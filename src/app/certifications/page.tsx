import type { Metadata } from 'next';
import CertificationsClient from './CertificationsClient';

export const metadata: Metadata = {
  title: 'Certifications',
  description:
    'Shree Shyam Precision is ISO 9001:2015 certified for Quality Management System. View our official certification and learn about our commitment to manufacturing excellence.',
  openGraph: {
    title: 'Certifications | Shree Shyam Precision',
    description:
      'ISO 9001:2015 certified steel manufacturing — quality assured by Shree Shyam Precision.',
  },
};

export default function CertificationsPage() {
  return <CertificationsClient />;
}
