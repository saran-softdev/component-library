import React from "react";
import {
  BedDouble,
  Home,
  CheckCircle,
  Users,
  Wrench,
  Building2,
  Eye
} from "lucide-react";

const OwnerRoomInventory = () => {
  // Static data for demonstration
  const roomStats = {
    totalRooms: 186,
    available: 42,
    occupied: 118,
    maintenance: 26,
    properties: 5
  };

  // Calculate percentages for better visualization
  const availablePercent = (
    (roomStats.available / roomStats.totalRooms) *
    100
  ).toFixed(1);
  const occupiedPercent = (
    (roomStats.occupied / roomStats.totalRooms) *
    100
  ).toFixed(1);
  const maintenancePercent = (
    (roomStats.maintenance / roomStats.totalRooms) *
    100
  ).toFixed(1);

  // Room status configurations
  const roomStatusConfig = [
    {
      label: "Available",
      value: roomStats.available,
      percentage: availablePercent,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      icon: CheckCircle,
      description: "Ready for booking"
    },
    {
      label: "Occupied",
      value: roomStats.occupied,
      percentage: occupiedPercent,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: Users,
      description: "Currently booked"
    },
    {
      label: "Maintenance",
      value: roomStats.maintenance,
      percentage: maintenancePercent,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      icon: Wrench,
      description: "Under repair"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Main Inventory Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <BedDouble className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Room Inventory</h1>
                <p className="text-teal-100 text-sm">
                  Monitor your room availability
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{roomStats.totalRooms}</div>
              <div className="text-teal-100 text-sm flex items-center justify-end mt-1">
                <Building2 className="w-4 h-4 mr-1" />
                {roomStats.properties} Properties
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-3 bg-teal-50 rounded-lg flex-shrink-0">
                <Home className="w-5 h-5 text-teal-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-lg font-bold text-gray-900">
                  {roomStats.properties}
                </div>
                <div className="text-sm text-gray-600">Total Properties</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                <BedDouble className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="text-lg font-bold text-gray-900">
                  {Math.round(roomStats.totalRooms / roomStats.properties)}
                </div>
                <div className="text-sm text-gray-600">Avg Rooms/Property</div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Status Cards */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Room Status Overview
            </h3>
            <p className="text-sm text-gray-600">
              Current availability across all properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {roomStatusConfig.map((status) => {
              const IconComponent = status.icon;
              return (
                <div
                  key={status.label}
                  className={`p-6 rounded-lg border ${status.borderColor} ${status.bgColor} hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <IconComponent className={`w-5 h-5 ${status.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${status.color}`}>
                      {status.value}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {status.label}
                      </span>
                      <span className={`text-sm font-semibold ${status.color}`}>
                        {status.percentage}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${status.color.replace(
                          "text-",
                          "bg-"
                        )}`}
                        style={{ width: `${status.percentage}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-gray-600 mt-2">
                      {status.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Room Distribution Chart */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Room Distribution
            </h4>
            <div className="flex rounded-lg overflow-hidden h-4">
              <div
                className="bg-emerald-500 flex-shrink-0"
                style={{ width: `${availablePercent}%` }}
                title={`Available: ${roomStats.available} rooms (${availablePercent}%)`}
              ></div>
              <div
                className="bg-blue-500 flex-shrink-0"
                style={{ width: `${occupiedPercent}%` }}
                title={`Occupied: ${roomStats.occupied} rooms (${occupiedPercent}%)`}
              ></div>
              <div
                className="bg-amber-500 flex-shrink-0"
                style={{ width: `${maintenancePercent}%` }}
                title={`Maintenance: ${roomStats.maintenance} rooms (${maintenancePercent}%)`}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Available ({availablePercent}%)</span>
              <span>Occupied ({occupiedPercent}%)</span>
              <span>Maintenance ({maintenancePercent}%)</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-800">
                  Occupancy Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-teal-900">
                {occupiedPercent}%
              </div>
              <p className="text-sm text-teal-700 mt-1">
                {roomStats.occupied} of {roomStats.totalRooms} rooms occupied
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">
                  Available Now
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-900">
                {roomStats.available}
              </div>
              <p className="text-sm text-emerald-700 mt-1">
                Ready for immediate booking
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium">
              Manage Inventory
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              View All Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRoomInventory;
