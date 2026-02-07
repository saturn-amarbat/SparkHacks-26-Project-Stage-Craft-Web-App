import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 px-4 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex items-center justify-between text-sm text-purple-200">
          <Link
            href="/"
            className="font-semibold text-amber-300 hover:text-amber-200"
          >
            StageCraft
          </Link>
          <Link href="/marketplace" className="hover:text-white">
            Back to marketplace
          </Link>
        </div>

        <div className="grid w-full gap-8 rounded-2xl border border-purple-800/30 bg-slate-900/50 p-6 shadow-2xl backdrop-blur md:grid-cols-[1.1fr_1fr] md:p-10">
          <div className="flex flex-col justify-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                Welcome back
              </h1>
              <p className="mt-3 text-purple-200">
                Sign in to manage your rentals.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-purple-800/30 bg-slate-950/60 p-6 md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-white">Sign in</h2>
              <p className="mt-1 text-sm text-purple-300">
                Use your email and password.
              </p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-purple-300">
                Don&apos;t have an account?{" "}
              </span>
              <Link
                href="/signup"
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
