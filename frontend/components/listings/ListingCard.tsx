"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/lib/api";

type Listing = {
  id: number;
  title: string;
  location: string;
  city: string;
  price_per_night: number;
  rating: number;
  image_url?: string | null;
};

type ListingCardProps = {
  listing: Listing;
};

export default function ListingCard({ listing }: ListingCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check whether this listing is already in the wishlist
  useEffect(() => {
    async function checkWishlist() {
      try {
        const wishlist = await getWishlist();

        const saved = wishlist.some(
          (item: { listing_id: number }) =>
            item.listing_id === listing.id
        );

        setIsWishlisted(saved);
      } catch (error) {
        console.error("Failed to check wishlist:", error);
      }
    }

    checkWishlist();
  }, [listing.id]);

  async function handleWishlist(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);

      if (isWishlisted) {
        await removeFromWishlist(listing.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(listing.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}

        {/* Wishlist */}
        <button
  type="button"
  onClick={handleWishlist}
  disabled={loading}
  aria-label={
    isWishlisted
      ? "Remove from wishlist"
      : "Add to wishlist"
  }
  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl shadow-sm backdrop-blur-sm transition hover:scale-110 disabled:opacity-60"
>
  <span
    className={
      isWishlisted
        ? "text-[#FF385C]"
        : "text-gray-700"
    }
  >
    {isWishlisted ? "♥" : "♡"}
  </span>
</button>

        {/* Guest Favourite badge */}
        {listing.rating >= 4.8 && (
          <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-sm">
            Guest favourite
          </div>
        )}
      </div>

      {/* Listing information */}
      <div className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-[15px] font-semibold">
            {listing.title}
          </h2>

          <div className="flex shrink-0 items-center gap-1 text-sm">
            <span>★</span>
            <span>{listing.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="mt-1 text-[14px] text-gray-500">
          {listing.location}, {listing.city}
        </p>

        <p className="mt-2 text-[15px]">
          <span className="font-semibold">
            ₹{listing.price_per_night.toLocaleString("en-IN")}
          </span>{" "}
          <span className="text-gray-500">
            night
          </span>
        </p>
      </div>
    </Link>
  );
}