"use client";
import { SearchX } from "lucide-react";
export default function NoJobs() {
  return (
    <div className="h-[calc(100vh-20px)] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <SearchX />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-semibold text-gray-900">No Jobs Found</h1>

        <p className="mt-2 max-w-md text-sm text-gray-500">
          There are currently no jobs available. Please check back later for new
          opportunities.
        </p>

        {/* Optional Button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 cursor-pointer"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
