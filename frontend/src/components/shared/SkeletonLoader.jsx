import React from 'react';

/**
 * Reusable Skeleton Loader component to provide visual loading feedback.
 * @param {string} className - Optional Tailwind utility classes.
 */
export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
  );
}

/**
 * Skeleton loader designed for loading table or list rows.
 */
export function TableRowSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-gray-200">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader designed for dashboard stat cards.
 */
export function CardSkeleton({ cards = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="border-4 border-black p-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
