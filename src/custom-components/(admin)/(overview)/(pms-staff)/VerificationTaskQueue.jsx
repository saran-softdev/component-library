import React from "react";
import {
  ClipboardCheck,
  AlertCircle,
  FileText,
  Building,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Zap,
  Calendar,
  TrendingUp,
  Eye,
  Filter,
  Plus,
  Award
} from "lucide-react";

const VerificationTaskQueue = () => {
  // Static data for demonstration
  const pendingVerifications = [
    {
      id: "V-2024-0045",
      type: "Hotel Registration",
      name: "Sunset Beach Resort",
      location: "Miami, FL",
      documents: ["Business License", "Tax Certificate", "Insurance Policy"],
      submittedDate: "June 15, 2023",
      priority: "High",
      status: "Under Review",
      assignee: "Sarah Johnson",
      estimatedCompletion: "2 days",
      completedDocs: 2,
      totalDocs: 3,
      daysInQueue: 8
    },
    {
      id: "V-2024-0046",
      type: "Document Update",
      name: "Mountain View Hotel",
      location: "Denver, CO",
      documents: [
        "Property Deed",
        "Insurance Policy",
        "Fire Safety Certificate"
      ],
      submittedDate: "June 17, 2023",
      priority: "Medium",
      status: "Pending Review",
      assignee: "Mike Wilson",
      estimatedCompletion: "3 days",
      completedDocs: 1,
      totalDocs: 3,
      daysInQueue: 6
    },
    {
      id: "V-2024-0048",
      type: "Compliance Check",
      name: "City Center Suites",
      location: "New York, NY",
      documents: ["Operating Permit", "Health Certificate", "Zoning Approval"],
      submittedDate: "June 18, 2023",
      priority: "Critical",
      status: "Action Required",
      assignee: "Lisa Chen",
      estimatedCompletion: "1 day",
      completedDocs: 0,
      totalDocs: 3,
      daysInQueue: 5
    },
    {
      id: "V-2024-0049",
      type: "Identity Verification",
      name: "Coastal Resort & Spa",
      location: "San Diego, CA",
      documents: ["Owner ID", "Business Registration", "Bank Statement"],
      submittedDate: "June 20, 2023",
      priority: "High",
      status: "In Progress",
      assignee: "David Brown",
      estimatedCompletion: "1 day",
      completedDocs: 2,
      totalDocs: 3,
      daysInQueue: 3
    },
    {
      id: "V-2024-0050",
      type: "Renewal Check",
      name: "Downtown Business Hotel",
      location: "Chicago, IL",
      documents: ["License Renewal", "Updated Insurance", "Safety Inspection"],
      submittedDate: "June 22, 2023",
      priority: "Medium",
      status: "Completed",
      assignee: "Emma Davis",
      estimatedCompletion: "Completed",
      completedDocs: 3,
      totalDocs: 3,
      daysInQueue: 1
    }
  ];

  // Calculate statistics
  const stats = {
    total: pendingVerifications.length,
    pending: pendingVerifications.filter((v) => v.status === "Pending Review")
      .length,
    inProgress: pendingVerifications.filter(
      (v) => v.status === "In Progress" || v.status === "Under Review"
    ).length,
    critical: pendingVerifications.filter((v) => v.priority === "Critical")
      .length,
    completed: pendingVerifications.filter((v) => v.status === "Completed")
      .length,
    avgProcessingTime: "4.2 days",
    completionRate: 78.5
  };

  // Priority configurations
  const priorityConfig = {
    Critical: {
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      pulse: true,
      icon: AlertCircle
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
      icon: FileText
    }
  };

  // Status configurations
  const statusConfig = {
    "Pending Review": {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      dotColor: "bg-yellow-400",
      icon: Clock
    },
    "Under Review": {
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-400",
      icon: Eye
    },
    "In Progress": {
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      dotColor: "bg-purple-400",
      icon: ClipboardCheck
    },
    "Action Required": {
      color: "text-red-600",
      bgColor: "bg-red-50",
      dotColor: "bg-red-400",
      icon: AlertCircle
    },
    Completed: {
      color: "text-green-600",
      bgColor: "bg-green-50",
      dotColor: "bg-green-400",
      icon: CheckCircle
    }
  };

  // Verification type colors
  const typeColors = {
    "Hotel Registration": "bg-blue-50 text-blue-600 border-blue-200",
    "Document Update": "bg-purple-50 text-purple-600 border-purple-200",
    "Compliance Check": "bg-red-50 text-red-600 border-red-200",
    "Identity Verification": "bg-green-50 text-green-600 border-green-200",
    "Renewal Check": "bg-amber-50 text-amber-600 border-amber-200"
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

  // Group verifications by assignee
  const verificationsByAssignee = pendingVerifications.reduce(
    (acc, verification) => {
      if (!acc[verification.assignee]) {
        acc[verification.assignee] = [];
      }
      acc[verification.assignee].push(verification);
      return acc;
    },
    {}
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main Verification Queue Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Verification Task Queue</h1>
                <p className="text-amber-100 text-sm">
                  Manage hotel and document verifications
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{stats.total}</div>
              <div className="text-amber-100 text-sm flex items-center justify-end mt-1">
                <FileText className="w-4 h-4 mr-1" />
                Pending Tasks
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-yellow-900">
                  {stats.pending}
                </div>
                <div className="text-xs text-yellow-700">Pending Review</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <ClipboardCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-blue-900">
                  {stats.inProgress}
                </div>
                <div className="text-xs text-blue-700">In Progress</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
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
                  {stats.completed}
                </div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-purple-900">
                  {stats.completionRate}%
                </div>
                <div className="text-xs text-purple-700">Success Rate</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-indigo-900">
                  {stats.avgProcessingTime}
                </div>
                <div className="text-xs text-indigo-700">Avg Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Tasks */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Verification Tasks
              </h3>
              <p className="text-sm text-gray-600">
                Manage all pending verification requests
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </button>
            </div>
          </div>

          {/* Tasks by Assignee */}
          <div className="space-y-6">
            {Object.entries(verificationsByAssignee).map(
              ([assignee, tasks]) => (
                <div
                  key={assignee}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Assignee Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {assignee}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {tasks.length} tasks assigned •{" "}
                            {
                              tasks.filter((t) => t.status === "Completed")
                                .length
                            }{" "}
                            completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-600">
                          Progress:{" "}
                          {tasks.filter((t) => t.status === "Completed").length}
                          /{tasks.length}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (tasks.filter((t) => t.status === "Completed")
                                  .length /
                                  tasks.length) *
                                100
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignee Tasks */}
                  <div className="p-4 space-y-3">
                    {tasks.map((verification) => {
                      const statusConfigItem =
                        statusConfig[verification.status];
                      const StatusIcon = statusConfigItem.icon;

                      return (
                        <div
                          key={verification.id}
                          className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${statusConfigItem.bgColor} border-gray-200`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            {/* Verification Info */}
                            <div className="flex-grow min-w-0 mr-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {verification.name}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  #{verification.id}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <span className="flex items-center">
                                  <Building className="w-3 h-3 mr-1" />
                                  {verification.location}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {verification.submittedDate}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {verification.daysInQueue} days in queue
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <span>Documents:</span>
                                <div className="flex flex-wrap gap-1">
                                  {verification.documents.map((doc, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-white rounded-md border text-xs"
                                    >
                                      {doc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Priority & Type */}
                            <div className="flex flex-col space-y-2 flex-shrink-0">
                              {getPriorityBadge(verification.priority)}
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                  typeColors[verification.type]
                                }`}
                              >
                                {verification.type}
                              </div>
                            </div>
                          </div>

                          {/* Progress & Actions */}
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
                                  {verification.status}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>Progress:</span>
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">
                                    {verification.completedDocs}/
                                    {verification.totalDocs}
                                  </span>
                                  <div className="w-12 bg-gray-200 rounded-full h-1">
                                    <div
                                      className="bg-amber-500 h-1 rounded-full"
                                      style={{
                                        width: `${
                                          (verification.completedDocs /
                                            verification.totalDocs) *
                                          100
                                        }%`
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600">
                                ETA:{" "}
                                <span className="font-medium">
                                  {verification.estimatedCompletion}
                                </span>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex space-x-2">
                              {verification.status === "Pending Review" && (
                                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                  Start Review
                                </button>
                              )}
                              {verification.status === "Action Required" && (
                                <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors duration-200">
                                  Take Action
                                </button>
                              )}
                              {(verification.status === "Under Review" ||
                                verification.status === "In Progress") && (
                                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors duration-200">
                                  Complete
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
                </div>
              )
            )}
          </div>

          {/* Performance Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  Processing Speed
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-900">
                {stats.avgProcessingTime}
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Average completion time
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Success Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {stats.completionRate}%
              </div>
              <p className="text-sm text-green-700 mt-1">
                Successful verifications
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Critical Queue
                </span>
              </div>
              <div className="text-2xl font-bold text-red-900">
                {stats.critical}
              </div>
              <p className="text-sm text-red-700 mt-1">High priority pending</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 font-medium">
              Bulk Assign
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Priority Review
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
              Generate Report
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              Export Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationTaskQueue;
