import React from "react";

const stats = [
  { value: "120+", label: "Partner Schools", highlight: false },
  { value: "₦2M", label: "Max Parent Loan", highlight: true },
  { value: "₦5M", label: "School Cash-Flow", highlight: true },
  { value: "48hr", label: "Avg. Approval", highlight: false },
];

export default function StatsBar() {
  return (
    <section className="relative z-10 -mt-10 bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-6 text-center shadow-sm"
          >
            <p
              className={`text-2xl font-bold sm:text-3xl ${stat.highlight ? "text-primary" : "text-neutral-900"
                }`}
            >
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
