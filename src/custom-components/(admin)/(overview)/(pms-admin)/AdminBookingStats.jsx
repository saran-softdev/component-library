import React from "react";
import {
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Star,
  MapPin,
  Clock,
  BarChart3,
  Eye
} from "lucide-react";

const AdminBookingStats = () => {
  // Static data for demonstration
  const bookingStats = {
    totalBookings: 1843,
    growthPercentage: 12.5,
    previousMonth: 1640,
    thisWeek: 387,
    weekGrowth: 8.3,
    averageDaily: 55,
    monthlyBreakdown: [
      { month: "Jan", bookings: 142, growth: 5.2 },
      { month: "Feb", bookings: 158, growth: 11.3 },
      { month: "Mar", bookings: 167, growth: 5.7 },
      { month: "Apr", bookings: 145, growth: -13.2 },
      { month: "May", bookings: 189, growth: 30.3 },
      { month: "Jun", bookings: 203, growth: 7.4 },
      { month: "Jul", bookings: 224, growth: 10.3 },
      { month: "Aug", bookings: 615, growth: 12.5 } // Current month partial
    ],
    topSources: [
      { source: "Direct Website", bookings: 523, percentage: 28.4 },
      { source: "Booking.com", bookings: 441, percentage: 23.9 },
      { source: "Expedia", bookings: 368, percentage: 20.0 },
      { source: "Airbnb", bookings: 295, percentage: 16.0 },
      { source: "Others", bookings: 216, percentage: 11.7 }
    ],
    propertyPerformance: [
      {
        property: "Oceanview Resort",
        bookings: 456,
        rating: 4.8,
        growth: 15.2
      },
      { property: "Downtown Suites", bookings: 387, rating: 4.6, growth: 8.7 },
      { property: "Mountain Lodge", bookings: 342, rating: 4.9, growth: 22.1 },
      {
        property: "City Center Hotel",
        bookings: 298,
        rating: 4.4,
        growth: 5.3
      },
      { property: "Beachfront Villa", bookings: 360, rating: 4.7, growth: 18.9 }
    ]
  };

  // Calculate additional metrics
  const isPositiveGrowth = bookingStats.growthPercentage > 0;
  const maxMonthlyBookings = Math.max(
    ...bookingStats.monthlyBreakdown.map((m) => m.bookings)
  );
  const totalRevenue = bookingStats.totalBookings * 125; // Assume avg $125 per booking

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main Booking Stats Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Booking Analytics</h1>
                <p className="text-green-100 text-sm">
                  Comprehensive booking performance overview
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {bookingStats.totalBookings.toLocaleString()}
              </div>
              <div className="flex items-center justify-end mt-1">
                {isPositiveGrowth ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-green-200" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-red-300" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositiveGrowth ? "text-green-200" : "text-red-300"
                  }`}
                >
                  {isPositiveGrowth ? "+" : ""}
                  {bookingStats.growthPercentage}% vs last month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-blue-900">
                  {bookingStats.thisWeek}
                </div>
                <div className="text-sm text-blue-700">This Week</div>
                <div className="text-xs text-blue-600 font-medium">
                  +{bookingStats.weekGrowth}% from last week
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-purple-900">
                  {bookingStats.averageDaily}
                </div>
                <div className="text-sm text-purple-700">Daily Average</div>
                <div className="text-xs text-purple-600">Bookings per day</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-emerald-900">
                  ${(totalRevenue / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-emerald-700">Est. Revenue</div>
                <div className="text-xs text-emerald-600">This month</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-orange-900">
                  {bookingStats.growthPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-orange-700">Growth Rate</div>
                <div className="text-xs text-orange-600">Month over month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="p-6 border-b border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Monthly Booking Trends
            </h3>
            <p className="text-sm text-gray-600">
              Booking volume and growth rates over time
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-40 gap-2">
              {bookingStats.monthlyBreakdown.map((month, index) => (
                <div
                  key={month.month}
                  className="flex flex-col items-center flex-grow group"
                >
                  {/* Bar with hover effect */}
                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-8 bg-gradient-to-t from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 transition-all duration-300 rounded-t-md cursor-pointer shadow-sm group-hover:shadow-md"
                      style={{
                        height: `${Math.max(
                          (month.bookings / maxMonthlyBookings) * 100,
                          10
                        )}%`
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        {month.bookings} bookings
                      </div>
                    </div>
                  </div>

                  {/* Month label */}
                  <div className="text-sm font-medium mt-2 text-gray-700">
                    {month.month}
                  </div>

                  {/* Growth indicator */}
                  <div
                    className={`text-xs mt-1 font-medium flex items-center ${
                      month.growth > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {month.growth > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(month.growth)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sources & Property Performance */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Sources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Booking Sources
              </h3>
              <div className="space-y-3">
                {bookingStats.topSources.map((source, index) => (
                  <div
                    key={source.source}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {source.source}
                        </div>
                        <div className="text-sm text-gray-600">
                          {source.percentage}% of total
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {source.bookings}
                      </div>
                      <div className="text-xs text-gray-500">bookings</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Performance */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Performance
              </h3>
              <div className="space-y-3">
                {bookingStats.propertyPerformance
                  .slice(0, 5)
                  .map((property, index) => (
                    <div
                      key={property.property}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="font-semibold text-gray-900 truncate">
                            {property.property}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{property.rating}</span>
                            <span
                              className={`font-medium ${
                                property.growth > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {property.growth > 0 ? "+" : ""}
                              {property.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-gray-900">
                          {property.bookings}
                        </div>
                        <div className="text-xs text-gray-500">bookings</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Insights */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Best Performing Month
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {
                  bookingStats.monthlyBreakdown.reduce((max, month) =>
                    month.bookings > max.bookings ? month : max
                  ).month
                }
              </div>
              <p className="text-sm text-green-700 mt-1">
                {Math.max(
                  ...bookingStats.monthlyBreakdown.map((m) => m.bookings)
                )}{" "}
                bookings
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Conversion Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900">68.4%</div>
              <p className="text-sm text-blue-700 mt-1">Visitors to bookings</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Peak Hours
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-900">2-6 PM</div>
              <p className="text-sm text-purple-700 mt-1">
                Highest booking activity
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
              Export Analytics
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              View Detailed Reports
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              Configure Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingStats;
