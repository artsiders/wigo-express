import React, { ReactNode } from "react";
import {
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
} from "react-icons/io5";

export type AlertType = "error" | "info" | "success" | "warning";

export interface AlertProps {
  type: AlertType;
  title: string | ReactNode;
  description: string | ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  type,
  title,
  description,
  onClose,
  className = "",
}: AlertProps) {
  // Utilisation des icônes outlined (Io*Outline)
  const config = {
    error: {
      icon: IoWarningOutline,
      iconColor: "text-red-500",
      shadow: "0 8px 16px rgba(239, 68, 68, 0.25)",
      gridColor: "rgba(239, 68, 68, 0.20)",
      glowColor: "rgba(239, 68, 68, 0.15)",
    },
    info: {
      icon: IoInformationCircleOutline,
      iconColor: "text-indigo-500",
      shadow: "0 8px 16px rgba(99, 102, 241, 0.25)",
      gridColor: "rgba(99, 102, 241, 0.20)",
      glowColor: "rgba(99, 102, 241, 0.15)",
    },
    success: {
      icon: IoCheckmarkCircleOutline,
      iconColor: "text-green-500",
      shadow: "0 8px 16px rgba(34, 197, 94, 0.25)",
      gridColor: "rgba(34, 197, 94, 0.20)",
      glowColor: "rgba(34, 197, 94, 0.15)",
    },
    warning: {
      icon: IoWarningOutline,
      iconColor: "text-amber-500",
      shadow: "0 8px 16px rgba(245, 158, 11, 0.25)",
      gridColor: "rgba(245, 158, 11, 0.20)",
      glowColor: "rgba(245, 158, 11, 0.15)",
    },
  }[type] || {
    icon: IoInformationCircleOutline,
    iconColor: "text-indigo-500",
    shadow: "0 8px 16px rgba(99, 102, 241, 0.25)",
    gridColor: "rgba(99, 102, 241, 0.20)",
    glowColor: "rgba(99, 102, 241, 0.15)",
  };

  const Icon = config.icon;

  return (
    <div
      className={`relative bg-white rounded-3xl p-5 md:p-6 pr-14 flex items-start shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-4 ring-white border border-dark/5 overflow-hidden w-full ${className}`}
    >
      {/* Decorative Glow Only */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at top left, ${config.glowColor} 0%, transparent 400px)`,
          maskImage: "linear-gradient(to right, black 0%, transparent 450px)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, transparent 450px)",
        }}
      />

      {/* Floating Icon Wrapper */}
      <div
        className="relative z-10 w-12 h-12 rounded-full bg-white ring-4 ring-white border border-dark/5 flex items-center justify-center shrink-0 mt-0.5"
        style={{ boxShadow: config.shadow }}
      >
        <Icon className={`text-xl ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 ml-5 flex-1 pt-1">
        <h4 className="text-[17px] font-bold text-neutral-900 mb-1.5 leading-tight tracking-tight">
          {title}
        </h4>
        <p className="text-[15px] text-neutral-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-neutral-400 hover:text-neutral-800 bg-neutral-100/50 hover:bg-neutral-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <IoCloseOutline size={18} />
        </button>
      )}
    </div>
  );
}
