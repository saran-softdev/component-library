"use client";
import React, { useState } from "react";
import { ShieldCheckIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import ABACComponent from "./(components)/ABACComponent";
import RBACComponent from "./(components)/RBACComponent";

const AccessMatrix = () => {
  const [activeTab, setActiveTab] = useState("rbac");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Access Matrix</h1>
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("rbac")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "rbac"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              RBAC (Role-Based)
            </div>
          </button>
          <button
            onClick={() => setActiveTab("abac")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "abac"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <CpuChipIcon className="h-5 w-5 mr-2" />
              ABAC (Attribute-Based)
            </div>
          </button>
        </nav>
      </div>
      {activeTab === "rbac" ? <RBACComponent /> : <ABACComponent />}
    </div>
  );
};

export default AccessMatrix;
