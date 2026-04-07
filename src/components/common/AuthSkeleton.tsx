export default function AuthSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-4">
      <div className="w-full max-w-md">
        <div className="border-0 shadow-xl bg-white dark:bg-neutral-800 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
            <div className="h-10 bg-primary rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
