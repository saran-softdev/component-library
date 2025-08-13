"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

// ✅ Component imports
import AdminHotelCount from "@/Components/(admin)/(overView)/(pms-admin)/AdminHotelCount";
import AdminBookingStats from "@/Components/(admin)/(overView)/(pms-admin)/AdminBookingStats";
import PlatformRevenueInsights from "@/Components/(admin)/(overView)/(pms-admin)/PlatformRevenueInsights";
import SupportTicketsBoard from "@/Components/(admin)/(overView)/(pms-staff)/SupportTicketsBoard";
import VerificationTaskQueue from "@/Components/(admin)/(overView)/(pms-staff)/VerificationTaskQueue";
import TodayBookingSummary from "@/Components/(admin)/(overView)/(pms-staff)/TodayBookingSummary";
import OwnerRoomInventory from "@/Components/(admin)/(overView)/(hotel-owner)/OwnerRoomInventory";
import OwnerBookingOverview from "@/Components/(admin)/(overView)/(hotel-owner)/OwnerBookingOverview";
import OwnerRevenueReport from "@/Components/(admin)/(overView)/(hotel-owner)/OwnerRevenueReport";
import StaffTaskAssignments from "@/Components/(admin)/(overView)/(hotel-staff)/StaffTaskAssignments";
import CheckinCheckoutMonitor from "@/Components/(admin)/(overView)/(hotel-staff)/CheckinCheckoutMonitor";
import GuestServiceRequests from "@/Components/(admin)/(overView)/(hotel-staff)/GuestServiceRequests";

// ✅ Widget metadata with layout preferences
const widgetMeta = [
  { Component: AdminHotelCount, size: "large", priority: 1 },
  { Component: AdminBookingStats, size: "large", priority: 1 },
  { Component: PlatformRevenueInsights, size: "large", priority: 2 },
  { Component: SupportTicketsBoard, size: "large", priority: 3 },
  { Component: VerificationTaskQueue, size: "large", priority: 3 },
  { Component: TodayBookingSummary, size: "large", priority: 2 },
  { Component: OwnerRoomInventory, size: "large", priority: 3 },
  { Component: OwnerBookingOverview, size: "large", priority: 3 },
  { Component: OwnerRevenueReport, size: "large", priority: 3 },
  { Component: StaffTaskAssignments, size: "large", priority: 2 },
  { Component: CheckinCheckoutMonitor, size: "large", priority: 2 },
  { Component: GuestServiceRequests, size: "large", priority: 2 }
];

// ✅ Loading Component
const LoadingWidget = ({ className = "" }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
  >
    <div className="p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// ✅ Error Boundary Component
const WidgetErrorBoundary = ({ children, componentName }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-800 font-medium">Widget Error</div>
        <div className="text-red-600 text-sm mt-1">
          Failed to load {componentName}
        </div>
      </div>
    );
  }

  return children;
};

const Page = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [allowedComponents, setAllowedComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllowedComponents = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "/api/component-widgets?controllerName=getComponentAccessForPathname",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ pathname })
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (Array.isArray(data.components)) {
          const names = data.components.map((c) => c.componentName);
          setAllowedComponents(names);
        } else {
          setAllowedComponents([]);
        }
      } catch (error) {
        console.error("❌ Error fetching components:", error);
        setError(error.message);
        setAllowedComponents([]);
      } finally {
        setLoading(false);
      }
    };

    if (pathname) {
      fetchAllowedComponents();
    }
  }, [pathname]);

  // ✅ Loading states
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingWidget key={i} className="h-48" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-lg font-medium mb-2">
            Failed to Load Dashboard
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  // ✅ Filter and sort widgets
  const filteredWidgets = widgetMeta
    .filter(({ Component }) => allowedComponents.includes(Component.name))
    .sort((a, b) => a.priority - b.priority);

  // ✅ Empty state
  if (filteredWidgets.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-600 text-lg font-medium mb-2">
            No Widgets Available
          </div>
          <div className="text-gray-500">
            Contact your administrator to configure dashboard access.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* ✅ Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Overview
          </h1>
          <div className="text-gray-600">
            Welcome back, {session?.user?.name || "User"}
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
          {filteredWidgets.map(({ Component, size }, index) => {
            const getGridSpan = (size) => {
              switch (size) {
                case "small":
                  return "sm:col-span-1";
                case "medium":
                  return "sm:col-span-2 lg:col-span-2";
                case "large":
                  return "sm:col-span-2 lg:col-span-3 xl:col-span-4";
                default:
                  return "sm:col-span-1";
              }
            };

            return (
              <div
                key={Component.name}
                className={`col-span-1 ${getGridSpan(size)} flex`}
              >
                <div className="w-full flex flex-col">
                  <WidgetErrorBoundary componentName={Component.name}>
                    <Suspense fallback={<LoadingWidget className="flex-1" />}>
                      <Component />
                    </Suspense>
                  </WidgetErrorBoundary>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Page;
