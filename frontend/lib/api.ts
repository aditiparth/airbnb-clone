const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// =========================
// Listings
// =========================

export async function getListings(filters?: {
  location?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
  check_in?: string;
  check_out?: string;
  skip?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();

  if (filters?.location) {
    params.set("location", filters.location);
  }

  if (filters?.guests) {
    params.set("guests", filters.guests.toString());
  }

  if (filters?.min_price !== undefined) {
    params.set("min_price", filters.min_price.toString());
  }

  if (filters?.max_price !== undefined) {
    params.set("max_price", filters.max_price.toString());
  }

  if (filters?.check_in) {
    params.set("check_in", filters.check_in);
  }

  if (filters?.check_out) {
    params.set("check_out", filters.check_out);
  }

  if (filters?.skip !== undefined) {
    params.set("skip", filters.skip.toString());
  }

  if (filters?.limit !== undefined) {
    params.set("limit", filters.limit.toString());
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_URL}/listings/?${queryString}`
    : `${API_URL}/listings/`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
}


export async function getListing(id: string) {
  const response = await fetch(`${API_URL}/listings/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch listing");
  }

  return response.json();
}


// =========================
// Availability
// =========================

export async function getAvailability(listingId: number) {
  const response = await fetch(
    `${API_URL}/bookings/availability/${listingId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch availability");
  }

  return response.json();
}


// =========================
// Bookings
// =========================

export async function createBooking(
  listingId: number,
  checkIn: string,
  checkOut: string,
  guests: number
) {
  const response = await fetch(
    `${API_URL}/bookings/?guest_id=1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listing_id: listingId,
        check_in: checkIn,
        check_out: checkOut,
        guests,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create booking");
  }

  return data;
}


export async function getBookings() {
  const response = await fetch(
    `${API_URL}/bookings/?guest_id=1`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return response.json();
}
export async function getBooking(bookingId: number) {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booking");
  }

  return response.json();
}


// =========================
// Host Listings
// =========================

export async function getHostListings() {
  const response = await fetch(
    `${API_URL}/listings/host/?host_id=2`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch host listings");
  }

  return response.json();
}


export async function getHostListing(id: string) {
  const response = await fetch(
    `${API_URL}/listings/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch listing");
  }

  return response.json();
}


export async function createListing(listing: {
  title: string;
  description: string;
  image_url?: string;
  location: string;
  city: string;
  country: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
}) {
  const response = await fetch(
    `${API_URL}/listings/?host_id=2`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to create listing"
    );
  }

  return data;
}


export async function updateListing(
  id: string,
  listing: {
    title?: string;
    description?: string;
    image_url?: string;
    location?: string;
    city?: string;
    country?: string;
    price_per_night?: number;
    max_guests?: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
  }
) {
  const response = await fetch(
    `${API_URL}/listings/${id}?host_id=2`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to update listing"
    );
  }

  return data;
}


export async function deleteListing(id: number) {
  const response = await fetch(
    `${API_URL}/listings/${id}?host_id=2`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to delete listing"
    );
  }

  return data;
}


// =========================
// Wishlist
// =========================

export async function getWishlist() {
  const response = await fetch(
    `${API_URL}/wishlist/?user_id=1`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  return response.json();
}


export async function addToWishlist(listingId: number) {
  const response = await fetch(
    `${API_URL}/wishlist/${listingId}?user_id=1`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to add to wishlist"
    );
  }

  return data;
}


export async function removeFromWishlist(listingId: number) {
  const response = await fetch(
    `${API_URL}/wishlist/${listingId}?user_id=1`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to remove from wishlist"
    );
  }

  return data;
}
// =========================
// Reviews
// =========================

export async function getReviews(listingId: number) {
  const response = await fetch(
    `${API_URL}/reviews/${listingId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}

export async function createReview(
  listingId: number,
  bookingId: number,
  rating: number,
  comment: string
) {
  const response = await fetch(
    `${API_URL}/reviews/${listingId}?guest_id=1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking_id: bookingId,
        rating,
        comment,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to submit review"
    );
  }

  return data;
}