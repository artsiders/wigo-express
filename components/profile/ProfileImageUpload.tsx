"use client";

import React, { useState, useRef, useEffect } from "react";
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

  // Synchroniser l'aperçu si l'image actuelle change (ex: après le chargement du profil)
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation locale
    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (max 5Mo)");
      return;
    }

    // Créer un aperçu local
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Passer le fichier au parent
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        {/* Avatar Container */}
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-neutral-100 flex items-center justify-center relative transition-all duration-500 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
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
              <LuCamera size={64} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-3 right-3 bg-primary text-white p-2 rounded-full border-2 border-white shadow-xl hover:bg-dark transition-all active:scale-90 flex items-center justify-center group/btn z-20"
          title="Modifier la photo"
        >
          <LuUpload size={22} className="" />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
      />

      <div className="text-center space-y-1">
        <p className="text-[11px] font-semibold text-dark uppercase tracking-[0.2em] opacity-30">
          Format JPG, PNG ou WebP
        </p>
        <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mt-1 bg-primary/5 px-3 py-1 rounded-full">
          Sauvegardé à la validation
        </p>
      </div>
    </div>
  );
}
