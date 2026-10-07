"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getBooking } from "@/lib/api";

type Booking = {
  id: number;
  listing_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  listing: {
    title: string;
    location: string;
    city: string;
    country: string;
  };
};

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getBooking(Number(bookingId));
        setBooking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading confirmation...
          </p>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-2xl border border-gray-200 p-10 text-center dark:border-gray-800">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              Booking not found
            </h1>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Back to stays
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">

          {/* Success */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700 dark:bg-green-950 dark:text-green-400">
              ✓
            </div>

            <h1 className="mt-5 text-3xl font-semibold text-black dark:text-white">
              Booking confirmed!
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Your trip has been successfully booked.
            </p>
          </div>

          {/* Listing */}
          <div className="mt-8 rounded-xl bg-gray-50 p-5 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              {booking.listing.title}
            </h2>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {booking.listing.location},{" "}
              {booking.listing.city},{" "}
              {booking.listing.country}
            </p>
          </div>

          {/* Booking details */}
          <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">

            <div className="flex justify-between gap-4 p-4">
              <span className="font-medium text-black dark:text-white">
                Check-in
              </span>

              <span className="text-gray-600 dark:text-gray-300">
                {booking.check_in}
              </span>
            </div>

            <div className="flex justify-between gap-4 p-4">
              <span className="font-medium text-black dark:text-white">
                Check-out
              </span>

              <span className="text-gray-600 dark:text-gray-300">
                {booking.check_out}
              </span>
            </div>

            <div className="flex justify-between gap-4 p-4">
              <span className="font-medium text-black dark:text-white">
                Guests
              </span>

              <span className="text-gray-600 dark:text-gray-300">
                {booking.guests}{" "}
                {booking.guests === 1 ? "guest" : "guests"}
              </span>
            </div>

            <div className="flex justify-between gap-4 p-4">
              <span className="font-medium text-black dark:text-white">
                Booking ID
              </span>

              <span className="text-gray-600 dark:text-gray-300">
                #{booking.id}
              </span>
            </div>

            <div className="flex justify-between gap-4 p-4">
              <span className="font-medium text-black dark:text-white">
                Total
              </span>

              <span className="font-semibold text-black dark:text-white">
                ₹{booking.total_price.toLocaleString("en-IN")}
              </span>
            </div>

          </div>

          {/* Status */}
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-center text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
            ✓ Your reservation is confirmed
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/trips")}
              className="flex-1 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              View My Trips
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              Explore more stays
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading confirmation...
            </p>
          </div>
        </main>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}