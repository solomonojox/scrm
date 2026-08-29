import React, { useState } from "react";
import { Check } from "lucide-react";

type Audience = "schools" | "parents";

const content: Record<
  Audience,
  {
    platform: string;
    title: string;
    description: string;
    points: string[];
  }
> = {
  schools: {
    platform: 'educat',
    title: "Built for schools that refuse to settle.",
    description:
      "Educat + Edubanc gives your school the financial stability to grow, invest in teachers, and keep every seat filled.",
    points: [
      "Guaranteed full fee collection every term",
      "Reduce student dropout due to unpaid fees",
      "Automated invoicing and payment tracking on Educat",
      "Access to Orbit school cash-flow solution - up to ₦5M",
      "Real-time financial reports via your Educat dashboard",
      "Zero integration cost - completely free for schools",
    ],
  },
  parents: {
    platform: 'edubank',
    title: "Your child's education, never on pause.",
    description:
      "With Edubanc's EdPay, school fees become manageable - spread across months, not scrambled at once.",
    points: [
      "Pay school fees in easy monthly installments",
      "Loans up to ₦2,000,000 with no collateral required",
      "Fast approval - no lengthy bank queues",
      "Covers tuition, levies, uniforms, and more",
      "Available across 120+ partner schools nationwide",
      "Backed by Sterling Bank and AltBank",
    ],
  },
};

export default function Benefits() {
  const [active, setActive] = useState<Audience>("schools");
  const data = content[active];

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Benefits
        </p>
        <h2 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
          Something for Everyone
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-500">
          Whether you're running a school or raising a child, this partnership
          delivers real value.
        </p>

        <div className="mt-8 inline-flex rounded-full bg-orange-50 p-1">
          <button
            onClick={() => setActive("schools")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${active === "schools"
              ? "bg-primary text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
              }`}
          >
            For Schools
          </button>
          <button
            onClick={() => setActive("parents")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${active === "parents"
              ? "bg-primary text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
              }`}
          >
            For Parents
          </button>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-3xl border border-orange-100 text-left sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="relative bg-primary p-8 text-white">
            <p className="text-xs font-semibold text-orange-100">
              {data.platform === 'educat' ? <span className="text-xl">Educat</span> : <img src="/edbanc.svg" />}
            </p>
            <h3 className="mt-3 text-xl font-bold leading-snug sm:text-2xl">
              {data.title}
            </h3>
            <p className="mt-3 text-sm text-orange-50/90">{data.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 bg-white p-8 sm:grid-cols-1">
            {data.points.map((point) => (
              <div key={point} className="flex items-start gap-2 text-sm text-neutral-700">
                <Check className="mt-0.5 h-5.5 w-5.5 shrink-0 text-orange-500 bg-primary/30 rounded-full p-1" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
