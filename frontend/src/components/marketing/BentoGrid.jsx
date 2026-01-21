/**
 * BentoGrid - Feature Highlights in Bento Box Layout
 * 
 * Displays features in a visually appealing bento grid with
 * gradient backgrounds and premium/free indicators.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, FolderOpen, Moon, BarChart3, Palette, Code, 
  Crown, Sparkles, Lock 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { bentoFeatures } from '@/data/landingPageData';
import { cn } from '@/lib/utils';

// Icon mapping
const iconMap = {
  Video,
  FolderOpen,
  Moon,
  BarChart3,
  Palette,
  Code,
};

const BentoGrid = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <section className="py-20 md:py-28 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Powerful Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need to build trust
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From collection to display, TrustWall provides all the tools you need to leverage social proof effectively.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {bentoFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Sparkles;
            const isLarge = feature.size === 'large';
            const isMedium = feature.size === 'medium';

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 backdrop-blur-sm',
                  isLarge && 'md:col-span-2 md:row-span-2',
                  isMedium && 'md:row-span-2'
                )}
              >
                {/* Gradient overlay on hover */}
                <div 
                  className={cn(
                    'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br',
                    feature.gradient
                  )} 
                />

                {/* Content */}
                <div className={cn(
                  'relative p-6 md:p-8 h-full flex flex-col',
                  isLarge && 'md:p-10'
                )}>
                  {/* Premium badge */}
                  {feature.isPremium && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
                        <Crown className="w-3 h-3" />
                        Pro
                      </Badge>
                    </div>
                  )}

                  {/* Icon */}
                  <div 
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br text-white shadow-lg',
                      feature.gradient
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className={cn(
                    'font-bold text-slate-900 dark:text-white mb-2',
                    isLarge ? 'text-2xl' : 'text-xl'
                  )}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={cn(
                    'text-slate-600 dark:text-slate-400 flex-grow',
                    isLarge ? 'text-lg' : 'text-base'
                  )}>
                    {feature.description}
                  </p>

                  {/* Large card visual */}
                  {isLarge && (
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i}
                            className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center"
                          >
                            <Icon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Decorative corner gradient */}
                <div 
                  className={cn(
                    'absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br',
                    feature.gradient
                  )}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 dark:text-slate-400">
            And many more features to explore.{' '}
            <a 
              href="/features" 
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              See all features →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoGrid;
