"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /*
   * Load saved theme when the component mounts.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  /*
   * Toggle between light and dark mode.
   */
  function toggleDarkMode() {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white text-black dark:border-gray-800 dark:bg-black dark:text-white">

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* =========================
            DESKTOP HEADER
        ========================== */}
        <div className="flex h-20 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-2xl font-bold tracking-tight text-[#FF385C]"
          >
            airbnb
          </Link>

          {/* Search bar */}
          <button
            type="button"
            className="hidden h-14 max-w-xl flex-1 items-center rounded-full border border-gray-200 bg-white px-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900 md:flex"
          >
            <div className="flex flex-1 items-center divide-x divide-gray-200 dark:divide-gray-700">

              <div className="px-4 text-left">
                <p className="text-xs font-semibold text-black dark:text-white">
                  Where
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Search destinations
                </p>
              </div>

              <div className="px-4 text-left">
                <p className="text-xs font-semibold text-black dark:text-white">
                  When
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add dates
                </p>
              </div>

              <div className="px-4 text-left">
                <p className="text-xs font-semibold text-black dark:text-white">
                  Who
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add guests
                </p>
              </div>

            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF385C] text-white">
              <span className="text-lg">
                ⌕
              </span>
            </div>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-2 lg:flex">

            {/* Home */}
            <Link
              href="/"
              className="rounded-full px-4 py-3 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              Home
            </Link>

            {/* Dark / Light mode */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Account menu */}
            <div className="relative">

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <span className="text-lg">
                  ☰
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
                  A
                </span>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 text-black shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-white">

                  <Link
                    href="/trips"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    My Trips
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Wishlists
                  </Link>

                  {/* Theme option */}
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="flex w-full items-center justify-between px-5 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span>
                      {darkMode
                        ? "Light mode"
                        : "Dark mode"}
                    </span>

                    <span className="text-lg">
                      {darkMode ? "☀️" : "🌙"}
                    </span>
                  </button>

                  <Link
                    href="/host"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Host Dashboard
                  </Link>

                </div>
              )}

            </div>

          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-black transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 md:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

        </div>

        {/* =========================
            MOBILE SEARCH
        ========================== */}
        <div className="pb-4 md:hidden">

          <Link
            href="/"
            className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >

            <span className="text-lg">
              ⌕
            </span>

            <div>
              <p className="text-sm font-medium text-black dark:text-white">
                Where to?
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Anywhere · Any week · Add guests
              </p>
            </div>

          </Link>

        </div>

        {/* =========================
            MOBILE MENU
        ========================== */}
        {menuOpen && (
          <div className="border-t border-gray-200 py-3 dark:border-gray-800 md:hidden">

            <Link
              href="/trips"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900"
            >
              My Trips
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900"
            >
              Wishlists
            </Link>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900"
            >
              <span>
                {darkMode
                  ? "Light mode"
                  : "Dark mode"}
              </span>

              <span>
                {darkMode ? "☀️" : "🌙"}
              </span>
            </button>

            <Link
              href="/host"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900"
            >
              Host Dashboard
            </Link>

          </div>
        )}

      </div>
    </header>
  );
}