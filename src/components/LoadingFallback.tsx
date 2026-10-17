import { LoaderCircle } from 'lucide-react';

/**
 * Loading fallback component for Suspense boundaries
 * Displays while lazy-loaded components are being fetched
 * 
 * @example
 * <Suspense fallback={<LoadingFallback />}>
 *   <LazyComponent />
 * </Suspense>
 */
export function LoadingFallback() {
  return (
    <div data-vid="u4smxey" className="min-h-[60vh] flex items-center justify-center">
      <div data-vid="qdr4qa8" className="flex flex-col items-center gap-4">
        <LoaderCircle data-vid="354cper" className="w-8 h-8 animate-spin text-primary" />
        <p data-vid="ijcv5c0" className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

