"use client";

import { useEffect, useState } from "react";
import {
  createReview,
  getReviews,
  getBookings,
} from "@/lib/api";

type Review = {
  id: number;
  listing_id: number;
  guest_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  guest_name: string;
};

type Booking = {
  id: number;
  listing_id: number;
  check_in: string;
  check_out: string;
  status: string;
};

type ReviewsSectionProps = {
  listingId: number;
};

export default function ReviewsSection({
  listingId,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function loadReviews() {
    try {
      const [reviewsData, bookingsData] = await Promise.all([
        getReviews(listingId),
        getBookings(),
      ]);

      setReviews(reviewsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [listingId]);

  const eligibleBooking = bookings.find(
    (booking) =>
      booking.listing_id === listingId &&
      booking.status === "confirmed" &&
      !reviews.some(
        (review) => review.booking_id === booking.id
      )
  );

  async function handleSubmit() {
    if (!eligibleBooking) {
      setMessage(
        "You need a completed booking to leave a review."
      );
      return;
    }

    if (!comment.trim()) {
      setMessage("Please write a comment.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await createReview(
        listingId,
        eligibleBooking.id,
        rating,
        comment
      );

      setComment("");
      setRating(5);
      setMessage("Review submitted successfully!");

      await loadReviews();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 border-t border-gray-200 pt-10 dark:border-gray-800">

      {/* Reviews heading */}
      <h2 className="text-2xl font-semibold text-black dark:text-white">
        ⭐{" "}
        {reviews.length > 0
          ? `${(
              reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / reviews.length
            ).toFixed(1)} · ${reviews.length} reviews`
          : "No reviews yet"}
      </h2>

      {loading ? (
        <p className="mt-6 text-gray-500 dark:text-gray-400">
          Loading reviews...
        </p>
      ) : (
        <>
          {/* Existing reviews */}
          {reviews.length > 0 && (
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {reviews.map((review) => (
                <div key={review.id}>

                  {/* Reviewer */}
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {review.guest_name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium text-black dark:text-white">
                        {review.guest_name}
                      </p>

                      <p className="text-sm text-black dark:text-white">
                        {"★".repeat(review.rating)}
                        <span className="text-gray-300 dark:text-gray-600">
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </p>
                    </div>

                  </div>

                  {/* Comment */}
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>

                </div>
              ))}
            </div>
          )}

          {/* Leave a review */}
          {eligibleBooking && (
            <div className="mt-10 rounded-xl border border-gray-200 p-6 dark:border-gray-700">

              <h3 className="text-lg font-semibold text-black dark:text-white">
                Leave a review
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Reviewing as{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  Aditi
                </span>
              </p>

              {/* Rating */}
              <div className="mt-4">
                <label className="text-sm font-medium text-black dark:text-white">
                  Rating
                </label>

                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5`}
                      className="text-2xl transition hover:scale-110"
                    >
                      <span
                        className={
                          star <= rating
                            ? "text-black dark:text-white"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      >
                        {star <= rating
                          ? "★"
                          : "☆"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Share your experience..."
                rows={4}
                className="mt-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none placeholder:text-gray-500 focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white"
              />

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit review"}
              </button>

              {/* Message */}
              {message && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {message}
                </p>
              )}

            </div>
          )}
        </>
      )}
    </section>
  );
}