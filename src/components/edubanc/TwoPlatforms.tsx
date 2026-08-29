import React from "react";
import { Check } from "lucide-react";

const educatFeatures = [
  "Student & staff records management",
  "Automated fee invoicing & tracking",
  "Academic performance reporting",
  "Multi-branch school support",
];

const edubancFeatures = [
  "EdPay fee loans up to ₦2M for parents",
  "Orbit school cash-flow up to ₦5M",
  "Backed by Sterling Bank & Alitheia",
  "120+ partner schools nationwide",
];

export default function TwoPlatforms() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          The Partnership
        </p>
        <h2 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
          Two platforms, one mission
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-500">
          Bridging the gap between school management and education financing
          across Nigeria.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Educat card */}
          <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-orange-50/40 p-8 text-left">
            <p className="text-xs font-semibold text-neutral-400">Educat</p>
            <h3 className="mt-2 text-xl font-bold text-neutral-900">
              School Management, Simplified
            </h3>
            <p className="mt-3 text-sm text-neutral-500">
              Educat is a comprehensive school management system that helps
              Nigerian schools manage student records, staff, fee invoicing,
              academic calendars, and financial reporting - all from one
              powerful platform.
            </p>
            <ul className="mt-6 space-y-3">
              {educatFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700">
                  <Check className="mt-0.5 h-6 w-6 shrink-0 text-orange-500 rounded-full bg-primary/20 p-1" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Edubanc card */}
          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-left text-white">
            <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-white/10" />
            <p className="text-xs font-semibold text-orange-100"><img src="/edbanc.svg" alt="" className="w-30" /></p>
            <h3 className="mt-2 text-xl font-bold">
              Education Financing for Every Family
            </h3>
            <p className="mt-3 text-sm text-orange-50/90">
              Edubanc is Nigeria's leading education financing platform,
              making it possible for every parent to pay school fees without
              financial stress — through flexible loans and school cash-flow
              solutions.
            </p>
            <ul className="mt-6 space-y-3">
              {edubancFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-6 w-6 shrink-0 text-white bg-white/20 p-1 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
