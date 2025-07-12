export function Input({ icon: Icon, label, className = '', ...props }) {
  return (
    <div className="relative">
      <label>{label}</label>
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={`
          block w-full rounded-lg border-0 py-3 
          ${Icon ? 'pl-10' : 'pl-4'} pr-4
          text-gray-900 ring-1 ring-inset ring-gray-300
          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600
          sm:text-sm sm:leading-6 bg-white/50 backdrop-blur-sm
          ${className}
        `}
        {...props}
      />
    </div>
  );
}