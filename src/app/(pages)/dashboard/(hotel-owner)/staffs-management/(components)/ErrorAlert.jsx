import React from "react";

const ErrorAlert = ({ error }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
    <p>{error}</p>
  </div>
);

export default ErrorAlert;
