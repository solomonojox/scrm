import React from 'react';

interface StatusBadgeProps {
  isActive: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive }) => {
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
      }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

export default StatusBadge;
