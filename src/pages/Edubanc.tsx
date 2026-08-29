import React from "react";
import Navbar from "../components/edubanc/Navbar";
import Hero from "../components/edubanc/Hero";
import StatsBar from "../components/edubanc/StatsBar";
import TwoPlatforms from "../components/edubanc/TwoPlatforms";
import HowItWorks from "../components/edubanc/HowItWorks";
import Benefits from "../components/edubanc/Benefits";
import FAQ from "../components/edubanc/Faq";
import CTASection from "../components/edubanc/Ctasection";
import Footer from "../components/edubanc/Footer";

export default function Edubanc() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <StatsBar />
      <TwoPlatforms />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
