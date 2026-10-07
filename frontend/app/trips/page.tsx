"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookings } from "@/lib/api";

type Booking = {
  id: number;
  listing_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  listing: {
    id: number;
    title: string;
    location: string;
    city: string;
    country: string;
    price_per_night: number;
  };
};

export default function TripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load your trips.");
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Your trips
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage your upcoming and past stays.
        </p>

        {loading && (
          <p className="mt-10 text-gray-500 dark:text-gray-400">
            Loading your trips...
          </p>
        )}

        {error && (
          <p className="mt-10 text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 p-10 text-center dark:border-gray-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              No trips yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start exploring stays and book your first trip.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Explore stays
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="mt-8 space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div>
                    <Link
                      href={`/listings/${booking.listing.id}`}
                      className="text-xl font-semibold text-black hover:underline dark:text-white"
                    >
                      {booking.listing.title}
                    </Link>

                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      {booking.listing.location},{" "}
                      {booking.listing.city},{" "}
                      {booking.listing.country}
                    </p>
                  </div>

                  <span className="h-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 border-t border-gray-200 pt-5 dark:border-gray-800 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      CHECK-IN
                    </p>
                    <p className="mt-1 font-medium text-black dark:text-white">
                      {booking.check_in}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      CHECK-OUT
                    </p>
                    <p className="mt-1 font-medium text-black dark:text-white">
                      {booking.check_out}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      GUESTS
                    </p>
                    <p className="mt-1 font-medium text-black dark:text-white">
                      {booking.guests}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">
                    Total paid
                  </span>

                  <span className="text-lg font-semibold text-black dark:text-white">
                    ₹{booking.total_price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}