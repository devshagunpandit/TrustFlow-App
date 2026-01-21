/**
 * About - About Us Page
 * 
 * Premium branded About Us page with company story and mission.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, Heart, Zap, Shield, Users, Target, Rocket, 
  Sparkles, CheckCircle, Globe 
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';
import CTASection from '@/components/marketing/CTASection';
import { companyInfo } from '@/data/landingPageData';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make starts with how it impacts our users.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Simplicity',
      description: 'Complex problems deserve simple, elegant solutions.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Trust & Privacy',
      description: 'Your data is yours. We protect it like our own.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Rocket,
      title: 'Innovation',
      description: 'We constantly push boundaries to deliver the best.',
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Testimonials Collected' },
    { value: '2,500+', label: 'Happy Customers' },
    { value: '50+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-0">
              <Users className="w-3 h-3 mr-1" />
              About Us
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Building Trust,{' '}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                One Testimonial at a Time
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We're on a mission to help businesses showcase authentic customer stories 
              and build meaningful trust with their audience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Why We Built TrustWall
              </h2>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg prose-slate dark:prose-invert max-w-none"
            >
              <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 md:p-10">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {companyInfo.name} was born from a simple observation: while testimonials are one 
                    of the most powerful conversion tools, collecting and displaying them was a painful, 
                    fragmented process.
                  </p>
                  
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    We saw businesses juggling screenshots, spreadsheets, and clunky tools just to 
                    showcase what their customers were already saying. Video testimonials? Even harder. 
                    So we set out to change that.
                  </p>
                  
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    Our vision is simple: make it effortless to collect, manage, and display beautiful 
                    testimonials that convert visitors into customers. Whether you're a solo creator, 
                    a growing startup, or an established agency, {companyInfo.name} gives you the tools 
                    to build trust at scale.
                  </p>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Today, thousands of businesses use {companyInfo.name} to collect video and text 
                    testimonials, embed stunning widgets on their websites, and boost their conversion 
                    rates. And we're just getting started.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-0">
              <Target className="w-3 h-3 mr-1" />
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              These core principles guide every decision we make.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-lg`}>
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Globe className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Our Mission
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
              "To empower every business to harness the power of authentic customer stories, 
              making trust-building effortless and beautiful."
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {['Easy to Use', 'Beautiful Design', 'Privacy First', 'Always Improving'].map((tag) => (
                <div key={tag} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </MarketingLayout>
  );
};

export default About;
