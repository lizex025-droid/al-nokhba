import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RevealObserver } from '@/components/Reveal';
import './globals.css';

export const metadata: Metadata = { title: { default: 'النخبة علوم التأهيل', template: '%s | النخبة علوم التأهيل' }, description: 'موقع النخبة الأكاديمي لطلبة كلية علوم التأهيل في الجامعة الأردنية.', robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ar" dir="rtl"><body><RevealObserver /><Navbar /><main id="main-content">{children}</main><Footer /></body></html>; }
