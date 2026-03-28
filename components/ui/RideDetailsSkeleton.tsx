import React from "react";

export default function RideDetailsSkeleton() {
  return (
    <div className="container mx-auto pt-4 md:pt-12 px-4 sm:px-8 animate-fade-in pb-12 w-full">
      {/* Top Navigation */}
      <div className="flex items-center gap-2 mb-8 group w-fit">
        <div className="w-10 h-10 rounded-full bg-neutral-200 animate-pulse border border-neutral-100 shrink-0"></div>
        <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Main Details */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Header Title */}
          <div>
            <div className="flex items-center flex-wrap gap-4 mb-3">
              <div className="h-10 md:h-12 w-48 bg-neutral-200 rounded-lg animate-pulse"></div>
              <div className="h-6 w-10 bg-neutral-100 rounded animate-pulse"></div>
              <div className="h-10 md:h-12 w-48 bg-neutral-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-6 w-64 bg-neutral-100 rounded-md animate-pulse mt-3"></div>
          </div>

          {/* Premium Journey Timeline */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-neutral-100 mt-2 relative overflow-hidden">
            <div className="h-8 w-32 bg-neutral-200 rounded animate-pulse mb-8"></div>

            <div className="flex flex-col relative px-2">
              {/* Departure Node */}
              <div className="flex gap-4 md:gap-6 relative group w-full mb-8">
                <div className="absolute left-[9px] top-6 bottom-[-32px] w-0.5 bg-neutral-100"></div>
                <div className="w-5 h-5 rounded-full border-4 border-white bg-neutral-200 shrink-0 relative z-10 mt-1.5 animate-pulse shadow-sm"></div>

                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-5 w-48 bg-neutral-100 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-64 bg-neutral-50 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Arrival Node */}
              <div className="flex gap-4 md:gap-6 relative group pt-2 w-full">
                <div className="w-5 h-5 rounded-full border-4 border-white bg-neutral-200 shrink-0 relative z-10 mt-0.5 -ml-[1px] animate-pulse shadow-sm"></div>

                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-5 w-48 bg-neutral-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Sections Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Driver Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col gap-5">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-neutral-200 animate-pulse shrink-0"></div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-50 flex flex-col gap-3">
                <div className="h-4 w-full bg-neutral-100 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Car Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-center">
               <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse mb-2"></div>
               <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse mb-2"></div>
               <div className="h-4 w-40 bg-neutral-100 rounded animate-pulse mb-6"></div>
               <div className="h-3 w-48 bg-neutral-100 rounded animate-pulse mt-auto"></div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Sticky Widget Skeleton */}
        <aside className="w-full lg:w-96 shrink-0 flex flex-col gap-6 self-start sticky top-28 z-30">
          <div className="bg-dark rounded-2xl squircle p-8 shadow-xl border border-neutral-800 relative overflow-hidden">
            {/* Price Header */}
            <div className="flex items-end gap-2 mb-6">
              <div className="h-12 w-32 bg-neutral-800 rounded animate-pulse"></div>
              <div className="h-6 w-12 bg-neutral-800 rounded animate-pulse mb-1"></div>
            </div>
            
            <div className="flex gap-2 mt-4 mb-8">
               <div className="h-6 w-24 bg-neutral-800 rounded-full animate-pulse"></div>
               <div className="h-6 w-24 bg-neutral-800 rounded-full animate-pulse"></div>
            </div>

            <div className="h-px bg-neutral-800 w-full mb-8"></div>

            {/* Options */}
            <div className="mb-8 space-y-4">
              <div className="h-3 w-24 bg-neutral-800 rounded animate-pulse mb-4"></div>
              <div className="flex gap-2 flex-wrap">
                 <div className="h-10 w-32 bg-neutral-800 rounded-lg animate-pulse"></div>
                 <div className="h-10 w-32 bg-neutral-800 rounded-lg animate-pulse"></div>
                 <div className="h-10 w-32 bg-neutral-800 rounded-lg animate-pulse mt-2"></div>
              </div>
            </div>

            {/* Warning block */}
            <div className="h-20 w-full bg-neutral-800/50 rounded-2xl animate-pulse mb-8"></div>

            {/* Booking Controls */}
            <div className="flex flex-col gap-4">
               <div className="h-14 w-full bg-neutral-800 rounded-full animate-pulse"></div>
               <div className="h-14 w-full bg-neutral-700/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
