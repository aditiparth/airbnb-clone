"use client";

import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@/components/map/Map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-gray-100">
        <p className="text-sm text-gray-500">
          Loading map...
        </p>
      </div>
    ),
  }
);

type MapWrapperProps = {
  latitude: number;
  longitude: number;
  title: string;
};

export default function MapWrapper({
  latitude,
  longitude,
  title,
}: MapWrapperProps) {
  return (
    <Map
      latitude={latitude}
      longitude={longitude}
      title={title}
    />
  );
}