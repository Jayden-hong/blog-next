import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Star Office | Zucchini',
  description: 'A pixel office for OpenClaw - visualize your AI agent work states',
};

export default function OfficePage() {
  // 直接重定向到静态 HTML 文件
  redirect('/office.html');
}
