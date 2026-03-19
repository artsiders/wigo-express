import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center p-4 selection:bg-black selection:text-white">
      <LoginForm />
    </div>
  );
}
