import React from "react";

export default function RideCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-neutral-50 rounded-full blur-3xl"></div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 w-full">
        {/* Left Side: Timeline */}
        <div className="flex-1 max-w-xl">
          <div className="flex flex-col relative pl-2 border-l-2 border-dashed border-neutral-200 py-1">
            
            {/* Departure */}
            <div className="flex items-center gap-4 relative -left-[11px] group w-full mb-6">
              <div className="w-5 h-5 rounded-full border-[5px] border-white bg-neutral-200 shrink-0 shadow-sm relative z-10 animate-pulse"></div>
              <div className="flex flex-col flex-1 gap-2">
                <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex items-center gap-4 relative -left-[11px] group w-full">
              <div className="w-5 h-5 rounded-full border-[5px] border-white bg-neutral-200 shrink-0 shadow-sm relative z-10 animate-pulse"></div>
              <div className="flex flex-col flex-1 gap-2">
                <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse"></div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Side: Price */}
        <div className="flex flex-col md:items-end justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100 shrink-0 min-w-[120px]">
          <div className="h-10 w-24 bg-neutral-200 rounded animate-pulse ml-auto"></div>
          <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse ml-auto mt-2"></div>
        </div>
      </div>

      <div className="h-px bg-neutral-100 w-full my-5 relative z-10"></div>

      {/* Footer Area */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 w-max">
          <div className="w-10 h-10 rounded-full bg-neutral-200 animate-pulse shrink-0"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-28 bg-neutral-200 rounded animate-pulse"></div>
            <div className="h-3 w-20 bg-neutral-100 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Features badges */}
        <div className="flex gap-2">
          <div className="h-6 w-8 bg-neutral-100 rounded-full animate-pulse"></div>
          <div className="h-6 w-8 bg-neutral-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
