from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from app.db_setup import init_db, get_db
from contextlib import asynccontextmanager
from fastapi import Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload, selectinload, load_only
from sqlalchemy import select, update, delete, insert
from app.models.models import User
from app.schemas.schemas import NewPasswordSchema, Token, UserOutSchema, UserUpdateSchema, UserSchema
from sqlalchemy.exc import IntegrityError
from app.security import hash_password, verify_password, create_access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from datetime import timedelta
from dotenv import load_dotenv 
import os
from app.email import generate_password_reset_token, send_password_reset_email, get_user_by_email, verify_password_reset_token


load_dotenv(override=True)

ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv(
    "ACCESS_TOKEN_EXPIRE_MINUTES")

router = APIRouter(tags=["auth"])

@router.post("/user/create", status_code=status.HTTP_201_CREATED)
def register_user(users: UserSchema, db: Session = Depends(get_db)) -> UserOutSchema:
    hashed_password: str = hash_password(users.password)
    users.password = hashed_password
    try:
        new_user = User(**users.model_dump())
        db.add(new_user)
        db.commit()
    except IntegrityError as e:
        print(e)
        raise HTTPException(detail="Invalid user registration", status_code=status.HTTP_400_BAD_REQUEST)
    return new_user

@router.post("/user/token")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)) -> Token:
    users = db.scalars(select(User).where(User.email == form_data.username)).first()
    
    if not users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user registration",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, users.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Passwords do not match",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(data={"sub": str(users.id)}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def read_users_me(current_user: Annotated[User, Depends(get_current_user)]) -> UserOutSchema:
    return current_user

@router.post("/password-recovery/{email}", status_code=status.HTTP_200_OK)
def recover_password(email: str, background_tasks: BackgroundTasks, db : Session = Depends(get_db)):
    """
    Password Recovery
    Sends a password reset email
    """
    user = get_user_by_email(session=db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    background_tasks.add_task(send_password_reset_email, email, password_reset_token)
    # send_password_reset_email(email=email, token=password_reset_token)
    return {"message": "Mail sent"}


@router.post("/reset-password/", status_code=status.HTTP_200_OK)
def reset_password(body: NewPasswordSchema, db: Session = Depends(get_db)):
    """
    Reset password using a token a user should have received through a PW reset email
    """
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = get_user_by_email(session=db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    hashed_password = hash_password(password=body.new_password)
    user.password = hashed_password
    db.add(user)
    db.commit()
    return {"message": "Password updated"}
    