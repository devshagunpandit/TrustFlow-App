/**
 * HeroSection - Premium Hero with Animated Background
 * 
 * Features huge bold typography, gradient text, animated mesh gradient,
 * and a 3D-style mockup of the dashboard.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Sparkles, Star, CheckCircle } from 'lucide-react';
import { heroContent } from '@/data/landingPageData';
import AnimatedBackground from './AnimatedBackground';

const HeroSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="hero" />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Badge className="mb-6 px-4 py-2 bg-violet-100/80 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-0 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              {heroContent.badge}
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="block text-slate-900 dark:text-white">
              {heroContent.headlineStart}
            </span>
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {heroContent.headlineHighlight}
            </span>
            <span className="block text-slate-900 dark:text-white">
              {heroContent.headlineEnd}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {heroContent.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to={heroContent.primaryCTA.href}>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {heroContent.primaryCTA.label}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={heroContent.secondaryCTA.href}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                {heroContent.secondaryCTA.label}
              </Button>
            </Link>
          </motion.div>

          {/* Quick benefits */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-slate-600 dark:text-slate-400"
          >
            {['Free Forever Plan', 'No Credit Card Required', 'Setup in 2 Minutes'].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {benefit}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 md:mt-24 max-w-5xl mx-auto"
        >
          <div className="relative perspective-1000">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl blur-2xl opacity-20" />
            
            {/* Mockup container */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-md mx-auto bg-white dark:bg-slate-700 rounded-lg px-4 py-1.5 text-sm text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600">
                    trustwall.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard preview */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Total Testimonials', value: '1,247', icon: Star },
                    { label: 'This Month', value: '+89', icon: Sparkles },
                    { label: 'Conversion Rate', value: '+24%', icon: CheckCircle },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                        <stat.icon className="w-4 h-4" />
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
                
                {/* Testimonial cards preview */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded mb-3" />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400" />
                        <div>
                          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-2 w-16 bg-slate-100 dark:bg-slate-600 rounded mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto"
        >
          {heroContent.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
