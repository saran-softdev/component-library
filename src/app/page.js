import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";
import Link from "next/link";

import HeroSection from "@/Components/HomeComponents/HeroSection";
import FeaturesSection from "@/Components/HomeComponents/FeaturesSection";
import TrustStatsSection from "@/Components/HomeComponents/TrustStatsSection";
import ManagementServicesSection from "@/Components/HomeComponents/ManagementServicesSection";
import HomeNavbar from "@/Components/common/HomeNavbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <TrustStatsSection />
      <ManagementServicesSection />
      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Property Management System. All rights
        reserved.
      </footer>
    </div>
  );
}
