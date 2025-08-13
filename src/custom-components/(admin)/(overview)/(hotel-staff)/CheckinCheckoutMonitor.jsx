import React from "react";
import {
  LogIn,
  LogOut,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";

const CheckinCheckoutMonitor = () => {
  // Static data for demonstration
  const todayStats = {
    checkIns: 24,
    checkOuts: 18,
    date: "June 22, 2023",
    timeSlots: [
      { time: "08:00 - 10:00", checkIns: 6, checkOuts: 3 },
      { time: "10:00 - 12:00", checkIns: 8, checkOuts: 5 },
      { time: "12:00 - 14:00", checkIns: 5, checkOuts: 4 },
      { time: "14:00 - 16:00", checkIns: 3, checkOuts: 4 },
      { time: "16:00 - 18:00", checkIns: 2, checkOuts: 2 }
    ]
  };

  // Calculate additional metrics
  const netChange = todayStats.checkIns - todayStats.checkOuts;
  const totalActivity = todayStats.checkIns + todayStats.checkOuts;
  const peakHour = todayStats.timeSlots.reduce((max, slot) =>
    slot.checkIns + slot.checkOuts > max.checkIns + max.checkOuts ? slot : max
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Main Monitor Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Guest Movement</h1>
                <p className="text-indigo-100 text-sm">
                  Real-time check-in/check-out monitoring
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{totalActivity}</div>
              <div className="text-indigo-100 text-sm flex items-center justify-end mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {todayStats.date}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                <LogIn className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-emerald-900">
                  {todayStats.checkIns}
                </div>
                <div className="text-sm text-emerald-700">Check-ins Today</div>
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
                <div className="text-sm text-orange-700">Check-outs Today</div>
              </div>
            </div>

            <div
              className={`flex items-center p-4 rounded-lg border ${
                netChange >= 0
                  ? "bg-blue-50 border-blue-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div
                className={`p-3 rounded-lg flex-shrink-0 ${
                  netChange >= 0 ? "bg-blue-100" : "bg-red-100"
                }`}
              >
                <Users
                  className={`w-5 h-5 ${
                    netChange >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                />
              </div>
              <div className="ml-4 flex-grow">
                <div
                  className={`text-2xl font-bold ${
                    netChange >= 0 ? "text-blue-900" : "text-red-900"
                  }`}
                >
                  {netChange >= 0 ? "+" : ""}
                  {netChange}
                </div>
                <div
                  className={`text-sm ${
                    netChange >= 0 ? "text-blue-700" : "text-red-700"
                  }`}
                >
                  Net Change
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-2xl font-bold text-purple-900">
                  {peakHour.checkIns + peakHour.checkOuts}
                </div>
                <div className="text-sm text-purple-700">Peak Activity</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Breakdown */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hourly Schedule
            </h3>
            <p className="text-sm text-gray-600">
              Check-in and check-out activity by time slots
            </p>
          </div>

          {/* Visual Timeline */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-4">
              {todayStats.timeSlots.map((slot, index) => {
                const maxActivity = Math.max(
                  ...todayStats.timeSlots.map((s) => s.checkIns + s.checkOuts)
                );
                const slotActivity = slot.checkIns + slot.checkOuts;
                const activityPercent = (slotActivity / maxActivity) * 100;

                return (
                  <div key={index} className="flex items-center space-x-4">
                    {/* Time label */}
                    <div className="w-24 text-sm font-medium text-gray-700 flex-shrink-0">
                      {slot.time}
                    </div>

                    {/* Activity bars */}
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1 text-xs text-emerald-700">
                          <LogIn className="w-3 h-3" />
                          <span className="font-medium">{slot.checkIns}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-orange-700">
                          <LogOut className="w-3 h-3" />
                          <span className="font-medium">{slot.checkOuts}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ({slotActivity} total)
                        </div>
                      </div>

                      {/* Visual bars */}
                      <div className="flex space-x-1 h-3">
                        <div
                          className="bg-emerald-400 rounded-sm"
                          style={{
                            width: `${
                              maxActivity > 0
                                ? (slot.checkIns / maxActivity) * 100
                                : 0
                            }%`,
                            minWidth: slot.checkIns > 0 ? "4px" : "0px"
                          }}
                        ></div>
                        <div
                          className="bg-orange-400 rounded-sm"
                          style={{
                            width: `${
                              maxActivity > 0
                                ? (slot.checkOuts / maxActivity) * 100
                                : 0
                            }%`,
                            minWidth: slot.checkOuts > 0 ? "4px" : "0px"
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Activity indicator */}
                    <div className="w-16 text-right">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          activityPercent === 100
                            ? "bg-red-100 text-red-800"
                            : activityPercent > 75
                            ? "bg-yellow-100 text-yellow-800"
                            : activityPercent > 50
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {activityPercent === 100
                          ? "Peak"
                          : activityPercent > 75
                          ? "High"
                          : activityPercent > 50
                          ? "Med"
                          : "Low"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">
                  Peak Hours
                </span>
              </div>
              <div className="text-lg font-bold text-emerald-900">
                {peakHour.time}
              </div>
              <p className="text-sm text-emerald-700 mt-1">
                {peakHour.checkIns + peakHour.checkOuts} total activities
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-800">
                  Activity Rate
                </span>
              </div>
              <div className="text-lg font-bold text-indigo-900">
                {(totalActivity / todayStats.timeSlots.length).toFixed(1)}
              </div>
              <p className="text-sm text-indigo-700 mt-1">
                Average activities per time slot
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
              View Live Dashboard
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              Export Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinCheckoutMonitor;
