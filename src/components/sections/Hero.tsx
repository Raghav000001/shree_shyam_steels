"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Slide {
  bgImage: string;
  lightText: string;
  boldText: string;
  description: string;
}

const slides: Slide[] = [
  {
    bgImage: '/photos/home/hero_cnc_turning.png',
    lightText: 'Shree Shyam Precision',
    boldText: 'EXCELLENCE',
    description:
      'We are engaged in the manufacturing of precision CNC turned components, delivering reliable quality and superior performance to our customers.',
  },
  {
    bgImage: '/photos/home/hero_cnc_turning.png',
    lightText: 'PRECISION',
    boldText: 'MACHINING',
    description:
      'Manufacturing high-precision CNC turned components with advanced technology and strict quality control. Delivering accuracy, consistency and reliability in every part.',
  },
  {
    bgImage: '/photos/home/hero_cnc_turning.png',
    lightText: 'QUALITY',
    boldText: 'ASSURANCE',
    description:
      'Every component undergoes rigorous inspection and quality checks to ensure superior performance, dimensional accuracy and customer satisfaction.',
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slides[current].bgImage}')` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex items-center w-full min-h-screen">
        <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-36">
          <div className="max-w-[700px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <motion.span
                  className="inline-block text-[#FF5B22] text-sm md:text-base font-bold uppercase tracking-[0.25em] mb-4 md:mb-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Where Precision Meets Performance
                </motion.span>

                <motion.h1
                  className="text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase leading-[1.05] text-white mb-4 md:mb-6 drop-shadow-lg break-words"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slides[current].lightText}
                  <br />
                  <span className="text-[#FF5B22]">{slides[current].boldText}</span>
                </motion.h1>

                <motion.p
                  className="text-gray-300 text-[clamp(1rem,2vw,1.25rem)] font-light leading-[1.6] mb-6 md:mb-10 max-w-[600px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  {slides[current].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/contact-us')}
                    className="bg-[#FF5B22] hover:bg-[#e04b19] text-white font-bold py-3.5 px-9 uppercase text-sm tracking-wider transition-all duration-200 shadow-xl shadow-orange-900/30 cursor-pointer"
                  >
                    Contact Us
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3 mt-8 md:mt-12">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === current
                      ? 'w-10 bg-[#FF5B22]'
                      : 'w-4 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
