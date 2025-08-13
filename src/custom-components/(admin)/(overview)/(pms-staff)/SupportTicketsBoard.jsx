import React from "react";
import {
  LifeBuoy,
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
  Zap,
  Building,
  Calendar,
  TrendingUp
} from "lucide-react";

const SupportTicketsBoard = () => {
  // Static data for demonstration
  const tickets = [
    {
      id: "T-2024-0123",
      title: "Booking system not responding",
      description: "Users unable to complete bookings, system timeout errors",
      priority: "High",
      status: "Open",
      submitted: "2 hours ago",
      hotel: "Grand Plaza Hotel",
      assignee: "John Smith",
      responses: 3,
      category: "Technical",
      estimatedResolution: "4 hours"
    },
    {
      id: "T-2024-0120",
      title: "Payment gateway integration issue",
      description:
        "Credit card transactions failing, gateway returning error codes",
      priority: "Critical",
      status: "In Progress",
      submitted: "1 day ago",
      hotel: "Seaside Resort",
      assignee: "Sarah Johnson",
      responses: 8,
      category: "Payment",
      estimatedResolution: "2 hours"
    },
    {
      id: "T-2024-0118",
      title: "Room availability not updating",
      description: "Inventory sync issues causing double bookings",
      priority: "Medium",
      status: "Waiting Customer",
      submitted: "2 days ago",
      hotel: "Mountain View Lodge",
      assignee: "Mike Wilson",
      responses: 5,
      category: "Integration",
      estimatedResolution: "1 day"
    },
    {
      id: "T-2024-0115",
      title: "Customer unable to modify reservation",
      description: "Modification form showing validation errors",
      priority: "Medium",
      status: "Open",
      submitted: "3 days ago",
      hotel: "City Center Inn",
      assignee: "Lisa Chen",
      responses: 2,
      category: "Booking",
      estimatedResolution: "6 hours"
    },
    {
      id: "T-2024-0112",
      title: "Email notifications not being sent",
      description: "Booking confirmations and reminders failing to send",
      priority: "High",
      status: "Resolved",
      submitted: "4 days ago",
      hotel: "Airport Hotel",
      assignee: "David Brown",
      responses: 12,
      category: "Communication",
      estimatedResolution: "Resolved"
    }
  ];

  // Calculate statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    critical: tickets.filter((t) => t.priority === "Critical").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
    avgResponseTime: "2.4 hours",
    satisfactionRate: 94.2
  };

  // Priority configurations
  const priorityConfig = {
    Critical: {
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      pulse: true,
      icon: AlertTriangle
    },
    High: {
      color: "text-orange-700",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-300",
      pulse: false,
      icon: Zap
    },
    Medium: {
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-300",
      pulse: false,
      icon: Clock
    },
    Low: {
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300",
      pulse: false,
      icon: MessageSquare
    }
  };

  // Status configurations
  const statusConfig = {
    Open: {
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-400",
      icon: MessageSquare
    },
    "In Progress": {
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      dotColor: "bg-purple-400",
      icon: Clock
    },
    "Waiting Customer": {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      dotColor: "bg-yellow-400",
      icon: User
    },
    Resolved: {
      color: "text-green-600",
      bgColor: "bg-green-50",
      dotColor: "bg-green-400",
      icon: CheckCircle
    }
  };

  // Category color mapping
  const categoryColors = {
    Technical: "bg-red-50 text-red-600 border-red-200",
    Payment: "bg-orange-50 text-orange-600 border-orange-200",
    Integration: "bg-blue-50 text-blue-600 border-blue-200",
    Booking: "bg-purple-50 text-purple-600 border-purple-200",
    Communication: "bg-green-50 text-green-600 border-green-200"
  };

  const getPriorityBadge = (priority) => {
    const config = priorityConfig[priority];
    const IconComponent = config.icon;
    return (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
          config.bgColor
        } ${config.color} ${config.borderColor} ${
          config.pulse ? "animate-pulse" : ""
        }`}
      >
        {config.pulse && (
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-ping"></div>
        )}
        <IconComponent className="w-3 h-3 mr-1" />
        {priority}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Main Support Tickets Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Support Tickets</h1>
                <p className="text-blue-100 text-sm">
                  Manage customer support requests
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-blue-100 text-sm flex items-center justify-end mt-1">
                <MessageSquare className="w-4 h-4 mr-1" />
                Active Tickets
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-blue-900">
                  {stats.open}
                </div>
                <div className="text-xs text-blue-700">Open</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-purple-900">
                  {stats.inProgress}
                </div>
                <div className="text-xs text-purple-700">In Progress</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-red-900">
                  {stats.critical}
                </div>
                <div className="text-xs text-red-700">Critical</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-green-900">
                  {stats.resolved}
                </div>
                <div className="text-xs text-green-700">Resolved</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-amber-900">
                  {stats.satisfactionRate}%
                </div>
                <div className="text-xs text-amber-700">Satisfaction</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-indigo-900">
                  {stats.avgResponseTime}
                </div>
                <div className="text-xs text-indigo-700">Avg Response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Support Requests
              </h3>
              <p className="text-sm text-gray-600">
                Manage all customer support tickets
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => {
              const statusConfigItem = statusConfig[ticket.status];
              const StatusIcon = statusConfigItem.icon;

              return (
                <div
                  key={ticket.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${statusConfigItem.bgColor} border-gray-200`}
                >
                  <div className="flex items-start justify-between mb-3">
                    {/* Ticket Info */}
                    <div className="flex-grow min-w-0 mr-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {ticket.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          #{ticket.id}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {ticket.hotel}
                        </span>
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {ticket.assignee}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {ticket.submitted}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {ticket.responses} responses
                        </span>
                      </div>
                    </div>

                    {/* Priority & Category */}
                    <div className="flex flex-col space-y-2 flex-shrink-0">
                      {getPriorityBadge(ticket.priority)}
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          categoryColors[ticket.category]
                        }`}
                      >
                        {ticket.category}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
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
                          {ticket.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        ETA:{" "}
                        <span className="font-medium">
                          {ticket.estimatedResolution}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons based on status */}
                    <div className="flex space-x-2">
                      {ticket.status === "Open" && (
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          Take Ticket
                        </button>
                      )}
                      {ticket.status === "In Progress" && (
                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors duration-200">
                          Resolve
                        </button>
                      )}
                      {ticket.status === "Waiting Customer" && (
                        <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                          Follow Up
                        </button>
                      )}
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Response Time
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {stats.avgResponseTime}
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Average first response time
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Resolution Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {Math.round((stats.resolved / stats.total) * 100)}%
              </div>
              <p className="text-sm text-green-700 mt-1">
                Tickets resolved successfully
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Critical Backlog
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {stats.critical}
              </div>
              <p className="text-sm text-purple-700 mt-1">
                High priority tickets pending
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Assign Tickets
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
              Bulk Actions
            </button>
            <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium">
              Generate Report
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

export default SupportTicketsBoard;
