from pydantic import BaseModel, Field, ConfigDict, EmailStr, validator
from typing import Optional, List, TypeVar, Type
from datetime import date, time, datetime

T = TypeVar("T", bound=BaseModel)  # Type variable for base model

class BaseModelConfig(BaseModel):
    """Base class for all schemas with automatic configuration."""
    @validator("*", pre=True)
    def set_config(cls, value):
        # Set the config for the current class and its subclasses
        cls.Config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
        return value

    class Config:
        # Inherit attributes from parent classes (optional)
        arbitrary_types_allowed = True

class Token(BaseModelConfig):
    access_token: str
    token_type: str

class TokenPayload(BaseModelConfig):
    sub: str = None
    exp: int = None

class NewPasswordSchema(BaseModel):
    token: str
    new_password: str
    
class UserSchema(BaseModelConfig):
    firstname: str = Field(max_length=100)
    lastname: str = Field(max_length=100)
    email: EmailStr
    password: str

class UserOutSchema(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: EmailStr


class UserRegisterSchema(BaseModel):
    firstname: str = Field(max_length=100)
    lastname: str = Field(max_length=100)
    email: EmailStr
    password: str


class UserUpdateSchema(BaseModel):
    firstname: Optional[str] = Field(max_length=100)
    lastname: Optional[str] = Field(max_length=100)
    email: Optional[EmailStr]


class BookingSchema(BaseModelConfig):
    booking_id: int
    arrival_date: date
    departure_date: date

class BookingOutSchema(BaseModel):
    user_id: int
    booking_id: int
    arrival_date: date
    departure_date: date

class BookingUpdateSchema(BaseModel):
    arrival_date: Optional[date]
    departure_date: Optional[date]

