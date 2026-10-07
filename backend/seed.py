from app.database import Base, SessionLocal, engine
from app.models import User, Listing


def seed_database():
    # Create all database tables if they do not exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # -------------------------
        # USERS
        # -------------------------

        # Guest
        guest = (
            db.query(User)
            .filter(User.email == "guest@airbnbclone.com")
            .first()
        )

        if not guest:
            guest = User(
                name="Aditi",
                email="guest@airbnbclone.com",
                role="guest",
            )
            db.add(guest)

        # Host
        host = (
            db.query(User)
            .filter(User.email == "host@airbnbclone.com")
            .first()
        )

        if not host:
            host = User(
                name="Airbnb Host",
                email="host@airbnbclone.com",
                role="host",
            )
            db.add(host)

        db.commit()
        db.refresh(host)

        # -------------------------
        # LISTINGS
        # -------------------------

        listings = [
            # =====================
            # BHOPAL
            # =====================

            {
                "title": "Lake View Apartment",
                "description": "A modern apartment with beautiful views of Upper Lake, perfect for a relaxing stay in Bhopal.",
                "image_url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
                "location": "Upper Lake",
                "city": "Bhopal",
                "country": "India",
                "latitude": 23.2599,
                "longitude": 77.4126,
                "price_per_night": 2800,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2,
                "rating": 4.9,
            },
            {
                "title": "Arera Colony Home",
                "description": "A comfortable and stylish home in one of Bhopal's popular residential neighborhoods.",
                "image_url": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
                "location": "Arera Colony",
                "city": "Bhopal",
                "country": "India",
                "latitude": 23.2156,
                "longitude": 77.4347,
                "price_per_night": 2200,
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": 1,
                "rating": 4.7,
            },
            {
                "title": "Van Vihar Retreat",
                "description": "A peaceful retreat surrounded by greenery, ideal for guests looking for a quiet getaway.",
                "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                "location": "Shyamla Hills",
                "city": "Bhopal",
                "country": "India",
                "latitude": 23.2291,
                "longitude": 77.3407,
                "price_per_night": 3200,
                "max_guests": 5,
                "bedrooms": 2,
                "beds": 3,
                "bathrooms": 2,
                "rating": 4.8,
            },
            {
                "title": "Modern City Villa",
                "description": "Spacious modern villa with comfortable interiors and easy access to central Bhopal.",
                "image_url": "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
                "location": "MP Nagar",
                "city": "Bhopal",
                "country": "India",
                "latitude": 23.2332,
                "longitude": 77.4322,
                "price_per_night": 4200,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 4,
                "bathrooms": 2,
                "rating": 4.9,
            },

            # =====================
            # INDORE
            # =====================

            {
                "title": "Vijay Nagar Apartment",
                "description": "A bright modern apartment close to Indore's restaurants, shopping and business district.",
                "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
                "location": "Vijay Nagar",
                "city": "Indore",
                "country": "India",
                "latitude": 22.7533,
                "longitude": 75.8937,
                "price_per_night": 2500,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2,
                "rating": 4.8,
            },
            {
                "title": "Palasia Studio",
                "description": "A cozy studio apartment in the heart of Indore, perfect for solo travelers and couples.",
                "image_url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
                "location": "Palasia",
                "city": "Indore",
                "country": "India",
                "latitude": 22.7256,
                "longitude": 75.8845,
                "price_per_night": 1800,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1,
                "rating": 4.6,
            },
            {
                "title": "Rajwada Heritage Stay",
                "description": "Experience Indore from a charming heritage-inspired home near the historic Rajwada Palace.",
                "image_url": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
                "location": "Rajwada",
                "city": "Indore",
                "country": "India",
                "latitude": 22.7196,
                "longitude": 75.8577,
                "price_per_night": 2300,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 1,
                "rating": 4.7,
            },
            {
                "title": "Super Corridor Home",
                "description": "A spacious contemporary home with excellent connectivity to Indore's Super Corridor.",
                "image_url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
                "location": "Super Corridor",
                "city": "Indore",
                "country": "India",
                "latitude": 22.7382,
                "longitude": 75.8024,
                "price_per_night": 3000,
                "max_guests": 5,
                "bedrooms": 2,
                "beds": 3,
                "bathrooms": 2,
                "rating": 4.8,
            },

            # =====================
            # UJJAIN
            # =====================

            {
                "title": "Mahakal Temple Stay",
                "description": "A convenient and comfortable stay located close to the famous Mahakaleshwar Temple.",
                "image_url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
                "location": "Mahakal Area",
                "city": "Ujjain",
                "country": "India",
                "latitude": 23.1828,
                "longitude": 75.7682,
                "price_per_night": 2000,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 1,
                "rating": 4.8,
            },
            {
                "title": "Shipra Riverside Home",
                "description": "Relax in a peaceful home near the Shipra River and enjoy easy access to Ujjain's attractions.",
                "image_url": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
                "location": "Ram Ghat",
                "city": "Ujjain",
                "country": "India",
                "latitude": 23.1793,
                "longitude": 75.7681,
                "price_per_night": 2400,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 1,
                "rating": 4.7,
            },
            {
                "title": "Old City Apartment",
                "description": "A simple and comfortable apartment in the historic heart of Ujjain.",
                "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
                "location": "Old City",
                "city": "Ujjain",
                "country": "India",
                "latitude": 23.1765,
                "longitude": 75.7885,
                "price_per_night": 1700,
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": 1,
                "rating": 4.5,
            },
            {
                "title": "Mahakal View Retreat",
                "description": "A modern family-friendly stay with spacious rooms and convenient access to the temple district.",
                "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                "location": "Freeganj",
                "city": "Ujjain",
                "country": "India",
                "latitude": 23.1765,
                "longitude": 75.7867,
                "price_per_night": 2800,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 4,
                "bathrooms": 2,
                "rating": 4.9,
            },

            # =====================
            # JAIPUR
            # =====================

            {
                "title": "Pink City Haveli",
                "description": "A beautiful heritage-inspired stay in the heart of Jaipur's famous Pink City.",
                "image_url": "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
                "location": "Pink City",
                "city": "Jaipur",
                "country": "India",
                "latitude": 26.9124,
                "longitude": 75.7873,
                "price_per_night": 3500,
                "max_guests": 5,
                "bedrooms": 2,
                "beds": 3,
                "bathrooms": 2,
                "rating": 4.9,
            },
            {
                "title": "Hawa Mahal Apartment",
                "description": "Stay close to Jaipur's iconic Hawa Mahal in this stylish and comfortable apartment.",
                "image_url": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
                "location": "Hawa Mahal",
                "city": "Jaipur",
                "country": "India",
                "latitude": 26.9239,
                "longitude": 75.8267,
                "price_per_night": 2800,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 1,
                "rating": 4.8,
            },
            {
                "title": "Amer View Villa",
                "description": "A spacious villa with beautiful surroundings near the historic Amer Fort.",
                "image_url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
                "location": "Amer",
                "city": "Jaipur",
                "country": "India",
                "latitude": 26.9855,
                "longitude": 75.8513,
                "price_per_night": 4500,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 4,
                "bathrooms": 3,
                "rating": 4.9,
            },
            {
                "title": "Jaipur Heritage Home",
                "description": "A warm and elegant home combining traditional Rajasthani character with modern comforts.",
                "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
                "location": "C-Scheme",
                "city": "Jaipur",
                "country": "India",
                "latitude": 26.9124,
                "longitude": 75.7873,
                "price_per_night": 3200,
                "max_guests": 5,
                "bedrooms": 2,
                "beds": 3,
                "bathrooms": 2,
                "rating": 4.7,
            },
        ]

        # -------------------------
        # INSERT LISTINGS
        # -------------------------

        added_count = 0

        for data in listings:
            existing = (
                db.query(Listing)
                .filter(Listing.title == data["title"])
                .first()
            )

            if existing:
                continue

            listing = Listing(
                host_id=host.id,
                title=data["title"],
                description=data["description"],
                image_url=data["image_url"],
                location=data["location"],
                city=data["city"],
                country=data["country"],
                latitude=data["latitude"],
                longitude=data["longitude"],
                price_per_night=data["price_per_night"],
                max_guests=data["max_guests"],
                bedrooms=data["bedrooms"],
                beds=data["beds"],
                bathrooms=data["bathrooms"],
                rating=data["rating"],
                is_active=1,
            )

            db.add(listing)
            added_count += 1

        db.commit()

        print("Database seeded successfully!")
        print(f"Added {added_count} new listings.")

    except Exception as error:
        db.rollback()
        print("Error while seeding database:")
        print(error)

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()