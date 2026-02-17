export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 mt-20">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-neutral-400">
            © {new Date().getFullYear()}
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Jayden-hong"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              GitHub
            </a>
            <span className="text-neutral-200">·</span>
            <a
              href="/rss.xml"
              className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
