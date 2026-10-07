"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getListing, createBooking } from "@/lib/api";

type Listing = {
  id: number;
  title: string;
  location: string;
  city: string;
  country: string;
  price_per_night: number;
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const listingId = searchParams.get("listingId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListing() {
      if (!listingId) {
        setError("Listing information is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await getListing(listingId);
        setListing(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [listingId]);

  function calculateNights() {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    return Math.ceil(
      (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }

  async function handleConfirmBooking() {
    if (!listingId || !checkIn || !checkOut || !guests) {
      setError("Incomplete booking information.");
      return;
    }

    try {
      setBooking(true);
      setError("");

      const booking = await createBooking(
        Number(listingId),
        checkIn,
        checkOut,
        Number(guests)
      );

      router.push(
        `/booking-confirmation?bookingId=${booking.id}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create booking."
      );
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  if (error && !listing) {
    return (
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-xl border border-gray-200 p-8 dark:border-gray-800">
            <h1 className="text-xl font-semibold text-black dark:text-white">
              Something went wrong
            </h1>

            <p className="mt-2 text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!listing) return null;

  const nights = calculateNights();
  const subtotal = nights * listing.price_per_night;
  const cleaningFee = 500;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + cleaningFee + serviceFee;

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Confirm and pay
        </h1>

        <div className="mt-8 grid gap-10 md:grid-cols-2">

          {/* Booking details */}
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Your trip
            </h2>

            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
              <h3 className="text-lg font-medium text-black dark:text-white">
                {listing.title}
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {listing.location}, {listing.city},{" "}
                {listing.country}
              </p>

              <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-black dark:text-white">
                    Dates
                  </span>

                  <span className="text-right text-gray-600 dark:text-gray-300">
                    {checkIn} → {checkOut}
                  </span>
                </div>

                <div className="mt-4 flex justify-between">
                  <span className="font-medium text-black dark:text-white">
                    Guests
                  </span>

                  <span className="text-gray-600 dark:text-gray-300">
                    {guests}{" "}
                    {Number(guests) === 1
                      ? "guest"
                      : "guests"}
                  </span>
                </div>
              </div>
            </div>

            {/* Mock payment */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
              <h2 className="font-semibold text-black dark:text-white">
                Payment
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This is a mock checkout. No real
                payment will be processed.
              </p>

              <div className="mt-4 rounded-lg bg-gray-100 p-4 text-sm text-black dark:bg-gray-900 dark:text-white">
                💳 Mock payment method
                <br />
                <span className="text-gray-500 dark:text-gray-400">
                  •••• •••• •••• 4242
                </span>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Price details
              </h2>

              <div className="mt-6 space-y-4 text-sm text-black dark:text-white">
                <div className="flex justify-between gap-4">
                  <span>
                    ₹{listing.price_per_night.toLocaleString("en-IN")} ×{" "}
                    {nights} nights
                  </span>

                  <span>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Cleaning fee</span>

                  <span>
                    ₹{cleaningFee.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Service fee</span>

                  <span>
                    ₹{serviceFee.toFixed(0)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>

                    <span>
                      ₹{total.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={booking}
                className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {booking
                  ? "Confirming..."
                  : "Confirm and pay"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                You won't be charged. This is a
                mock payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}