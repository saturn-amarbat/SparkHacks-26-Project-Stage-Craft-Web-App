"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/marketplace";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setInfo("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (!data.session) {
        setInfo("Sign-in needs email confirmation. Check your inbox.");
        setIsLoading(false);
        return;
      }

      // Redirect back to where they came from, or marketplace
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Enter your email to receive a reset link.");
      return;
    }

    setIsResetting(true);
    setError("");
    setInfo("");

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setError("Supabase env vars are missing. Add them to .env.local.");
      setIsResetting(false);
      return;
    }

    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/login`,
      });

      if (error) {
        setError(error.message);
      } else {
        setInfo("Password reset email sent. Check your inbox.");
      }
    } catch {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {info && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded">
          {info}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-purple-200">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-400 focus-visible:ring-amber-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-purple-200">
            Password
          </Label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-xs text-amber-300 hover:text-amber-200"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-400 focus-visible:ring-amber-400"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-purple-200">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-purple-700 bg-slate-900 text-amber-400 focus:ring-amber-400"
            defaultChecked
          />
          Keep me signed in
        </label>
        <button
          type="button"
          onClick={handleResetPassword}
          disabled={isResetting}
          className="text-amber-300 hover:text-amber-200 disabled:opacity-60"
        >
          {isResetting ? "Sending..." : "Forgot password?"}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 shadow-lg shadow-amber-500/20"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
