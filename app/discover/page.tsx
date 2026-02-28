import { DiscoverClient } from '@/components/DiscoverClient';

export const dynamic = 'force-static'; // ✅ 强制静态导出

export const metadata = {
  title: 'Discover - Jayden',
  description: '每日AI推荐阅读清单',
};

export default function DiscoverPage() {
  // 完全静态页面，数据由客户端加载
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8">
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
              Discover
            </h1>
            <span className="text-xs text-neutral-400 mono">
              Loading...
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            Curated by Kimi K2.5
          </p>
        </header>

        <DiscoverClient />
      </div>
    </div>
  );
}
