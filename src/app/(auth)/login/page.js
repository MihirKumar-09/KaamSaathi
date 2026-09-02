import { Suspense } from "react";
import LoginPage from "@/components/auth/Login";

export const dynamic = "force-dynamic";

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
          Loading...
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
