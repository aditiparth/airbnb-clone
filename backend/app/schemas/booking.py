from datetime import date

from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guests: int = Field(gt=0)


class ListingSummary(BaseModel):
    id: int
    title: str
    location: str
    city: str
    country: str
    price_per_night: float

    class Config:
        from_attributes = True


class BookingResponse(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    check_in: date
    check_out: date
    guests: int
    nightly_price: float
    cleaning_fee: float
    service_fee: float
    total_price: float
    status: str
    listing: ListingSummary

    class Config:
        from_attributes = True


class AvailabilityResponse(BaseModel):
    listing_id: int
    booked_dates: list[date]