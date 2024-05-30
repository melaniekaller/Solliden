from fastapi import HTTPException, status, Response, Depends, APIRouter
from app.db_setup import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete, insert
from sqlalchemy.exc import IntegrityError
from app.models import User
from app.schemas.schemas import Token, UserRegisterSchema, UserOutSchema
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.security import get_current_user, create_access_token, hash_password, verify_password
from pydantic import ValidationError
from datetime import timedelta
from dotenv import load_dotenv
import os
import datetime
from jose import jwt, JWTError
import requests
import json
from app.security import ALGORITHM, EMAIL_RESET_TOKEN_EXPIRE_HOURS, SECRET_KEY , ACCESS_TOKEN_EXPIRE_MINUTES, POSTMARK_TOKEN


load_dotenv(override=True)

def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=int(EMAIL_RESET_TOKEN_EXPIRE_HOURS))
    now = datetime.datetime.now(datetime.UTC)
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        SECRET_KEY,
        algorithm="HS256",
    )
    return encoded_jwt


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.execute(statement).scalars().first()
    return session_user


def send_password_reset_email(email: str, token: str):
    # Should come from a .env-variable
    reset_url = f"http://localhost:5173/resetpassword?token={token}"
    message = {
        "From": "mailer@valutaomvandla.com",
        "To": email,
        "Subject": "Password Reset Request",
        "HtmlBody": f'<strong>You have requested to reset your password.</strong> Please click on the link to reset your password: <a href="{reset_url}">Reset Password</a>',
        "MessageStream": "outbound"
    }

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": f"{POSTMARK_TOKEN}"
    }

    try:
        response = requests.post(
            "https://api.postmarkapp.com/email", headers=headers, data=json.dumps(message))
        response.raise_for_status()  # This will raise an exception for HTTP error responses
        print(f"Email sent to {email}: {response.status_code}")
        # Optionally print response JSON data
        print(response.json())
    except requests.exceptions.HTTPError as e:
        # This catches HTTP errors and prints the response JSON if available
        print(f"Failed to send email to {email}, HTTP error: {e}")
        try:
            print(e.response.json())
        except ValueError:  # Includes simplejson.decoder.JSONDecodeError
            print("Error response content is not JSON")
    except Exception as e:
        # This catches other errors, such as connection errors
        print(f"Failed to send email to {email}: {e}")


def verify_password_reset_token(token: str) -> str | None:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return str(decoded_token["sub"])
    except JWTError:
        return None