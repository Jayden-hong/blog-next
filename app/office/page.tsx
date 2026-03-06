import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Zucchini Office | Zucchini',
  description: '🥒 Zucchini 的像素办公室 - AI Agent 工作状态可视化',
};

export default function OfficePage() {
  // 使用定制版页面（Zucchini 专属）
  redirect('/office-zucchini.html');
}
