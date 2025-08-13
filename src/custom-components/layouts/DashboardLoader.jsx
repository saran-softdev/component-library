"use client";
import React, { useState } from "react";
import { Skeleton } from "./Skeleton";
import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";

export default function DashboardLoader() {
  /*   if (typeof window !== "undefined") {
    throw new Error("This is a test error from DashboardLoader!");
  } */

  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Header Search & Profile */}
      <div className="z-20 flex justify-between items-center bg-white px-4 py-4 border-b border-gray-300">
        <div className="flex items-center justify-start h-[40px] px-4 bg-white ">
          {imgError ? (
            <span className="text-2xl font-bold text-gray-700">PMS</span>
          ) : (
            <Image
              loader={gcsImageLoader}
              alt="PMS Logo"
              src="/pmslogo.png"
              width={70}
              height={50}
              quality={100}
              priority
              className="object-contain"
            />
          )}
        </div>
        <Skeleton className="h-10 w-[400px] rounded-md" />
        <div className="flex justify-center items-center gap-3">
          <div className="flex justify-center items-center gap-2">
            {" "}
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
      </div>{" "}
      <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
        {/* Navbar with Logo */}
        <div className="flex flex-col w-64 border-r border-gray-300">
          {/* Sidebar skeleton items fill remaining height */}
          <aside className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-white">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="flex justify-center items-center gap-2 px-3"
              >
                <Skeleton className="h-7 w-7 rounded-md p-3" />
                <Skeleton className="h-3 w-full rounded-md p-3" />
              </div>
            ))}
          </aside>
        </div>

        <div className="flex-1 space-y-6 bg-white py-6">
          {" "}
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
          {/* Booking Trend Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          {/* Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
