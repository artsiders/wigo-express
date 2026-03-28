"use client";

import React from "react";

export default function ProfileEditSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 bg-neutral-200 rounded-full"></div>

      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-1/3 bg-neutral-200 rounded-xl"></div>
        <div className="h-4 w-2/3 bg-neutral-100 rounded-lg"></div>
      </div>

      <div className="bg-white rounded-4xl p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-neutral-100">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* Left Column Skeleton: Photo */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-32 space-y-10 flex flex-col items-center w-full">
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-neutral-100 border-4 border-white shadow-xl flex items-center justify-center">
                <div className="w-16 h-16 bg-neutral-200 rounded-2xl"></div>
              </div>
              <div className="text-center space-y-4 w-full flex flex-col items-center">
                <div className="h-8 w-32 bg-neutral-200 rounded-lg"></div>
                <div className="h-4 w-48 bg-neutral-100 rounded-md"></div>
                <div className="h-4 w-32 bg-neutral-100 rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton: Form Fields */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-100"></div>
                <div className="h-4 w-24 bg-neutral-200 rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-20 bg-neutral-50 rounded-2xl border border-neutral-100"></div>
                <div className="h-20 bg-neutral-50 rounded-2xl border border-neutral-100"></div>
              </div>

              <div className="h-20 bg-neutral-50 rounded-2xl border border-neutral-100"></div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-100"></div>
                <div className="h-4 w-32 bg-neutral-200 rounded-full"></div>
              </div>

              <div className="space-y-3">
                <div className="h-4 w-24 bg-neutral-100 rounded-full ml-1"></div>
                <div className="h-40 bg-neutral-50 rounded-2xl border border-neutral-100"></div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="pt-10 flex flex-col sm:flex-row gap-5">
              <div className="flex-1 h-16 bg-neutral-200 rounded-2xl"></div>
              <div className="w-32 h-16 bg-neutral-50 rounded-2xl border border-neutral-100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
