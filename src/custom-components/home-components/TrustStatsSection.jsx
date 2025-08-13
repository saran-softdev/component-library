import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";
import Link from "next/link";

export default function TrustStatsSection() {
  return (
    <section className="bg-theme-surface py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-theme-text mb-4 leading-tight">
            Trusted by 100+ Property Owners
          </h2>
          <p className="text-theme-secondary text-lg mb-6">
            86% occupancy rate &bull; 4.9/5 guest satisfaction
          </p>
          <Link
            href="/dashboard"
            className="btn-theme-primary inline-block px-6 py-3 rounded-full font-semibold transition"
          >
            See How It Works
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-96 h-96 flex justify-center">
          <Image
            loader={gcsImageLoader}
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1500&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJ1c3R8ZW58MHx8MHx8fDA%3D"
            alt="Happy customers"
            width={400}
            height={300}
            className="rounded-xl object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
