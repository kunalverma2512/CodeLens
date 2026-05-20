function SkeletonBlock({ className = "" }) {
  return <div className={`bg-gray-200 border-[2px] border-black animate-pulse ${className}`} />;
}

/**
 * Generic auth-guard loading placeholder — shown by ProtectedRoute / PublicRoute
 * while authentication state is being resolved. Page-agnostic by design.
 */
export function GuardSkeleton() {
  return (
    <div className="w-full flex-1 flex flex-col px-4 sm:px-6 md:px-8 py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-10 border-b-4 border-black pb-6">
          <SkeletonBlock className="h-12 sm:h-16 w-56 sm:w-80 mb-4" />
          <SkeletonBlock className="h-5 w-40 sm:w-64" />
        </div>
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-[200px] w-full" />
          <SkeletonBlock className="h-[140px] w-full" />
          <SkeletonBlock className="h-[100px] w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="w-full flex-1 flex flex-col px-4 sm:px-6 md:px-8 py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12 sm:mb-16 border-b-4 border-black pb-6 sm:pb-8">
          <SkeletonBlock className="h-14 sm:h-20 w-64 sm:w-96 mb-6" />
          <SkeletonBlock className="h-6 w-52 sm:w-80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 mb-12 sm:mb-16">
          <SkeletonBlock className="h-[240px]" />
          <SkeletonBlock className="h-[240px]" />
          <SkeletonBlock className="h-[240px]" />
        </div>
        <SkeletonBlock className="h-[120px] max-w-3xl" />
      </div>
    </div>
  );
}

export function AccountCenterSkeleton() {
  return (
    <div className="w-full flex-1 bg-white px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 border-b-[4px] border-black pb-8">
          <SkeletonBlock className="h-4 w-44 mb-4" />
          <SkeletonBlock className="h-12 sm:h-16 w-64 sm:w-80 mb-4" />
          <SkeletonBlock className="h-5 w-full max-w-2xl" />
        </div>
        <div className="mb-12 p-6 border-[4px] border-black bg-black">
          <div className="flex items-center gap-5">
            <SkeletonBlock className="w-16 h-16 border-[3px] border-white bg-gray-300" />
            <div className="w-full">
              <SkeletonBlock className="h-7 w-60 border-[2px] border-white mb-2 bg-gray-300" />
              <SkeletonBlock className="h-4 w-72 border-[2px] border-white bg-gray-300" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonBlock className="h-[310px]" />
          <SkeletonBlock className="h-[310px]" />
          <SkeletonBlock className="h-[230px]" />
          <SkeletonBlock className="h-[230px]" />
        </div>
      </div>
    </div>
  );
}
