import React from "react";

const steps = [
  {
    number: "01",
    title: "School Signs Up on Educat",
    description:
      "Your school creates an account on Educat and manages student records, fees, and reports - all in one dashboard.",
  },
  {
    number: "02",
    title: "Edubanc Integration is Activated",
    description:
      "Educat automatically links your school to Edubanc. Parents see the financing option when fee invoices are issued.",
  },
  {
    number: "03",
    title: "Parents Apply for EdPay",
    description:
      "Parents apply for a school fee loan directly - no collateral, no stress. Funds are disbursed straight to the school.",
  },
  {
    number: "04",
    title: "School Receives Payment Instantly",
    description:
      "Schools get paid in full while parents repay Edubanc in comfortable installments over time.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-orange-50/60 px-6 py-20" id="how-it-works">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          The Process
        </p>
        <h2 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
          How It Works
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">
          Four simple steps from sign-up to seamless school fee collection.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 rounded-2xl bg-white p-6 text-left shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-primary">
                {step.number}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
