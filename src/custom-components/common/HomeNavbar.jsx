"use client";

import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";
import { signOut } from "next-auth/react";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { FaHome, FaHotel, FaRobot, FaUmbrellaBeach } from "react-icons/fa";

export default function HomeNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // PMS/Hotel-specific nav items
  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Dashboard", path: "/dashboard/overview", icon: <FaHotel /> },
    { name: "AI Assistant", path: "/ai-assistant", icon: <FaRobot /> },
    { name: "Bookings", path: "/bookings", icon: <FaUmbrellaBeach /> }
  ];

  function isActivePath(currentPath, itemPath) {
    if (itemPath === "/") {
      return currentPath === itemPath;
    }
    const normalizedCurrentPath = currentPath.endsWith("/")
      ? currentPath
      : `${currentPath}/`;
    const normalizedItemPath = itemPath.endsWith("/")
      ? itemPath
      : `${itemPath}/`;
    return normalizedCurrentPath.startsWith(normalizedItemPath);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Disclosure
        as="nav"
        className="bg-theme-background border-b border-theme-border shadow-lg w-full sticky top-0 "
      >
        {() => (
          <>
            <div className="mx-auto max-w-7xl flex justify-between items-center px-4 py-1">
              <div className="flex items-center">
                <Link href="/">
                  <Image
                    loader={gcsImageLoader}
                    className="w-auto h-[50px]"
                    src="/pmslogo.png"
                    alt="Logo"
                    width={1000}
                    height={1000}
                  />
                </Link>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <ul className="flex space-x-4">
                  {navItems.map((item) => (
                    <li
                      key={item.name}
                      className="relative group text-black flex items-center"
                    >
                      <Link
                        href={item.path}
                        className={`flex items-center gap-1 pb-1 transition-colors ${
                          isActivePath(pathname, item.path)
                            ? "text-theme-primary font-bold"
                            : "text-theme-secondary font-semibold"
                        }`}
                      >
                        <span className="text-md">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                      <span
                        className={`absolute left-0 bottom-0 h-[2px] bg-theme-primary transition-all duration-300 ${
                          isActivePath(pathname, item.path)
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center">
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="bg-transparent border-none px-4 py-2 rounded-lg transition flex items-center space-x-2"
                  >
                    {session && session.user && session.user.image ? (
                      <Image
                        loader={gcsImageLoader}
                        src={session.user.image}
                        alt={session.user.name || "User Profile"}
                        className="h-10 w-10 border-2 border-blue-400 rounded-full object-cover"
                        width={32}
                        height={32}
                        unoptimized
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 text-blue-500 border-2 border-blue-400 rounded-full p-1 cursor-pointer" />
                    )}
                  </button>
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-gray-50 rounded-md shadow-lg border border-gray-200"
                    >
                      <ul className="py-1 text-gray-800">
                        {session && session.user ? (
                          <>
                            <li>
                              <Link
                                href="/dashboard/overview"
                                className="block px-4 py-2 hover:bg-gray-200"
                              >
                                My Profile
                              </Link>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  signOut();
                                  setShowDropdown(false);
                                }}
                                className="w-full text-left block px-4 py-2 hover:bg-gray-200"
                              >
                                Log Out
                              </button>
                            </li>
                          </>
                        ) : (
                          <li>
                            <button
                              onClick={() => {
                                setShowDropdown(false);
                                router.push("/auth");
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            >
                              Sign in / Register
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="lg:hidden">
                  <button
                    onClick={toggleMenu}
                    className="text-blue-500 p-2 rounded-md focus:outline-none"
                  >
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-[99999] flex transform transition-all duration-300 ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-sm z-[99999] ${
            isOpen ? "opacity-90" : "opacity-0"
          }`}
          onClick={closeMenu}
        ></div>
        <div
          className={`relative w-64 bg-theme-background shadow-xl h-full transform transition-transform duration-300 z-[100000] ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <Link href="/">
              <Image
                loader={gcsImageLoader}
                className="w-auto h-10"
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
              />
            </Link>
            <button
              onClick={closeMenu}
              className="text-gray-500 hover:text-red-500"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          {session && session.user && (
            <div className="flex items-center gap-4 px-4 py-3 border-b">
              {session.user.image ? (
                <Image
                  loader={gcsImageLoader}
                  src={session.user.image}
                  alt={session.user.name || "User Profile"}
                  className="h-12 w-12 border-2 border-theme-primary rounded-full object-cover"
                  width={48}
                  height={48}
                  unoptimized
                />
              ) : (
                <UserIcon className="h-12 w-12 text-gray-400" />
              )}
              <div>
                <p className="text-lg font-medium text-theme-text">
                  {session.user.name || "User"}
                </p>
                <p className="text-sm text-theme-secondary">
                  {session.user.email}
                </p>
              </div>
            </div>
          )}
          <nav className="mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-2 text-theme-text hover:bg-theme-surface rounded-md transition"
              >
                <span className="text-black text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 w-full border-t border-theme-border py-2 bg-theme-surface">
            {session && session.user ? (
              <button
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-theme-text hover:bg-theme-primary hover:text-white rounded-md transition-colors"
              >
                <FiLogOut className="h-5 w-5 text-theme-secondary" />
                Log Out
              </button>
            ) : (
              <button
                onClick={() => {
                  closeMenu();
                  router.push("/auth");
                }}
                className="flex items-center gap-2 justify-start px-4 py-2 text-theme-text hover:bg-theme-primary hover:text-white rounded-md w-full text-left transition-colors"
              >
                <FiLogIn className="h-5 w-5 text-theme-secondary" />
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
