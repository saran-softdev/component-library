import React from "react";
import {
  Calendar,
  Plus,
  LogIn,
  LogOut,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  MapPin,
  Eye,
  Filter,
} from "lucide-react";

const TodayBookingSummary = () => {
  // Static data for demonstration
  const todayStats = {
    totalNew: 27,
    checkIns: 42,
    checkOuts: 38,
    pending: 5,
    cancelled: 3,
    netChange: 4, // checkIns - checkOuts
    occupancyRate: 78.5,
    revenue: 12450,
    avgBookingValue: 461.11,
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeSlots = [
    { time: "06:00 - 09:00", checkIns: 8, checkOuts: 12, newBookings: 3 },
    { time: "09:00 - 12:00", checkIns: 15, checkOuts: 18, newBookings: 8 },
    { time: "12:00 - 15:00", checkIns: 12, checkOuts: 6, newBookings: 7 },
    { time: "15:00 - 18:00", checkIns: 5, checkOuts: 2, newBookings: 6 },
    { time: "18:00 - 21:00", checkIns: 2, checkOuts: 0, newBookings: 3 },
  ];

  const recentBookings = [
    {
      id: "BK-7821",
      guest: "Emma Wilson",
      room: "305",
      time: "2:30 PM",
      type: "New Booking",
      amount: 285,
    },
    {
      id: "BK-7819",
      guest: "Michael Chen",
      room: "412",
      time: "2:15 PM",
      type: "Check-in",
      amount: 340,
    },
    {
      id: "BK-7818",
      guest: "Sarah Davis",
      room: "208",
      time: "1:45 PM",
      type: "New Booking",
      amount: 195,
    },
    {
      id: "BK-7816",
      guest: "Robert Taylor",
      room: "156",
      time: "1:20 PM",
      type: "Check-out",
      amount: 520,
    },
  ];

  const propertyPerformance = [
    {
      property: "Main Building",
      checkIns: 24,
      checkOuts: 22,
      occupancy: 85.2,
      newBookings: 15,
    },
    {
      property: "Garden Wing",
      checkIns: 12,
      checkOuts: 10,
      occupancy: 72.8,
      newBookings: 8,
    },
    {
      property: "Pool Side",
      checkIns: 6,
      checkOuts: 6,
      occupancy: 68.5,
      newBookings: 4,
    },
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total activity
  const totalActivity =
    todayStats.checkIns + todayStats.checkOuts + todayStats.totalNew;
  const maxSlotActivity = Math.max(
    ...timeSlots.map(
      (slot) => slot.checkIns + slot.checkOuts + slot.newBookings
    )
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main Today's Booking Summary Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Today&apos;s Booking Summary
                </h1>
                <p className="text-indigo-100 text-sm">{currentDate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{totalActivity}</div>
              <div className="text-indigo-100 text-sm flex items-center justify-end mt-1">
                <Users className="w-4 h-4 mr-1" />
                Total Activity
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-green-900">
                  {todayStats.totalNew}
                </div>
                <div className="text-sm text-green-700">New Reservations</div>
                <div className="text-xs text-green-600">
                  {formatCurrency(todayStats.avgBookingValue)} avg value
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <LogIn className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-blue-900">
                  {todayStats.checkIns}
                </div>
                <div className="text-sm text-blue-700">Check-ins</div>
                <div className="text-xs text-blue-600">Guests arriving</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                <LogOut className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-orange-900">
                  {todayStats.checkOuts}
                </div>
                <div className="text-sm text-orange-700">Check-outs</div>
                <div className="text-xs text-orange-600">Guests departing</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-yellow-900">
                  {todayStats.pending}
                </div>
                <div className="text-sm text-yellow-700">Pending</div>
                <div className="text-xs text-yellow-600">
                  Awaiting confirmation
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-purple-900">
                  {todayStats.occupancyRate}%
                </div>
                <div className="text-sm text-purple-700">Occupancy</div>
                <div className="text-xs text-purple-600">Current rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Activity & Recent Bookings */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hourly Activity
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  {timeSlots.map((slot, index) => {
                    const slotActivity =
                      slot.checkIns + slot.checkOuts + slot.newBookings;
                    const activityPercent =
                      (slotActivity / maxSlotActivity) * 100;

                    return (
                      <div key={index} className="flex items-center space-x-4">
                        {/* Time label */}
                        <div className="w-24 text-sm font-medium text-gray-700 flex-shrink-0">
                          {slot.time}
                        </div>

                        {/* Activity visualization */}
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center space-x-1 text-xs">
                              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                              <span className="text-green-700 font-medium">
                                {slot.newBookings}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs">
                              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                              <span className="text-blue-700 font-medium">
                                {slot.checkIns}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs">
                              <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
                              <span className="text-orange-700 font-medium">
                                {slot.checkOuts}
                              </span>
                            </div>
                          </div>

                          {/* Activity bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{
                                width: `${Math.max(activityPercent, 5)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Total count */}
                        <div className="w-8 text-right text-sm font-medium text-gray-900">
                          {slotActivity}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {booking.guest
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {booking.guest}
                        </div>
                        <div className="text-sm text-gray-600">
                          Room {booking.room} • {booking.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(booking.amount)}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          booking.type === "New Booking"
                            ? "text-green-600"
                            : booking.type === "Check-in"
                            ? "text-blue-600"
                            : "text-orange-600"
                        }`}
                      >
                        {booking.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Property Performance */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Property Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {propertyPerformance.map((property) => (
              <div
                key={property.property}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {property.property}
                  </h4>
                  <div className="text-sm font-medium text-purple-600">
                    {property.occupancy}%
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-ins:</span>
                    <span className="font-medium text-blue-600">
                      {property.checkIns}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-outs:</span>
                    <span className="font-medium text-orange-600">
                      {property.checkOuts}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">New bookings:</span>
                    <span className="font-medium text-green-600">
                      {property.newBookings}
                    </span>
                  </div>
                </div>

                {/* Occupancy bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${property.occupancy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Insights */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-800">
                  Net Guest Change
                </span>
              </div>
              <div className="text-2xl font-bold text-indigo-900">
                +{todayStats.netChange}
              </div>
              <p className="text-sm text-indigo-700 mt-1">
                More check-ins than check-outs
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Today&apos;s Revenue
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(todayStats.revenue)}
              </div>
              <p className="text-sm text-green-700 mt-1">From new bookings</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Confirmation Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900">84.4%</div>
              <p className="text-sm text-blue-700 mt-1">
                Bookings confirmed vs pending
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  Avg Booking Value
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-900">
                {formatCurrency(todayStats.avgBookingValue)}
              </div>
              <p className="text-sm text-amber-700 mt-1">Per new reservation</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
              Manage Check-ins
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
              Process Pending
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Room Assignments
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              Export Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayBookingSummary;
