"use client";

import { useState, Suspense } from "react"; // 1. Import Suspense
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// 2. Move all logic into a separate component
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      window.location.href = redirect;
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-primary";
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground py-2 rounded-lg font-medium transition"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-muted-foreground text-sm">
        No account?{" "}
        <Link href="/register" className="text-primary hover:underline">Register</Link>
      </p>
    </div>
  );
}

// 3. Export the main page wrapped in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
