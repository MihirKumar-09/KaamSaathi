import { Suspense } from "react";
import RegisterForm from "@/components/auth/Register";

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#111827] text-white">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
