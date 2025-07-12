const SkeletonLoader = () => {
    return (
      <div className="p-4 space-y-4 w-full max-w-sm">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
  
        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
  
        {/* Description Lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-300 rounded animate-pulse"></div>
          <div className="h-3 w-5/6 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-3 w-4/6 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    );
  };
  
  export default SkeletonLoader;  