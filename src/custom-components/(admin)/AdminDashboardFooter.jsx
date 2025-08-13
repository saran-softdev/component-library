"use client";

export default function AdminDashboardFooter() {
  return (
    <footer className="border-t border-theme-border bg-theme-background px-5 py-4 md:px-8">
      <div className="flex flex-col items-center justify-between space-y-2 text-sm text-theme-secondary sm:flex-row sm:space-y-0">
        <div>© {new Date().getFullYear()} PMS. All rights reserved.</div>
        <div className="flex items-center space-x-4">
          <span>Version 1.0.0</span>
          <span>•</span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-theme-primary text-nowrap transition-colors"
          >
            Property Management System
          </a>
        </div>
      </div>
    </footer>
  );
}
