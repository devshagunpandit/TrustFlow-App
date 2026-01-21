/**
 * FeaturesPage - Detailed Feature Breakdown
 * 
 * Comprehensive features page with alternating layout sections,
 * tech specs, and integration details.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Video, MessageSquare, Star, Image, Layout, Moon, Palette, Monitor,
  Code, Zap, Search, Blocks, Globe, Webhook, Terminal, BarChart3,
  ArrowRight, CheckCircle, Sparkles, Shield, Play, Pause, Download,
  FileText, Upload, Settings, TrendingUp, Users, Eye, MousePointer,
  FileSpreadsheet, FileJson, PieChart, Bell, Send, Heart
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';
import FrameworkLogos from '@/components/marketing/FrameworkLogos';
import CTASection from '@/components/marketing/CTASection';
import { featuresPageData } from '@/data/landingPageData';

// Icon mapping
const iconMap = {
  Video, MessageSquare, Star, Image, Layout, Moon, Palette, Monitor,
  Code, Zap, Search, Blocks, Globe, Webhook, Terminal, BarChart3,
  Download, FileText, Upload, Settings,
};

// ============================================================================
// INTERACTIVE FEATURE UI COMPONENTS
// ============================================================================

// Collection Feature UI - Video recording mockup
const CollectionFeatureUI = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Video Preview Area */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl aspect-video overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
          </motion.div>
        </div>
        
        {/* Recording indicator */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 backdrop-blur px-3 py-1.5 rounded-full"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-3 h-3 rounded-full bg-white"
            />
            <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsRecording(!isRecording);
            if (!isRecording) setRecordingTime(0);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isRecording
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
          }`}
        >
          {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </motion.button>
      </div>

      {/* Features List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {['HD Quality', 'No App Needed', 'Auto Upload'].map((feature, i) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg"
          >
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Widget Presets Feature UI
const PresetsFeatureUI = () => {
  const [activePreset, setActivePreset] = useState(0);
  const presets = [
    { name: 'Minimal', bg: 'bg-white dark:bg-slate-800', accent: 'border-slate-200 dark:border-slate-700' },
    { name: 'Gradient', bg: 'bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20', accent: 'border-violet-200 dark:border-violet-700' },
    { name: 'Bold', bg: 'bg-slate-900 dark:bg-slate-950', accent: 'border-violet-500', textColor: 'text-white' },
    { name: 'Glass', bg: 'bg-white/60 dark:bg-slate-800/60 backdrop-blur', accent: 'border-white/50 dark:border-slate-600/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Preset Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presets.map((preset, i) => (
          <motion.button
            key={preset.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActivePreset(i)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activePreset === i
                ? 'bg-violet-600 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {preset.name}
          </motion.button>
        ))}
      </div>

      {/* Preview Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePreset}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${presets[activePreset].bg} ${presets[activePreset].accent} ${presets[activePreset].textColor || ''} border-2 rounded-2xl p-6`}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className={`text-sm mb-3 ${presets[activePreset].textColor || 'text-slate-600 dark:text-slate-300'}`}>
                "This product completely transformed our workflow. Highly recommended!"
              </p>
              <div className={`text-sm font-medium ${presets[activePreset].textColor || 'text-slate-900 dark:text-white'}`}>
                Sarah Johnson
              </div>
              <div className={`text-xs ${presets[activePreset].textColor ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                CEO, TechStart
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="text-center">
        <Badge className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-0">
          15+ Premium Presets Available
        </Badge>
      </div>
    </div>
  );
};

// Card Layouts Feature UI
const CardLayoutsFeatureUI = () => {
  const [activeLayout, setActiveLayout] = useState(0);
  
  const layouts = [
    {
      name: 'Classic',
      render: () => (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
            "TrustWall has completely transformed how we collect and display customer feedback. Highly recommended!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">John Doe</div>
              <div className="text-xs text-slate-500">CEO, TechStart</div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Quote',
      render: () => (
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-6 relative">
          <div className="text-6xl text-violet-300 dark:text-violet-700 absolute top-2 left-4">"</div>
          <p className="text-lg text-slate-700 dark:text-slate-300 italic pt-8 pb-4 relative z-10">
            The best investment we made this year.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Emily Chen</div>
              <div className="text-sm text-slate-500">Product Lead</div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Modern',
      render: () => (
        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-slate-300 mb-4">Incredible tool. Our conversions went up 40%!</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400" />
            <div>
              <div className="font-medium">Alex Thompson</div>
              <div className="text-sm text-slate-400">Founder, LaunchPad</div>
            </div>
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Layout Tabs */}
      <div className="flex gap-2">
        {layouts.map((layout, i) => (
          <motion.button
            key={layout.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveLayout(i)}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeLayout === i
                ? 'bg-violet-600 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {layout.name}
          </motion.button>
        ))}
      </div>

      {/* Layout Preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLayout}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {layouts[activeLayout].render()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Combo Packs Feature UI
const ComboPacksFeatureUI = () => {
  const [activePack, setActivePack] = useState(0);
  const packs = ['Elegant', 'Startup', 'Agency'];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center">
        {packs.map((pack, i) => (
          <motion.button
            key={pack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePack(i)}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
              activePack === i
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {pack}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activePack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 gap-4"
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl ${
              activePack === 0 ? 'bg-slate-50 dark:bg-slate-800' :
              activePack === 1 ? 'bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20' :
              'bg-slate-900 dark:bg-slate-950 text-white'
            }`}
          >
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className={`h-8 rounded mb-2 ${
              activePack === 2 ? 'bg-slate-800' : 'bg-slate-200 dark:bg-slate-700'
            }`} />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400" />
              <div className={`h-3 w-16 rounded ${
                activePack === 2 ? 'bg-slate-700' : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center gap-3">
        <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-0">
          <Zap className="w-3 h-3 mr-1" /> One-Click Apply
        </Badge>
      </div>
    </div>
  );
};

// Widget Designer Feature UI
const WidgetDesignerFeatureUI = () => {
  const [bgColor, setBgColor] = useState('#f8fafc');
  const [textColor, setTextColor] = useState('#1e293b');
  const [accentColor, setAccentColor] = useState('#8b5cf6');

  return (
    <div className="space-y-6">
      {/* Color Controls */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <span className="text-xs text-slate-500">{bgColor}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Text</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <span className="text-xs text-slate-500">{textColor}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Accent</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <span className="text-xs text-slate-500">{accentColor}</span>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <motion.div
        layout
        style={{ backgroundColor: bgColor }}
        className="rounded-2xl p-6 transition-colors duration-300 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} style={{ color: accentColor, fill: accentColor }} className="w-5 h-5" />
          ))}
        </div>
        <p style={{ color: textColor }} className="text-sm mb-4 transition-colors">
          "Customization options are incredible! Made our widget match perfectly."
        </p>
        <div className="flex items-center gap-3">
          <div style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)` }} className="w-10 h-10 rounded-full" />
          <div>
            <div style={{ color: textColor }} className="font-medium text-sm">Designer Pro</div>
            <div style={{ color: textColor + '99' }} className="text-xs">UI/UX Lead</div>
          </div>
        </div>
      </motion.div>

      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        <Settings className="w-4 h-4 inline mr-1" />
        Live Preview - Changes update instantly
      </div>
    </div>
  );
};

// FOMO Popups Feature UI
const FomoPopupsFeatureUI = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }, 5000);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[280px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden">
      {/* Website Mockup */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 h-6 bg-white dark:bg-slate-700 rounded-lg" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>

      {/* FOMO Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 max-w-[200px] border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">Sarah</span> just left a 5-star review
                </p>
                <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4">
        <Badge className="bg-violet-600 text-white border-0">
          <Bell className="w-3 h-3 mr-1" /> Auto-Shows
        </Badge>
      </div>
    </div>
  );
};

// CTA Analytics Feature UI with animated graphs
const CTAAnalyticsFeatureUI = () => {
  const [showGraphs, setShowGraphs] = useState(false);
  const data = [
    { label: 'Views', value: 12847, color: 'from-blue-500 to-blue-600', height: 85 },
    { label: 'Clicks', value: 2341, color: 'from-violet-500 to-violet-600', height: 60 },
    { label: 'Conversions', value: 847, color: 'from-green-500 to-green-600', height: 45 },
    { label: 'CTR', value: '18.2%', color: 'from-amber-500 to-amber-600', height: 70 },
  ];

  useEffect(() => {
    setTimeout(() => setShowGraphs(true), 500);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {data.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-2 sm:p-3 text-center border border-slate-200 dark:border-slate-700"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white"
            >
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </motion.div>
            <div className="text-xs text-slate-500">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-end justify-between h-28 sm:h-32 gap-2 sm:gap-3">
          {data.map((item, i) => (
            <div key={item.label} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: showGraphs ? `${item.height}%` : 0 }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: 'easeOut' }}
                className={`w-full bg-gradient-to-t ${item.color} rounded-t-lg min-h-[4px]`}
              />
              <span className="text-xs text-slate-500 mt-2 truncate w-full text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-0">
          <Eye className="w-3 h-3 mr-1" /> Real-time
        </Badge>
        <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-0">
          <TrendingUp className="w-3 h-3 mr-1" /> +23% this week
        </Badge>
      </div>
    </div>
  );
};

// Custom Domains Feature UI
const CustomDomainsFeatureUI = () => {
  const [domain, setDomain] = useState('testimonials');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVerified(true), 2000);
    return () => clearTimeout(timer);
  }, [domain]);

  return (
    <div className="space-y-6">
      {/* Domain Input */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
          Your Custom Domain
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <input
              type="text"
              value={domain}
              onChange={(e) => { setDomain(e.target.value); setIsVerified(false); }}
              className="flex-1 px-4 py-3 bg-transparent text-slate-900 dark:text-white text-sm outline-none"
            />
            <span className="px-3 text-slate-500 text-sm">.yoursite.com</span>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center justify-between p-4 rounded-xl ${
          isVerified
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <Globe className={`w-5 h-5 ${isVerified ? 'text-green-600' : 'text-amber-600'}`} />
          <span className={`font-medium ${isVerified ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {domain}.yoursite.com
          </span>
        </div>
        <Badge className={isVerified 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-0'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0'
        }>
          {isVerified ? '✓ Verified' : 'Verifying...'}
        </Badge>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3">
        {['SSL Certificate', 'No Tech Required'].map((feature, i) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            {feature}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Custom Forms Feature UI
const CustomFormsFeatureUI = () => {
  const [formFields] = useState([
    { label: 'Your Name', type: 'text', required: true },
    { label: 'Company', type: 'text', required: false },
    { label: 'Rating', type: 'stars', required: true },
    { label: 'Your Feedback', type: 'textarea', required: true },
  ]);

  return (
    <div className="space-y-4">
      {/* Form Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Share Your Experience</h4>
            <p className="text-xs text-slate-500">We'd love to hear from you!</p>
          </div>
        </div>

        <div className="space-y-4">
          {formFields.map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'stars' ? (
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-6 h-6 text-amber-400 fill-amber-400 cursor-pointer hover:scale-110 transition-transform" />
                  ))}
                </div>
              ) : field.type === 'textarea' ? (
                <div className="h-16 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700" />
              ) : (
                <div className="h-10 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg"
        >
          Submit Testimonial
        </motion.button>
      </div>

      <div className="flex justify-center gap-3">
        <Badge className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-0">
          <Settings className="w-3 h-3 mr-1" /> Fully Customizable
        </Badge>
        <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-0">
          <Palette className="w-3 h-3 mr-1" /> Brand Colors
        </Badge>
      </div>
    </div>
  );
};

// Export Data Feature UI
const ExportDataFeatureUI = () => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const formats = [
    { name: 'CSV', icon: FileSpreadsheet, color: 'text-green-600' },
    { name: 'Excel', icon: FileSpreadsheet, color: 'text-emerald-600' },
  ];

  const handleExport = () => {
    setExporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setExporting(false), 500);
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Export Formats */}
      <div className="grid grid-cols-2 gap-4">
        {formats.map((format, i) => (
          <motion.div
            key={format.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <format.icon className={`w-8 h-8 mx-auto mb-2 ${format.color}`} />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{format.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Export Preview */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 font-mono text-sm">
        <div className="text-slate-500 mb-2"># Exported data preview</div>
        <div className="text-green-400">{`{`}</div>
        <div className="pl-4 text-slate-300">
          <div><span className="text-violet-400">"testimonials"</span>: <span className="text-amber-400">847</span>,</div>
          <div><span className="text-violet-400">"spaces"</span>: <span className="text-amber-400">5</span>,</div>
          <div><span className="text-violet-400">"total_views"</span>: <span className="text-amber-400">12847</span></div>
        </div>
        <div className="text-green-400">{`}`}</div>
      </div>

      {/* Export Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        disabled={exporting}
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {exporting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Exporting... {progress}%
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Export All Data
          </>
        )}
      </motion.button>

      {exporting && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
        />
      )}
    </div>
  );
};

// Webhooks Feature UI - Interactive webhook configuration
const WebhooksFeatureUI = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourapp.com/webhooks');
  const [selectedEvents, setSelectedEvents] = useState(['new_testimonial', 'rating_received']);
  const [testStatus, setTestStatus] = useState(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const events = [
    { id: 'new_testimonial', label: 'New Testimonial', icon: MessageSquare, color: 'text-violet-500' },
    { id: 'rating_received', label: 'Rating Received', icon: Star, color: 'text-amber-500' },
    { id: 'video_uploaded', label: 'Video Uploaded', icon: Video, color: 'text-blue-500' },
    { id: 'testimonial_approved', label: 'Testimonial Approved', icon: CheckCircle, color: 'text-green-500' },
  ];

  const toggleEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const testWebhook = () => {
    setIsTestingWebhook(true);
    setTestStatus(null);
    setTimeout(() => {
      setTestStatus('success');
      setIsTestingWebhook(false);
    }, 1500);
  };

  return (
    <div className="space-y-5">
      {/* Webhook URL Input */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
          <Webhook className="w-4 h-4 text-violet-500" />
          Webhook Endpoint
        </label>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <span className="px-3 text-slate-400 text-sm border-r border-slate-200 dark:border-slate-700">POST</span>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1 px-3 py-3 bg-transparent text-slate-900 dark:text-white text-sm outline-none"
              placeholder="https://your-endpoint.com/webhook"
            />
          </div>
        </div>
      </div>

      {/* Event Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-500" />
          Trigger Events
        </label>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {events.map((event) => {
            const Icon = event.icon;
            const isSelected = selectedEvents.includes(event.id);
            return (
              <motion.button
                key={event.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleEvent(event.id)}
                className={`flex items-center gap-2 p-3 rounded-lg text-left text-sm transition-all ${
                  isSelected
                    ? 'bg-violet-100 dark:bg-violet-900/40 border-2 border-violet-500'
                    : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-violet-600' : event.color}`} />
                <span className={`${isSelected ? 'text-violet-700 dark:text-violet-300 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                  {event.label}
                </span>
                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-violet-600 ml-auto flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Payload Preview */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-hidden">
        <div className="flex items-center gap-2 mb-3 text-slate-400">
          <Terminal className="w-4 h-4" />
          <span>Webhook Payload Preview</span>
        </div>
        <div className="text-green-400">{`{`}</div>
        <div className="pl-4 text-slate-300 space-y-0.5">
          <div><span className="text-violet-400">"event"</span>: <span className="text-amber-400">"new_testimonial"</span>,</div>
          <div><span className="text-violet-400">"timestamp"</span>: <span className="text-amber-400">"2024-01-20T10:30:00Z"</span>,</div>
          <div><span className="text-violet-400">"data"</span>: {`{`}</div>
          <div className="pl-4">
            <div><span className="text-violet-400">"rating"</span>: <span className="text-amber-400">5</span>,</div>
            <div><span className="text-violet-400">"author"</span>: <span className="text-amber-400">"John Doe"</span></div>
          </div>
          <div>{`}`}</div>
        </div>
        <div className="text-green-400">{`}`}</div>
      </div>

      {/* Test Webhook Button */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={testWebhook}
          disabled={isTestingWebhook}
          className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isTestingWebhook ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Test Webhook
            </>
          )}
        </motion.button>
      </div>

      {/* Test Result */}
      <AnimatePresence>
        {testStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 dark:text-green-400 font-medium">Webhook delivered successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features */}
      <div className="flex justify-center gap-3 flex-wrap">
        <Badge className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-0">
          <Zap className="w-3 h-3 mr-1" /> Real-time
        </Badge>
        <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-0">
          <Shield className="w-3 h-3 mr-1" /> Secure
        </Badge>
      </div>
    </div>
  );
};

// Map section IDs to their interactive UI components
const sectionUIMap = {
  collection: CollectionFeatureUI,
  presets: PresetsFeatureUI,
  'card-layouts': CardLayoutsFeatureUI,
  combos: ComboPacksFeatureUI,
  'widget-designer': WidgetDesignerFeatureUI,
  'fomo-popups': FomoPopupsFeatureUI,
  'cta-analytics': CTAAnalyticsFeatureUI,
  'custom-domains': CustomDomainsFeatureUI,
  'custom-forms': CustomFormsFeatureUI,
  'export-data': ExportDataFeatureUI,
  'webhooks': WebhooksFeatureUI,
};

// Additional sections data
const additionalSections = [
  {
    id: 'custom-domains',
    title: 'Custom Domains',
    description: 'Connect your own domain for a fully branded experience. testimonials.yoursite.com looks more professional and builds trust.',
    features: [
      { title: 'Your Domain', description: 'Use any subdomain you own.', icon: 'Globe' },
      { title: 'SSL Included', description: 'Automatic HTTPS for security.', icon: 'Shield' },
      { title: 'Easy Setup', description: 'Simple DNS configuration wizard.', icon: 'Settings' },
      { title: 'Instant Verification', description: 'Quick domain verification process.', icon: 'Zap' },
    ],
    imagePosition: 'right',
  },
  {
    id: 'custom-forms',
    title: 'Custom Collection Forms',
    description: 'Create beautiful, branded forms to collect testimonials. Add custom fields, adjust styling, and match your brand perfectly.',
    features: [
      { title: 'Custom Fields', description: 'Add any fields you need.', icon: 'Layout' },
      { title: 'Brand Colors', description: 'Match your brand identity.', icon: 'Palette' },
      { title: 'Smart Validation', description: 'Ensure quality submissions.', icon: 'CheckCircle' },
      { title: 'Video & Text', description: 'Collect both formats seamlessly.', icon: 'Video' },
    ],
    imagePosition: 'left',
  },
  {
    id: 'export-data',
    title: 'Export Your Data',
    description: 'Download all your testimonials and analytics in multiple formats. Your data is always yours - export anytime.',
    features: [
      { title: 'Multiple Formats', description: 'CSV and Excel exports.', icon: 'Download' },
      { title: 'Full Analytics', description: 'Export all performance data.', icon: 'BarChart3' },
      { title: 'Scheduled Exports', description: 'Automate regular backups.', icon: 'Zap' },
      { title: 'API Access', description: 'Programmatic data access.', icon: 'Code' },
    ],
    imagePosition: 'right',
  },
  {
    id: 'webhooks',
    title: 'Webhooks Integration',
    description: 'Connect TrustWall to your favorite tools. Get real-time notifications when new testimonials arrive.',
    features: [
      { title: 'Real-time Events', description: 'Instant notifications for new testimonials.', icon: 'Zap' },
      { title: 'Custom Endpoints', description: 'Send data to any URL you choose.', icon: 'Globe' },
      { title: 'Event Filtering', description: 'Choose which events trigger webhooks.', icon: 'Settings' },
      { title: 'Secure Delivery', description: 'Signed payloads for verification.', icon: 'Shield' },
    ],
    imagePosition: 'left',
  },
];

// Shield icon for additional sections
const additionalIconMap = {
  ...iconMap,
  Shield,
  CheckCircle,
};

// Default Feature UI for sections without custom UI
const DefaultFeatureUI = ({ section }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>
      <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded-lg" />
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-lg" />
        <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg" />
      </div>
    </div>
  );
};

const FeaturesPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  // Combine original sections with additional sections
  const allSections = [...featuresPageData.sections, ...additionalSections];

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
              <Sparkles className="w-3 h-3 mr-1" />
              {featuresPageData.hero.badge}
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              {featuresPageData.hero.headline}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {featuresPageData.hero.subheadline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Sections - Large Layout for Desktop (2 features per screen) */}
      {allSections.map((section, sectionIndex) => {
        const SectionUI = sectionUIMap[section.id];
        const useAdditionalIcons = additionalSections.some(s => s.id === section.id);
        const currentIconMap = useAdditionalIcons ? additionalIconMap : iconMap;
        
        return (
          <section 
            key={section.id} 
            className={`md:min-h-[85vh] flex items-center py-12 md:py-20 lg:py-24 overflow-hidden ${
              sectionIndex % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-900/30'
            }`}
          >
            <div className="container mx-auto px-4">
              <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center ${
                section.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Text Content */}
                <motion.div
                  {...fadeInUp}
                  transition={{ duration: 0.5 }}
                  className={section.imagePosition === 'left' ? 'lg:order-2' : ''}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6">
                      {section.title}
                    </h2>
                    <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 lg:mb-10">
                      {section.description}
                    </p>
                  </motion.div>

                  {/* Feature list - 2 columns on larger screens */}
                  <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
                    {section.features.map((feature, featureIndex) => {
                      const Icon = currentIconMap[feature.icon] || CheckCircle;
                      return (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                          className="flex items-start gap-3 lg:gap-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                            <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-violet-600 dark:text-violet-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-base lg:text-lg">
                              {feature.title}
                            </h4>
                            <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Visual/Mockup - Larger for desktop */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={section.imagePosition === 'left' ? 'lg:order-1' : ''}
                >
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-4 lg:-inset-8 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />
                    
                    {/* Mockup card - Larger padding for desktop */}
                    <Card className="relative bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl">
                      <CardContent className="p-6 md:p-8 lg:p-10">
                        {/* Render interactive UI if available, otherwise fallback */}
                        {SectionUI ? (
                          <SectionUI />
                        ) : (
                          <DefaultFeatureUI section={section} />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Tech Specs */}
      <section className="py-16 md:py-24 bg-slate-900 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-white/10 text-white border-0">
              <Shield className="w-3 h-3 mr-1" />
              Enterprise Ready
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for performance & security
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto"
          >
            {featuresPageData.techSpecs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {spec.value}
                </div>
                <div className="text-sm text-slate-400">{spec.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Framework Integration */}
      <FrameworkLogos />

      {/* CTA */}
      <CTASection />
    </MarketingLayout>
  );
};

export default FeaturesPage;
