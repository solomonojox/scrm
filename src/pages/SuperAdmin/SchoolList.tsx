import React, { useState } from 'react';
import { Search, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SchoolStatus = 'Active' | 'Inactive';

interface School {
    id: string;
    name: string;
    location: string;
    status: SchoolStatus;
    students: number;
    totalAccounts: number;
    registered: string;
}

const initialSchools: School[] = [
    {
        id: '1',
        name: 'Greenfield International School',
        location: 'Lagos, Nigeria',
        status: 'Active',
        students: 450,
        totalAccounts: 868,
        registered: 'Jan 15, 2024'
    },
    {
        id: '2',
        name: "St. Mary's High School",
        location: 'Abuja, Nigeria',
        status: 'Active',
        students: 320,
        totalAccounts: 640,
        registered: 'Feb 20, 2024'
    },
    {
        id: '3',
        name: 'Royal Academy',
        location: 'Port Harcourt, Nigeria',
        status: 'Inactive',
        students: 280,
        totalAccounts: 549,
        registered: 'Mar 10, 2024'
    },
    {
        id: '4',
        name: 'Bright Future Academy',
        location: 'Ibadan, Nigeria',
        status: 'Active',
        students: 520,
        totalAccounts: 1031,
        registered: 'Apr 5, 2024'
    },
    {
        id: '5',
        name: 'Excellence College',
        location: 'Kano, Nigeria',
        status: 'Active',
        students: 390,
        totalAccounts: 773,
        registered: 'May 12, 2024'
    },
    {
        id: '6',
        name: 'Unity Secondary School',
        location: 'Enugu, Nigeria',
        status: 'Inactive',
        students: 210,
        totalAccounts: 415,
        registered: 'Jun 18, 2024'
    }
];

type FilterType = 'All' | 'Active' | 'Inactive';

export default function SchoolList() {
    const navigate = useNavigate()
    const [schools, setSchools] = useState<School[]>(initialSchools);
    const [filter, setFilter] = useState<FilterType>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSchoolStatus = (id: string) => {
        setSchools(schools.map(school =>
            school.id === id
                ? { ...school, status: school.status === 'Active' ? 'Inactive' : 'Active' as SchoolStatus }
                : school
        ));
    };

    const handleViewDetails = (schoolName: string) => {
        alert(`Viewing details for ${schoolName}`);
    };

    const handleUpdateApproval = () => {
        alert('Update Approval clicked');
    };

    const filteredSchools = schools.filter(school => {
        const matchesFilter = filter === 'All' || school.status === filter;
        const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 z-40">
            <div>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Registered Schools</h1>
                    <p className="text-gray-600">Manage all schools and their activation status</p>
                </div>

                {/* Controls Bar */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search schools by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Filters and Button */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setFilter('All')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'All'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('Active')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'Active'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter('Inactive')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'Inactive'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Inactive
                            </button>
                            <button
                                onClick={handleUpdateApproval}
                                className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                <span className="text-xl">+</span>
                                Update Approval
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">School Name</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Location</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Students</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Total Accounts</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Registered</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Activate/Deactivate</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSchools.length > 0 ? (
                                    filteredSchools.map((school) => (
                                        <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-gray-900 font-medium whitespace-nowrap">{school.name}</td>
                                            <td className="py-4 px-6 text-gray-600 whitespace-nowrap">{school.location}</td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${school.status === 'Active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {school.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-900 whitespace-nowrap">{school.students}</td>
                                            <td className="py-4 px-6 text-gray-900 whitespace-nowrap">{school.totalAccounts}</td>
                                            <td className="py-4 px-6 text-gray-600 whitespace-nowrap">{school.registered}</td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleSchoolStatus(school.id)}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${school.status === 'Active'
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-black text-white hover:bg-gray-800'
                                                        }`}
                                                >
                                                    {school.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                {school.status === 'Active' ? (
                                                    <button
                                                        // onClick={() => handleViewDetails(school.name)}
                                                        onClick={() => navigate('/super-admin/school-info')}
                                                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                        <span>View Details</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <EyeOff className="w-5 h-5" />
                                                        <span>Not Available</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <p className="text-gray-500 text-lg">No schools found matching your criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}