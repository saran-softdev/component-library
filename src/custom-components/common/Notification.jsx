"use client";

import { useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function Notification({
  show,
  setShow,
  type = "success",
  title,
  message,
  duration = 3000,
}) {
  // Auto-hide after duration ms
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, setShow, duration]);

  // Choose icon and color based on type
  const icon =
    type === "success" ? (
      <CheckCircleIcon aria-hidden="true" className="size-6 text-green-400" />
    ) : (
      <ExclamationCircleIcon
        aria-hidden="true"
        className="size-6 text-red-400"
      />
    );
  const panelColor = "bg-white"; // You can change bg if needed

  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={show}
            enter="transform transition ease-in-out duration-500"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transform transition ease-in-out duration-500"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
          >
            <div
              className={`pointer-events-auto w-full max-w-sm rounded-lg ${panelColor} shadow-sm ring-1 ring-black/5`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">{icon}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    {message && (
                      <p className="mt-1 text-sm text-gray-500">{message}</p>
                    )}
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => setShow(false)}
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
