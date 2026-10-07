from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Booking, Listing, User
from app.schemas.listing import ListingCreate, ListingResponse, ListingUpdate

router = APIRouter(prefix="/listings", tags=["Listings"])


# Get listings with search, filters, and pagination
@router.get("/", response_model=list[ListingResponse])
def get_listings(
    location: str | None = None,
    guests: int | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    check_in: date | None = None,
    check_out: date | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(8, ge=1, le=50),
    db: Session = Depends(get_db),
):
    query = db.query(Listing).filter(Listing.is_active == 1)

    # Location filter
    if location:
        query = query.filter(
            (Listing.location.ilike(f"%{location}%"))
            | (Listing.city.ilike(f"%{location}%"))
            | (Listing.country.ilike(f"%{location}%"))
        )

    # Guest capacity filter
    if guests:
        query = query.filter(Listing.max_guests >= guests)

    # Price filters
    if min_price is not None:
        query = query.filter(Listing.price_per_night >= min_price)

    if max_price is not None:
        query = query.filter(Listing.price_per_night <= max_price)

    # Date validation
    if check_in and check_out:
        if check_in >= check_out:
            raise HTTPException(
                status_code=400,
                detail="Check-out date must be after check-in date",
            )

        # Find listings that have overlapping bookings
        booked_listing_ids = (
            db.query(Booking.listing_id)
            .filter(
                Booking.status == "confirmed",
                Booking.check_in < check_out,
                Booking.check_out > check_in,
            )
            .distinct()
            .all()
        )

        booked_listing_ids = [
            listing_id[0]
            for listing_id in booked_listing_ids
        ]

        if booked_listing_ids:
            query = query.filter(
                ~Listing.id.in_(booked_listing_ids)
            )

    return query.offset(skip).limit(limit).all()

# Get a single listing
@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
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

    return listing


# Get listings belonging to a host
@router.get("/host/", response_model=list[ListingResponse])
def get_host_listings(
    host_id: int,
    db: Session = Depends(get_db),
):
    host = db.query(User).filter(User.id == host_id).first()

    if not host:
        raise HTTPException(
            status_code=404,
            detail="Host not found",
        )

    listings = (
        db.query(Listing)
        .filter(
            Listing.host_id == host_id,
            Listing.is_active == 1,
        )
        .all()
    )

    return listings


# Create a listing
@router.post("/", response_model=ListingResponse)
def create_listing(
    listing: ListingCreate,
    host_id: int,
    db: Session = Depends(get_db),
):
    host = (
        db.query(User)
        .filter(
            User.id == host_id,
            User.role == "host",
        )
        .first()
    )

    if not host:
        raise HTTPException(
            status_code=404,
            detail="Host not found",
        )

    new_listing = Listing(
        host_id=host_id,
        title=listing.title,
        description=listing.description,
        image_url=listing.image_url,
        location=listing.location,
        city=listing.city,
        country=listing.country,
        latitude=listing.latitude,
        longitude=listing.longitude,
        price_per_night=listing.price_per_night,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        bathrooms=listing.bathrooms,
        rating=0.0,
        is_active=1,
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return new_listing


# Update a listing
@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_update: ListingUpdate,
    host_id: int,
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

    if listing.host_id != host_id:
        raise HTTPException(
            status_code=403,
            detail="You do not own this listing",
        )

    update_data = listing_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(listing, field, value)

    db.commit()
    db.refresh(listing)

    return listing


# Delete a listing
@router.delete("/{listing_id}")
def delete_listing(
    listing_id: int,
    host_id: int,
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

    if listing.host_id != host_id:
        raise HTTPException(
            status_code=403,
            detail="You do not own this listing",
        )

    # Soft delete
    listing.is_active = 0

    db.commit()

    return {
        "message": "Listing deleted successfully",
        "listing_id": listing_id,
    }