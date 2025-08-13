"use client";

import * as HeroIcons from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

// In-memory cache for dynamic icon mappings
let dynamicIconMappings = {};

export function AdminIcon({ iconName, className = "w-5 h-5", ...props }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset error state when iconName changes
    setError(false);
  }, [iconName]);

  if (!iconName) {
    return (
      <HeroIcons.QuestionMarkCircleIcon className={className} {...props} />
    );
  }

  try {
    // 1. Check if icon exists directly in HeroIcons
    if (HeroIcons[iconName]) {
      const IconComponent = HeroIcons[iconName];
      return <IconComponent className={className} {...props} />;
    }

    // 2. Check our dynamic cache
    if (dynamicIconMappings[iconName]) {
      const IconComponent = dynamicIconMappings[iconName];
      return <IconComponent className={className} {...props} />;
    }

    // 3. Try variations of the name
    // Convert FooBarIcon to different formats and try them
    const baseName = iconName.replace(/Icon$/, ""); // Remove 'Icon' suffix if present

    // Try with 'Icon' suffix
    if (HeroIcons[`${baseName}Icon`]) {
      const IconComponent = HeroIcons[`${baseName}Icon`];
      // Cache this mapping for future use
      dynamicIconMappings[iconName] = IconComponent;
      return <IconComponent className={className} {...props} />;
    }

    // Try without suffix
    if (HeroIcons[baseName]) {
      const IconComponent = HeroIcons[baseName];
      // Cache this mapping for future use
      dynamicIconMappings[iconName] = IconComponent;
      return <IconComponent className={className} {...props} />;
    }

    // 4. Fallback to our manual mapping
    const iconMap = {
      // Dashboard & Main
      Dashboard: HeroIcons.HomeIcon,
      Home: HeroIcons.HomeIcon,

      // Property Management
      Property: HeroIcons.BuildingOffice2Icon,
      Building: HeroIcons.BuildingOffice2Icon,
      Room: HeroIcons.KeyIcon,
      Location: HeroIcons.MapPinIcon,
      Amenity: HeroIcons.StarIcon,

      // Reservations & Bookings
      Booking: HeroIcons.CalendarIcon,
      Reservation: HeroIcons.CalendarIcon,

      // Guests & Users
      Guest: HeroIcons.UserCircleIcon,
      Customers: HeroIcons.UserGroupIcon,
      Staff: HeroIcons.UsersIcon,

      // Financial
      Payment: HeroIcons.CreditCardIcon,
      Invoice: HeroIcons.DocumentTextIcon,
      Receipt: HeroIcons.ReceiptRefundIcon,
      Transaction: HeroIcons.BanknotesIcon,
      Revenue: HeroIcons.BanknotesIcon,
      Expense: HeroIcons.BanknotesIcon,

      // Analytics & Reports
      Analytics: HeroIcons.ChartBarIcon,
      Chart: HeroIcons.ChartBarIcon,
      Report: HeroIcons.DocumentMagnifyingGlassIcon,
      Presentation: HeroIcons.PresentationChartBarIcon,
      Statistics: HeroIcons.ChartBarIcon,

      // Admin & Security
      Admin: HeroIcons.ShieldCheckIcon,
      Security: HeroIcons.LockClosedIcon,
      Role: HeroIcons.IdentificationIcon,
      Permission: HeroIcons.KeyIcon,
      Shield: HeroIcons.ShieldCheckIcon,

      // Communication
      Message: HeroIcons.EnvelopeIcon,
      Chat: HeroIcons.ChatBubbleLeftRightIcon,
      Notification: HeroIcons.BellIcon,
      Email: HeroIcons.EnvelopeIcon,

      // Settings & System
      Settings: HeroIcons.Cog6ToothIcon,
      Config: HeroIcons.AdjustmentsHorizontalIcon,
      System: HeroIcons.CommandLineIcon,
      Global: HeroIcons.GlobeAltIcon
    };

    // Try finding by the base name without 'Icon' suffix
    if (iconMap[baseName]) {
      const IconComponent = iconMap[baseName];
      // Cache this mapping for future use
      dynamicIconMappings[iconName] = IconComponent;
      return <IconComponent className={className} {...props} />;
    }

    // If we got here, we couldn't find a matching icon
    console.warn(`Icon not found: ${iconName}`);
    setError(true);
    return (
      <HeroIcons.QuestionMarkCircleIcon className={className} {...props} />
    );
  } catch (err) {
    console.error("Error rendering icon:", err);
    return (
      <HeroIcons.ExclamationTriangleIcon className={className} {...props} />
    );
  }
}

// Helper function to register custom icon mappings
AdminIcon.registerIcon = (name, component) => {
  dynamicIconMappings[name] = component;
};

// Helper to clear registered mappings (useful for testing)
AdminIcon.clearMappings = () => {
  dynamicIconMappings = {};
};
