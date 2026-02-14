"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: 'no-store' });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [pathname]); // Re-check whenever page changes

  async function handleLogout() {
    try {
      setLoading(true); // Show loading while logging out
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      
      // Force a full refresh to clear any server-side caches
      router.push("/");
      router.refresh(); 
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg text-blue-300 hover:text-white transition">
          CivicBridge
        </Link>
        
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-slate-300 hover:text-white transition text-sm font-medium"
          >
            Dashboard
          </Link>

          {/* Loading Guard: Prevents showing the wrong buttons 
            while the session is being verified.
          */}
          {!loading && (
            <>
              {user ? (
                <>
                  {user.role === "resident" && (
                    <Link
                      href="/submit"
                      className="text-slate-300 hover:text-white transition text-sm font-medium"
                    >
                      Report Issue
                    </Link>
                  )}
                  {user.role === "official" && (
                    <Link
                      href="/official"
                      className="text-slate-300 hover:text-white transition text-sm font-medium"
                    >
                      Official Dashboard
                    </Link>
                  )}
                  <span className="text-slate-400 text-sm hidden md:inline">
                    {user.name?.split(" ")[0]} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-300 transition text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-300 hover:text-white transition text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-md text-sm font-medium transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}