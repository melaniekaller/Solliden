from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Boolean
from datetime import datetime, timezone

class Base(DeclarativeBase):
    id:Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

class User(Base):
    __tablename__ = "users"
    firstname: Mapped[str] = mapped_column(String(100), nullable=False)
    lastname: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=True)
    notifications_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationship to Booking
    bookings: Mapped[list["Booking"]] = relationship("Booking", back_populates="user")

class Booking(Base):
    __tablename__ = "bookings"
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)   
    arrival_date: Mapped[Date] = mapped_column(Date, nullable=False)
    departure_date: Mapped[Date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    is_cancelled: Mapped[bool] = mapped_column(Boolean, default=False)
    cancelled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationship to User
    user: Mapped[User] = relationship("User", back_populates="bookings")
