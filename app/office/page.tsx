import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zucchini Office | Zucchini',
  description: '🥒 Zucchini 的像素办公室 - AI Agent 工作状态可视化',
};

export default function OfficePage() {
  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      <iframe 
        src="/office-zucchini.html" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Zucchini Office"
      />
    </div>
  );
}
