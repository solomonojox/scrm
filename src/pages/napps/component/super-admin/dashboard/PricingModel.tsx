export const PricingModel = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing Model</h2>

        <div className="space-y-4">
            {/* Per-Student Pricing */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <h3 className="text-indigo-900 font-bold mb-3">Per-Student Pricing</h3>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-indigo-600">Per Term:</span>
                    <span className="font-bold text-indigo-900">₦500/student</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-indigo-600">Calculation:</span>
                    <span className="font-medium text-indigo-900">Student Count × ₦500</span>
                </div>
            </div>

            {/* Revenue Sharing */}
            <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl">
                <h3 className="text-green-900 font-bold mb-2">Revenue Sharing</h3>
                <p className="text-sm text-green-800 leading-relaxed">
                    Chapters receive <span className="font-bold">20% of expected revenue</span> from schools in their jurisdiction
                </p>
            </div>

            {/* Example Calculation */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <h3 className="text-blue-900 font-bold mb-3 text-sm uppercase tracking-wide">Example Calculation</h3>
                <p className="text-sm text-blue-700 mb-2">School with 300 students:</p>
                <p className="text-blue-900 font-bold text-lg">
                    300 × ₦500 = <span className="text-blue-700">₦150,000 per term</span>
                </p>
                <p className="text-xs text-blue-600 mt-1 font-medium">
                    Chapter receives ₦30,000 (20%)
                </p>
            </div>
        </div>
    </div>
);