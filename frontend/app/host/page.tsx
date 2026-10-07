import Link from "next/link";
import { getHostListings } from "@/lib/api";
import DeleteListingButton from "@/components/host/DeleteListingButton";

type Listing = {
  id: number;
  title: string;
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

export default async function HostDashboard() {
  const listings: Listing[] = await getHostListings();

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold text-black dark:text-white">
              Host Dashboard
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your properties
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/host/bookings"
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              View all bookings
            </Link>

            <Link
              href="/host/listings/new"
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              + Add listing
            </Link>
          </div>
        </div>

        {/* NO LISTINGS */}
        {listings.length === 0 ? (
          <div className="mt-12 rounded-xl border border-gray-200 p-8 text-center dark:border-gray-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              No listings yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Create your first listing to get started.
            </p>

            <Link
              href="/host/listings/new"
              className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Create listing
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
              >

                {/* IMAGE */}
                <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-800">
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

                {/* LISTING DETAILS */}
                <div className="p-5">
                  <div className="flex justify-between gap-3">
                    <h2 className="font-semibold text-black dark:text-white">
                      {listing.title}
                    </h2>

                    <span className="text-sm text-black dark:text-white">
                      ★ {listing.rating}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {listing.location}, {listing.city}
                  </p>

                  <p className="mt-3 text-black dark:text-white">
                    <span className="font-semibold">
                      ₹{listing.price_per_night.toLocaleString("en-IN")}
                    </span>{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      / night
                    </span>
                  </p>

                  {/* PROPERTY DETAILS */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {listing.max_guests}
                      </p>
                      <p>guests</p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {listing.bedrooms}
                      </p>
                      <p>bedrooms</p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {listing.bathrooms}
                      </p>
                      <p>bathrooms</p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/listings/${listing.id}/edit`}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-black transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
                    >
                      Edit
                    </Link>

                    <DeleteListingButton
                      listingId={listing.id}
                    />
                  </div>

                  {/* BOOKINGS */}
                  <Link
                    href={`/host/bookings?listing_id=${listing.id}`}
                    className="mt-3 block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-black transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
                  >
                    View bookings
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}