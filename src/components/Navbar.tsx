import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Rocket, Compass, LayoutGrid, User, Plus, LogOut, LogIn } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import { useFirebase } from "../contexts/FirebaseContext";
import { signIn, signOut } from "../firebase";

export const Navbar = () => {
  const location = useLocation();
  const { user, loading } = useFirebase();
  
  const navItems = [
    { label: "Explore", path: "/explore", icon: Compass },
    { label: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-600 to-cyan-600 group-hover:rotate-12 transition-transform">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">VibePort</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
                location.pathname === item.path ? "text-white" : "text-zinc-400"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/submit">
                <Button size="sm" className="hidden sm:flex gap-2">
                  <Plus className="h-4 w-4" />
                  Share Build
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="group relative">
                  <img 
                    src={user.photoURL || ""} 
                    className="h-8 w-8 rounded-full border border-zinc-700 cursor-pointer hover:border-violet-500 transition-colors" 
                    alt={user.displayName || "User"} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute right-0 top-full hidden group-hover:block w-48 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-50">
                    <Link 
                      to="/dashboard"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all mb-1"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link 
                      to={`/maker/${user.uid}`}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all mb-1"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <div className="h-px bg-zinc-800 my-1" />
                    <button 
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn()} className="gap-2" isLoading={loading}>
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
