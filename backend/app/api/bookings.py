from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Booking, Listing, User
from app.schemas.booking import (
    BookingCreate,
    BookingResponse,
    AvailabilityResponse,
)
from datetime import date, timedelta

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    guest_id: int,
    db: Session = Depends(get_db),
):
    # 1. Find the listing
    listing = (
        db.query(Listing)
        .filter(
            Listing.id == booking.listing_id,
            Listing.is_active == 1,
        )
        .first()
    )

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found",
        )

    # 2. Find the guest
    guest = (
        db.query(User)
        .filter(User.id == guest_id)
        .first()
    )

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Guest not found",
        )

    if guest.role != "guest":
        raise HTTPException(
            status_code=400,
            detail="Only guests can make bookings",
        )

    # 3. Validate dates
    if booking.check_in >= booking.check_out:
        raise HTTPException(
            status_code=400,
            detail="Check-out must be after check-in",
        )

    # 4. Validate number of guests
    if booking.guests > listing.max_guests:
        raise HTTPException(
            status_code=400,
            detail="Too many guests for this listing",
        )

    # 5. Check for overlapping bookings
    overlapping_booking = (
        db.query(Booking)
        .filter(
            Booking.listing_id == booking.listing_id,
            Booking.status == "confirmed",
            Booking.check_in < booking.check_out,
            Booking.check_out > booking.check_in,
        )
        .first()
    )

    if overlapping_booking:
        raise HTTPException(
            status_code=409,
            detail="Listing is not available for these dates",
        )

    # 6. Calculate price
    number_of_nights = (
        booking.check_out - booking.check_in
    ).days

    nightly_price = listing.price_per_night

    cleaning_fee = 500
    service_fee = nightly_price * number_of_nights * 0.10

    total_price = (
        nightly_price * number_of_nights
        + cleaning_fee
        + service_fee
    )

    # 7. Create booking
    new_booking = Booking(
        listing_id=booking.listing_id,
        guest_id=guest_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        guests=booking.guests,
        nightly_price=nightly_price,
        cleaning_fee=cleaning_fee,
        service_fee=service_fee,
        total_price=total_price,
        status="confirmed",
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking

@router.get("/", response_model=list[BookingResponse])
def get_bookings(
    guest_id: int,
    db: Session = Depends(get_db),
):
    bookings = (
        db.query(Booking)
        .filter(Booking.guest_id == guest_id)
        .order_by(Booking.check_in.desc())
        .all()
    )

    return bookings

@router.get(
    "/availability/{listing_id}",
    response_model=AvailabilityResponse,
)
def get_listing_availability(
    listing_id: int,
    db: Session = Depends(get_db),
):
    listing = (
        db.query(Listing)
        .filter(
            Listing.id == listing_id,
            Listing.is_active == 1,
        )
        .first()
    )

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found",
        )

    bookings = (
        db.query(Booking)
        .filter(
            Booking.listing_id == listing_id,
            Booking.status == "confirmed",
        )
        .all()
    )

    booked_dates = []

    for booking in bookings:
        current_date = booking.check_in

        while current_date < booking.check_out:
            booked_dates.append(current_date)
            current_date += timedelta(days=1)

    return {
        "listing_id": listing_id,
        "booked_dates": booked_dates,
    }

@router.get("/host/", response_model=list[BookingResponse])
def get_host_bookings(
    host_id: int,
    db: Session = Depends(get_db),
):
    host = (
        db.query(User)
        .filter(User.id == host_id)
        .first()
    )

    if not host:
        raise HTTPException(
            status_code=404,
            detail="Host not found",
        )

    if host.role != "host":
        raise HTTPException(
            status_code=400,
            detail="User is not a host",
        )

    bookings = (
        db.query(Booking)
        .join(Listing)
        .filter(Listing.host_id == host_id)
        .order_by(Booking.check_in.desc())
        .all()
    )

    return bookings

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
):
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    return booking

