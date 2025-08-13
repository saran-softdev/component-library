import React from "react";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  User,
  Brush,
  LogIn,
  LogOut,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

const StaffTaskAssignments = () => {
  // Static data for demonstration
  const tasks = [
    {
      id: "T1",
      type: "Room Cleaning",
      room: "304",
      priority: "High",
      status: "Pending",
      assignedTo: "Maria Rodriguez",
      time: "10:30 AM",
      duration: "45 mins",
      department: "Housekeeping",
    },
    {
      id: "T2",
      type: "Check-Out",
      room: "215",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "James Wilson",
      time: "11:00 AM",
      duration: "15 mins",
      department: "Front Desk",
    },
    {
      id: "T3",
      type: "Check-In",
      room: "118",
      priority: "High",
      status: "Pending",
      assignedTo: "Sarah Thompson",
      time: "2:00 PM",
      duration: "20 mins",
      department: "Front Desk",
    },
    {
      id: "T4",
      type: "Room Cleaning",
      room: "427",
      priority: "Medium",
      status: "Completed",
      assignedTo: "Maria Rodriguez",
      time: "9:15 AM",
      duration: "40 mins",
      department: "Housekeeping",
    },
    {
      id: "T5",
      type: "Maintenance",
      room: "302",
      priority: "High",
      status: "In Progress",
      assignedTo: "David Chen",
      time: "1:30 PM",
      duration: "60 mins",
      department: "Maintenance",
    },
  ];

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    pending: tasks.filter((t) => t.status === "Pending").length,
    high: tasks.filter((t) => t.priority === "High").length,
  };

  // Task type configurations
  const taskTypeConfig = {
    "Room Cleaning": {
      icon: Brush,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      badgeColor: "bg-blue-100 text-blue-600",
    },
    "Check-In": {
      icon: LogIn,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badgeColor: "bg-green-100 text-green-600",
    },
    "Check-Out": {
      icon: LogOut,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      badgeColor: "bg-purple-100 text-purple-600",
    },
    Maintenance: {
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      badgeColor: "bg-orange-100 text-orange-600",
    },
  };

  // Status configurations
  const statusConfig = {
    Pending: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      dotColor: "bg-yellow-400",
      borderColor: "border-yellow-200",
    },
    "In Progress": {
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-400",
      borderColor: "border-blue-200",
    },
    Completed: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      dotColor: "bg-green-400",
      borderColor: "border-green-200",
    },
  };

  // Priority configurations
  const priorityConfig = {
    High: {
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      pulse: true,
    },
    Medium: {
      color: "text-amber-700",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-300",
      pulse: false,
    },
    Low: {
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300",
      pulse: false,
    },
  };

  // Group tasks by staff member for better organization
  const tasksByStaff = tasks.reduce((acc, task) => {
    if (!acc[task.assignedTo]) {
      acc[task.assignedTo] = [];
    }
    acc[task.assignedTo].push(task);
    return acc;
  }, {});

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
      {/* Main Task Assignments Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Staff Task Assignments</h1>
                <p className="text-violet-100 text-sm">
                  Manage daily staff activities
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-violet-100 text-sm flex items-center justify-end mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                Today&apos;s Tasks
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
                <ClipboardList className="w-4 h-4 text-blue-600" />
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
                  {stats.high}
                </div>
                <div className="text-xs text-red-700">High Priority</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="text-xl font-bold text-gray-900">
                  {Object.keys(tasksByStaff).length}
                </div>
                <div className="text-xs text-gray-700">Staff Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Today&apos;s Assignments
              </h3>
              <p className="text-sm text-gray-600">
                Tasks organized by staff member
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors duration-200 text-sm font-medium">
                Assign New Task
              </button>
            </div>
          </div>

          {/* Tasks by Staff Member */}
          <div className="space-y-6">
            {Object.entries(tasksByStaff).map(([staffName, staffTasks]) => (
              <div
                key={staffName}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Staff Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {staffName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {staffName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {staffTasks[0]?.department} • {staffTasks.length}{" "}
                          tasks assigned
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-600">
                        {
                          staffTasks.filter((t) => t.status === "Completed")
                            .length
                        }
                        /{staffTasks.length} completed
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (staffTasks.filter(
                                (t) => t.status === "Completed"
                              ).length /
                                staffTasks.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Staff Tasks */}
                <div className="p-4 space-y-3">
                  {staffTasks.map((task) => {
                    const taskConfig = taskTypeConfig[task.type];
                    const statusConfigItem = statusConfig[task.status];
                    const TaskIcon = taskConfig.icon;
                    const StatusIcon = statusConfigItem.icon;

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${taskConfig.bgColor} ${taskConfig.borderColor}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          {/* Task Info */}
                          <div className="flex items-center space-x-3 flex-grow">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <TaskIcon
                                className={`w-5 h-5 ${taskConfig.color}`}
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-gray-900">
                                  {task.type}
                                </span>
                                <span className="text-xs text-gray-500">
                                  #{task.id}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>
                                  Room <strong>{task.room}</strong>
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {task.time}
                                </span>
                                <span>
                                  Duration: <strong>{task.duration}</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Priority Badge */}
                          <div className="flex-shrink-0">
                            {getPriorityBadge(task.priority)}
                          </div>
                        </div>

                        {/* Status & Actions */}
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
                              {task.status}
                            </span>
                          </div>

                          {/* Action buttons based on status */}
                          <div className="flex space-x-2">
                            {task.status === "Pending" && (
                              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                Start Task
                              </button>
                            )}
                            {task.status === "In Progress" && (
                              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors duration-200">
                                Complete
                              </button>
                            )}
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors duration-200">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-800">
                  Completion Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-violet-900">
                {Math.round((stats.completed / stats.total) * 100)}%
              </div>
              <p className="text-sm text-violet-700 mt-1">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Active Staff
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {Object.keys(tasksByStaff).length}
              </div>
              <p className="text-sm text-green-700 mt-1">
                Staff members with assigned tasks
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200 font-medium">
              Manage Schedules
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              View Reports
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              Staff Performance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTaskAssignments;
