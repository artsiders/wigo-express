import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-4 w-16 bg-neutral-200 rounded"></div>
        <div className="h-4 w-4 bg-neutral-100 rounded"></div>
        <div className="h-4 w-24 bg-neutral-200 rounded"></div>
      </div>

      {/* SectionHeader Skeleton */}
      <div className="flex justify-between items-start mb-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-neutral-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-neutral-100 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-neutral-200 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Sidebar Skeleton */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-dark rounded-2xl p-8 shadow-2xl border border-neutral-800 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-neutral-800 border-4 border-neutral-700"></div>
              <div className="mt-6 h-8 w-40 bg-neutral-800 rounded"></div>
              <div className="mt-2 h-6 w-32 bg-neutral-800/50 rounded-full"></div>

              <div className="grid grid-cols-2 gap-4 w-full mt-10">
                <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 space-y-2">
                  <div className="h-3 w-12 bg-neutral-700 rounded mx-auto"></div>
                  <div className="h-6 w-8 bg-neutral-600 rounded mx-auto"></div>
                </div>
                <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 space-y-2">
                  <div className="h-3 w-12 bg-neutral-700 rounded mx-auto"></div>
                  <div className="h-6 w-12 bg-neutral-600 rounded mx-auto"></div>
                </div>
              </div>
            </div>
          </div>

          <section className="bg-white border border-zinc-100 rounded-xl p-5 space-y-4 animate-pulse">
            <div className="h-3 w-24 bg-neutral-100 rounded uppercase tracking-widest"></div>
            <div className="space-y-3">
              <div className="h-12 w-full bg-neutral-50 border border-neutral-100 rounded-md"></div>
              <div className="h-12 w-full bg-neutral-50 border border-neutral-100 rounded-md"></div>
            </div>
          </section>
        </aside>

        {/* Main Content Area Skeleton */}
        <div className="lg:col-span-8 space-y-8 animate-pulse">
          {/* Action Card Skeleton */}
          <div className="bg-neutral-100 rounded-2xl p-8 h-40"></div>

          {/* Vehicle Section Skeleton */}
          <section className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-50 flex justify-between items-center">
              <div className="h-5 w-40 bg-neutral-200 rounded"></div>
              <div className="h-8 w-20 bg-neutral-100 rounded"></div>
            </div>
            <div className="p-6 space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-neutral-100 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-neutral-200 rounded"></div>
                    <div className="h-3 w-24 bg-neutral-100 rounded"></div>
                    <div className="h-4 w-16 bg-neutral-50 rounded mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Section Skeleton */}
          <section className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-50">
              <div className="h-5 w-40 bg-neutral-200 rounded"></div>
            </div>
            <div className="p-12 flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-neutral-50 rounded-full border border-neutral-100"></div>
              <div className="h-5 w-48 bg-neutral-100 rounded"></div>
              <div className="h-4 w-64 bg-neutral-50 rounded"></div>
              <div className="h-10 w-48 bg-neutral-200 rounded-md mt-2"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
