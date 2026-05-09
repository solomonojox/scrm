import React from 'react';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react'; // Using Lucide for icons

const SchoolChapterTable = () => {
    const schools = [
        {
            name: "Capital Heights Academy",
            admin: "Mrs. Grace Eze",
            email: "admin@greenwood.ng",
            phone: "+234 810 123 4567",
            location: "45 Victoria Island, Lagos",
            students: 450,
            price: "₦1,500/year",
            total: "₦675,000",
            status: ["Active", "Active"] // Primary (Green), Secondary (Blue)
        },
        {
            name: "Royal Academy",
            admin: "Mrs. Funmi Adeyemi",
            email: "info@royalacademy.ng",
            phone: "+234 811 234 5678",
            location: "12 Lekki Phase 1, Lagos",
            students: 320,
            price: "₦1,500/year",
            total: "₦480,000",
            status: ["Active", "Active"]
        }
    ];

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
                {/* Table Header */}
                <thead>
                    <tr className="border-b border-gray-100 text-sm font-medium text-gray-500">
                        <th className="px-6 py-4">School</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Subscription</th>
                        <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                    {schools.map((school, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            {/* School Name & Admin */}
                            <td className="px-6 py-5">
                                <div className="font-bold text-gray-900">{school.name}</div>
                                <div className="text-sm text-gray-400">{school.admin}</div>
                            </td>

                            {/* Contact Info */}
                            <td className="px-6 py-5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} className="text-gray-400" />
                                        {school.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={14} className="text-gray-400" />
                                        {school.phone}
                                    </div>
                                </div>
                            </td>

                            {/* Location */}
                            <td className="px-6 py-5">
                                <div className="flex items-start gap-2 text-sm text-gray-600 max-w-45">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <span>{school.location}</span>
                                </div>
                            </td>

                            {/* Subscription Details */}
                            <td className="px-6 py-5">
                                <div className="text-sm">
                                    <div className="font-bold text-gray-900">{school.students} students</div>
                                    <div className="text-gray-500">{school.price}</div>
                                    <div className="mt-1">
                                        <span className="text-gray-500">Total: </span>
                                        <span className="font-bold text-gray-900">{school.total}</span>
                                    </div>
                                </div>
                            </td>

                            {/* Status Badges */}
                            <td className="px-6 py-5">
                                <div className="flex flex-col items-end gap-2">
                                    {school.status.map((stat, i) => (
                                        <span
                                            key={i}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${stat === 'Active'
                                                ? 'bg-green-50 text-green-600 border-green-100'
                                                : 'bg-red-50 text-red-600 border-red-100'
                                                } ${i === 1 && stat === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}`}
                                        >
                                            {stat}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SchoolChapterTable;