from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Booking, Listing, Review, User
from app.schemas.review import ReviewCreate

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/{listing_id}")
def get_listing_reviews(
    listing_id: int,
    db: Session = Depends(get_db),
):
    reviews = (
        db.query(Review, User.name)
        .join(User, Review.guest_id == User.id)
        .filter(Review.listing_id == listing_id)
        .order_by(Review.id.desc())
        .all()
    )

    return [
        {
            "id": review.id,
            "listing_id": review.listing_id,
            "guest_id": review.guest_id,
            "booking_id": review.booking_id,
            "rating": review.rating,
            "comment": review.comment,
            "guest_name": guest_name,
        }
        for review, guest_name in reviews
    ]


@router.post("/{listing_id}")
def create_review(
    listing_id: int,
    review_data: ReviewCreate,
    guest_id: int,
    db: Session = Depends(get_db),
):
    # Check listing
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

    # Check booking
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == review_data.booking_id,
            Booking.listing_id == listing_id,
            Booking.guest_id == guest_id,
            Booking.status == "confirmed",
        )
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=403,
            detail="You can only review a listing you have booked",
        )

    # Prevent duplicate review
    existing_review = (
        db.query(Review)
        .filter(Review.booking_id == review_data.booking_id)
        .first()
    )

    if existing_review:
        raise HTTPException(
            status_code=400,
            detail="You have already reviewed this booking",
        )

    review = Review(
        listing_id=listing_id,
        guest_id=guest_id,
        booking_id=review_data.booking_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    # Recalculate listing rating
    all_reviews = (
        db.query(Review)
        .filter(Review.listing_id == listing_id)
        .all()
    )

    listing.rating = round(
        sum(r.rating for r in all_reviews) / len(all_reviews),
        1,
    )

    db.commit()

    return {
        "message": "Review submitted successfully",
        "review": {
            "id": review.id,
            "listing_id": review.listing_id,
            "guest_id": review.guest_id,
            "booking_id": review.booking_id,
            "rating": review.rating,
            "comment": review.comment,
        },
        "new_rating": listing.rating,
    }