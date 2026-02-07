"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (!data.session) {
        setInfo("Account created! Check your email to confirm and sign in.");
        setIsLoading(false);
        return;
      }

      setInfo("Account created! Redirecting...");

      // Redirect to marketplace or the original requested page after successful signup
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
      setIsLoading(false);
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
        <Label htmlFor="fullName" className="text-purple-200">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          className="bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-400 focus-visible:ring-amber-400"
        />
      </div>

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
          minLength={6}
          autoComplete="new-password"
          className="bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-400 focus-visible:ring-amber-400"
        />
        <p className="text-xs text-purple-400">At least 6 characters.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-purple-200">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-400 focus-visible:ring-amber-400"
        />
        <p className="text-xs text-purple-400">
          Make sure it matches your password.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 shadow-lg shadow-amber-500/20"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
