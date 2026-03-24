import React, { ReactNode, useEffect } from "react";
import {
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
} from "react-icons/io5";

export type AlertType = "error" | "info" | "success" | "warning";

export interface AlertDialogProps {
  isOpen: boolean;
  type: AlertType;
  title: string | ReactNode;
  description: string | ReactNode;
  onClose: () => void;
  confirmText?: string;
  onConfirm?: () => void;
}

export default function AlertDialog({
  isOpen,
  type,
  title,
  description,
  onClose,
  confirmText = "Fermer",
  onConfirm
}: AlertDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const config = {
    error: {
      icon: IoWarningOutline,
      iconColor: "text-red-500",
      shadow: "0 8px 16px rgba(239, 68, 68, 0.25)",
      glowColor: "rgba(239, 68, 68, 0.15)",
      btnClass: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
    },
    info: {
      icon: IoInformationCircleOutline,
      iconColor: "text-indigo-500",
      shadow: "0 8px 16px rgba(99, 102, 241, 0.25)",
      glowColor: "rgba(99, 102, 241, 0.15)",
      btnClass: "bg-primary hover:bg-dark text-white shadow-primary/20"
    },
    success: {
      icon: IoCheckmarkCircleOutline,
      iconColor: "text-green-500",
      shadow: "0 8px 16px rgba(34, 197, 94, 0.25)",
      glowColor: "rgba(34, 197, 94, 0.15)",
      btnClass: "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20"
    },
    warning: {
      icon: IoWarningOutline,
      iconColor: "text-amber-500",
      shadow: "0 8px 16px rgba(245, 158, 11, 0.25)",
      glowColor: "rgba(245, 158, 11, 0.15)",
      btnClass: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
    },
  }[type];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-dark-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl ring-4 ring-white border border-dark/5 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: `radial-gradient(circle at top, ${config.glowColor} 0%, transparent 400px)` }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full bg-white ring-4 ring-white border border-dark/5 flex items-center justify-center shrink-0 mb-6"
            style={{ boxShadow: config.shadow }}
          >
            <Icon className={`text-3xl ${config.iconColor}`} />
          </div>

          <h4 className="text-2xl font-black text-dark mb-3 leading-tight tracking-tight">
            {title}
          </h4>
          <p className="text-neutral-500 font-medium mb-8">
            {description}
          </p>

          <button
            onClick={onConfirm || onClose}
            className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl ${config.btnClass}`}
          >
            {confirmText}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-neutral-400 hover:text-dark bg-neutral-100/50 hover:bg-neutral-100 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        >
          <IoCloseOutline size={22} />
        </button>
      </div>
    </div>
  );
}
