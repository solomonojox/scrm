import React, { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../Context/Auth/useAuth";
import { schoolAccountService } from "../../../Services/Admin/schoolAccountService";
import { getErrorMessage } from "../../../utils/getErrorMessage";

interface SchoolAccountFormProps {
  onClose: () => void;
  onAccountAdded: () => void;
}

const newsSchema = z.object({
  bankName: z
    .string()
    .trim()
    .min(1, "Bank Name is required")
    .min(3, "Bank Name must be at least 3 characters"),

  bankCode: z
    .string()
    .trim()
    .min(1, "Bank Code is required")
    .min(3, "Bank Code must be at least 3 characters"),

  accountNumber: z
    .string()
    .trim()
    .min(1, "Account Number is required")
    .min(3, "Account Number must be at least 3 characters"),

  accountName: z
    .string()
    .trim()
    .min(1, "Account Name is required")
    .min(3, "Account Name must be at least 3 characters"),
});

type SchoolAccountFormValues = z.infer<typeof newsSchema>;

const defaultValues: SchoolAccountFormValues = {
  bankName: "",
  bankCode: "",
  accountNumber: "",
  accountName: "",
};

const SchoolAccountForm: React.FC<SchoolAccountFormProps> = ({
  onClose,
  onAccountAdded,
}) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SchoolAccountFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: SchoolAccountFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      bankName: values.bankName.trim(),
      bankCode: values.bankCode.trim(),
      accountNumber: values.accountNumber.trim(),
      accountName: values.accountName.trim(),
    };

    try {
      const res = await schoolAccountService.addAccount(payload);

      toast.success((res as any)?.responseMessage || "Account added successfully!");

      onAccountAdded();

      setTimeout(() => {
        onClose();
        reset(defaultValues);
      }, 1200);
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-sm text-gray-900
    outline-none transition-all duration-200
    placeholder:text-gray-400
    focus:bg-white focus:ring-4
    ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-200 focus:border-orange-500 focus:ring-orange-100"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18" />
                  <path d="M7 15h3" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add School Account
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  Add the bank account details for your school.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-180px)] overflow-y-auto"
        >
          <div className="space-y-6 px-6 py-6 sm:px-8">
            {/* Error */}
            {formError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-0.5 shrink-0 text-red-500"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>

                <p className="text-sm text-red-700">{formError}</p>
              </div>
            )}

            {/* Section title */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Account Details
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Enter the official bank details associated with the school.
              </p>
            </div>

            {/* Bank Name + Bank Code */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Bank Name */}
              <div>
                <label
                  htmlFor="bankName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Bank Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M3 10h18" />
                      <path d="M5 10v8" />
                      <path d="M9 10v8" />
                      <path d="M15 10v8" />
                      <path d="M19 10v8" />
                      <path d="M3 18h18" />
                      <path d="m12 3 9 5H3l9-5Z" />
                    </svg>
                  </div>

                  <input
                    id="bankName"
                    type="text"
                    placeholder="e.g. First Bank"
                    className={`${inputClass(
                      !!errors.bankName
                    )} pl-11`}
                    {...register("bankName")}
                  />
                </div>

                {errors.bankName && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              {/* Bank Code */}
              <div>
                <label
                  htmlFor="bankCode"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Bank Code
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="bankCode"
                  type="text"
                  placeholder="e.g. 011"
                  className={inputClass(!!errors.bankCode)}
                  {...register("bankCode")}
                />

                {errors.bankCode && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.bankCode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label
                htmlFor="accountNumber"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Account Number
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M7 10h.01" />
                    <path d="M11 10h6" />
                    <path d="M7 14h10" />
                  </svg>
                </div>

                <input
                  id="accountNumber"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter account number"
                  className={`${inputClass(
                    !!errors.accountNumber
                  )} pl-11 tracking-wide`}
                  {...register("accountNumber")}
                />
              </div>

              {errors.accountNumber && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            {/* Account Name */}
            <div>
              <label
                htmlFor="accountName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Account Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-4 text-gray-400">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="3" />
                    <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                  </svg>
                </div>

                <input
                  id="accountName"
                  type="text"
                  placeholder="Enter account holder name"
                  className={`${inputClass(
                    !!errors.accountName
                  )} pl-11`}
                  {...register("accountName")}
                />
              </div>

              {errors.accountName && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.accountName.message}
                </p>
              )}
            </div>

            {/* Information box */}
            <div className="flex gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3.5">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="mt-0.5 shrink-0 text-orange-500"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <path d="M12 8h.01" />
              </svg>

              <p className="text-xs leading-5 text-orange-800">
                Please ensure the account information is correct before
                submitting. This information may be used for school payment
                transactions.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-30"
                    />

                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  Saving...
                </>
              ) : (
                <>
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>

                  Add Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolAccountForm;