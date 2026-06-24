import type { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Shree Shyam Precision — precision CNC turned components and quality machining in Rohtak, Haryana. ISO 9001:2015 certified, precision component manufacturing.',
  openGraph: {
    title: 'About Us | Shree Shyam Precision',
    description:
      'Shree Shyam Precision — precision CNC turned components, quality machining, and manufacturing excellence.',
  },
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}
