"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteListing } from "@/lib/api";

type DeleteListingButtonProps = {
  listingId: number;
};

export default function DeleteListingButton({
  listingId,
}: DeleteListingButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await deleteListing(listingId);

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete listing."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}