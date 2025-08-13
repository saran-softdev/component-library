import React from "react";
import {
  Building2,
  MapPin,
  Star,
  TrendingUp,
  Plus,
  Users,
  Calendar,
  Award,
  Filter,
  Eye,
  TrendingDown,
} from "lucide-react";

const AdminHotelCount = () => {
  // Static data for demonstration
  const hotelStats = {
    totalHotels: 127,
    growthPercentage: 18.4,
    newThisMonth: 8,
    pendingApproval: 5,
    activeBookings: 1247,
    averageRating: 4.6,
    regionalBreakdown: [
      { region: "North America", count: 42, growth: 15.2, color: "blue" },
      { region: "Europe", count: 38, growth: 22.1, color: "emerald" },
      { region: "Asia Pacific", count: 31, growth: 12.8, color: "purple" },
      { region: "Latin America", count: 16, growth: 35.7, color: "orange" },
    ],
    propertyTypes: [
      { type: "Luxury Hotels", count: 35, percentage: 27.6, icon: Award },
      { type: "Business Hotels", count: 28, percentage: 22.0, icon: Building2 },
      { type: "Boutique Hotels", count: 23, percentage: 18.1, icon: Star },
      { type: "Resort & Spa", count: 19, percentage: 15.0, icon: MapPin },
      { type: "Budget Hotels", count: 22, percentage: 17.3, icon: Users },
    ],
    recentlyAdded: [
      {
        name: "Grand Marina Resort",
        location: "Miami, FL",
        date: "Aug 3, 2025",
        rating: 4.8,
        rooms: 156,
      },
      {
        name: "Alpine Wellness Spa",
        location: "Zurich, CH",
        date: "Aug 1, 2025",
        rating: 4.9,
        rooms: 89,
      },
      {
        name: "Urban Loft Hotel",
        location: "Tokyo, JP",
        date: "Jul 28, 2025",
        rating: 4.5,
        rooms: 124,
      },
      {
        name: "Coastal Vista Inn",
        location: "Barcelona, ES",
        date: "Jul 25, 2025",
        rating: 4.7,
        rooms: 78,
      },
    ],
  };

  // Calculate additional metrics
  const totalRooms =
    hotelStats.recentlyAdded.reduce((sum, hotel) => sum + hotel.rooms, 0) * 8; // Estimate
  const avgRoomsPerHotel = Math.round(totalRooms / hotelStats.totalHotels);
  const isPositiveGrowth = hotelStats.growthPercentage > 0;

  // Regional color configurations
  const regionColors = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      dot: "bg-blue-400",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      dot: "bg-emerald-400",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      dot: "bg-purple-400",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      dot: "bg-orange-400",
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main Hotel Count Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Hotel Portfolio</h1>
                <p className="text-blue-100 text-sm">
                  Manage your property network
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{hotelStats.totalHotels}</div>
              <div className="flex items-center justify-end mt-1">
                {isPositiveGrowth ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-blue-200" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-red-300" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositiveGrowth ? "text-blue-200" : "text-red-300"
                  }`}
                >
                  +{hotelStats.growthPercentage}% growth
                </span>
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
                  {hotelStats.newThisMonth}
                </div>
                <div className="text-sm text-green-700">New This Month</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-yellow-900">
                  {hotelStats.pendingApproval}
                </div>
                <div className="text-sm text-yellow-700">Pending Approval</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-purple-900">
                  {hotelStats.activeBookings}
                </div>
                <div className="text-sm text-purple-700">Active Bookings</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="p-3 bg-amber-100 rounded-lg flex-shrink-0">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-amber-900">
                  {hotelStats.averageRating}
                </div>
                <div className="text-sm text-amber-700">Avg Rating</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="p-3 bg-indigo-100 rounded-lg flex-shrink-0">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-indigo-900">
                  {avgRoomsPerHotel}
                </div>
                <div className="text-sm text-indigo-700">Avg Rooms/Hotel</div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Distribution & Property Types */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Regional Distribution
                </h3>
                <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
              <div className="space-y-3">
                {hotelStats.regionalBreakdown.map((region) => {
                  const colors = regionColors[region.color];
                  return (
                    <div
                      key={region.region}
                      className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${colors.dot}`}
                          ></div>
                          <span className="font-semibold text-gray-900">
                            {region.region}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">
                            {region.count}
                          </span>
                          <span
                            className={`text-sm font-medium ${colors.text}`}
                          >
                            +{region.growth}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors.dot
                            .replace("bg-", "bg-")
                            .replace("-400", "-500")}`}
                          style={{
                            width: `${
                              (region.count / hotelStats.totalHotels) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {(
                          (region.count / hotelStats.totalHotels) *
                          100
                        ).toFixed(1)}
                        % of total portfolio
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Property Types */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Types
              </h3>
              <div className="space-y-3">
                {hotelStats.propertyTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.type}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <IconComponent className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {type.type}
                          </div>
                          <div className="text-sm text-gray-600">
                            {type.percentage}% of portfolio
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {type.count}
                        </div>
                        <div className="text-xs text-gray-500">properties</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recently Added Hotels */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recently Added Properties
              </h3>
              <p className="text-sm text-gray-600">
                Latest hotels onboarded to the platform
              </p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotelStats.recentlyAdded.map((hotel, index) => (
              <div
                key={hotel.name}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {hotel.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Added: {hotel.date}</span>
                  <span>{hotel.rooms} rooms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Growth This Year
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                +{hotelStats.growthPercentage}%
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {hotelStats.newThisMonth} new properties this month
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Portfolio Value
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                ${((totalRooms * 150) / 1000000).toFixed(1)}B
              </div>
              <p className="text-sm text-green-700 mt-1">
                Estimated portfolio value
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Occupancy Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-900">74.2%</div>
              <p className="text-sm text-purple-700 mt-1">
                Average across all properties
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Onboard New Hotel
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
              Performance Analytics
            </button>
            <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium">
              Manage Portfolio
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHotelCount;
