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
import { useSession } from "next-auth/react";
import axios from "axios";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  bio: string;
  image: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const { update } = useSession();
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
      firstName: "",
      lastName: "",
      bio: "",
      image: "",
    },
  });

  const currentImageUrl = watch("image");

  useEffect(() => {
    if (profile) {
      // Split name into firstName and lastName
      const nameParts = (profile.name || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      reset({
        firstName,
        lastName,
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

      // Handle image upload if a new file was selected
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

      // Join name parts
      const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

      // Update in DB
      await updateProfile.mutateAsync({
        name: fullName,
        bio: data.bio,
        image: finalImageUrl,
      });

      // Update session
      await update({
        name: fullName,
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
        className="container mx-auto w-full space-y-8 animate-fade-in"
      >
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-neutral-100">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Column: Image Upload & Preview */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="sticky top-32 space-y-6 flex flex-col items-center w-full">
                <div className="p-2 bg-neutral-50 rounded-full border border-neutral-100 shadow-inner">
                  <ProfileImageUpload
                    currentImage={currentImageUrl}
                    onFileSelect={(file) => {
                      setSelectedFile(file);
                      setValue("image", "new-file-pending", { shouldDirty: true });
                    }}
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-black text-dark">Photo de profil</h3>
                  <p className="text-sm text-neutral-500 font-medium max-w-[200px] leading-relaxed">
                    Une photo claire aide les autres membres à vous reconnaître.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Information Fields */}
            <div className="lg:col-span-8 space-y-10">
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] pb-2 border-b border-neutral-100">
                  Informations Générales
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <LargeInput
                    label="Prénom"
                    icon={<LuUser />}
                    placeholder="Votre prénom"
                    {...register("firstName", { required: "Le prénom est requis" })}
                  />
                  <LargeInput
                    label="Nom"
                    icon={<LuUser />}
                    placeholder="Votre nom"
                    {...register("lastName", { required: "Le nom est requis" })}
                  />
                </div>

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

              <div className="space-y-6">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] pb-2 border-b border-neutral-100">
                  À propos de vous
                </h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 uppercase tracking-widest px-1">
                    Bio / Présentation
                  </label>
                  <div className="relative bg-light-400 rounded-xl border border-neutral-300 focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all p-5 group">
                    <LuText className="absolute top-6 left-6 text-xl text-neutral-700 group-focus-within:text-primary transition-colors" />
                    <textarea
                      className="w-full bg-transparent text-dark outline-none placeholder:text-neutral-500 min-h-[140px] pl-10 pr-2 py-1 resize-none font-medium text-base leading-relaxed"
                      placeholder="Partagez vos goûts musicaux, vos sujets de discussion préférés en voiture..."
                      {...register("bio")}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={updateProfile.isPending || isUploading || !isDirty}
                  className={`flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl font-black transition-all ${
                    !isDirty || updateProfile.isPending || isUploading
                      ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      : "bg-dark text-white hover:bg-primary shadow-xl shadow-primary/20 active:scale-95"
                  }`}
                >
                  {updateProfile.isPending || isUploading ? (
                    <LuLoaderCircle className="animate-spin" size={24} />
                  ) : (
                    <LuCheck size={24} />
                  )}
                  Enregistrer les modifications
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="px-10 h-16 border-2 border-neutral-100 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <LuX size={18} />
                  Annuler
                </button>
              </div>
            </div>
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
