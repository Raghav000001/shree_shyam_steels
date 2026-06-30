'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageBanner from '@/components/ui/PageBanner';
import AboutSection from '@/components/sections/About';
import VisionMission from '@/components/sections/VisionMission';

export default function AboutUsClient() {
  return (
    <main>
      <PageBanner
        title="About Us"
        subtitle="Home > About Us"
        bgImage="/photos/about/hero_about_us.png"
      />

      <AboutSection />

      <motion.section
        className="py-20 bg-gray-50 overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <motion.h2
            className="text-2xl md:text-3xl font-bold uppercase text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our History
          </motion.h2>
          <motion.div
            className="w-16 h-1 bg-[#FF5B22] mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.p
            className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Established in 2026, Shree Shyam Precision was founded with a vision to deliver high-quality precision CNC machined components to various industries. From the very beginning, our focus has been on precision, quality and customer satisfaction.
          </motion.p>
          <motion.p
            className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Equipped with CNC machines and modern manufacturing practices, we specialize in the production of precision turned and machined components as per customer requirements. Our commitment to maintaining strict quality standards ensures reliable and consistent products.
          </motion.p>
          <motion.p
            className="text-gray-600 leading-relaxed text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            As a growing company, we continuously strive to enhance our manufacturing capabilities, adopt new technologies and build long-term relationships with our customers through dependable service and timely delivery. With a strong foundation and a dedication to excellence, we are committed to establishing ourselves as a trusted name in the CNC manufacturing industry.
          </motion.p>
        </div>
      </motion.section>

      <section className="py-28 bg-white overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gray-500 font-medium tracking-wide uppercase text-sm mb-2 block">
              Our Strengths
            </span>
            <h2 className="text-3xl lg:text-4xl uppercase font-bold text-gray-800">
              Core Values
            </h2>
            <motion.div
              className="w-12 h-1 bg-[#FF5B22] mx-auto mt-4"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                src: '/Item Details/About Us/Quality Assurance.jpeg',
                title: 'Quality Assurance',
                desc: 'Committed to the highest standards of quality in every product we deliver.',
              },
              {
                src: '/images/core_values2.jpeg',
                title: 'Customized Solutions',
                desc: 'Tailored steel processing and component manufacturing to meet unique client requirements.',
              },
              {
                src: '/Item Details/About Us/Efficient Service.jpeg',
                title: 'Efficient Service',
                desc: 'Timely delivery and responsive support built on long-standing client partnerships.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="group relative overflow-hidden rounded-xl bg-gray-100 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <VisionMission />
    </main>
  );
}
