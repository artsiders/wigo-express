import React from "react";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <header className="relative bg-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-neutral-200 overflow-hidden mb-8">
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="relative z-10 flex-1">
        <div className="w-8 h-1.5 bg-primary rounded-full mb-4"></div>
        <h1 className="text-3xl lg:text-4xl font-black text-dark tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-neutral-500 font-medium mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
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
