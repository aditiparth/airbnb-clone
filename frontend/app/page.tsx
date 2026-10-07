"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/listings/ListingCard";
import { getListings } from "@/lib/api";

type Listing = {
  id: number;
  title: string;
  location: string;
  city: string;
  country: string;
  price_per_night: number;
  rating: number;
  image_url?: string | null;
};

type CitySection = {
  title: string;
  location: string;
};

const citySections: CitySection[] = [
  {
    title: "Stays in Bhopal",
    location: "Bhopal",
  },
  {
    title: "Check out homes in Indore",
    location: "Indore",
  },
  {
    title: "Explore stays in Ujjain",
    location: "Ujjain",
  },
  {
    title: "Popular homes in Jaipur",
    location: "Jaipur",
  },
];

const categories = [
  { name: "Homes", icon: "⌂" },
  { name: "Beach", icon: "♨" },
  { name: "Mountains", icon: "⌁" },
  { name: "City", icon: "▦" },
  { name: "Countryside", icon: "♧" },
  { name: "Pools", icon: "◯" },
  { name: "Amazing views", icon: "◇" },
];

export default function HomePage() {
  const [listingsByCity, setListingsByCity] = useState<
    Record<string, Listing[]>
  >({});

  const [searchResults, setSearchResults] = useState<Listing[]>([]);

  const [loading, setLoading] = useState(true);

  // Search filters
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const hasFilters =
    location.trim() !== "" ||
    checkIn !== "" ||
    checkOut !== "" ||
    guests !== "" ||
    minPrice !== "" ||
    maxPrice !== "";

  /*
   * Load the normal homepage.
   *
   * Each city gets its own API request.
   */
  async function loadHomepage() {
    try {
      setLoading(true);

      const results = await Promise.all(
        citySections.map(async (section) => {
          const listings = await getListings({
            location: section.location,
            limit: 8,
          });

          return {
            location: section.location,
            listings,
          };
        })
      );

      const grouped: Record<string, Listing[]> = {};

      results.forEach((result) => {
        /*
         * Extra protection:
         * Only keep listings that actually belong
         * to this city's section.
         */
        const cityListings = result.listings.filter(
          (listing: Listing) =>
            listing.city.toLowerCase() ===
            result.location.toLowerCase()
        );

        grouped[result.location] = cityListings;
      });

      setListingsByCity(grouped);
    } catch (error) {
      console.error(
        "Failed to load homepage listings:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Load filtered search results.
   *
   * This makes ONE API request.
   */
  async function loadSearchResults() {
    try {
      setLoading(true);

      const listings = await getListings({
        location: location.trim() || undefined,
        guests: guests ? Number(guests) : undefined,
        min_price: minPrice
          ? Number(minPrice)
          : undefined,
        max_price: maxPrice
          ? Number(maxPrice)
          : undefined,
        check_in: checkIn || undefined,
        check_out: checkOut || undefined,
        limit: 50,
      });

      /*
       * Extra client-side location check.
       *
       * If the user searches "Bhopal", only listings
       * containing "Bhopal" in city/location/country
       * are allowed through.
       */
      const searchLocation =
        location.trim().toLowerCase();

      const filteredListings = searchLocation
        ? listings.filter(
            (listing: Listing) =>
              listing.city
                .toLowerCase()
                .includes(searchLocation) ||
              listing.location
                .toLowerCase()
                .includes(searchLocation) ||
              listing.country
                .toLowerCase()
                .includes(searchLocation)
          )
        : listings;

      setSearchResults(filteredListings);
    } catch (error) {
      console.error(
        "Failed to search listings:",
        error
      );

      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHomepage();
  }, []);

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    loadSearchResults();
  }

  function clearFilters() {
    setLocation("");
    setCheckIn("");
    setCheckOut("");
    setGuests("");
    setMinPrice("");
    setMaxPrice("");
    setSearchResults([]);

    loadHomepage();
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">

      {/* =========================
          SEARCH
      ========================== */}
      <section className="border-b bg-white dark:border-gray-800 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 md:flex-row"
          >

            {/* Where */}
            <div className="flex-1 border-b px-5 py-4 md:border-b-0 md:border-r dark:border-gray-700">
              <label className="block text-xs font-semibold text-black dark:text-white">
                Where
              </label>

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Search destinations"
                className="mt-1 w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>

            {/* Check in */}
            <div className="flex-1 border-b px-5 py-4 md:border-b-0 md:border-r dark:border-gray-700">
              <label className="block text-xs font-semibold text-black dark:text-white">
                Check in
              </label>

              <input
                type="date"
                value={checkIn}
                onChange={(event) =>
                  setCheckIn(event.target.value)
                }
                className="mt-1 w-full bg-transparent text-sm text-black outline-none dark:text-white"
              />
            </div>

            {/* Check out */}
            <div className="flex-1 border-b px-5 py-4 md:border-b-0 md:border-r dark:border-gray-700">
              <label className="block text-xs font-semibold text-black dark:text-white">
                Check out
              </label>

              <input
                type="date"
                value={checkOut}
                onChange={(event) =>
                  setCheckOut(event.target.value)
                }
                className="mt-1 w-full bg-transparent text-sm text-black outline-none dark:text-white"
              />
            </div>

            {/* Guests */}
            <div className="flex-1 border-b px-5 py-4 md:border-b-0 md:border-r dark:border-gray-700">
              <label className="block text-xs font-semibold text-black dark:text-white">
                Guests
              </label>

              <input
                type="number"
                min="1"
                value={guests}
                onChange={(event) =>
                  setGuests(event.target.value)
                }
                placeholder="Add guests"
                className="mt-1 w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>

            {/* Search button */}
            <div className="flex items-center justify-center p-3">
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#FF385C] px-6 text-sm font-semibold text-white transition hover:bg-[#E31C5F] md:w-12 md:px-0"
                aria-label="Search"
              >
                🔍
              </button>
            </div>

          </form>

          {/* Price filters */}
          <div className="mx-auto mt-4 flex max-w-5xl flex-wrap items-center gap-3">

            <span className="text-sm font-medium text-black dark:text-white">
              Price:
            </span>

            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) =>
                setMinPrice(event.target.value)
              }
              placeholder="Min"
              className="w-24 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black outline-none placeholder:text-gray-500 focus:border-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-white"
            />

            <span className="text-gray-500 dark:text-gray-400">
              —
            </span>

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(event.target.value)
              }
              placeholder="Max"
              className="w-24 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black outline-none placeholder:text-gray-500 focus:border-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-white"
            />

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
              >
                Clear filters
              </button>
            )}

          </div>
        </div>
      </section>

      {/* =========================
          CATEGORIES
      ========================== */}
      <section className="border-b bg-white dark:border-gray-800 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="flex gap-8 overflow-x-auto py-5">

            {categories.map((category, index) => (
              <button
                key={category.name}
                type="button"
                className={`group flex min-w-fit flex-col items-center gap-2 border-b-2 pb-3 ${
                  index === 0
                    ? "border-black text-black dark:border-white dark:text-white"
                    : "border-transparent text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <span className="text-2xl">
                  {category.icon}
                </span>

                <span className="whitespace-nowrap text-xs font-medium">
                  {category.name}
                </span>
              </button>
            ))}

          </div>

        </div>
      </section>

      {/* =========================
          CONTENT
      ========================== */}
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">

        {loading ? (
          <div className="space-y-14">

            {[1, 2].map((section) => (
              <section key={section}>

                <div className="mb-5">
                  <div className="h-7 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

                  <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">

                  {[1, 2, 3, 4].map((item) => (
                    <div key={item}>

                      <div className="aspect-square animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />

                      <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

                      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

                    </div>
                  ))}

                </div>
              </section>
            ))}

          </div>
        ) : hasFilters ? (

          /* =========================
             SEARCH RESULTS
          ========================== */
          <section>

            <div className="mb-6">

              <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                {location.trim()
                  ? `Stays in ${location}`
                  : "Search results"}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchResults.length}{" "}
                {searchResults.length === 1
                  ? "stay"
                  : "stays"}{" "}
                found
              </p>

            </div>

            {searchResults.length === 0 ? (

              <div className="rounded-2xl border border-gray-200 p-12 text-center dark:border-gray-800">

                <div className="text-4xl">
                  🏠
                </div>

                <h2 className="mt-4 text-xl font-semibold text-black dark:text-white">
                  No stays found
                </h2>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try changing your destination or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Clear filters
                </button>

              </div>

            ) : (

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">

                {searchResults.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                  />
                ))}

              </div>

            )}

          </section>

        ) : (

          /* =========================
             NORMAL HOMEPAGE
          ========================== */
          <div className="space-y-14">

            {citySections.map((section) => {

              const listings =
                listingsByCity[section.location] || [];

              if (listings.length === 0) {
                return null;
              }

              return (
                <section key={section.location}>

                  <div className="mb-5 flex items-end justify-between">

                    <div>
                      <h2 className="text-[22px] font-semibold tracking-tight text-black dark:text-white">
                        {section.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Discover places to stay in{" "}
                        {section.location}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="hidden items-center gap-1 text-sm font-medium text-black underline dark:text-white sm:flex"
                    >
                      Show all
                      <span>→</span>
                    </button>

                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">

                    {listings
                      .slice(0, 4)
                      .map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                        />
                      ))}

                  </div>

                  {listings.length > 4 && (
                    <button
                      type="button"
                      className="mt-5 text-sm font-medium text-black underline dark:text-white sm:hidden"
                    >
                      Show all stays in{" "}
                      {section.location}
                    </button>
                  )}

                </section>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}