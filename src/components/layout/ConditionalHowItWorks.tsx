"use client";

import { usePathname } from "next/navigation";
import HowItWorks from "@/components/sections/HowItWorks";

export default function ConditionalHowItWorks() {
  const pathname = usePathname();
  // Exclude contact page and any subpaths under it
  if (pathname.startsWith("/contact-us")) {
    return null;
  }
  return <HowItWorks />;
}
