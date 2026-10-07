from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    booking_id: int
    rating: int = Field(ge=1, le=5)
    comment: str


class ReviewResponse(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    booking_id: int
    rating: int
    comment: str
    guest_name: str

    class Config:
        from_attributes = True