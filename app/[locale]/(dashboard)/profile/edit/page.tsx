"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useRouter } from "@/i18n/routing";
import {
  LuUser,
  LuMail,
  LuText,
  LuCheck,
  LuX,
  LuLoaderCircle,
} from "react-icons/lu";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import LargeInput from "@/components/ui/LargeInput";
import Alert from "@/components/ui/Alert";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";

import axios from "axios";

interface ProfileFormValues {
  name: string;
  bio: string;
  image: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfile = useUpdateProfile();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      bio: "",
      image: "",
    },
  });

  const currentImageUrl = watch("image");

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        bio: profile.bio || "",
        image: profile.image || "",
      });
    }
  }, [profile, reset]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="p-8 text-center">
        <Alert
          type="error"
          title="Erreur"
          description="Impossible de charger votre profil."
        />
        <button
          onClick={() => router.push("/profile")}
          className="btn-dark mt-4"
        >
          Retour au profil
        </button>
      </div>
    );
  }

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      let finalImageUrl = data.image;

      // First, handle image upload if a new file was selected
      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder", "profile");

        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalImageUrl = uploadRes.data.url;
      }

      // Then update the profile with the (possibly new) image URL
      await updateProfile.mutateAsync({
        ...data,
        image: finalImageUrl,
      });
      
      router.push("/profile");
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Mon Profil", href: "/profile" },
          { label: "Modifier" },
        ]}
      />

      <SectionHeader
        title="Modifier mon profil"
        description="Mettez à jour vos informations personnelles pour que la communauté puisse mieux vous connaître."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto w-full space-y-8 animate-fade-in"
      >
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-neutral-100 space-y-10">
          {/* Unité d'upload d'image */}
          <div className="flex justify-center pb-4 border-b border-neutral-50">
            <ProfileImageUpload
              currentImage={currentImageUrl}
              onFileSelect={(file) => {
                setSelectedFile(file);
                // Mark form as dirty so Save button enables
                setValue("image", "new-file-pending", { shouldDirty: true });
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <LargeInput
              label="Nom Complet"
              icon={<LuUser />}
              placeholder="Votre nom"
              {...register("name", { required: "Le nom est requis" })}
            />

            <div className="relative flex-1 w-full bg-light-400 rounded-xl min-h-20 h-20 flex items-center px-6 border border-neutral-300 opacity-60 cursor-not-allowed">
              <LuMail className="text-xl text-neutral-400 shrink-0" />
              <div className="ml-3 flex flex-col justify-center">
                <span className="block text-sm font-bold text-neutral-500 uppercase tracking-widest pointer-events-none">
                  Email (Non modifiable)
                </span>
                <span className="text-dark font-medium">{profile.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 uppercase tracking-widest px-1">
              Bio / Présentation
            </label>
            <div className="relative bg-light-400 rounded-xl border border-neutral-300 focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all p-4 group">
              <LuText className="absolute top-5 left-6 text-xl text-neutral-700 group-focus-within:text-primary transition-colors" />
              <textarea
                className="w-full bg-transparent text-dark outline-none placeholder:text-neutral-500 min-h-[120px] pl-10 pr-2 py-1 resize-none font-medium text-base"
                placeholder="Dites-nous en un peu plus sur vous, vos habitudes de conduite..."
                {...register("bio")}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={updateProfile.isPending || isUploading || !isDirty}
              className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-black transition-all ${
                !isDirty || updateProfile.isPending || isUploading
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-dark text-white hover:bg-primary shadow-lg shadow-primary/10 active:scale-95"
              }`}
            >
              {updateProfile.isPending || isUploading ? (
                <LuLoaderCircle className="animate-spin" size={20} />
              ) : (
                <LuCheck size={20} />
              )}
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="px-8 h-14 border border-neutral-200 text-neutral-600 font-bold rounded-xl hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
            >
              <LuX size={18} />
              Annuler
            </button>
          </div>
        </div>

        {(updateProfile.isError || isError) && (
          <Alert
            type="error"
            title="Erreur lors de la mise à jour"
            description="Une erreur est survenue lors de l'enregistrement de vos modifications. Veuillez réessayer."
          />
        )}
      </form>
    </div>
  );
}
