import React from "react";
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-neutral-950 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-neutral-400 sm:flex-row">
        <div className="flex items-center gap-2 font-medium text-white">
          <Link to={'/'}>Educat</Link>
          <span className="text-neutral-600">×</span>
          <span className="font-bold"><img src="/edbanc.svg" alt="" className="w-18 bg-white p-1 rounded" /></span>
        </div>

        <p className="text-center">
          © 2026 Educat &amp; Edubanc Partnership. All rights reserved.
          Committed to making education accessible across Nigeria.
        </p>

        <div className="flex items-center gap-4">
          <a href="https://educatonline.com" className="hover:text-white">
            educatonline.com
          </a>
          <a href="https://edubanc.ng" className="hover:text-white">
            edubanc.ng
          </a>
        </div>
      </div>
    </footer>
  );
}
