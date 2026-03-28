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
import ProfileEditSkeleton from "@/components/ui/ProfileEditSkeleton";
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
    return <ProfileEditSkeleton />;
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
      const fullName =
        `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

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
        <div className="bg-white rounded-2xl p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-neutral-100">
          <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
            {/* Left Column: Image Upload & Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="sticky top-32 space-y-10 flex flex-col items-center w-full">
                <div className="relative">
                  {/* Decorative Background for the Avatar */}
                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                  <ProfileImageUpload
                    currentImage={currentImageUrl}
                    onFileSelect={(file) => {
                      setSelectedFile(file);
                      setValue("image", "new-file-pending", {
                        shouldDirty: true,
                      });
                    }}
                  />
                </div>
                <div className="text-center space-y-4 max-w-[280px]">
                  <h3 className="text-2xl font-bold text-dark tracking-tight">
                    Votre photo
                  </h3>
                  <p className="text-base text-neutral-500 font-medium leading-relaxed">
                    Une photo authentique et amicale augmente vos chances de
                    trouver des partenaires de trajet.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Information Fields */}
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <LuUser size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-dark uppercase tracking-[0.2em]">
                    Identité
                  </h4>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <LargeInput
                    label="Prénom"
                    icon={<LuUser />}
                    placeholder="Votre prénom"
                    {...register("firstName", {
                      required: "Le prénom est requis",
                    })}
                  />
                  <LargeInput
                    label="Nom"
                    icon={<LuUser />}
                    placeholder="Votre nom"
                    {...register("lastName", { required: "Le nom est requis" })}
                  />
                </div>

                <div className="relative flex-1 w-full bg-neutral-50 rounded-2xl min-h-[80px] flex items-center px-6 border border-neutral-200 opacity-60 cursor-not-allowed">
                  <LuMail className="text-xl text-neutral-400 shrink-0" />
                  <div className="ml-4 flex flex-col justify-center">
                    <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                      Compte
                    </span>
                    <span className="text-dark font-semibold text-base">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <LuText size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-dark uppercase tracking-[0.2em]">
                    Description
                  </h4>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1 ml-1">
                    Bio & Préférences
                  </label>
                  <div className="relative bg-neutral-50 rounded-2xl border border-neutral-200 focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-8 focus-within:ring-primary-500/5 transition-all p-6 group">
                    <LuText className="absolute top-7 left-6 text-xl text-neutral-400 group-focus-within:text-primary transition-colors" />
                    <textarea
                      className="w-full bg-transparent text-dark outline-none placeholder:text-neutral-400 min-h-[160px] pl-10 pr-2 py-1 resize-none font-medium text-lg leading-relaxed"
                      placeholder="Comment décririez-vous vos trajets ? Plutôt bavard ou mélomane ?"
                      {...register("bio")}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-10 flex flex-col sm:flex-row gap-5">
                <button
                  type="submit"
                  disabled={updateProfile.isPending || isUploading || !isDirty}
                  aria-disabled={
                    updateProfile.isPending || isUploading || !isDirty
                  }
                  className="btn-primary w-full"
                >
                  {updateProfile.isPending ||
                    (isUploading && (
                      <LuLoaderCircle className="animate-spin" size={24} />
                    ))}
                  Sauvegarder les modifications
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="px-10 h-16 border-2 border-neutral-100 text-neutral-500 font-semibold rounded-2xl hover:bg-neutral-100 hover:text-dark transition-all flex items-center justify-center gap-2 active:scale-95"
                >
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
