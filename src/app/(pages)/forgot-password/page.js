"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Blue Header */}
        <div className="bg-blue-600 px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-blue-600"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-white">
            Password Recovery
          </h1>
          <p className="mt-2 text-lg text-white/90">
            Please contact your administrator
          </p>
        </div>

        {/* White Content Section */}
        <div className="px-8 py-10">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-6">
            <p className="text-blue-700">
              For security reasons, password reset must be handled by your
              system administrator. Please contact them with your account
              details.
            </p>
          </div>

          {/* Contact Information */}
          <div className="border border-gray-100 rounded-lg p-5 mb-6">
            <h3 className="font-medium text-gray-800 mb-3">
              Contact Information
            </h3>
            <div className="space-y-1.5">
              <p className="text-gray-700">
                Email: <span className="font-medium">admin@pms.com</span>
              </p>
              <p className="text-gray-700">
                Phone: <span className="font-medium">+1 (555) 123-4567</span>
              </p>
            </div>
          </div>

          {/* Required Information */}
          <div>
            <p className="text-gray-700 mb-2.5">
              Please provide the following information:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Your full name</li>
              <li>Your email address</li>
              <li>Your organization ID</li>
            </ul>
          </div>

          {/* Return Button */}
          <Link
            href="/auth"
            className="mt-8 flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
