import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Star Office | Zucchini',
  description: 'A pixel office for OpenClaw - visualize your AI agent work states',
};

export default function OfficePage() {
  // 使用简化版离线页面（避免 HTTPS/HTTP 混合内容问题）
  redirect('/office-v2.html');
}
