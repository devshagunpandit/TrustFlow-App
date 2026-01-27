/**
 * LogoMarquee - Infinite Scrolling Logo Strip
 * 
 * Displays "Trusted by modern teams" with a smooth infinite scroll of logos.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { trustedByLogos } from '@/data/landingPageData';

const LogoMarquee = () => {
  // Double the logos for seamless infinite scroll
  const duplicatedLogos = [...trustedByLogos, ...trustedByLogos];

  return (
    <section className="py-16 md:py-20 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
        >
          Trusted by modern teams at
        </motion.p>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10" />

        {/* Scrolling track */}
        <motion.div
          animate={{
            x: [0, -50 * trustedByLogos.length],
          }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          className="flex gap-12 md:gap-16"
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center h-12 w-32 md:w-40 group"
            >
              <img
                src={logo.logoUrl}
                alt={logo.altText}
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LogoMarquee;
