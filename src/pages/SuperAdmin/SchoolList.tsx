import React, { useEffect, useState } from 'react';
import { Search, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../../Services/superAdmin';
import { useAuth } from '../../Context/Auth/useAuth';

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
    }
];

type FilterType = 'All' | 'Active' | 'Inactive';

export default function SchoolList() {
    const navigate = useNavigate()
    const [schools, setSchools] = useState<School[]>(initialSchools);
    const [filter, setFilter] = useState<any>('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { user } = useAuth();
    const [allSchools, setAllSchools] = useState<any[]>([]);
    const getAllSchools = async () => {
        try {
            const res = await superAdminService.getAllSchools();
            const schoolsData = res.data;

            // Fetch total students for each school concurrently
            const enrichedSchools = await Promise.all(
                schoolsData.map(async (school: any) => {
                    try {
                        const studentsRes = await superAdminService.getAllStudents(school.schoolId);
                        const teachersRes = await superAdminService.getAllTeachers(school.schoolId);
                        const guardiansRes = await superAdminService.getAllGuardians(school.schoolId);
                        const totalStudents = Array.isArray(studentsRes.data) ? studentsRes.data.length : 0;
                        const totalTeachers = Array.isArray(teachersRes.data) ? studentsRes.data.length : 0;
                        const totalGuardians = Array.isArray(guardiansRes.data) ? studentsRes.data.length : 0;

                        return {
                            ...school,
                            totalStudents,
                            totalTeachers,
                            totalGuardians
                        };
                    } catch (error) {
                        console.error(`Error fetching students for ${school.schoolName}:`, error);
                        return {
                            ...school,
                            totalStudents: 0,
                        };
                    }
                })
            );

            setAllSchools(enrichedSchools);
            // Reset to first page when data changes
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching schools:", error);
        }
    };

    useEffect(() => {
        if (user) {
            getAllSchools();
        }
    }, [user])

    const toggleSchoolStatus = (id: string) => {
        setSchools(schools.map(school =>
            school.id === id
                ? { ...school, status: school.status === 'Active' ? 'Inactive' : 'Active' as SchoolStatus }
                : school
        ));
    };

    const activateSchool = async (schoolId: string) => {
        console.log(schoolId);
        try {
            const res = await superAdminService.changeSchoolStatus({ schoolId: schoolId, approvalStatus: 1, approvedBy: user?.id });
            getAllSchools();
        } catch (error) {
            console.log(error);
        }
    }

    const deactivateSchool = async (schoolId: string) => {
        try {
            const res = await superAdminService.changeSchoolStatus({ schoolId: schoolId, approvalStatus: 2, approvedBy: user?.id });
            getAllSchools();
        } catch (error) {
            console.log(error);
        }
    }

    const handleViewDetails = (schoolName: string) => {
        alert(`Viewing details for ${schoolName}`);
    };

    const handleUpdateApproval = () => {
        alert('Update Approval clicked');
    };

    // Filter schools based on search and filter criteria
    const filteredSchools = allSchools.filter(school => {
        const matchesFilter = filter === 'All' || school.approvalStatus === filter;
        const matchesSearch = school.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Pagination calculations
    const totalItems = filteredSchools.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentSchools = filteredSchools.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

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
                                onClick={() => {
                                    setFilter('All');
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'All'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => {
                                    setFilter(1);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 1
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => {
                                    setFilter(2);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 2
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Inactive
                            </button>
                        </div>
                    </div>
                </div>

                {/* Items per page selector */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {endIndex} of {totalItems} schools
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="itemsPerPage" className="text-sm text-gray-600 whitespace-nowrap">
                            Schools per page:
                        </label>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">School Name</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Location</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Students</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Registered</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Activate/Deactivate</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentSchools.length > 0 ? (
                                    currentSchools.map((school) => (
                                        <tr key={school.schoolId} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-gray-900 font-medium whitespace-nowrap">{school.schoolName}</td>
                                            <td className="py-4 px-6 text-gray-600 whitespace-nowrap">{school.address}</td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${school.approvalStatus === 1
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {school.approvalStatus === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-900 whitespace-nowrap">{school.totalStudents}</td>
                                            <td className="py-4 px-6 text-gray-600 whitespace-nowrap">{school?.approvalDate?.split('T')[0]}</td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                {school.approvalStatus === 1 ? (
                                                    <button
                                                        onClick={() => deactivateSchool(school.schoolId)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700`}
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => activateSchool(school.schoolId)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-colors bg-black text-white hover:bg-gray-800`}
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                {school.approvalStatus === 1 ? (
                                                    <button
                                                        onClick={() => navigate('/super-admin/school-info', { state: { school } })}
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
                                        <td colSpan={7} className="text-center py-12">
                                            <p className="text-gray-500 text-lg">No schools found matching your criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border ${currentPage === 1
                                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Page Numbers */}
                            {getPageNumbers().map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === page
                                        ? 'bg-black text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border ${currentPage === totalPages
                                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}