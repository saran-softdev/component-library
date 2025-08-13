"use client";
import DashboardLayout from "@/custom-components/layouts/DashboardLayout";
import DashboardLoader from "@/custom-components/layouts/DashboardLoader";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
