'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  images: string[];
}

interface ProductsClientProps {
  categories: CategoryData[];
}

interface LightboxItem {
  url: string;
  category: string;
}

export default function ProductsClient({ categories }: ProductsClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<string>(categories[0]?.slug ?? '');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Letters that actually have a matching category — others render disabled
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((cat) => {
      const first = cat.name.trim().charAt(0).toUpperCase();
      if (first) set.add(first);
    });
    return set;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!activeLetter) return categories;
    return categories.filter(
      (cat) => cat.name.trim().charAt(0).toUpperCase() === activeLetter
    );
  }, [categories, activeLetter]);

  const allItems = useMemo(() => {
    const items: LightboxItem[] = [];
    for (const cat of categories) {
      const catImages = [cat.coverImage, ...cat.images].filter(Boolean);
      for (const url of catImages) {
        items.push({ url, category: cat.name });
      }
    }
    return items;
  }, [categories]);

  const currentItem = lightboxIndex !== null ? allItems[lightboxIndex] : null;

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allItems.length : 0));
  }, [allItems.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + allItems.length) % allItems.length : allItems.length - 1
    );
  }, [allItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, goNext, goPrev]);

  // Track which category section is in view to highlight the jump-nav
  useEffect(() => {
    if (categories.length < 2) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute('data-slug');
            if (slug) setActiveCat(slug);
          }
        });
      },
      { rootMargin: '-170px 0px -60% 0px', threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  const scrollToCategory = (slug: string) => {
    const el = sectionRefs.current[slug];
    if (el) {
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (categories.length === 0) {
    return (
      <main className="bg-white min-h-screen">
        <HeroSection totalCategories={0} totalImages={0} />
        <section className="pt-16 pb-24">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center py-24 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-400 text-lg">
                No product categories available yet. Seed the database to get started.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <HeroSection totalCategories={categories.length} totalImages={allItems.length} />

      {/* ── Sticky category nav ── */}
      {categories.length > 1 && (
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => {
                const isActive = activeCat === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setActiveLetter(null);
                      scrollToCategory(cat.slug);
                    }}
                    className={`relative shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#1C1D1F] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* ── A–Z filter ── */}
            <div className="flex items-center gap-3 py-3 border-t border-gray-100">
              <span className="hidden sm:inline text-[11px] font-mono text-gray-400 uppercase tracking-wider shrink-0">
                Jump to
              </span>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  onClick={() => setActiveLetter(null)}
                  className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                    activeLetter === null
                      ? 'bg-[#FF5B22] text-white'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
                  const isAvailable = availableLetters.has(letter);
                  const isActive = activeLetter === letter;
                  return (
                    <button
                      key={letter}
                      disabled={!isAvailable}
                      onClick={() => setActiveLetter(letter)}
                      className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-[11px] font-mono font-bold transition-all duration-150 ${
                        isActive
                          ? 'bg-[#FF5B22] text-white'
                          : isAvailable
                          ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
                          : 'text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── No results for selected letter ── */}
      {activeLetter && filteredCategories.length === 0 && (
        <div className="max-w-[1400px] mx-auto px-6 py-16 text-center">
          <p className="text-gray-400">
            No categories starting with <span className="font-bold text-gray-600">{activeLetter}</span>.
          </p>
          <button
            onClick={() => setActiveLetter(null)}
            className="mt-3 text-sm font-semibold text-[#FF5B22] hover:underline cursor-pointer"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* ── Category Sections ── */}
      {filteredCategories.map((cat, catIdx) => {
        const catImages = [cat.coverImage, ...cat.images].filter(Boolean);
        const globalStartIdx = allItems.findIndex(
          (item) => item.url === catImages[0] && item.category === cat.name
        );
        const num = String(catIdx + 1).padStart(2, '0');

        return (
          <section
            key={cat._id}
            data-slug={cat.slug}
            ref={(el) => {
              sectionRefs.current[cat.slug] = el;
            }}
            className={`scroll-mt-32 ${
              catIdx < filteredCategories.length - 1 ? 'pt-14 pb-16' : 'pt-14 pb-24'
            } ${catIdx % 2 === 1 ? 'bg-gray-50/60' : ''}`}
          >
            <div className="max-w-[1400px] mx-auto px-6">
              {/* Category header */}
              <div className="flex items-start sm:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <span className="font-mono text-xs md:text-sm text-[#FF5B22] font-bold tracking-wider shrink-0">
                    {num}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                    {cat.name}
                  </h2>
                </div>
                <span className="hidden sm:inline-flex items-center font-mono text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1 shrink-0">
                  {catImages.length} {catImages.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-[#FF5B22]/40 via-gray-200 to-transparent mb-6" />
              <p className="text-gray-500 text-sm md:text-base mb-8 max-w-2xl">
                Browse our complete range of {cat.name.toLowerCase()}. High-quality precision
                components manufactured by Shree Shyam Precision.
              </p>

              {/* Image grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {catImages.map((image, imgIdx) => {
                  const globalIdx = globalStartIdx + imgIdx;
                  return (
                    <motion.button
                      key={`${cat.slug}-${imgIdx}`}
                      onClick={() => setLightboxIndex(globalIdx)}
                      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B22] focus-visible:ring-offset-2"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.35, delay: Math.min(imgIdx, 6) * 0.05 }}
                      whileHover={{ y: -3 }}
                    >
                      {/* corner brackets — toolpath reference mark, shown on hover */}
                      <span className="pointer-events-none absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FF5B22] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="pointer-events-none absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FF5B22] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                      <div className="aspect-square bg-white p-4 md:p-5">
                        <img
                          src={image}
                          alt={`${cat.name} — image ${imgIdx + 1}`}
                          loading={globalIdx < 4 ? 'eager' : 'lazy'}
                          className="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-500"
                        />
                      </div>

                      {/* zoom affordance */}
                      <span className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-[#1C1D1F]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6" />
                        </svg>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CTA ── */}
      <section className="relative border-t border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/photos/infra/cnc_machine.jpg)' }} />
        <div className="absolute inset-0 bg-[#1C1D1F]/85" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 py-14 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block font-mono text-[11px] tracking-widest text-[#FF5B22] font-bold mb-3 uppercase">
              Custom Tooling
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Need Custom Components?
            </h3>
            <p className="text-sm md:text-base text-gray-400 mb-7 max-w-lg mx-auto">
              Contact our team for detailed specifications, pricing, and availability.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex bg-[#FF5B22] hover:bg-[#e04b19] text-white font-bold py-3 px-8 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-[#FF5B22]/30 active:scale-[0.97]"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && currentItem && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${currentItem.category} image ${lightboxIndex + 1} of ${allItems.length}`}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Close lightbox"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {allItems.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <motion.div
              className="max-w-5xl w-full flex flex-col items-center justify-center"
              key={lightboxIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentItem.url}
                alt={`${currentItem.category} — image ${lightboxIndex + 1}`}
                className="w-full max-h-[70vh] md:max-h-[80vh] object-contain drop-shadow-2xl"
              />
              <div className="flex items-center gap-3 mt-4">
                <span className="text-white/80 text-sm font-semibold">{currentItem.category}</span>
                <span className="text-white/30">•</span>
                <span className="text-white/50 text-sm font-mono">
                  {lightboxIndex + 1} / {allItems.length}
                </span>
              </div>
            </motion.div>

            {allItems.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


function HeroSection({
  totalCategories,
  totalImages,
}: {
  totalCategories: number;
  totalImages: number;
}) {
  return (
      <section className="relative min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] pt-[130px] md:pt-[150px] lg:pt-[170px] pb-16 md:pb-24 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero_bg_1778760928163.png)' }} />
        <div className="absolute inset-0 bg-[#1C1D1F]/70">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1D1F]/80 via-[#2E2F31]/70 to-[#1C1D1F]/80" />
        {/* blueprint dot-grid texture, on-brand with precision manufacturing */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#FF5B22]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
        <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
          <ol className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-[#FF5B22] transition-colors duration-200">Home</Link>
            </li>
            <li aria-hidden="true" className="text-gray-600 select-none">/</li>
            <li className="text-white font-medium">Products</li>
          </ol>
        </nav>

        <span className="inline-flex items-center gap-2 font-mono text-[11px] md:text-xs tracking-widest text-[#FF5B22] font-bold uppercase mb-5 md:mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B22]" />
          Precision Component Catalog
        </span>

        <h1 className="text-[44px] md:text-[68px] lg:text-[84px] font-bold text-white leading-[1.02] tracking-tight">
          Products
        </h1>
        <p className="text-sm md:text-lg text-gray-400 max-w-[620px] leading-relaxed mt-4 md:mt-6">
          Explore our range of precision-engineered components. High-quality CNC turned parts
          by Shree Shyam Precision.
        </p>

        {totalCategories > 0 && (
          <div className="flex gap-8 md:gap-12 mt-10 md:mt-14">
            <Stat value={totalCategories} label={totalCategories === 1 ? 'Category' : 'Categories'} />
            <div className="w-px bg-white/10" />
            <Stat value={totalImages} label={totalImages === 1 ? 'Component' : 'Components'} />
          </div>
        )}
      </div>

      {/* scroll cue */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-gray-500">
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-gray-600 flex items-start justify-center p-1.5"
        >
          <span className="w-1 h-1.5 rounded-full bg-[#FF5B22]" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-mono text-2xl md:text-3xl font-bold text-[#FF5B22] leading-none">
        {String(value).padStart(2, '0')}
      </p>
      <p className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}