from fastapi import FastAPI, HTTPException, Depends, status
from app.db_setup import init_db, get_db
from contextlib import asynccontextmanager
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload, selectinload, load_only
from sqlalchemy import select, update, delete, insert, and_
from app.models.models import User, Booking
from app.schemas.schemas import UserSchema, BookingSchema, BookingOutSchema, BookingUpdateSchema
from sqlalchemy.exc import IntegrityError, NoResultFound
from auth_endpoints import router as auth_router
from app.security import get_current_user
from typing import Annotated
from fastapi.responses import JSONResponse
from datetime import date, time, datetime


origin = [
    "http://localhost:3000",
    "http://localhost:5173"
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/booking", tags=["bookings"], status_code=status.HTTP_201_CREATED)
def add_booking(bookings: BookingSchema, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        user_id = current_user.id
        db_booking = Booking(**bookings.model_dump(), users_id=user_id)
        db.add(db_booking)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Database error")
    return db_booking

@app.put("/bookings/{formattedDate}", status_code=status.HTTP_204_NO_CONTENT)
def update_booking(formattedDate: date, bookings_id: BookingUpdateSchema, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    query = select(Booking).where(and_(Booking.arrival_date == formattedDate, Booking.users_id == current_user.id))
    db_booking = db.execute(query).scalar_one_or_none()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    for key, value in bookings_id.model_dump(exclude_unset=True).items():
        setattr(db_booking, key, value)
    db.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={"message": "Booking updated successfully"})

@app.get("/bookings/{formattedDate}", status_code=200)
def list_bookings(formattedDate: date, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)) -> list[BookingOutSchema]:
    booking = db.scalars(select(Booking).where(and_(Booking.arrival_date == formattedDate, Booking.users_id == current_user.id)))
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@app.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    query = delete(Booking).where(Booking.booking_id == booking_id)
    result = db.execute(query)
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code= 404, detail= "Booking not found")
    return {"message": "Booking deleted"}
