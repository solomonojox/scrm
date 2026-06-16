import React, { useEffect, useState } from 'react';
import {
    FileText,
    CheckCircle,
    Edit,
    Users,
    Clock,
    GraduationCap,
    UserPlus,
    Database
} from 'lucide-react';
import { ExaminerDashboardService } from '../../../../Services/Cbt/Examiner/dashboard';

interface DashboardData {
    totalExams: number;
    publishedExams: number;
    draftExams: number;
    totalTeacherAssignments: number;
    pendingQuestionApprovals: number;
    totalStudentAssignments: number;
    pendingStudentRegistrations: number;
}

// Default data from the provided JSON
const defaultData: DashboardData = {
    totalExams: 0,
    publishedExams: 0,
    draftExams: 0,
    totalTeacherAssignments: 0,
    pendingQuestionApprovals: 0,
    totalStudentAssignments: 0,
    pendingStudentRegistrations: 0,
};

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColor} ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

interface ProgressCardProps {
    title: string;
    completed: number;
    total: number;
    icon: React.ReactNode;
    color: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, completed, total, icon, color }) => {
    const percentage = total === undefined ? 0 : total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                        {icon}
                    </div>
                    <h3 className="font-semibold text-gray-700">{title}</h3>
                </div>
                <span className="text-sm font-medium text-gray-500">
                    {completed || 0}/{total || 0}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${color.replace('text', 'bg')}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-xs text-gray-400 mt-2">{percentage}% completed</p>
        </div>
    );
};

interface ExaminarDashboardProps {
    data?: DashboardData;
    onRefresh?: () => void;
    isLoading?: boolean;
}

const ExaminarDashboard: React.FC<ExaminarDashboardProps> = ({
    onRefresh,
    isLoading = false
}) => {
    const [data, setData] = useState<DashboardData>({} as DashboardData)
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await ExaminerDashboardService.getAll();
            setData(res);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }

    // Calculate derived stats
    const totalContentItems = data.totalExams + data.totalTeacherAssignments + data.totalStudentAssignments;
    const approvalRate = data.pendingQuestionApprovals === 0 && data.totalTeacherAssignments === 0
        ? 100
        : data.totalTeacherAssignments === 0
            ? 0
            : Math.round(((data.totalTeacherAssignments - data.pendingQuestionApprovals) / data.totalTeacherAssignments) * 100);

    const registrationRate = data.pendingStudentRegistrations === 0 && data.totalStudentAssignments === 0
        ? 100
        : data.totalStudentAssignments === 0
            ? 0
            : Math.round(((data.totalStudentAssignments - data.pendingStudentRegistrations) / data.totalStudentAssignments) * 100);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Examinar Dashboard</h1>
                        <p className="text-gray-500 mt-1">Monitor your examination system performance</p>
                    </div>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <Database className="w-4 h-4" />
                            Refresh
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Exams"
                    value={data.totalExams}
                    icon={<FileText className="w-6 h-6" />}
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                />
                <StatCard
                    title="Published Exams"
                    value={data.publishedExams}
                    icon={<CheckCircle className="w-6 h-6" />}
                    color="text-green-600"
                    bgColor="bg-green-100"
                />
                <StatCard
                    title="Draft Exams"
                    value={data.draftExams}
                    icon={<Edit className="w-6 h-6" />}
                    color="text-yellow-600"
                    bgColor="bg-yellow-100"
                />
                <StatCard
                    title="Teacher Assignments"
                    value={data.totalTeacherAssignments}
                    icon={<Users className="w-6 h-6" />}
                    color="text-purple-600"
                    bgColor="bg-purple-100"
                />
            </div>

            {/* Progress & Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Question Approvals Progress */}
                <ProgressCard
                    title="Question Approvals"
                    completed={data.totalTeacherAssignments - data.pendingQuestionApprovals}
                    total={data.totalTeacherAssignments}
                    icon={<Clock className="w-5 h-5" />}
                    color="text-orange-600"
                />

                {/* Student Registrations Progress */}
                <ProgressCard
                    title="Student Registrations"
                    completed={data.totalStudentAssignments - data.pendingStudentRegistrations}
                    total={data.totalStudentAssignments}
                    icon={<UserPlus className="w-5 h-5" />}
                    color="text-teal-600"
                />
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Exam Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Exam Overview</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Published Rate</span>
                            <span className="font-semibold text-gray-900">
                                {data.totalExams === 0 || data.totalExams === undefined ? '0%' : `${Math.round((data.publishedExams / data.totalExams) * 100)}%`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Draft Rate</span>
                            <span className="font-semibold text-gray-900">
                                {data.totalExams === 0 || data.totalExams === undefined ? '0%' : `${Math.round((data.draftExams / data.totalExams) * 100)}%`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Content Items (Total)</span>
                            <span className="font-semibold text-gray-900">{totalContentItems || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Assignment Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Assignment Status</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Teacher Assignment Completion</span>
                            <span className="font-semibold text-gray-900">{approvalRate || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Student Registration Completion</span>
                            <span className="font-semibold text-gray-900">{registrationRate || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Pending Approvals</span>
                            <span className="font-semibold text-orange-600">{data.pendingQuestionApprovals || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Pending Registrations</span>
                            <span className="font-semibold text-teal-600">{data.pendingStudentRegistrations || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State Message (when all data is zero) */}
            {data.totalExams === 0 &&
                data.totalTeacherAssignments === 0 &&
                data.totalStudentAssignments === 0 && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <Database className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-blue-800">No Data Available</h3>
                        <p className="text-blue-600 mt-1">Start creating exams and assigning teachers to see statistics here.</p>
                    </div>
                )}
        </div>
    );
};

export default ExaminarDashboard;