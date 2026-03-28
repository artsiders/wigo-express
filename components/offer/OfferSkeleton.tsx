"use client";

import React from "react";

export default function OfferSkeleton() {
  return (
    <div className="container mx-auto px-4 mt-8 md:mt-12 md:px-8 lg:px-12 flex flex-col items-center animate-pulse">
      <div className="w-full container flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
        
        {/* Left Column Skeleton */}
        <div className="w-full lg:w-5/12 hidden lg:flex flex-col relative rounded-2xl overflow-hidden border border-neutral-100 bg-white shadow-sm">
          <div className="relative w-full flex-1 min-h-[400px] bg-neutral-100"></div>
          <div className="p-10 xl:p-12 bg-white flex flex-col gap-4">
            <div className="w-12 h-1.5 bg-neutral-200 rounded-full"></div>
            <div className="w-3/4 h-8 bg-neutral-200 rounded-lg"></div>
            <div className="w-full h-4 bg-neutral-100 rounded-md"></div>
            <div className="w-5/6 h-4 bg-neutral-100 rounded-md"></div>
          </div>
        </div>

        {/* Right Column Skeleton (Wizard) */}
        <div className="w-full lg:w-7/12 flex flex-col">
          <div className="w-full h-full bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-neutral-100 flex flex-col min-h-[600px]">
            {/* Header Skeleton */}
            <div className="px-8 lg:px-14 pt-10 pb-6 border-b border-light-400">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 rounded-full bg-neutral-100"></div>
                <div className="w-24 h-4 bg-neutral-100 rounded-full"></div>
                <div className="w-10 h-10 rounded-full bg-neutral-100"></div>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-200 w-1/3 rounded-full"></div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-8 lg:p-14 flex-1 flex flex-col gap-10">
              <div className="flex flex-col gap-3">
                <div className="w-48 h-8 bg-neutral-200 rounded-lg"></div>
                <div className="w-full h-4 bg-neutral-100 rounded-md"></div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="w-full h-[72px] bg-neutral-50 rounded-2xl border border-neutral-100"></div>
                <div className="w-full h-[72px] bg-neutral-50 rounded-2xl border border-neutral-100"></div>
                <div className="flex gap-4">
                  <div className="flex-1 h-[72px] bg-neutral-50 rounded-2xl border border-neutral-100"></div>
                  <div className="flex-1 h-[72px] bg-neutral-50 rounded-2xl border border-neutral-100"></div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <div className="w-full h-14 bg-neutral-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
