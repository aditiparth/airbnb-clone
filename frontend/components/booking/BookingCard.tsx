"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAvailability } from "@/lib/api";

type BookingCardProps = {
  listingId: number;
  pricePerNight: number;
  maxGuests: number;
};

export default function BookingCard({
  listingId,
  pricePerNight,
  maxGuests,
}: BookingCardProps) {
  const router = useRouter();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAvailability() {
      try {
        const data = await getAvailability(listingId);
        setBookedDates(data.booked_dates);
      } catch (error) {
        console.error(error);
      }
    }

    loadAvailability();
  }, [listingId]);

  function calculateNights() {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  const nights = calculateNights();

  const subtotal =
    nights > 0 ? nights * pricePerNight : 0;

  const cleaningFee =
    nights > 0 ? 500 : 0;

  const serviceFee =
    subtotal * 0.1;

  const total =
    subtotal + cleaningFee + serviceFee;

  function isDateBooked(date: string) {
    return bookedDates.includes(date);
  }

  function handleReserve() {
    setMessage("");

    if (!checkIn || !checkOut) {
      setMessage(
        "Please select your check-in and check-out dates."
      );
      return;
    }

    if (nights <= 0) {
      setMessage(
        "Check-out must be after check-in."
      );
      return;
    }

    if (Number(guests) > maxGuests) {
      setMessage(
        `This listing allows a maximum of ${maxGuests} guests.`
      );
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    for (
      let current = new Date(start);
      current < end;
      current.setDate(current.getDate() + 1)
    ) {
      const dateString =
        current.toISOString().split("T")[0];

      if (isDateBooked(dateString)) {
        setMessage(
          "Some of your selected dates are already booked."
        );
        return;
      }
    }

    const params = new URLSearchParams({
      listingId: listingId.toString(),
      checkIn,
      checkOut,
      guests,
    });

    router.push(
      `/checkout?${params.toString()}`
    );
  }

  return (
    <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-lg dark:border-gray-700 dark:bg-white dark:text-black">

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-black">
          ₹{pricePerNight}
        </span>

        <span className="text-gray-500">
          night
        </span>
      </div>

      {/* Dates */}
      <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl border border-gray-300">

        {/* Check-in */}
        <div className="border-r border-gray-300 p-3">
          <label className="text-xs font-semibold text-black">
            CHECK-IN
          </label>

          <input
            type="date"
            value={checkIn}
            onChange={(e) =>
              setCheckIn(e.target.value)
            }
            className="mt-2 w-full bg-transparent text-sm text-black outline-none"
          />
        </div>

        {/* Check-out */}
        <div className="p-3">
          <label className="text-xs font-semibold text-black">
            CHECK-OUT
          </label>

          <input
            type="date"
            value={checkOut}
            onChange={(e) =>
              setCheckOut(e.target.value)
            }
            className="mt-2 w-full bg-transparent text-sm text-black outline-none"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="mt-3 rounded-xl border border-gray-300 p-3">
        <label className="text-xs font-semibold text-black">
          GUESTS
        </label>

        <select
          value={guests}
          onChange={(e) =>
            setGuests(e.target.value)
          }
          className="mt-2 w-full bg-transparent text-black outline-none"
        >
          {Array.from(
            { length: maxGuests },
            (_, index) => index + 1
          ).map((number) => (
            <option
              key={number}
              value={number}
              className="bg-white text-black"
            >
              {number}{" "}
              {number === 1
                ? "guest"
                : "guests"}
            </option>
          ))}
        </select>
      </div>

      {/* Reserve */}
      <button
        type="button"
        onClick={handleReserve}
        className="mt-5 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
      >
        Reserve
      </button>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="mt-6 space-y-3 text-sm text-black">

          <div className="flex justify-between">
            <span>
              ₹{pricePerNight} × {nights} nights
            </span>

            <span>
              ₹{subtotal}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Cleaning fee</span>

            <span>
              ₹{cleaningFee}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Service fee</span>

            <span>
              ₹{serviceFee.toFixed(0)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-base font-semibold text-black">
              <span>Total</span>

              <span>
                ₹{total.toFixed(0)}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Status message */}
      {message && (
        <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
          {message}
        </p>
      )}

    </div>
  );
}