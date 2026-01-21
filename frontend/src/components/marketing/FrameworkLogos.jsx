/**
 * FrameworkLogos - Integration Logos with Brand Color Glow
 * 
 * Displays logos for supported frameworks with hover glow effects.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { frameworkLogos } from '@/data/landingPageData';

const FrameworkLogos = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Works with your favorite stack
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Integrate TrustWall with any platform in minutes. Native support for all major frameworks.
          </p>
        </motion.div>

        {/* Logo Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-4 md:grid-cols-8 gap-6 md:gap-8 max-w-4xl mx-auto"
        >
          {frameworkLogos.map((framework, index) => (
            <motion.div
              key={framework.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.15, y: -5 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                style={{ backgroundColor: framework.brandColor }}
              />

              {/* Logo container */}
              <div className="relative flex items-center justify-center h-16 md:h-20 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-transparent group-hover:shadow-xl transition-all duration-300">
                <img
                  src={framework.logoUrl}
                  alt={framework.altText}
                  className="h-8 md:h-10 w-auto object-contain dark:brightness-200"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to text if image fails
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-xs font-medium text-slate-500">${framework.name}</span>`;
                  }}
                />
              </div>

              {/* Label on hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-0 right-0 text-center"
              >
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {framework.name}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* "And more" text */}
        <motion.p
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12 text-slate-500 dark:text-slate-400"
        >
          + any website with a simple embed code
        </motion.p>
      </div>
    </section>
  );
};

export default FrameworkLogos;
