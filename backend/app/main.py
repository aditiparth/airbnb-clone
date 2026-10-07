from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import User, Listing, Booking
from app.api.users import router as users_router
from app.api.listings import router as listings_router
from app.api.bookings import router as bookings_router
from app.api.wishlist import router as wishlist_router
from app.api.reviews import router as reviews_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Airbnb Clone API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://172.25.189.191:3000",
        "https://airbnb-clone-beta-rose.vercel.app",
        "https://airbnb-clone-o0t7vxaia.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/test-db")
def test_database(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return {
        "users_count": len(users)
    }


app.include_router(users_router)
app.include_router(listings_router)
app.include_router(bookings_router)
app.include_router(wishlist_router)
app.include_router(reviews_router)