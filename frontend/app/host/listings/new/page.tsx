"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/lib/api";

export default function NewListingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    location: "",
    city: "",
    country: "",
    price_per_night: "",
    max_guests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    setError("");
    setLoading(true);

    try {
      await createListing({
        title: form.title,
        description: form.description,
        image_url: form.image_url || undefined,
        location: form.location,
        city: form.city,
        country: form.country,
        price_per_night: Number(form.price_per_night),
        max_guests: Number(form.max_guests),
        bedrooms: Number(form.bedrooms),
        beds: Number(form.beds),
        bathrooms: Number(form.bathrooms),
      });

      router.push("/host");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create listing."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none transition placeholder:text-gray-500 focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-white";

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-8">

        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Create a new listing
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add your property details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <input
            name="title"
            placeholder="Listing title"
            value={form.title}
            onChange={handleChange}
            required
            className={inputClassName}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className={inputClassName}
          />

          <input
            name="image_url"
            type="url"
            placeholder="Image URL"
            value={form.image_url}
            onChange={handleChange}
            className={inputClassName}
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
            className={inputClassName}
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className={inputClassName}
          />

          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
            className={inputClassName}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="price_per_night"
              type="number"
              placeholder="Price per night"
              value={form.price_per_night}
              onChange={handleChange}
              required
              min="1"
              className={inputClassName}
            />

            <input
              name="max_guests"
              type="number"
              placeholder="Maximum guests"
              value={form.max_guests}
              onChange={handleChange}
              required
              min="1"
              className={inputClassName}
            />

            <input
              name="bedrooms"
              type="number"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              required
              min="0"
              className={inputClassName}
            />

            <input
              name="beds"
              type="number"
              placeholder="Beds"
              value={form.beds}
              onChange={handleChange}
              required
              min="0"
              className={inputClassName}
            />

            <input
              name="bathrooms"
              type="number"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              required
              min="0"
              className={inputClassName}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
        </form>
      </div>
    </main>
  );
}