import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  Globe,
  Building,
  Calendar,
  Target,
  Award,
  BarChart3,
  Eye
} from "lucide-react";

const PlatformRevenueInsights = () => {
  // Static data for demonstration
  const revenueStats = {
    totalRevenue: 1250000,
    growthPercentage: 8.2,
    previousPeriod: 1154000,
    thisQuarter: 387500,
    quarterGrowth: 12.4,
    monthlyRevenue: 156250,
    commissionRate: 12.5,
    revenueStreams: [
      {
        source: "Booking Commissions",
        amount: 875000,
        percentage: 70.0,
        growth: 9.1,
        color: "emerald"
      },
      {
        source: "Premium Subscriptions",
        amount: 187500,
        percentage: 15.0,
        growth: 15.3,
        color: "blue"
      },
      {
        source: "Advertisement Revenue",
        amount: 125000,
        percentage: 10.0,
        growth: 5.8,
        color: "purple"
      },
      {
        source: "Service Fees",
        amount: 62500,
        percentage: 5.0,
        growth: 3.2,
        color: "orange"
      }
    ],
    topPerformingHotels: [
      {
        name: "Grand Marina Resort",
        revenue: 45600,
        commission: 5695,
        growth: 18.2,
        bookings: 312
      },
      {
        name: "Alpine Wellness Spa",
        revenue: 38900,
        commission: 4862,
        growth: 15.7,
        bookings: 267
      },
      {
        name: "Urban Loft Hotel",
        revenue: 34200,
        commission: 4275,
        growth: 12.3,
        bookings: 298
      },
      {
        name: "Coastal Vista Inn",
        revenue: 29800,
        commission: 3725,
        growth: 22.1,
        bookings: 189
      }
    ],
    regionalRevenue: [
      {
        region: "North America",
        revenue: 437500,
        percentage: 35.0,
        growth: 7.8
      },
      { region: "Europe", revenue: 375000, percentage: 30.0, growth: 11.2 },
      {
        region: "Asia Pacific",
        revenue: 275000,
        percentage: 22.0,
        growth: 6.4
      },
      { region: "Others", revenue: 162500, percentage: 13.0, growth: 4.1 }
    ],
    monthlyTrends: [
      { month: "Jan", revenue: 145000, commission: 18125 },
      { month: "Feb", revenue: 156000, commission: 19500 },
      { month: "Mar", revenue: 162000, commission: 20250 },
      { month: "Apr", revenue: 148000, commission: 18500 },
      { month: "May", revenue: 167000, commission: 20875 },
      { month: "Jun", revenue: 178000, commission: 22250 },
      { month: "Jul", revenue: 194000, commission: 24250 }
    ]
  };

  // Calculate additional metrics
  const isPositiveGrowth = revenueStats.growthPercentage > 0;
  const totalCommission =
    revenueStats.totalRevenue * (revenueStats.commissionRate / 100);
  const avgRevenuePerHotel = revenueStats.totalRevenue / 127; // Assuming 127 hotels from previous context
  const maxMonthlyRevenue = Math.max(
    ...revenueStats.monthlyTrends.map((m) => m.revenue)
  );

  // Format currency
  const formatCurrency = (amount, abbreviated = false) => {
    if (abbreviated && amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (abbreviated && amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Color configurations for revenue streams
  const streamColors = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      dot: "bg-emerald-400"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      dot: "bg-blue-400"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      dot: "bg-purple-400"
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      dot: "bg-orange-400"
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main Platform Revenue Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Platform Revenue Insights
                </h1>
                <p className="text-purple-100 text-sm">
                  Comprehensive revenue analytics and performance
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {formatCurrency(revenueStats.totalRevenue, true)}
              </div>
              <div className="flex items-center justify-end mt-1">
                {isPositiveGrowth ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-purple-200" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-red-300" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositiveGrowth ? "text-purple-200" : "text-red-300"
                  }`}
                >
                  +{revenueStats.growthPercentage}% growth
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
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(revenueStats.thisQuarter, true)}
                </div>
                <div className="text-sm text-green-700">This Quarter</div>
                <div className="text-xs text-green-600 font-medium">
                  +{revenueStats.quarterGrowth}% QoQ
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(revenueStats.monthlyRevenue, true)}
                </div>
                <div className="text-sm text-blue-700">Monthly Avg</div>
                <div className="text-xs text-blue-600">This year</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="p-3 bg-indigo-100 rounded-lg flex-shrink-0">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-indigo-900">
                  {formatCurrency(totalCommission, true)}
                </div>
                <div className="text-sm text-indigo-700">Total Commission</div>
                <div className="text-xs text-indigo-600">
                  {revenueStats.commissionRate}% avg rate
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="p-3 bg-amber-100 rounded-lg flex-shrink-0">
                <Building className="w-5 h-5 text-amber-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-amber-900">
                  {formatCurrency(avgRevenuePerHotel, true)}
                </div>
                <div className="text-sm text-amber-700">Avg per Hotel</div>
                <div className="text-xs text-amber-600">
                  Revenue per property
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-purple-900">94.2%</div>
                <div className="text-sm text-purple-700">
                  Target Achievement
                </div>
                <div className="text-xs text-purple-600">YTD performance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Streams & Monthly Trends */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Streams */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Streams
              </h3>
              <div className="space-y-4">
                {revenueStats.revenueStreams.map((stream) => {
                  const colors = streamColors[stream.color];
                  return (
                    <div
                      key={stream.source}
                      className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${colors.dot}`}
                          ></div>
                          <span className="font-semibold text-gray-900">
                            {stream.source}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(stream.amount, true)}
                          </span>
                          <span
                            className={`text-sm font-medium ${colors.text}`}
                          >
                            +{stream.growth}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full ${colors.dot
                            .replace("bg-", "bg-")
                            .replace("-400", "-500")}`}
                          style={{ width: `${stream.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {stream.percentage}% of total revenue
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Revenue Trend */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Revenue Trend
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-end justify-between h-32 gap-2">
                  {revenueStats.monthlyTrends.map((month) => (
                    <div
                      key={month.month}
                      className="flex flex-col items-center flex-grow group"
                    >
                      <div className="relative w-full flex justify-center">
                        <div
                          className="w-8 bg-gradient-to-t from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 transition-all duration-300 rounded-t-md cursor-pointer shadow-sm group-hover:shadow-md"
                          style={{
                            height: `${Math.max(
                              (month.revenue / maxMonthlyRevenue) * 100,
                              10
                            )}%`
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {formatCurrency(month.revenue, true)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium mt-2 text-gray-700">
                        {month.month}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Hotels & Regional Breakdown */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Hotels */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Revenue Generators
              </h3>
              <div className="space-y-3">
                {revenueStats.topPerformingHotels.map((hotel, index) => (
                  <div
                    key={hotel.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="font-semibold text-gray-900 truncate">
                          {hotel.name}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{hotel.bookings} bookings</span>
                          <span className="text-green-600 font-medium">
                            +{hotel.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(hotel.commission, true)}
                      </div>
                      <div className="text-xs text-gray-500">commission</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Revenue */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Regional Performance
              </h3>
              <div className="space-y-3">
                {revenueStats.regionalRevenue.map((region) => (
                  <div
                    key={region.region}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        {region.region}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">
                          {formatCurrency(region.revenue, true)}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          +{region.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${region.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {region.percentage}% of total revenue
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Best Month
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {
                  revenueStats.monthlyTrends.reduce((max, month) =>
                    month.revenue > max.revenue ? month : max
                  ).month
                }
              </div>
              <p className="text-sm text-purple-700 mt-1">
                {formatCurrency(
                  Math.max(...revenueStats.monthlyTrends.map((m) => m.revenue)),
                  true
                )}{" "}
                revenue
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <PieChart className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Commission Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {revenueStats.commissionRate}%
              </div>
              <p className="text-sm text-green-700 mt-1">
                Average platform commission
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Market Reach
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900">45+</div>
              <p className="text-sm text-blue-700 mt-1">
                Countries generating revenue
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium">
              Revenue Analytics
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Commission Settings
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
              Performance Reports
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

export default PlatformRevenueInsights;
