import React from 'react';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
  bgPosition?: string;
}

export default function PageBanner({ title, subtitle, bgImage = "/images/hero_bg_1778760928163.png", bgPosition = "center" }: PageBannerProps) {
  return (
    <section className="relative w-full h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: bgPosition }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#FF5B22] font-semibold tracking-widest text-sm uppercase">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
