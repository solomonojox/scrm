import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Does my school need to pay to join?",
    answer:
      "No. Integration between Educat and Edubanc is completely free for schools. There are no setup fees or monthly charges.",
  },
  {
    question: "How quickly does the school receive payment?",
    answer:
      "Once a parent's Edubanc loan is approved, funds are disbursed directly to the school — typically within 48 hours.",
  },
  {
    question: "What documents do parents need to apply?",
    answer:
      "Parents need a valid ID, proof of income, and the school's fee invoice. The entire process is digital.",
  },
  {
    question: "Is Edubanc available across Nigeria?",
    answer:
      "Yes. Edubanc currently partners with 120+ schools across Nigeria and is rapidly expanding its network.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-orange-50/60 px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          FAQ
        </p>
        <h2 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
          Common Questions
        </h2>

        <div className="mt-10 space-y-3 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-orange-100 bg-white px-5 py-4"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm font-medium text-neutral-900">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-neutral-500">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
