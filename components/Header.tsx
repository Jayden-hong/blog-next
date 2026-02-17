import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-3xl mx-auto px-4 h-full flex items-center justify-between">
        <Link 
          href="/" 
          className="text-base font-medium text-neutral-900 hover:opacity-60 transition-opacity"
        >
          Jayden
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link
            href="/discover"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/blog"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Writing
          </Link>
        </nav>
      </div>
    </header>
  );
}
