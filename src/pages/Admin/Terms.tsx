import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";          // adjust relative paths as needed
import Footer from "../Footer";
import Edu from "../../assets/Edu.png";  // logo asset
import "../../Styles/loader.css";        // spinner styles

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ───────── event handlers ───────── */
  const handleAgree = () => {
    setLoading(true);
    // simulate async accept; replace with real API call if required
    setTimeout(() => navigate(-1), 1500);
  };

  const handleDecline = () => {
    alert("You must accept the terms to proceed.");
  };

  /* ───────── JSX ───────── */
  return (
    <>
      {/* site‑wide header */}
      <Header />

      {/* main page */}
      <div className="bg-white text-black font-sans min-h-screen relative">
        {/* overlay loader */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="loader" />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* local logo row */}
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <img
                src={Edu}
                alt="EduCat logo"
                className="w-10 h-10 object-contain"
                width={60}
                height={40}
              />
            </div>
            <button
              aria-label="Close"
              onClick={() => navigate(-1)}
              className="text-black text-xl leading-none"
            >
              <i className="fas fa-times" />
            </button>
          </header>

          <h1 className="text-center font-bold text-base mb-4">
            Terms and Conditions for School Registration
          </h1>

          <p className="font-bold mb-2">Effective Date: July&nbsp;16,&nbsp;2025</p>

          {/* ───── Terms body ───── */}
          <div className="text-sm leading-relaxed space-y-4">
            <p>
              Welcome to EduCat ("Platform", "We", "Us", "Our"). These Terms and
              Conditions ("Terms") govern the registration and use of EduCat by
              schools, institutions, and their authorized representatives
              ("School", "You", "Your"). By registering your school on EduCat, you
              agree to comply with and be bound by these Terms.
            </p>

            <ol className="list-decimal list-inside space-y-4">
              <li>
                <strong>Registration is Free</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Registration of schools on EduCat is completely free of charge.</li>
                  <li>No upfront or setup fees are required to create a School account.</li>
                  <li>Registration grants access to EduCat’s onboarding process and management tools.</li>
                </ul>
              </li>

              <li>
                <strong>Usage Fees</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>EduCat operates a pay‑per‑term model.</li>
                  <li>Schools will be charged a fee of ₦500 (Five Hundred Naira) per student, per academic term.</li>
                  <li>Charges are calculated based on the total number of active student records for each term.</li>
                  <li>Once a student is registered for a given term, the corresponding fee becomes due and payable for that term, regardless of student withdrawal or transfer after registration.</li>
                  <li>Payment schedules, invoices, and account statements will be made available on the Platform.</li>
                  <li>All payments must be made in accordance with EduCat’s billing policies and timelines.</li>
                  <li>Failure to settle outstanding invoices may result in account suspension, limited access to features, or termination of service.</li>
                </ul>
              </li>

              <li>
                <strong>Eligibility</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Only authorized representatives of properly accredited schools or recognized educational institutions may register on EduCat.</li>
                  <li>The person completing the registration confirms that they have legal authority to enter into this agreement on behalf of the School.</li>
                </ul>
              </li>

              <li>
                <strong>Account Setup and Verification</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Schools are required to provide complete, accurate, and verifiable information during the registration process.</li>
                  <li>EduCat reserves the right to request official documents to verify the identity, accreditation status, or ownership of the school.</li>
                  <li>Schools are responsible for keeping their account information current.</li>
                </ul>
              </li>

              <li>
                <strong>Acceptance of Terms</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>By registering, the School acknowledges that it has read, understood, and agreed to these Terms.</li>
                  <li>If the School does not agree to any part of these Terms, registration should not proceed.</li>
                </ul>
              </li>

              <li>
                <strong>Use of Platform</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>EduCat provides tools to manage students, staff, academic records, and other school operations.</li>
                  <li>The School is solely responsible for all activities conducted through its account.</li>
                  <li>The School agrees not to misuse or abuse the Platform, violate laws, infringe rights, or interfere with system integrity.</li>
                </ul>
              </li>

              <li>
                <strong>Data Privacy</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>EduCat is committed to protecting the privacy and confidentiality of school and student data.</li>
                  <li>Data collected is used strictly for providing services, account management, analytics, and platform improvement.</li>
                  <li>Full data handling procedures are outlined in our Privacy Policy.</li>
                </ul>
              </li>

              <li>
                <strong>Intellectual Property</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>All software, designs, content, and intellectual property of EduCat remain the sole property of EduCat.</li>
                  <li>Schools are granted a limited, non‑exclusive, non‑transferable license to use the Platform strictly in accordance with these Terms.</li>
                </ul>
              </li>

              <li>
                <strong>Termination and Suspension</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>EduCat reserves the right to suspend or terminate accounts that violate these Terms, breach payment obligations, or engage in misuse or illegal activity.</li>
                  <li>Schools may request termination of their account at any time, subject to settlement of any outstanding payments.</li>
                </ul>
              </li>

              <li>
                <strong>Modifications</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>EduCat reserves the right to update or modify these Terms at any time.</li>
                  <li>Notice of material changes will be provided via email or Platform notifications.</li>
                  <li>Continued use of the Platform after such changes constitutes acceptance of the revised Terms.</li>
                </ul>
              </li>

              <li>
                <strong>Limitation of Liability</strong>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>EduCat shall not be liable for any indirect, incidental, or consequential damages arising from your use or inability to use the Platform.</li>
                  <li>EduCat’s total liability shall not exceed the amount of fees paid by the School for the specific term or service period in question.</li>
                </ul>
              </li>

              <li>
                <strong>Governing Law</strong>
                <p className="pl-5 mt-1">
                  These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria.
                </p>
              </li>

              <li>
                <strong>Contact Information</strong>
                <p className="pl-5 mt-1">
                  For support or inquiries, please contact:<br />
                  Email: <a href="mailto:info@educat.com.ng" className="text-blue-600 underline">info@educat.com.ng</a><br />
                  Phone: <a href="tel:+2347026790425" className="text-blue-600 underline">+2347026790425</a>
                </p>
              </li>
            </ol>

            <p className="mt-6">
              By clicking “Accept”, you confirm that you have read, understood, and agreed to abide by these Terms and Conditions.
            </p>
          </div>

          {/* action buttons */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={handleAgree}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition
                ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
            >
              Agree
            </button>
            <button
              onClick={handleDecline}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition
                ${loading ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
            >
              Decline
            </button>
          </div>
        </div>
      </div>

      {/* site‑wide footer */}
      <Footer />
    </>
  );
};

export default TermsAndConditions;
