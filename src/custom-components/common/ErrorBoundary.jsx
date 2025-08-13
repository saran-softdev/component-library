"use client";
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // You can log the error to an error reporting service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Left side - Illustration */}
          <div className="w-full md:w-1/2 relative overflow-hidden flex items-center justify-center min-h-[60vh] md:min-h-screen">
            <div className="relative w-screen h-screen">
              <img
                src="/error.png"
                alt="Error Illustration"
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 bg-[#f5e6cf] flex items-center justify-center p-8">
            <div className="max-w-md text-center">
              <div className="mb-4 text-[#0e2a38]">
                <div className="inline-block border-2 border-[#0e2a38] px-3 py-1 rounded-md text-sm font-medium">
                  Unexpected Error
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0e2a38] mb-4">
                Oops! Something went wrong.
              </h1>
              <p className="text-lg md:text-xl text-[#0e2a38] mb-8">
                We encountered an unexpected error. Please try again or go back
                to the homepage.
              </p>
              <div className="space-y-4">
                <a
                  href="/"
                  className="inline-flex items-center justify-center w-full bg-transparent border border-[#0e2a38] text-[#0e2a38] font-medium rounded-md px-6 py-3 transition duration-300 hover:bg-[#0e2a38] hover:text-white"
                >
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
