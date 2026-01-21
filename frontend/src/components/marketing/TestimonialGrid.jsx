/**
 * TestimonialGrid - Wall of Love Display
 * 
 * Displays testimonials in a beautiful masonry-style grid.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { testimonials } from '@/data/landingPageData';
import { cn } from '@/lib/utils';

const TestimonialGrid = ({ 
  showHeader = true, 
  maxItems = null, 
  className = '' 
}) => {
  const displayTestimonials = maxItems 
    ? testimonials.slice(0, maxItems) 
    : testimonials;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <section className={cn('py-20 md:py-28', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {showHeader && (
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <Badge className="mb-4 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-0">
              <Quote className="w-3 h-3 mr-1" />
              Wall of Love
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Loved by thousands of users
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              See what our customers are saying about TrustWall
            </p>
          </motion.div>
        )}

        {/* Testimonial Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={cn(
                testimonial.featured && index === 0 && 'sm:col-span-2 lg:col-span-1'
              )}
            >
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300">
                <CardContent className="p-6">
                  {/* Video indicator if video type */}
                  {testimonial.type === 'video' && (
                    <div className="relative mb-4 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 aspect-video flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-violet-600 fill-violet-600 ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Star rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < testimonial.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600'
                        )}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-100 dark:ring-violet-900"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7c3aed&color=fff`;
                      }}
                    />
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialGrid;
