"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { IoCloseOutline } from "react-icons/io5";
import RideSearchWidget from "./RideSearchWidget";

// 1. Mise à jour de l'interface pour accepter onClose
interface RideSearchPopupProps {
  initialOpen: boolean;
  onClose?: () => void;
}

export default function RideSearchPopup({
  initialOpen,
  onClose,
}: RideSearchPopupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isRendered, setIsRendered] = useState(initialOpen);

  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const isParamOpen = searchParams?.get("searchOpen") === "true";
    if (isParamOpen && !isOpen) {
      setIsRendered(true);
      setIsOpen(true);
    }
  }, [searchParams, isOpen]);

  useLayoutEffect(() => {
    if (!isRendered) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => onClosed(), // Utilisation d'une arrow function pour plus de sûreté
      });
      tlRef.current = tl;

      tl.to(
        overlayRef.current,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0,
      );

      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" },
        0.1,
      );
    });

    return () => ctx.revert();
  }, [isRendered]);

  useEffect(() => {
    if (isOpen && tlRef.current) {
      document.body.style.overflow = "hidden";
      tlRef.current.play();
    }
  }, [isOpen]);

  const closePopup = () => {
    if (tlRef.current) {
      tlRef.current.reverse();
    } else {
      onClosed();
    }
  };

  const onClosed = () => {
    setIsOpen(false);
    setIsRendered(false);
    document.body.style.overflow = "";

    // Nettoyage de l'URL
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has("searchOpen")) {
      currentUrl.searchParams.delete("searchOpen");
      router.replace(currentUrl.pathname + currentUrl.search, {
        scroll: false,
      });
    }

    // 2. IMPORTANT : On prévient le parent que le popup est fermé
    if (onClose) {
      onClose();
    }
  };

  if (!isRendered) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-dark-900/60 backdrop-blur-md opacity-0 p-4"
    >
      {/* Overlay click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={closePopup} />

      <div ref={containerRef} className="relative z-10 w-full max-w-5xl">
        <button
          onClick={closePopup}
          className="absolute -top-12 right-0 w-11 h-11 bg-white/10 hover:bg-white/20 hover:scale-110 border border-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg z-50"
        >
          <IoCloseOutline size={26} />
        </button>

        <div className="overflow-visible relative z-20">
          <RideSearchWidget variant="horizontal" onSearchSubmit={closePopup} />
        </div>
      </div>
    </div>
  );
}
