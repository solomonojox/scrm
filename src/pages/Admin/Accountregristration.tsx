import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { onboardingService } from "../../Services/Auth/onboarding";

export default function RegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    branchName: "",
    accountType: "",
    sortCode: "",
    swiftCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const schoolId = localStorage.getItem("schoolIdOnRegistration");

      if (!schoolId) {
        console.error("School ID not found in local storage.");
        return;
      }

      const payload = {
        schoolId,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        bankCode: "", // Optional
        isDefault: true,
      };

      const response = await onboardingService.accountRegistration(payload);
      localStorage.setItem("continueRegistration", 'add-admin');
      navigate("/add-admin");

      if (response.status === false) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSaved(true);
      // setTimeout(() => navigate("/AddAdmin"), 1000);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "accountName", label: "Account Name" },
    { id: "bankName", label: "Bank Name" },
    { id: "accountNumber", label: "Account Number" },
    { id: "branchName", label: "Branch Name" },
    { id: "accountType", label: "Account Type" },
    { id: "sortCode", label: "Sort Code (For local transfers only)" },
    {
      id: "swiftCode",
      label: "Swift Code (For international payments only — Optional)",
    },
  ];

  return (
    <>
      <Header />

      <main className="max-w-xl mx-auto p-6 font-sans">
        <h1 className="font-extrabold text-lg text-center">Registration Form</h1>
        <p className="text-center italic text-orange-600 mt-1 text-sm font-semibold">
          Fill out the form below to get your school started with EduCat.
        </p>
        <p className="text-center text-[10px] text-gray-600 mt-0.5">
          Note: Complete each section before moving to the next.
        </p>

        <div className="mt-4 h-1 w-full bg-gray-300 rounded-full relative">
          <div className="h-1 bg-green-600 rounded-full w-85"></div>
          <span className="absolute right-0 -top-4 text-[10px] text-gray-400 font-semibold">
            100%
          </span>
        </div>

        <nav className="flex justify-between mt-3 text-orange-600 font-semibold text-xs">
          <Link to="/add-school-form" className="hover:underline">Add School</Link>
          <Link to="/upload-license" className="hover:underline">Upload School License</Link>
          <Link to="/account-registration" className="underline">Add Account details</Link>
          <Link to="/add-admin" className="hover:underline">Add School Admin</Link>
        </nav>

        <p className="mt-4 text-center italic text-xs font-semibold">
          Please enter your school’s bank details to enable secure transactions like fee
          payments, refunds etc.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-4 text-xs text-gray-700 font-normal"
        >
          {fields.map(({ id, label }) => (
            <div key={id}>
              <label htmlFor={id} className="block mb-1 font-medium">
                {label}
              </label>
              <input
                id={id}
                type="text"
                value={formData[id]}
                onChange={handleChange}
                placeholder="Enter Here"
                className="w-full border border-orange-300 rounded px-2 py-1 text-xs placeholder:text-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || saved}
            className={`w-full ${saved
              ? "bg-green-500"
              : loading
                ? "bg-orange-300"
                : "bg-orange-500 hover:bg-orange-600"
              } text-white font-semibold py-2 rounded text-sm`}
          >
            {saved ? "Saved" : loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        <p className="mt-2 text-[10px] text-red-600 italic font-semibold">
          Security Notice: EduCat encrypts all sensitive banking information and complies
          with financial data protection standards to keep your information secure.
        </p>
      </main>

      <Footer />
    </>
  );
}
