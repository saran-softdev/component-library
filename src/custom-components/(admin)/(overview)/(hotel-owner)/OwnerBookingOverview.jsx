import React from "react";
import { BookOpen, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

const OwnerBookingOverview = () => {
  // Static data for demonstration
  const bookingStats = {
    total: 458,
    upcoming: 87,
    completed: 342,
    cancelled: 29
  };

  const recentBookings = [
    {
      id: "B-54291",
      guest: "John Smith",
      property: "Oceanview Resort",
      dates: "Jun 25-28",
      status: "confirmed",
      amount: "$845.00"
    },
    {
      id: "B-54287",
      guest: "Maria Garcia",
      property: "Downtown Suites",
      dates: "Jun 22-24",
      status: "pending",
      amount: "$520.00"
    },
    {
      id: "B-54284",
      guest: "Robert Brown",
      property: "Mountain Lodge",
      dates: "Jun 30-Jul 3",
      status: "confirmed",
      amount: "$1,240.00"
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          icon: CheckCircle
        };
      case "pending":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          icon: Clock
        };
      case "cancelled":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          icon: XCircle
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          icon: Clock
        };
    }
  };

  const statCards = [
    {
      label: "Upcoming",
      value: bookingStats.upcoming,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: Calendar
    },
    {
      label: "Completed",
      value: bookingStats.completed,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: CheckCircle
    },
    {
      label: "Cancelled",
      value: bookingStats.cancelled,
      color: "text-red-600",
      bg: "bg-red-50",
      icon: XCircle
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Main Header Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Booking Overview</h1>
                <p className="text-blue-100 text-sm">
                  Manage your property bookings
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{bookingStats.total}</div>
              <div className="text-blue-100 text-sm">Total Bookings</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statCards.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className={`p-3 rounded-lg ${stat.bg} flex-shrink-0`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Bookings Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Bookings
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Latest booking activities
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {recentBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                >
                  {/* Left Section - Guest & Property Info */}
                  <div className="flex-grow flex-shrink min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {booking.guest
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {booking.guest}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {booking.property}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {booking.dates}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Amount */}
                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {booking.amount}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {booking.id}
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full ${statusConfig.bg}`}
                    >
                      <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                      <span
                        className={`text-xs font-medium capitalize ${statusConfig.color}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="mt-6 text-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerBookingOverview;
