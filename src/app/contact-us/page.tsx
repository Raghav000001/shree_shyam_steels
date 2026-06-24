import type { Metadata } from 'next';
import ContactUsClient from './ContactUsClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Shree Shyam Precision. Visit our office in Rohtak, Haryana, call us at +91 9728797360, or use the contact form to send us a message.',
  openGraph: {
    title: 'Contact Us | Shree Shyam Precision',
    description:
      'Contact Shree Shyam Precision in Rohtak, Haryana. Call +91 9728797360 or email md@shreeshyamprecision.',
  },
};

export default function ContactUsPage() {
  return <ContactUsClient />;
}
