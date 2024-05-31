from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, delete
from sqlalchemy.exc import IntegrityError
from contextlib import asynccontextmanager
from typing import Annotated
from datetime import datetime, timedelta, date
from fastapi import HTTPException

from app.email import booking_confirmation_email
from app.db_setup import init_db, get_db
from app.models.models import User, Booking
from app.schemas.schemas import BookingSchema, BookingUpdateSchema, BookingOutSchema, UserOutSchema, UserSchema
from app.security import get_current_user, hash_password, verify_password, create_access_token
app = FastAPI()

# Setup CORS
origin = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize DB
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
app = FastAPI(lifespan=lifespan)

# Including authorization router
from auth_endpoints import router as auth_router
app.include_router(auth_router)


@app.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.get("/users/me")
def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

@app.put("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def update_user(user_data: UserSchema, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.firstname = user_data.firstname if user_data.firstname else user.firstname
    user.lastname = user_data.lastname if user_data.lastname else user.lastname
    user.email = user_data.email if user_data.email else user.email
    for key, value in user_data.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    return {"message": "User updated successfully"}

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    result = db.query(User).filter(User.id == user_id).delete()
    db.commit()
    if result == 0:
        db.rollback()
        raise HTTPException(status_code=404, detail="User not found")
    return JSONResponse(content={"message": "User deleted successfully"}, status_code=status.HTTP_204_NO_CONTENT)


# POST - Create a new booking
@app.post("/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(booking_data: BookingSchema, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        new_booking = Booking(**booking_data.model_dump(exclude_unset=True), user_id=current_user.id)
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        # Send notification to all users
        users = db.query(User).all()
        for user in users:
            if user.notifications_enabled:
                booking_confirmation_email(
                    user.email,
                    "New Booking Created",
                    f"<strong>{current_user.firstname} {current_user.lastname}</strong> has booked Solliden from {new_booking.arrival_date} to {new_booking.departure_date}."
                )
        return new_booking
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database error")


# GET - List bookings by id and user
@app.get("/bookings/current-and-upcoming", status_code=status.HTTP_200_OK)
def list_current_and_upcoming_bookings(current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    today = date.today()
    # Filter to select bookings that end today or later, and are not cancelled
    current_and_upcoming_bookings = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.departure_date >= today,  # Check against today's date
        Booking.is_cancelled == False  # Exclude cancelled bookings
    ).all()
    if not current_and_upcoming_bookings:
        raise HTTPException(status_code=404, detail="No current or upcoming bookings found")
    return current_and_upcoming_bookings


# GET - List all bookings by date
@app.get("/bookings/{formattedDate}", status_code=status.HTTP_200_OK)
def list_all_bookings(formattedDate: date, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.arrival_date == formattedDate).all()
    if not bookings:
        raise HTTPException(status_code=404, detail="No bookings found for this date")
    return bookings


# PUT - Update a booking by date
@app.put("/bookings/{formattedDate}", status_code=status.HTTP_204_NO_CONTENT)
def rebook(formattedDate: date, booking_data: BookingUpdateSchema, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(and_(Booking.arrival_date == formattedDate, Booking.user_id == current_user.id)).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    for key, value in booking_data.model_dump(exclude_unset=True).items():
        setattr(booking, key, value)
    db.commit()

    # Send notification to all users
    users = db.query(User).all()
    for user in users:
        if user.notifications_enabled:
            booking_confirmation_email(
                user.email,
                "Booking Updated",
                f"<strong>{current_user.firstname} {current_user.lastname}</strong> has updated their booking to from {booking.arrival_date} to {booking.departure_date}."
            )

    return booking


@app.put("/bookings/cancel/{id}")
def cancel_booking(id: int, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id, Booking.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Check if the cancellation is allowed based on the arrival date
    if booking.arrival_date - datetime.datetime.utcnow().date() < timedelta(days=10):
        raise HTTPException(status_code=400, detail="Cancellation must be made at least 10 days before the arrival date")

    days_until_arrival = (booking.arrival_date - datetime.datetime.utcnow().date()).days
    payment_required = False
    message = "Booking cancelled successfully."

    if days_until_arrival < 10:
        payment_required = True
        message += " However, since the cancellation is made less than 10 days before arrival, a cancellation fee applies."


    # Update booking to reflect cancellation
    booking.is_cancelled = True
    booking.cancelled_at = datetime.datetime.utcnow()
    db.commit()

   # Send notification to all users
    users = db.query(User).all()
    email_subject = "Booking Cancelled"
    email_content = f"<strong>{current_user.firstname} {current_user.lastname}</strong> has cancelled their booking from {booking.arrival_date} to {booking.departure_date}. {message if payment_required else ''}"

    for user in users:
        if user.notifications_enabled:
            booking_confirmation_email(
                user.email,
                email_subject,
                email_content
            )

    # Include the payment message in the response to the user who cancelled the booking
    return {"message": message, "payment_required": payment_required}
