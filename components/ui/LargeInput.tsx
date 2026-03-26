import React, { useRef, useImperativeHandle } from "react";

export interface LargeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label: string;
  containerClassName?: string;
  children?: React.ReactNode;
}

export const LargeInput = React.forwardRef<HTMLInputElement, LargeInputProps>(
  ({ icon, label, containerClassName = "", className = "", children, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't focus if clicking on interactive elements inside children
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest(".dropdown-content") || target.closest("[role='dialog']")) {
         return;
      }
      innerRef.current?.focus();
    };

    return (
      <div
        onClick={handleContainerClick}
        className={`relative flex-1 w-full bg-light-400 rounded-xl min-h-20 h-20 flex items-center px-6 border border-neutral-300 focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all shadow-inner shrink-0 group ${containerClassName}`}
      >
        {icon && (
          <div className="text-xl text-neutral-700 group-focus-within:text-primary transition-colors shrink-0 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="ml-3 w-full text-left flex flex-col justify-center h-full">
          <span className="block text-sm font-bold text-neutral-700 uppercase tracking-widest mt-0.5 pointer-events-none">
            {label}
          </span>
          <input
            ref={innerRef}
            className={`w-full bg-transparent text-sm md:text-base text-dark outline-none placeholder:text-neutral-500 truncate py-1 ${className}`}
            {...props}
          />
        </div>
        {children}
      </div>
    );
  }
);
LargeInput.displayName = "LargeInput";

export interface LargeClickableInputProps {
  icon?: React.ReactNode;
  label: string;
  valueDisplay: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  isActive?: boolean;
  containerClassName?: string;
  children?: React.ReactNode;
}

export function LargeClickableInput({
  icon,
  label,
  valueDisplay,
  onClick,
  isActive,
  containerClassName = "",
  children,
}: LargeClickableInputProps) {
  return (
    <div
      onClick={onClick}
      className={`relative flex-1 w-full rounded-xl min-h-20 h-20 flex items-center px-6 border transition-all shadow-inner shrink-0 group cursor-pointer ${isActive ? "bg-white border-primary-500/40 ring-4 ring-primary-500/10" : "bg-light-400 border-neutral-300 hover:bg-neutral-200"} ${containerClassName}`}
    >
      {icon && (
        <div className={`text-xl shrink-0 transition-colors flex items-center justify-center ${isActive ? "text-primary" : "text-neutral-700 group-hover:text-primary"}`}>
          {icon}
        </div>
      )}
      <div className="ml-3 w-full text-left flex flex-col justify-center h-full pointer-events-none">
        <span className="block text-sm font-bold text-neutral-700 uppercase tracking-widest mt-0.5">
          {label}
        </span>
        <span className="block text-[13px] md:text-base font-bold truncate text-dark">
          {valueDisplay}
        </span>
      </div>
      {children}
    </div>
  );
}

export default LargeInput;
