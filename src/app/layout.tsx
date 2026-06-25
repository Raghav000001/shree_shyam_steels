import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConditionalHowItWorks from "@/components/layout/ConditionalHowItWorks";
import FloatingActions from "@/components/layout/FloatingActions";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.SITE_URL || "https://shreeshyamprecision.com";

export const metadata: Metadata = {
  title: {
    default: "Shree Shyam Precision | CNC Machining & Component Manufacturing in Rohtak, Haryana",
    template: "%s | Shree Shyam Precision",
  },
  description:
    "Shree Shyam Precision — precision CNC turned components, quality machining, and durable industrial parts in Rohtak, Haryana. ISO 9001:2015 certified quality management.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Shree Shyam Precision",
    title: "Shree Shyam Precision | CNC Machining & Component Manufacturing",
    description:
      "Precision CNC turned components, quality machining, and durable industrial parts by Shree Shyam Precision, Rohtak, Haryana.",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "Shree Shyam Precision Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shree Shyam Precision | CNC Machining & Component Manufacturing",
    description:
      "Precision CNC turned components and quality machining by Shree Shyam Precision.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shree Shyam Precision",
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  description:
    "Precision CNC turned components, quality machining, and durable industrial parts.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot No. 92 HSIIDC Industrial Area, Hisar Road",
    addressLocality: "Rohtak",
    addressRegion: "Haryana",
    postalCode: "124001",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9728797360",
    contactType: "sales",
    email: "md@shreeshyamprecision",
  },
  knowsAbout: [
    "CNC Turning",
    "Precision Machined Components",
    "Custom Manufacturing Solutions",
    "Quality Inspection & Assurance",
    "Assembly & Finishing Services",
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        {children}
        <ConditionalHowItWorks />
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
