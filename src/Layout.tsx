import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-500/30 selection:text-violet-200">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-violet-600 to-cyan-600" />
            <span className="text-lg font-bold tracking-tighter">VibePort</span>
          </div>
          
          <div className="flex gap-8 text-sm text-zinc-500 font-medium">
            <a href="#" className="hover:text-zinc-300 transition-colors">Twitter</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Discord</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">GitHub</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
          </div>
          
          <p className="text-xs text-zinc-600">
            © 2026 VibePort. Built for AI Native Builders.
          </p>
        </div>
      </footer>
    </div>
  );
};
