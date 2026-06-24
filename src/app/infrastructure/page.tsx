import type { Metadata } from 'next';
import InfrastructureClient from './InfrastructureClient';

export const metadata: Metadata = {
  title: 'Infrastructure',
  description:
    'Explore the state-of-the-art facilities at Shree Shyam Precision in Rohtak, Haryana. Modern steel manufacturing plant with advanced fabrication and quality control equipment.',
  openGraph: {
    title: 'Infrastructure | Shree Shyam Precision',
    description:
      'State-of-the-art steel manufacturing facilities at Shree Shyam Precision, Rohtak, Haryana.',
  },
};

export default function InfrastructurePage() {
  return <InfrastructureClient />;
}
