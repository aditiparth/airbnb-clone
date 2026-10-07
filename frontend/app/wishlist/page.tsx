"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWishlist, removeFromWishlist } from "@/lib/api";

type Listing = {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  location: string;
  city: string;
  country: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  is_active: number;
};

type WishlistItem = {
  id: number;
  listing_id: number;
  listing: Listing;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWishlist() {
    try {
      setLoading(true);
      setError("");

      const data = await getWishlist();
      setItems(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load your wishlist.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  async function handleRemove(listingId: number) {
    try {
      await removeFromWishlist(listingId);

      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.listing_id !== listingId
        )
      );
    } catch (error) {
      console.error(error);
      setError("Failed to remove listing from wishlist.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Wishlists
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Save your favorite stays for later.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="mt-10 text-gray-500 dark:text-gray-400">
            Loading your wishlist...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="mt-10 text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Empty wishlist */}
        {!loading && !error && items.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 p-12 text-center dark:border-gray-800">
            <div className="text-5xl text-black dark:text-white">
              ♡
            </div>

            <h2 className="mt-4 text-xl font-semibold text-black dark:text-white">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Save stays you love and find them here later.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Explore stays
            </Link>
          </div>
        )}

        {/* Wishlist listings */}
        {!loading && !error && items.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => {
              const listing = item.listing;

              return (
                <div key={item.id}>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="block"
                  >
                    {/* Image */}
                    <div className="aspect-square overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
                      {listing.image_url ? (
                        <img
                          src={listing.image_url}
                          alt={listing.title}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="mt-3">
                      <div className="flex justify-between gap-2">
                        <h2 className="font-medium text-black dark:text-white">
                          {listing.title}
                        </h2>

                        <span className="text-sm text-black dark:text-white">
                          ★ {listing.rating}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {listing.location}, {listing.city}
                      </p>

                      <p className="mt-1 text-black dark:text-white">
                        <span className="font-semibold">
                          ₹{listing.price_per_night.toLocaleString("en-IN")}
                        </span>{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          night
                        </span>
                      </p>
                    </div>
                  </Link>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(listing.id)}
                    className="mt-3 text-sm font-medium text-black underline transition hover:text-[#FF385C] dark:text-white dark:hover:text-[#FF385C]"
                  >
                    Remove from wishlist
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}