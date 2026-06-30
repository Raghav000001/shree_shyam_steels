'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function VisionMission() {
  return (
    <section className="py-24 bg-[#0A192F] text-white relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#FF5B22] w-fit px-12 py-3 mb-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-white">Vision</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
              At Shree Shyam Precision, our vision is to develop innovative and reliable technologies that automate processes and contribute to a cleaner, safer, and more efficient world. We are committed to delivering solutions that enhance productivity, improve safety and optimize energy efficiency, enabling businesses to grow sustainably while minimizing their environmental impact.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#FF5B22] w-fit px-12 py-3 mb-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-white">Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
              At Shree Shyam precision, our mission is to build a strong and trusted reputation in the manufacturing of precision auto components. We are committed to delivering high-quality, precision engineered solutions that meet the unique requirements of our customers. By focusing on innovation, reliability and continuous improvement, we strive to exceed customer expectations and build long-term relationships based on trust, quality and excellence.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative background overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 0% 0%, rgba(255, 91, 34, 0.2) 0%, transparent 60%)'
        }} 
      />
    </section>
  );
}
