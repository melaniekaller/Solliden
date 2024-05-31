from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from jose import JWTError, jwt, ExpiredSignatureError
from typing import Annotated
from fastapi import Depends, status, HTTPException
from app.db_setup import get_db
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.models.models import User
from sqlalchemy import select
from app.schemas.schemas import TokenPayload
from pydantic import ValidationError

load_dotenv(override=True)

ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv(
    "ACCESS_TOKEN_EXPIRE_MINUTES")
EMAIL_RESET_TOKEN_EXPIRE_HOURS = os.getenv("EMAIL_RESET_TOKEN_EXPIRE_HOURS")
POSTMARK_TOKEN = os.getenv("POSTMARK_TOKEN")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token_access(token: str, credentials_exception: HTTPException):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        token_data = TokenPayload(**payload)
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token format validation failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as e:
        print(e)
        raise credentials_exception
    return token_data

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token_access(token, credentials_exception)
    user = db.scalars(select(User).where(User.id == token_data.sub)).first()
    if user is None:
        raise credentials_exception
    return user