import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link 
          href="/" 
          className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          Jayden
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link
            href="/discover"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Writing
          </Link>
        </nav>
      </div>
    </header>
  );
}
