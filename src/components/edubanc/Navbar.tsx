import React from "react";
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <Link to={'/'}>Educat</Link>
          <span className="text-neutral-300">×</span>
          <Link to={'https://edubanc.ng'} target="_blank" className="text-lg font-bold tracking-tight">
            <img src="/edbanc.svg" alt="" className="w-18" />
          </Link>
        </div>

        <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary/80">
          Get Started
        </button>
      </div>
    </header>
  );
}
