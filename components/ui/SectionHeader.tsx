import React from "react";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  bgImageUrl?: string;
}

export default function SectionHeader({
  title,
  description,
  action,
  bgImageUrl = "/images/hero-image.webp",
}: SectionHeaderProps) {
  return (
    <header className="relative bg-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-neutral-200 overflow-hidden">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={bgImageUrl}
          alt=""
          className="w-full h-full object-cover object-center opacity-30"
          draggable={false}
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-primary-500 to-primary-700/50" />
      </div>
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="relative z-10 flex-1">
        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-neutral-200 font-medium mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="relative z-10 shrink-0 w-full md:w-auto mt-2 md:mt-0 flex md:block">
          {action}
        </div>
      )}
    </header>
  );
}
