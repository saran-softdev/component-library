import React from "react";

// Map component names to dynamic imports from their correct subfolders
const componentMap = {
  AdminHotelCount: React.lazy(() =>
    import("../(admin)/(overview)/(pms-admin)/AdminHotelCount")
  ),
  AdminBookingStats: React.lazy(() =>
    import("../(admin)/(overview)/(pms-admin)/AdminBookingStats")
  ),
  PlatformRevenueInsights: React.lazy(() =>
    import("../(admin)/(overview)/(pms-admin)/PlatformRevenueInsights")
  ),
  SupportTicketsBoard: React.lazy(() =>
    import("../(admin)/(overview)/(pms-staff)/SupportTicketsBoard")
  ),
  VerificationTaskQueue: React.lazy(() =>
    import("../(admin)/(overview)/(pms-staff)/VerificationTaskQueue")
  ),
  TodayBookingSummary: React.lazy(() =>
    import("../(admin)/(overview)/(pms-staff)/TodayBookingSummary")
  ),
  OwnerRoomInventory: React.lazy(() =>
    import("../(admin)/(overview)/(hotel-owner)/OwnerRoomInventory")
  ),
  OwnerBookingOverview: React.lazy(() =>
    import("../(admin)/(overview)/(hotel-owner)/OwnerBookingOverview")
  ),
  OwnerRevenueReport: React.lazy(() =>
    import("../(admin)/(overview)/(hotel-owner)/OwnerRevenueReport")
  ),
  StaffTaskAssignments: React.lazy(() =>
    import("../(admin)/(overview)/(hotel-staff)/StaffTaskAssignments")
  ),
  CheckinCheckoutMonitor: React.lazy(() =>
    import("../(admin)/(overview)/(hotel-staff)/CheckinCheckoutMonitor")
  ),
  GuestServiceRequests: React.lazy(() =>
    import("../(admin)/(overview)/(hotel-staff)/GuestServiceRequests")
  )
};

export default function DynamicDashboardComponent({ componentName, ...props }) {
  const Component = componentMap[componentName];
  if (!Component) {
    return (
      <div className="text-red-500 font-semibold">
        Component not found: {componentName}
      </div>
    );
  }
  return (
    <React.Suspense fallback={<div className="text-gray-400">Loading...</div>}>
      <Component {...props} />
    </React.Suspense>
  );
}
