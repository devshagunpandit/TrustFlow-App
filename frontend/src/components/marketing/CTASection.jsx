/**
 * CTASection - Bottom CTA with Gradient Background and ROI Dashboard
 * 
 * Large, impactful CTA section with animated ROI graphs to drive conversions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Users, Star, Eye, MousePointer, BarChart3 } from 'lucide-react';
import { ctaSection } from '@/data/landingPageData';
import AnimatedBackground from './AnimatedBackground';

// Animated Counter Component
const AnimatedCounter = ({ target, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ROI Dashboard Component
const ROIDashboard = () => {
  const [phase, setPhase] = useState(0); // 0: numbers, 1: bars, 2: full graphs
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    const timers = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 2500),
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  const stats = [
    { label: 'Testimonials', value: 2847, icon: Star, color: 'from-amber-400 to-orange-500' },
    { label: 'Page Views', value: 45200, icon: Eye, color: 'from-blue-400 to-indigo-500' },
    { label: 'Conversions', value: 1234, icon: MousePointer, color: 'from-green-400 to-emerald-500' },
    { label: 'Growth', value: 156, suffix: '%', icon: TrendingUp, color: 'from-violet-400 to-purple-500' },
  ];

  const barData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 48 },
    { month: 'Apr', value: 65 },
    { month: 'May', value: 78 },
    { month: 'Jun', value: 95 },
  ];

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto mb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {isInView && <AnimatedCounter target={stat.value} suffix={stat.suffix || ''} />}
            </div>
            <div className="text-xs text-white/70">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-white/80" />
                <span className="text-white font-medium text-sm sm:text-base">Conversion Growth</span>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-green-400 text-xs sm:text-sm font-medium"
              >
                +156% this quarter
              </motion.span>
            </div>
            
            <div className="flex items-end justify-between h-24 sm:h-32 gap-1 sm:gap-2">
              {barData.map((bar, i) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: phase >= 2 ? `${bar.value}%` : '20%' }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className="w-full bg-gradient-to-t from-violet-500 to-indigo-400 rounded-t-lg min-h-[8px]"
                  />
                  <span className="text-[10px] sm:text-xs text-white/60">{bar.month}</span>
                </div>
              ))}
            </div>

            {/* Growth Line */}
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-400" />
                    <span className="text-white/70">Before TrustWall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-white/70">After TrustWall</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600" />
          
          {/* Animated overlay */}
          <AnimatedBackground variant="cta" />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

          {/* Content */}
          <div className="relative px-6 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-6" />
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {ctaSection.headline}
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {ctaSection.subheadline}
              </p>

              {/* ROI Dashboard */}
              <ROIDashboard />

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={ctaSection.primaryCTA.href}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-violet-600 hover:bg-slate-100 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    {ctaSection.primaryCTA.label}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={ctaSection.secondaryCTA.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl transition-all duration-300"
                  >
                    {ctaSection.secondaryCTA.label}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
