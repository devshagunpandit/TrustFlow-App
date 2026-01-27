/**
 * MarketingFooter - Professional Multi-Column Footer
 * 
 * Includes Product, Company, Legal, and Social links.
 * Required for Google OAuth verification (Privacy & Terms links).
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Twitter, Linkedin, Github, Youtube, Heart, ArrowUpRight, Check, Sparkles, Mail } from 'lucide-react';
import { companyInfo, footerLinks } from '@/data/landingPageData';
import confetti from 'canvas-confetti';

const MarketingFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialIcons = {
    twitter: Twitter,
    linkedin: Linkedin,
    github: Github,
    youtube: Youtube,
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  // Handle newsletter subscription with confetti
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Trigger confetti celebration
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from two corners
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#8b5cf6', '#6366f1', '#a855f7', '#fbbf24', '#22c55e'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#8b5cf6', '#6366f1', '#a855f7', '#fbbf24', '#22c55e'],
      });
    }, 250);

    setIsSubscribed(true);
    setIsSubmitting(false);
    setEmail('');

    // Reset after a while
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand Column */}
          <motion.div {...fadeInUp} className="col-span-2 sm:col-span-3 lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                TrustWall
              </span>
            </Link>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 max-w-xs">
              {companyInfo.description}. The easiest way to collect and showcase customer testimonials.
            </p>

            {/* Support Email - Prominently Displayed */}
            <a 
              href={`mailto:${companyInfo.supportEmail}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all group"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">{companyInfo.supportEmail}</span>
            </a>
          </motion.div>

          {/* Product Links */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    {link.href.startsWith('http') && (
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div {...fadeInUp} transition={{ delay: 0.15 }}>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('mailto:') ? (
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Feedback Links */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Feedback</h4>
            <ul className="space-y-3">
              {footerLinks.feedback.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links - Important for Google OAuth */}
          <motion.div {...fadeInUp} transition={{ delay: 0.25 }}>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Newsletter CTA */}
            <div className="max-w-md">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Stay up to date
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get the latest updates on new features, tips, and product news.
              </p>
            </div>

            {/* Newsletter Form with Confetti */}
            <form className="flex gap-2 w-full md:w-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribed}
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting || isSubscribed || !email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all flex items-center gap-2 min-w-[120px] justify-center ${
                  isSubscribed
                    ? 'bg-green-500 text-white shadow-green-500/25'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-violet-500/25 hover:shadow-violet-500/40'
                } disabled:opacity-70`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSubscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Subscribe
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.35 }}
          className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          {/* Copyright */}
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} {companyInfo.name}. All rights reserved.
          </p>

          {/* Made with love */}
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Made with
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            for creators worldwide
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
