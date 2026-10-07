from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Listing, User, Wishlist

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("/")
def get_wishlist(
    user_id: int,
    db: Session = Depends(get_db),
):
    items = (
        db.query(Wishlist)
        .filter(Wishlist.user_id == user_id)
        .all()
    )

    return [
        {
            "id": item.id,
            "listing_id": item.listing_id,
            "listing": item.listing,
        }
        for item in items
    ]


@router.post("/{listing_id}")
def add_to_wishlist(
    listing_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

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

    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user_id,
            Wishlist.listing_id == listing_id,
        )
        .first()
    )

    if existing:
        return {
            "message": "Already in wishlist",
            "listing_id": listing_id,
        }

    item = Wishlist(
        user_id=user_id,
        listing_id=listing_id,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "message": "Added to wishlist",
        "listing_id": listing_id,
    }


@router.delete("/{listing_id}")
def remove_from_wishlist(
    listing_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user_id,
            Wishlist.listing_id == listing_id,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Listing is not in wishlist",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Removed from wishlist",
        "listing_id": listing_id,
    }