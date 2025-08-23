import React, { useState } from 'react';
import { ChevronDown, Calendar, CheckSquare, Clock, Eye, Filter, ArrowLeft, Download, Upload, X } from 'lucide-react';

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dateCreated: string;
  dueDate: string;
  teacherName: string;
  status: 'Completed' | 'Pending' | 'Overdue';
  pupilName: string;
  class: string;
  submissionDate?: string;
  score?: string;
  description: string;
  questions: string[];
  resources: string[];
}

interface Student {
  id: string;
  name: string;
  assignments: Assignment[];
}

// Assignment Table Component
interface AssignmentTableProps {
  assignments: Assignment[];
  onViewAssignment: (assignment: Assignment) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ assignments, onViewAssignment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const completedCount = assignments.filter(a => a.status === 'Completed').length;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Assignments</h2>
          <p className="text-sm text-gray-500">
            {Math.min(completedCount, 3)} of {assignments.length} Assignments completed this week
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teachers Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((assignment, index) => (
              <tr key={assignment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{assignment.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.dateCreated}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.dueDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.teacherName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => onViewAssignment(assignment)}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-500">
            Page 1 of 0
          </p>
        </div>
      </div>
    </div>
  );
};


export default AssignmentTable