"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type Booking = {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  nightly_price: number;
  cleaning_fee: number;
  service_fee: number;
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

export default function HostBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await fetch(
          `${API_URL}/bookings/host/?host_id=2`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load host bookings.");
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div>
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Your bookings
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage reservations for your properties.
          </p>
        </div>

        {loading && (
          <p className="mt-10 text-gray-500 dark:text-gray-400">
            Loading bookings...
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
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Reservations for your listings will appear here.
            </p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-black dark:text-white">
                      Property
                    </th>

                    <th className="px-6 py-4 font-semibold text-black dark:text-white">
                      Guest
                    </th>

                    <th className="px-6 py-4 font-semibold text-black dark:text-white">
                      Dates
                    </th>

                    <th className="px-6 py-4 font-semibold text-black dark:text-white">
                      Guests
                    </th>

                    <th className="px-6 py-4 font-semibold text-black dark:text-white">
                      Total
                    </th>

                    <th className="px-6 py-4 font-semibold text-black dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-black dark:text-white">
                          {booking.listing.title}
                        </p>

                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          {booking.listing.city}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-black dark:text-white">
                        Guest #{booking.guest_id}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-black dark:text-white">
                        {booking.check_in}

                        <span className="mx-2 text-gray-400 dark:text-gray-500">
                          →
                        </span>

                        {booking.check_out}
                      </td>

                      <td className="px-6 py-5 text-black dark:text-white">
                        {booking.guests}
                      </td>

                      <td className="px-6 py-5 font-medium text-black dark:text-white">
                        ₹{booking.total_price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}