import { getListing } from "@/lib/api";
import BookingCard from "@/components/booking/BookingCard";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import MapWrapper from "@/components/map/MapWrapper";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingPage({
  params,
}: ListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white sm:text-3xl">
            {listing.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="font-medium text-black dark:text-white">
              ★ {listing.rating.toFixed(1)}
            </span>

            <span className="text-gray-400 dark:text-gray-600">
              ·
            </span>

            <button
              type="button"
              className="font-medium text-black underline dark:text-white"
            >
              {listing.rating >= 4.8
                ? "Guest favourite"
                : "Highly rated"}
            </button>

            <span className="text-gray-400 dark:text-gray-600">
              ·
            </span>

            <button
              type="button"
              className="font-medium text-black underline dark:text-white"
            >
              {listing.location}, {listing.city},{" "}
              {listing.country}
            </button>

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black underline transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900"
              >
                ↗ Share
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black underline transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900"
              >
                ♡ Save
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mt-6 overflow-hidden rounded-2xl">
          <div className="grid aspect-[16/9] grid-cols-1 gap-2 md:grid-cols-2">

            {/* Main image */}
            <div className="overflow-hidden bg-gray-200 dark:bg-gray-800">
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Additional gallery images */}
            <div className="hidden grid-cols-2 gap-2 md:grid">

              <div className="overflow-hidden bg-gray-200 dark:bg-gray-800">
                {listing.image_url && (
                  <img
                    src={listing.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="overflow-hidden bg-gray-200 dark:bg-gray-800">
                {listing.image_url && (
                  <img
                    src={listing.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="overflow-hidden bg-gray-200 dark:bg-gray-800">
                {listing.image_url && (
                  <img
                    src={listing.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="overflow-hidden bg-gray-200 dark:bg-gray-800">
                {listing.image_url && (
                  <img
                    src={listing.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* Left column */}
          <div>

            {/* Property summary */}
            <div className="border-b border-gray-200 pb-8 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Entire place hosted by your host
              </h2>

              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {listing.max_guests} guests ·{" "}
                {listing.bedrooms} bedrooms ·{" "}
                {listing.beds} beds ·{" "}
                {listing.bathrooms} bathrooms
              </p>
            </div>

            {/* Highlights */}
            <div className="border-b border-gray-200 py-8 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                What this place offers
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">

                <div className="flex gap-4">
                  <span className="text-2xl">📶</span>

                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Wi-Fi
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stay connected during your trip
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-2xl">🍳</span>

                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Kitchen
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cook your own meals
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-2xl">❄️</span>

                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Air conditioning
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stay comfortable
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-2xl">🚗</span>

                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Free parking
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Parking available on the property
                    </p>
                  </div>
                </div>

              </div>

              <button
                type="button"
                className="mt-8 rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
              >
                Show all amenities
              </button>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 py-8 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                About this place
              </h2>

              <p className="mt-5 max-w-3xl whitespace-pre-line leading-7 text-gray-600 dark:text-gray-300">
                {listing.description}
              </p>
            </div>

            {/* Sleeping arrangements */}
            <div className="border-b border-gray-200 py-8 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Where you'll sleep
              </h2>

              <div className="mt-5 rounded-xl border border-gray-200 p-6 dark:border-gray-700">
                <div className="text-3xl">
                  🛏️
                </div>

                <p className="mt-4 font-medium text-black dark:text-white">
                  {listing.bedrooms} bedroom
                  {listing.bedrooms !== 1 ? "s" : ""}
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {listing.beds} bed
                  {listing.beds !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="border-b border-gray-200 py-8 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Where you'll be
              </h2>

              <p className="mt-3 text-gray-600 dark:text-gray-300">
                {listing.location}, {listing.city},{" "}
                {listing.country}
              </p>

              <div className="mt-6">
                {listing.latitude && listing.longitude ? (
                  <MapWrapper
                    latitude={listing.latitude}
                    longitude={listing.longitude}
                    title={listing.title}
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-900">
                    <div className="text-center">
                      <div className="text-4xl">
                        📍
                      </div>

                      <p className="mt-2 font-medium text-black dark:text-white">
                        {listing.city}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Location unavailable
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                The exact location is provided after booking.
              </p>
            </div>

            {/* Reviews */}
            <div className="py-8">
              <ReviewsSection
                listingId={listing.id}
              />
            </div>

          </div>

          {/* Booking card */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <BookingCard
              listingId={listing.id}
              pricePerNight={listing.price_per_night}
              maxGuests={listing.max_guests}
            />
          </div>

        </div>
      </div>
    </main>
  );
}