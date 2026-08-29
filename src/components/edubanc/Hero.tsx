import React from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* decorative circles */}
      <div className="pointer-events-none absolute -top-16 right-20 h-64 w-64 rounded-full bg-orange-500/40" />
      <div className="pointer-events-none absolute bottom-35 left-25 h-72 w-72 rounded-full bg-primary/80/30" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-28 pt-14 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white">
          Educat <span className="opacity-60">×</span> <span><img src="/edbanc.svg" alt="" className="w-13" /></span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">
            Official Partnership
          </span>
        </span>

        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
          Schools run better.
          <br />
          <span className="italic font-medium">Fees get paid.</span>
          <br />
          Everyone wins.
        </h1>

        <p className="mt-6 max-w-xl text-sm text-orange-50/90 sm:text-base">
          Educat and Edubanc have partnered to eliminate the biggest obstacle in
          Nigerian education - unpaid school fees. Schools get paid in full,
          parents pay in installments. Students stay in class.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#get-started" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-orange-50">
            Get Started - It's Free
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            See How It Works
          </a>
        </div>
      </div>

      {/* bottom curve */}
      <svg
        className="absolute bottom-0 left-0 w-full text-white"
        viewBox="0 0 1440 80"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0,80 C480,0 960,0 1440,80 L1440,80 L0,80 Z" />
      </svg>
    </section>
  );
}
