from pydantic import BaseModel, Field


class ListingCreate(BaseModel):
    title: str
    description: str
    image_url: str | None = None
    location: str
    city: str
    country: str
    latitude: float | None = None
    longitude: float | None = None
    price_per_night: float = Field(gt=0)
    max_guests: int = Field(gt=0)
    bedrooms: int = Field(ge=0)
    beds: int = Field(ge=0)
    bathrooms: int = Field(ge=0)


class ListingUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    image_url: str | None = None
    location: str | None = None
    city: str | None = None
    country: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    price_per_night: float | None = Field(default=None, gt=0)
    max_guests: int | None = Field(default=None, gt=0)
    bedrooms: int | None = Field(default=None, ge=0)
    beds: int | None = Field(default=None, ge=0)
    bathrooms: int | None = Field(default=None, ge=0)


class ListingResponse(BaseModel):
    id: int
    host_id: int
    title: str
    description: str
    image_url: str | None
    location: str
    city: str
    country: str
    latitude: float | None 
    longitude: float | None 
    price_per_night: float
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: int
    rating: float
    is_active: int

    class Config:
        from_attributes = True