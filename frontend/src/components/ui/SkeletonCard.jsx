const SkeletonCard = () => (
  <div 
    aria-hidden="true"
    className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
  >
    {/* Header skeleton */}
    <div className="h-8 sm:h-10 bg-gray-200 w-3/4 mb-6 animate-pulse motion-reduce:animate-none"></div>
    
    {/* Content skeleton - 3 rows */}
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 w-full animate-pulse motion-reduce:animate-none"></div>
      <div className="h-6 bg-gray-200 w-5/6 animate-pulse motion-reduce:animate-none"></div>
      <div className="h-6 bg-gray-200 w-4/6 animate-pulse motion-reduce:animate-none"></div>
    </div>
  </div>
);

export default SkeletonCard;