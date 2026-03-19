import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center p-4 selection:bg-black selection:text-white">
      <RegisterForm />
    </div>
  );
}
