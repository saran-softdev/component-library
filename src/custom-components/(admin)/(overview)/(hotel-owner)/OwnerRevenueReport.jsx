import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar
} from "lucide-react";

const OwnerRevenueReport = () => {
  // Static data for demonstration
  const revenueData = {
    totalRevenue: 458750,
    previousPeriod: 412320,
    growthPercent: 11.26,
    monthlyBreakdown: [
      { month: "Jan", amount: 32500 },
      { month: "Feb", amount: 36750 },
      { month: "Mar", amount: 42100 },
      { month: "Apr", amount: 38900 },
      { month: "May", amount: 45300 },
      { month: "Jun", amount: 48200 }
    ]
  };

  // Format the revenue with a dollar sign and commas
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate the growth percentage
  const growthFormatted = revenueData.growthPercent.toFixed(1);
  const isPositiveGrowth = revenueData.growthPercent > 0;

  // Find the highest monthly revenue for scaling the chart
  const maxRevenue = Math.max(
    ...revenueData.monthlyBreakdown.map((item) => item.amount)
  );

  // Calculate average monthly revenue
  const avgMonthlyRevenue =
    revenueData.monthlyBreakdown.reduce((sum, item) => sum + item.amount, 0) /
    revenueData.monthlyBreakdown.length;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Main Revenue Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Revenue Report</h1>
                <p className="text-emerald-100 text-sm">
                  Track your earnings performance
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatCurrency(revenueData.totalRevenue)}
              </div>
              <div className="flex items-center justify-end mt-1">
                {isPositiveGrowth ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-emerald-200" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-red-300" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositiveGrowth ? "text-emerald-200" : "text-red-300"
                  }`}
                >
                  {growthFormatted}% growth
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(avgMonthlyRevenue)}
                </div>
                <div className="text-sm text-gray-600">Avg Monthly</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-3 bg-emerald-50 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(revenueData.previousPeriod)}
                </div>
                <div className="text-sm text-gray-600">Previous Period</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-3 bg-purple-50 rounded-lg flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-lg font-bold text-gray-900">
                  {revenueData.monthlyBreakdown.length}
                </div>
                <div className="text-sm text-gray-600">Months Tracked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown Chart */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Monthly Performance
            </h3>
            <p className="text-sm text-gray-600">Revenue breakdown by month</p>
          </div>

          {/* Enhanced bar chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-32 gap-2">
              {revenueData.monthlyBreakdown.map((item, index) => (
                <div
                  key={item.month}
                  className="flex flex-col items-center flex-grow group"
                >
                  {/* Bar with hover effect */}
                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-8 bg-gradient-to-t from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 transition-all duration-300 rounded-t-md cursor-pointer shadow-sm group-hover:shadow-md"
                      style={{
                        height: `${Math.max(
                          (item.amount / maxRevenue) * 100,
                          8
                        )}%`
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  </div>

                  {/* Month label */}
                  <div className="text-sm font-medium mt-2 text-gray-700">
                    {item.month}
                  </div>

                  {/* Amount label */}
                  <div className="text-xs text-gray-500 mt-1">
                    {formatCurrency(item.amount / 1000)}k
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">
                  Best Month
                </span>
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-emerald-900">
                  {
                    revenueData.monthlyBreakdown.reduce((max, item) =>
                      item.amount > max.amount ? item : max
                    ).month
                  }
                </div>
                <div className="text-sm text-emerald-700">
                  {formatCurrency(
                    Math.max(
                      ...revenueData.monthlyBreakdown.map((item) => item.amount)
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Growth Rate
                </span>
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-blue-900">
                  +{growthFormatted}%
                </div>
                <div className="text-sm text-blue-700">vs previous period</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium">
              Download Report
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRevenueReport;
