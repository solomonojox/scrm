import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"

export default function CTASection() {
  return (
    <section className="bg-white px-6 pb-20" id="get-started">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-orange-100 sm:grid-cols-2">
        <div className="bg-primary p-10 text-white">
          <p className="text-xs font-semibold text-orange-100">Educat</p>
          <h3 className="mt-3 text-xl font-bold sm:text-2xl">
            List your school on Educat today
          </h3>
          <p className="mt-3 text-sm text-orange-50/90">
            Get the full Educat management suite and automatically unlock
            Edubanc fee financing for all your parents — at zero cost to
            your school.
          </p>
          <Link to={'/get-started'} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-orange-50">
            Register Your School
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-10">
          <p className="text-sm font-bold text-neutral-900">edubanc</p>
          <h3 className="mt-3 text-xl font-bold text-neutral-900 sm:text-2xl">
            Apply for an EdPay school fee loan
          </h3>
          <p className="mt-3 text-sm text-neutral-500">
            Pay your child's school fees today and repay in comfortable
            monthly installments. No collateral, no stress — just peace of
            mind.
          </p>
          <a href="https://edubanc.ng" target="_blank" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/80">
            Apply for EdPay
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
