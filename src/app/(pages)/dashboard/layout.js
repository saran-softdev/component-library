"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLoader from "@/Components/Layout/DashboardLoader";
import DashboardLayout from "@/Components/Layout/DashboardLayout";

export default function RootLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, session, router, pathname]);

  if (status === "loading") {
    return <DashboardLoader />;
  }

  if (status !== "authenticated") {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
