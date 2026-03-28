"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { LuCamera, LuLoaderCircle, LuUpload } from "react-icons/lu";
import axios from "axios";

interface ProfileImageUploadProps {
  currentImage?: string | null;
  onFileSelect: (file: File) => void;
}

export default function ProfileImageUpload({
  currentImage,
  onFileSelect,
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local validation for better UX
    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (max 5Mo)");
      return;
    }

    // Show local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Pass the file to the parent, but don't upload yet
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-neutral-100 flex items-center justify-center relative transition-transform duration-500 hover:scale-[1.02]">
          {preview ? (
            <Image
              src={preview}
              alt="Profile Preview"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex flex-col items-center text-neutral-300">
              <LuCamera size={48} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-primary text-white p-3 rounded-full border-4 border-white shadow-xl hover:bg-primary-600 transition-all active:scale-90 flex items-center justify-center group/btn"
          title="Changer la photo"
        >
          <LuUpload
            size={20}
            className="group-hover/btn:-translate-y-0.5 transition-transform"
          />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
      />

      <div className="text-center text-neutral-400">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">
          Format JPG, PNG ou WebP
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest mt-1">
          L'envoi se fera à la validation
        </p>
      </div>
    </div>
  );
}
