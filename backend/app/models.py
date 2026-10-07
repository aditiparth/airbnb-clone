from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    role = Column(String, nullable=False, default="guest")

    listings = relationship("Listing", back_populates="host")
    bookings = relationship("Booking", back_populates="guest")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)

    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    image_url = Column(String, nullable=True)

    location = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    country = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    price_per_night = Column(Float, nullable=False)

    max_guests = Column(Integer, nullable=False)
    bedrooms = Column(Integer, nullable=False)
    beds = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)

    rating = Column(Float, default=0.0)
    is_active = Column(Integer, default=1)

    host = relationship("User", back_populates="listings")
    bookings = relationship("Booking", back_populates="listing")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    listing_id = Column(
        Integer,
        ForeignKey("listings.id"),
        nullable=False,
        index=True,
    )

    guest_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    check_in = Column(Date, nullable=False, index=True)
    check_out = Column(Date, nullable=False, index=True)

    guests = Column(Integer, nullable=False)

    nightly_price = Column(Float, nullable=False)
    cleaning_fee = Column(Float, nullable=False, default=0)
    service_fee = Column(Float, nullable=False, default=0)
    total_price = Column(Float, nullable=False)

    status = Column(String, nullable=False, default="confirmed")

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    listing_id = Column(
        Integer,
        ForeignKey("listings.id"),
        nullable=False,
        index=True,
    )

    user = relationship("User")
    listing = relationship("Listing")

    __table_args__ = (
        UniqueConstraint("user_id", "listing_id", name="unique_user_listing"),
    )

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    listing_id = Column(
        Integer,
        ForeignKey("listings.id"),
        nullable=False,
        index=True,
    )

    guest_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.id"),
        nullable=False,
        unique=True,
    )

    rating = Column(
        Integer,
        nullable=False,
    )

    comment = Column(
        Text,
        nullable=False,
    )

    listing = relationship("Listing")
    guest = relationship("User")
    booking = relationship("Booking")