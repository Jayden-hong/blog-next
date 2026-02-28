import { DiscoverClient } from '@/components/DiscoverClient';

export const dynamic = 'force-static'; // ✅ 强制静态导出

export const metadata = {
  title: 'Discover - Jayden',
  description: '每日AI推荐阅读清单',
};

export default function DiscoverPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <DiscoverClient />
      </div>
    </div>
  );
}
