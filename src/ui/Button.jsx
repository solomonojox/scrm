export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  disabled = false,
  ...props 
}) {
  const baseStyles = "relative px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500",
    secondary: "bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}