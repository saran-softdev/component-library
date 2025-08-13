// components/ui/skeleton.js
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-300 ${className}`}
    />
  );
}
