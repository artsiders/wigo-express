import React, { ReactNode } from 'react';
import { 
  IoWarning, 
  IoInformationCircle, 
  IoCheckmarkCircle, 
  IoClose 
} from 'react-icons/io5';

export type AlertType = 'error' | 'info' | 'success' | 'warning';

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
  className = '' 
}: AlertProps) {

  // We explicitly use standard RGBA values for gradients and shadows 
  // to ensure they always render perfectly regardless of the Tailwind theme config.
  const config = {
    error: {
      icon: IoWarning,
      iconColor: 'text-red-500',
      shadow: '0 8px 16px rgba(239, 68, 68, 0.25)',
      gridColor: 'rgba(239, 68, 68, 0.20)',
      glowColor: 'rgba(239, 68, 68, 0.15)',
    },
    info: {
      icon: IoInformationCircle,
      iconColor: 'text-indigo-500',
      shadow: '0 8px 16px rgba(99, 102, 241, 0.25)',
      gridColor: 'rgba(99, 102, 241, 0.20)',
      glowColor: 'rgba(99, 102, 241, 0.15)',
    },
    success: {
      icon: IoCheckmarkCircle,
      iconColor: 'text-green-500',
      shadow: '0 8px 16px rgba(34, 197, 94, 0.25)',
      gridColor: 'rgba(34, 197, 94, 0.20)',
      glowColor: 'rgba(34, 197, 94, 0.15)',
    },
    warning: {
      icon: IoWarning,
      iconColor: 'text-amber-500',
      shadow: '0 8px 16px rgba(245, 158, 11, 0.25)',
      gridColor: 'rgba(245, 158, 11, 0.20)',
      glowColor: 'rgba(245, 158, 11, 0.15)',
    }
  }[type] || {
    icon: IoInformationCircle,
    iconColor: 'text-indigo-500',
    shadow: '0 8px 16px rgba(99, 102, 241, 0.25)',
    gridColor: 'rgba(99, 102, 241, 0.20)',
    glowColor: 'rgba(99, 102, 241, 0.15)',
  };

  const Icon = config.icon;

  return (
    <div className={`relative bg-white rounded-3xl p-5 md:p-6 pr-14 flex items-start shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden w-full ${className}`}>
      
      {/* Decorative Grid & Glow - Implemented purely with CSS to guarantee exact 1:1 render with design */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at top left, ${config.glowColor} 0%, transparent 200px),
            linear-gradient(to right, ${config.gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${config.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 20px 20px, 20px 20px',
          backgroundPosition: '0 0, 0 0, 0 0',
          maskImage: 'linear-gradient(to right, black 0%, transparent 250px)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 250px)'
        }}
      />

      {/* Floating Icon Wrapper */}
      <div 
        className="relative z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5"
        style={{ boxShadow: config.shadow }}
      >
        <Icon className={`text-[24px] ${config.iconColor}`} />
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
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
}
