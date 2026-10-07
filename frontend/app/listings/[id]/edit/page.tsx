"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getHostListing,
  updateListing,
} from "@/lib/api";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    country: "",
    price_per_night: "",
    max_guests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadListing() {
      try {
        const listing = await getHostListing(id);

        setForm({
          title: listing.title,
          description: listing.description,
          location: listing.location,
          city: listing.city,
          country: listing.country,
          price_per_night: String(
            listing.price_per_night
          ),
          max_guests: String(listing.max_guests),
          bedrooms: String(listing.bedrooms),
          beds: String(listing.beds),
          bathrooms: String(listing.bathrooms),
        });
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load listing."
        );
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");
    setSaving(true);

    try {
      await updateListing(id, {
        title: form.title,
        description: form.description,
        location: form.location,
        city: form.city,
        country: form.country,
        price_per_night: Number(
          form.price_per_night
        ),
        max_guests: Number(form.max_guests),
        bedrooms: Number(form.bedrooms),
        beds: Number(form.beds),
        bathrooms: Number(form.bathrooms),
      });

      router.push("/host");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update listing."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClassName =
    "mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none transition placeholder:text-gray-500 focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-white";

  const labelClassName =
    "text-sm font-medium text-black dark:text-white";

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Loading listing...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-8">

        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Edit listing
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Update the details of your property.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className={labelClassName}>
              Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClassName}>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              className={inputClassName}
            />
          </div>

          {/* Location + City */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>
                Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                City
              </label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className={labelClassName}>
              Country
            </label>

            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>

          {/* Price */}
          <div>
            <label className={labelClassName}>
              Price per night (₹)
            </label>

            <input
              name="price_per_night"
              type="number"
              min="1"
              value={form.price_per_night}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>

          {/* Property details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>
                Maximum guests
              </label>

              <input
                name="max_guests"
                type="number"
                min="1"
                value={form.max_guests}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Bedrooms
              </label>

              <input
                name="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Beds
              </label>

              <input
                name="beds"
                type="number"
                min="0"
                value={form.beds}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Bathrooms
              </label>

              <input
                name="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>
          </div>

          {/* Error */}
          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {message}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/host")}
              className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-medium text-black transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}