import Link from "next/link";
import { getHostListings } from "@/lib/api";
import DeleteListingButton from "@/components/host/DeleteListingButton";

type Listing = {
  id: number;
  title: string;
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
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            Host Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your properties
          </p>
        </div>

        <Link
          href="/host/listings/new"
          className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-12 rounded-xl border p-8 text-center">
          <h2 className="text-xl font-semibold">
            No listings yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first listing to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-xl border"
            >
              <div className="flex aspect-video items-center justify-center bg-gray-200 text-gray-500">
                Image
              </div>

              <div className="p-5">
                <div className="flex justify-between gap-3">
                  <h2 className="font-semibold">
                    {listing.title}
                  </h2>

                  <span className="text-sm">
                    ★ {listing.rating}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {listing.location}, {listing.city}
                </p>

                <p className="mt-3">
                  <span className="font-semibold">
                    ₹{listing.price_per_night}
                  </span>{" "}
                  night
                </p>

                <div className="mt-4 flex gap-3">
  <Link
    href={`/listings/${listing.id}/edit`}
    className="flex-1 rounded-lg border px-4 py-2 text-center text-sm font-medium hover:bg-gray-50"
  >
    Edit
  </Link>

  <DeleteListingButton
    listingId={listing.id}
  />
</div>

<Link
  href={`/host/bookings?listing_id=${listing.id}`}
  className="mt-3 block w-full rounded-lg border px-4 py-2 text-center text-sm font-medium hover:bg-gray-50"
>
  View bookings
</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}