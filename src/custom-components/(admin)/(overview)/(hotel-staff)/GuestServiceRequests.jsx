import React from "react";
import {
  Coffee,
  AlertCircle,
  Wrench,
  Shirt,
  Gift,
  Clock,
  CheckCircle,
  PlayCircle,
  User,
  Filter
} from "lucide-react";

const GuestServiceRequests = () => {
  // Static data for demonstration
  const serviceRequests = [
    {
      id: "SR-2451",
      type: "Food",
      details: "Room service breakfast",
      room: "304",
      guest: "John Smith",
      status: "Pending",
      time: "Requested 25 mins ago",
      priority: "Normal"
    },
    {
      id: "SR-2450",
      type: "Laundry",
      details: "Express cleaning - business suit",
      room: "512",
      guest: "Maria Garcia",
      status: "In Progress",
      time: "Requested 45 mins ago",
      priority: "High"
    },
    {
      id: "SR-2447",
      type: "Maintenance",
      details: "AC not cooling properly",
      room: "218",
      guest: "Robert Brown",
      status: "Pending",
      time: "Requested 1 hr ago",
      priority: "Urgent"
    },
    {
      id: "SR-2445",
      type: "Amenities",
      details: "Extra towels and toiletries",
      room: "127",
      guest: "Lisa Wilson",
      status: "Completed",
      time: "Requested 1.5 hrs ago",
      priority: "Normal"
    }
  ];

  // Calculate statistics
  const stats = {
    total: serviceRequests.length,
    pending: serviceRequests.filter((r) => r.status === "Pending").length,
    inProgress: serviceRequests.filter((r) => r.status === "In Progress")
      .length,
    completed: serviceRequests.filter((r) => r.status === "Completed").length,
    urgent: serviceRequests.filter((r) => r.priority === "Urgent").length
  };

  // Service type configurations
  const serviceTypeConfig = {
    Food: {
      icon: Coffee,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    Laundry: {
      icon: Shirt,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    Maintenance: {
      icon: Wrench,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    Amenities: {
      icon: Gift,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  };

  // Status configurations
  const statusConfig = {
    Pending: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      dotColor: "bg-yellow-400"
    },
    "In Progress": {
      icon: PlayCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-400"
    },
    Completed: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      dotColor: "bg-green-400"
    }
  };

  // Priority configurations
  const priorityConfig = {
    Urgent: {
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      pulse: true
    },
    High: {
      color: "text-orange-700",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-300",
      pulse: false
    },
    Normal: {
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300",
      pulse: false
    }
  };

  const getPriorityBadge = (priority) => {
    const config = priorityConfig[priority];
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
          config.bgColor
        } ${config.color} ${config.borderColor} ${
          config.pulse ? "animate-pulse" : ""
        }`}
      >
        {config.pulse && (
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-ping"></div>
        )}
        {priority}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Main Service Requests Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-orange-600 to-red-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Service Requests</h1>
                <p className="text-orange-100 text-sm">
                  Manage guest service requests
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-orange-100 text-sm flex items-center justify-end mt-1">
                <Clock className="w-4 h-4 mr-1" />
                Active Requests
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-yellow-900">
                  {stats.pending}
                </div>
                <div className="text-xs text-yellow-700">Pending</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <PlayCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-blue-900">
                  {stats.inProgress}
                </div>
                <div className="text-xs text-blue-700">In Progress</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-green-900">
                  {stats.completed}
                </div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-red-900">
                  {stats.urgent}
                </div>
                <div className="text-xs text-red-700">Urgent</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-700">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Requests List */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Current Requests
              </h3>
              <p className="text-sm text-gray-600">
                Manage all active service requests
              </p>
            </div>
            <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>

          <div className="space-y-4">
            {serviceRequests.map((request) => {
              const serviceConfig = serviceTypeConfig[request.type];
              const statusConfigItem = statusConfig[request.status];
              const ServiceIcon = serviceConfig.icon;
              const StatusIcon = statusConfigItem.icon;

              return (
                <div
                  key={request.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${serviceConfig.bgColor} ${serviceConfig.borderColor}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    {/* Service Type & Request Info */}
                    <div className="flex items-center space-x-3 flex-grow">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <ServiceIcon
                          className={`w-5 h-5 ${serviceConfig.color}`}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {request.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{request.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          {request.details}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span>
                            Room <strong>{request.room}</strong>
                          </span>
                          <span>
                            Guest: <strong>{request.guest}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex-shrink-0">
                      {getPriorityBadge(request.priority)}
                    </div>
                  </div>

                  {/* Status & Time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${statusConfigItem.dotColor}`}
                      ></div>
                      <StatusIcon
                        className={`w-4 h-4 ${statusConfigItem.color}`}
                      />
                      <span
                        className={`text-sm font-medium ${statusConfigItem.color}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {request.time}
                    </div>
                  </div>

                  {/* Action Buttons for pending/in-progress requests */}
                  {(request.status === "Pending" ||
                    request.status === "In Progress") && (
                    <div className="mt-3 flex space-x-2">
                      {request.status === "Pending" && (
                        <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          Start Processing
                        </button>
                      )}
                      {request.status === "In Progress" && (
                        <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200">
                          Mark Complete
                        </button>
                      )}
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary & Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Attention Required
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {stats.urgent + stats.pending}
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Requests need immediate attention
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Completion Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {Math.round((stats.completed / stats.total) * 100)}%
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {stats.completed} of {stats.total} requests completed
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium">
              Assign Staff
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Generate Report
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestServiceRequests;
