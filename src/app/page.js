import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";
import Link from "next/link";
import HomeNavbar from "@/custom-components/common/HomeNavbar";
import HeroSection from "@/custom-components/home-components/HeroSection";
import FeaturesSection from "@/custom-components/home-components/FeaturesSection";
import TrustStatsSection from "@/custom-components/home-components/TrustStatsSection";
import ManagementServicesSection from "@/custom-components/home-components/ManagementServicesSection";

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
