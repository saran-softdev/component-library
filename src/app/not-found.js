"use client";
import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Hotel illustration */}
      <div className="w-full md:w-1/2  relative overflow-hidden flex items-center justify-center min-h-[60vh] md:min-h-screen">
        <div className="relative w-screen h-screen">
          {/* Hotel illustration */}
          <Image
            loader={gcsImageLoader}
            src="/hotel-illustration404.jpeg"
            alt="Hotel Illustration"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full md:w-1/2 bg-[#f5e6cf] flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mb-4 text-[#0e2a38]">
            <div className="inline-block border-2 border-[#0e2a38] px-3 py-1 rounded-md text-sm font-medium">
              Error code: 404
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0e2a38] mb-4">
            Oops! You have found the lost world!
          </h1>
          <p className="text-lg md:text-xl text-[#0e2a38] mb-8">
            Home is just a click away. Let&apos;s go back and continue our
            regular life.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center w-full bg-transparent border border-[#0e2a38] text-[#0e2a38] font-medium rounded-md px-6 py-3 transition duration-300 hover:bg-[#0e2a38] hover:text-white"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
