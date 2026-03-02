'use client';

import dynamic from 'next/dynamic';

// Dynamically import with SSR disabled to avoid hydration mismatch
const ThreadsContent = dynamic(() => import('./ThreadsContent'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-neutral-400 text-sm">Loading...</p>
    </div>
  )
});

export default function ThreadsPage() {
  return <ThreadsContent />;
}
