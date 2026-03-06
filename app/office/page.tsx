import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Star Office | Zucchini',
  description: 'A pixel office for OpenClaw - visualize your AI agent work states',
};

export default function OfficePage() {
  return (
    <div className="w-full h-screen">
      <iframe 
        src="/office/index.html" 
        className="w-full h-full border-0"
        title="Star Office"
      />
    </div>
  );
}
