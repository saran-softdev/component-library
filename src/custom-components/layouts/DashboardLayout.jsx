"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CloudIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  MegaphoneIcon,
  StarIcon,
  TagIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  BookmarkIcon,
  IdentificationIcon,
  KeyIcon,
  LightBulbIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  // Adding missing icons
  ShieldCheckIcon,
  UserIcon,
  PlusCircleIcon,
  HomeModernIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  LockClosedIcon,
  UserPlusIcon,
  CpuChipIcon,
  Squares2X2Icon,
  ChartBarSquareIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/20/solid";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";
import DashboardLoader from "./DashboardLoader";

const icons = {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  BookmarkIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CloudIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  MegaphoneIcon,
  StarIcon,
  IdentificationIcon,
  TagIcon,
  ChartBarIcon,
  BanknotesIcon,
  KeyIcon,
  // Adding missing icons to the icons object
  ShieldCheckIcon,
  UserIcon,
  PlusCircleIcon,
  HomeModernIcon,
  LockClosedIcon,
  UserPlusIcon,
  CpuChipIcon,
  Squares2X2Icon,
  ChartBarSquareIcon,
  PuzzlePieceIcon
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarConfig, setSidebarConfig] = useState({});
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const fetchSidebarItems = async () => {
    setLoadingSidebar(true);
    try {
      const res = await axios.get(
        "/api/sidebar?controllerName=getAllSidebarItemsByUser"
      );
      const data = res.data;
      const grouped = {};
      (data.sidebars || []).forEach((item) => {
        if (!grouped[item.sidebarName]) {
          grouped[item.sidebarName] = {
            label: item.sidebarName,
            childMenu: []
          };
        }
        grouped[item.sidebarName].childMenu.push({
          href: item.href,
          icon: item.icon,
          label: item.name,
          childMenu: Array.isArray(item.children)
            ? item.children.map((child) => ({
                href: child.href,
                label: child.name
              }))
            : []
        });
      });
      setSidebarConfig(grouped);
    } catch (err) {
      setSidebarConfig({});
    } finally {
      setLoadingSidebar(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchSidebarItems();
    }
  }, [status]);

  const userNavigation = [
    { name: "Home", href: "/" },
    { name: "Sign out", href: "#" }
  ];

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loadingSidebar) {
    return <DashboardLoader />;
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div
      className={`flex grow flex-col overflow-y-auto scrollbar-hidden ${
        !isMobile ? "border-r border-gray-200" : ""
      }`}
    >
      {/* Sidebar Header with Toggle */}
      {!isMobile && (
        <div
          className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 ${
            sidebarCollapsed ? "px-2" : "px-4"
          }`}
        >
          {!sidebarCollapsed && (
            <div className="text-sm font-medium text-gray-700">Menu</div>
          )}
          <button
            onClick={toggleSidebarCollapse}
            className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors duration-200 ${
              sidebarCollapsed ? "mx-auto" : ""
            }`}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      )}

      {/* Navigation Content */}
      <nav className={`flex flex-1 flex-col px-3 py-4 space-y-1`}>
        {Object.keys(sidebarConfig).length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="p-3 bg-gray-200 rounded-full mb-4">
              <FolderIcon className="w-6 h-6 text-gray-500" />
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="text-gray-600 text-sm font-medium">
                  No menu items available
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Contact administrator for access
                </div>
              </>
            )}
          </div>
        ) : (
          Object.keys(sidebarConfig).map((menu) => (
            <div key={menu} className="space-y-2">
              {/* Menu Category Header */}
              {!sidebarCollapsed && (
                <div className="px-3 py-2">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wide">
                    {sidebarConfig[menu].label}
                  </h3>
                </div>
              )}

              {/* Menu Items */}
              <div className="space-y-1">
                {sidebarConfig[menu].childMenu.map((item) => {
                  const IconComponent = icons[item.icon];
                  const hasChildren =
                    Array.isArray(item.childMenu) && item.childMenu.length > 0;
                  const isActive = pathname === item.href;

                  return (
                    <div key={item.label}>
                      {hasChildren ? (
                        <Disclosure>
                          {({ open }) => (
                            <div>
                              <Disclosure.Button
                                className={classNames(
                                  "group flex items-center px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-all duration-200 w-full",
                                  sidebarCollapsed
                                    ? "justify-center"
                                    : "gap-x-3",
                                  isActive
                                    ? "bg-white text-gray-900 border border-gray-400"
                                    : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                                )}
                                title={sidebarCollapsed ? item.label : ""}
                              >
                                {IconComponent ? (
                                  <IconComponent
                                    className={`${
                                      sidebarCollapsed ? "w-5 h-5" : "w-5 h-5"
                                    } shrink-0 ${
                                      isActive
                                        ? "text-gray-900"
                                        : "text-gray-600 group-hover:text-gray-900"
                                    }`}
                                  />
                                ) : (
                                  <FolderIcon
                                    className={`${
                                      sidebarCollapsed ? "w-5 h-5" : "w-5 h-5"
                                    } shrink-0 text-gray-400`}
                                  />
                                )}

                                {!sidebarCollapsed && (
                                  <>
                                    <span className="flex-1 text-left">
                                      {item.label}
                                    </span>
                                    <ChevronDownIcon
                                      className={`w-4 h-4 transition-transform duration-200 ${
                                        open ? "rotate-180" : "rotate-0"
                                      } ${
                                        isActive
                                          ? "text-gray-900"
                                          : "text-gray-600 group-hover:text-gray-900"
                                      }`}
                                    />
                                  </>
                                )}
                              </Disclosure.Button>

                              {!sidebarCollapsed && (
                                <Disclosure.Panel>
                                  <div className="ml-4 border-l-2 border-gray-200">
                                    <div className="py-1 space-y-1 pl-4">
                                      {item.childMenu.map((child) => (
                                        <Link
                                          key={child.label}
                                          href={child.href}
                                          className={classNames(
                                            "group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 relative",
                                            pathname === child.href
                                              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                                              : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                                          )}
                                        >
                                          <span className="absolute -left-4 top-1/2 h-[1px] w-4 bg-gray-200"></span>
                                          <div className="flex items-center">
                                            <div
                                              className={classNames(
                                                "w-1.5 h-1.5 rounded-full mr-3",
                                                pathname === child.href
                                                  ? "bg-gray-900"
                                                  : "bg-gray-400"
                                              )}
                                            ></div>
                                            {child.label}
                                          </div>
                                          {typeof child.badgeCount ===
                                            "number" &&
                                            child.badgeCount > 0 && (
                                              <span
                                                className={classNames(
                                                  "ml-2 text-xs font-semibold px-2 py-0.5 rounded-full",
                                                  child.badgeColor === "green"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-orange-100 text-orange-800"
                                                )}
                                              >
                                                {child.badgeCount}
                                              </span>
                                            )}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              )}
                            </div>
                          )}
                        </Disclosure>
                      ) : (
                        <Link
                          href={item.href || pathname}
                          className={classNames(
                            "group flex items-center px-3 py-2.5 text-sm  rounded-lg cursor-pointer transition-all duration-200",
                            sidebarCollapsed ? "justify-center" : "gap-x-3",
                            isActive
                              ? "bg-white text-gray-900 border border-gray-400"
                              : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                          )}
                          title={sidebarCollapsed ? item.label : ""}
                        >
                          {IconComponent ? (
                            <IconComponent
                              className={`${
                                sidebarCollapsed ? "w-5 h-5" : "w-5 h-5"
                              } shrink-0 ${
                                isActive
                                  ? "text-gray-900"
                                  : "text-gray-600 group-hover:text-gray-900"
                              }`}
                            />
                          ) : (
                            <FolderIcon
                              className={`${
                                sidebarCollapsed ? "w-5 h-5" : "w-5 h-5"
                              } shrink-0 text-gray-400`}
                            />
                          )}
                          {!sidebarCollapsed && (
                            <span className="flex-1 text-left">
                              {item.label}
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </nav>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-screen ">
      {/* Fixed Top Header */}
      <div className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-gray-200 bg-white px-4 sm:px-6">
        {/* Left Side - Mobile Menu + Logo */}
        <div className="flex items-center gap-x-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-700 lg:hidden hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="flex items-center h-10">
            <Link href="/">
              <Image
                loader={gcsImageLoader}
                alt="PMS Logo"
                src="/pmslogo.png"
                width={70}
                height={90}
                quality={100}
                priority
                className="  object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search navigation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {search && (
            <div className="absolute z-20 mt-1 w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-auto">
              {Object.keys(sidebarConfig).map((menu) => (
                <div key={menu}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                    {sidebarConfig[menu].label}
                  </div>
                  {sidebarConfig[menu].childMenu
                    .filter((tab) =>
                      tab.label.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((tab) => {
                      const IconComponent = icons[tab.icon];
                      const destination =
                        tab.childMenu?.length > 0
                          ? tab.childMenu[0].href
                          : tab.href || "#";

                      return (
                        <Link
                          key={tab.label}
                          href={destination}
                          onClick={() => setSearch("")}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          {IconComponent ? (
                            <IconComponent className="w-4 h-4 text-gray-400" />
                          ) : (
                            <FolderIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-900">
                            {tab.label}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Notifications + User */}
        <div className="flex items-center ">
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center  gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              {/* Profile Image or Default Icon */}
              {session?.user?.image ? (
                <Image
                  loader={gcsImageLoader}
                  src={session.user.image}
                  alt={session.user.name || "User Profile"}
                  width={36}
                  height={36}
                  className="rounded-full border border-gray-200"
                  unoptimized
                />
              ) : (
                <UserIcon className="w-9 h-9 text-gray-500 border border-gray-200 rounded-full p-1" />
              )}

              {/* User Info */}
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                  {session?.user?.name}
                </span>
              </div>

              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </MenuButton>

            {/* Dropdown */}
            <MenuItems className="absolute right-0 z-20 mt-2 w-72 rounded-xl bg-white shadow-lg border border-gray-200 focus:outline-none overflow-hidden">
              {/* Profile Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {session?.user?.image ? (
                    <Image
                      loader={gcsImageLoader}
                      src={session.user.image}
                      alt={session.user.name || "User Profile"}
                      width={48}
                      height={48}
                      className="rounded-full border border-gray-300"
                      unoptimized
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-gray-500 border border-gray-300 rounded-full p-2" />
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.roleName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="py-2">
                {userNavigation
                  .filter((item) => item.name !== "Sign out")
                  .map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    </MenuItem>
                  ))}
              </div>

              {/* Sign Out */}
              <div className="border-t py-2 border-gray-200 ">
                <MenuItem>
                  <button
                    onClick={() => signOut()}
                    className="group w-full text-left px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 transition-all duration-200"
                  >
                    <span className="flex flex-col">
                      <span className="font-semibold group-hover:animate-bounce">
                        Sign out
                      </span>
                      <span className="text-xs text-gray-500  opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300">
                        😢 Why leave? Stay a bit longer!
                      </span>
                    </span>
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" />
          <div className="fixed inset-0 flex">
            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition">
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              <SidebarContent isMobile={true} />
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop Sidebar */}
        <div
          className={`hidden lg:flex lg:flex-col border-r border-gray-200 transition-all duration-300 ${
            sidebarCollapsed ? "lg:w-16" : "lg:w-64"
          }`}
        >
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
