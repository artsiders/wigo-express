"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { IoCloseOutline } from "react-icons/io5";
import RideSearchWidget from "./RideSearchWidget";

interface RideSearchPopupProps {
  initialOpen: boolean;
}

export default function RideSearchPopup({ initialOpen }: RideSearchPopupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isRendered, setIsRendered] = useState(initialOpen);

  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Sync state with URL parameter if it changes
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
      // Setup timeline
      const tl = gsap.timeline({ paused: true, onReverseComplete: onClosed });
      tlRef.current = tl;

      // Overlay animation (fade in and blur)
      tl.to(
        overlayRef.current,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0
      );

      // Container wrap animation (scale and fade)
      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" },
        0.1
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

    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has("searchOpen")) {
      currentUrl.searchParams.delete("searchOpen");
      router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
    }
  };

  if (!isRendered) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-200 flex items-center justify-center bg-dark-900/60 backdrop-blur-md opacity-0 p-4"
    >
      <div className="absolute inset-0 cursor-pointer" onClick={closePopup} />
      
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-5xl"
      >
        <button
          onClick={closePopup}
          className="absolute -top-12 right-0 md:-right-4 md:-top-14 w-11 h-11 bg-white/10 hover:bg-white/20 hover:scale-110 border border-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg z-50"
        >
          <IoCloseOutline size={26} />
        </button>

        {/* The Search Widget */}
        <div className="overflow-visible">
          <RideSearchWidget variant="horizontal" onSearchSubmit={closePopup} />
        </div>
      </div>
    </div>
  );
}
