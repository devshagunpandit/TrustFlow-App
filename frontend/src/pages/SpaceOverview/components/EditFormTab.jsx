import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Star, Video, FileText, Loader2, Smartphone, Tablet, Laptop, 
  Palette, Type, Layout, ArrowLeft, User, CheckCircle, Camera, Upload, RotateCcw,
  Image as ImageIcon, Link as LinkIcon, Plus, Heart, Monitor, Crown, X, Aperture, Check, AlertCircle, Trash2,
  ExternalLink, Save, Sparkles, Zap, Moon, Sun, Waves, Mountain, Flame, Snowflake, Leaf, CloudRain, Lock
} from 'lucide-react';
import { PremiumToggle, SectionHeader } from './SharedComponents';
import confetti from 'canvas-confetti';
import { FeatureGate, PlanBadge, FeatureIndicator, UpgradeBanner } from '@/components/FeatureGate';
import { useFeature } from '@/hooks/useFeature';

const EditFormTab = ({ 
  formSettings, 
  setFormSettings, 
  saveFormSettings, 
  saving 
}) => {
  // Feature Access Checks - Called at component level
  const { isAllowed: hasPageThemeAccess } = useFeature('edit_form.page_theme');
  
  // --- Constants ---
  const DEFAULT_THEME_CONFIG = {
    theme: 'light', 
    accentColor: 'violet', 
    customColor: '#8b5cf6',
    pageBackground: 'gradient-violet', 
    pageTheme: 'minimal', // NEW: Premium page theme
    viewMode: 'mobile'
  };

  const accentColors = {
    violet: 'from-violet-600 to-indigo-600',
    blue: 'from-blue-600 to-cyan-600',
    rose: 'from-rose-600 to-pink-600',
    emerald: 'from-emerald-600 to-teal-600',
    custom: 'custom' 
  };

  const pageBackgrounds = {
    white: 'bg-white',
    dark: 'bg-slate-950',
    'gradient-violet': 'bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-violet-950/20 dark:via-background dark:to-indigo-950/20',
    'gradient-blue': 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/20',
  };

  // === PREMIUM PAGE THEMES ===
  const PAGE_THEMES = [
    {
      id: 'minimal',
      name: 'Minimal',
      icon: Sun,
      description: 'Clean & simple',
      preview: 'bg-gradient-to-br from-slate-50 to-white',
      isPremium: false, // FREE theme
      styles: {
        background: 'bg-gradient-to-br from-slate-50 via-white to-slate-50',
        pattern: '',
        overlay: '',
        cardGlow: false,
        floatingElements: false
      }
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: Moon,
      description: 'Sleek dark theme',
      preview: 'bg-gradient-to-br from-slate-800 to-slate-900',
      isPremium: false, // FREE theme
      styles: {
        background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        pattern: '',
        overlay: '',
        cardGlow: false,
        floatingElements: false,
        isDark: true
      }
    },
    {
      id: 'aurora',
      name: 'Aurora',
      icon: Sparkles,
      description: 'Magical gradient waves',
      preview: 'bg-gradient-to-br from-violet-400 via-pink-300 to-cyan-400',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100',
        pattern: 'aurora-waves',
        overlay: 'bg-gradient-to-t from-white/80 via-transparent to-white/60',
        cardGlow: true,
        floatingElements: true
      }
    },
    {
      id: 'cosmic',
      name: 'Cosmic Night',
      icon: Aperture,
      description: 'Deep space vibes',
      preview: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950',
        pattern: 'stars',
        overlay: '',
        cardGlow: true,
        floatingElements: true,
        isDark: true
      }
    },
    {
      id: 'ocean',
      name: 'Ocean Breeze',
      icon: Waves,
      description: 'Calm blue waves',
      preview: 'bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
        pattern: 'waves',
        overlay: 'bg-gradient-to-b from-white/40 to-transparent',
        cardGlow: true,
        floatingElements: true
      }
    },
    {
      id: 'sunset',
      name: 'Sunset Glow',
      icon: Flame,
      description: 'Warm orange hues',
      preview: 'bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50',
        pattern: 'mesh',
        overlay: 'bg-gradient-to-t from-white/60 to-transparent',
        cardGlow: true,
        floatingElements: true
      }
    },
    {
      id: 'forest',
      name: 'Forest',
      icon: Leaf,
      description: 'Nature inspired',
      preview: 'bg-gradient-to-br from-emerald-400 via-green-300 to-lime-400',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50',
        pattern: 'leaves',
        overlay: 'bg-gradient-to-b from-white/30 to-transparent',
        cardGlow: true,
        floatingElements: true
      }
    },
    {
      id: 'arctic',
      name: 'Arctic',
      icon: Snowflake,
      description: 'Cool ice tones',
      preview: 'bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-300',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50',
        pattern: 'frost',
        overlay: 'bg-gradient-to-t from-white/50 to-white/20',
        cardGlow: true,
        floatingElements: true
      }
    },
    {
      id: 'midnight',
      name: 'Midnight',
      icon: CloudRain,
      description: 'Dark & moody',
      preview: 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950',
        pattern: 'rain',
        overlay: '',
        cardGlow: true,
        floatingElements: true,
        isDark: true
      }
    },
    {
      id: 'neon',
      name: 'Neon Glow',
      icon: Zap,
      description: 'Cyberpunk style',
      preview: 'bg-gradient-to-br from-fuchsia-600 via-violet-600 to-cyan-500',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-slate-950 via-fuchsia-950 to-slate-950',
        pattern: 'grid',
        overlay: '',
        cardGlow: true,
        floatingElements: true,
        isDark: true,
        neonAccent: true
      }
    },
    {
      id: 'sunrise',
      name: 'Sunrise',
      icon: Sun,
      description: 'Fresh morning vibes',
      preview: 'bg-gradient-to-br from-amber-300 via-yellow-200 to-orange-300',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
        pattern: 'rays',
        overlay: 'bg-gradient-to-t from-white/40 to-transparent',
        cardGlow: true,
        floatingElements: true
      }
    },
    {
      id: 'lavender',
      name: 'Lavender Dreams',
      icon: Sparkles,
      description: 'Soft purple elegance',
      preview: 'bg-gradient-to-br from-purple-300 via-violet-200 to-fuchsia-300',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50',
        pattern: 'bubbles',
        overlay: 'bg-gradient-to-b from-white/30 to-transparent',
        cardGlow: true,
        floatingElements: true
      }
    },
    {
      id: 'galaxy',
      name: 'Galaxy',
      icon: Mountain,
      description: 'Stellar wonder',
      preview: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950',
        pattern: 'galaxy',
        overlay: '',
        cardGlow: true,
        floatingElements: true,
        isDark: true
      }
    },
    // === INTERACTIVE THEMES (Respond to touch/cursor) ===
    {
      id: 'spotlight',
      name: 'Spotlight',
      icon: Zap,
      description: 'Follows your cursor',
      preview: 'bg-gradient-to-br from-slate-100 via-white to-slate-100',
      isPremium: true,
      isInteractive: true,
      styles: {
        background: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
        pattern: '',
        cardGlow: true,
        floatingElements: false,
        interactive: 'spotlight'
      }
    },
    {
      id: 'magnetic',
      name: 'Magnetic',
      icon: Sparkles,
      description: 'Particles follow you',
      preview: 'bg-gradient-to-br from-violet-100 via-white to-purple-100',
      isPremium: true,
      isInteractive: true,
      styles: {
        background: 'bg-gradient-to-br from-violet-50 via-white to-purple-50',
        pattern: '',
        cardGlow: true,
        floatingElements: false,
        interactive: 'magnetic'
      }
    },
    {
      id: 'ripple',
      name: 'Ripple Touch',
      icon: Waves,
      description: 'Ripples on touch',
      preview: 'bg-gradient-to-br from-cyan-100 via-white to-blue-100',
      isPremium: true,
      isInteractive: true,
      styles: {
        background: 'bg-gradient-to-br from-cyan-50 via-white to-blue-50',
        pattern: '',
        cardGlow: true,
        floatingElements: false,
        interactive: 'ripple'
      }
    },
    {
      id: 'glow-trail',
      name: 'Glow Trail',
      icon: Flame,
      description: 'Glowing cursor trail',
      preview: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      isPremium: true,
      isInteractive: true,
      styles: {
        background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
        pattern: '',
        cardGlow: true,
        floatingElements: false,
        interactive: 'glow-trail',
        isDark: true
      }
    },
    // === ANIMATED THEMES (Continuous animations) ===
    {
      id: 'breathing',
      name: 'Breathing',
      icon: Heart,
      description: 'Gentle pulsing glow',
      preview: 'bg-gradient-to-br from-rose-200 via-pink-100 to-rose-200',
      isPremium: true,
      isAnimated: true,
      styles: {
        background: 'bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50',
        pattern: '',
        cardGlow: true,
        floatingElements: true,
        animated: 'breathing'
      }
    },
    {
      id: 'wave-motion',
      name: 'Wave Motion',
      icon: Waves,
      description: 'Flowing wave effect',
      preview: 'bg-gradient-to-br from-blue-300 via-cyan-200 to-teal-300',
      isPremium: true,
      isAnimated: true,
      styles: {
        background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
        pattern: '',
        cardGlow: true,
        floatingElements: true,
        animated: 'wave-motion'
      }
    },
    {
      id: 'particle-storm',
      name: 'Particle Storm',
      icon: CloudRain,
      description: 'Floating particles',
      preview: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
      isPremium: true,
      isAnimated: true,
      styles: {
        background: 'bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950',
        pattern: '',
        cardGlow: true,
        floatingElements: true,
        animated: 'particle-storm',
        isDark: true
      }
    },
    {
      id: 'gradient-shift',
      name: 'Gradient Shift',
      icon: Palette,
      description: 'Colors that flow',
      preview: 'bg-gradient-to-br from-violet-400 via-pink-400 to-orange-400',
      isPremium: true,
      isAnimated: true,
      styles: {
        background: 'bg-gradient-to-br from-violet-100 via-pink-100 to-orange-100',
        pattern: '',
        cardGlow: true,
        floatingElements: false,
        animated: 'gradient-shift'
      }
    },
    {
      id: 'northern-lights',
      name: 'Northern Lights',
      icon: Sparkles,
      description: 'Dancing aurora',
      preview: 'bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-400',
      isPremium: true,
      isAnimated: true,
      styles: {
        background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
        pattern: '',
        cardGlow: true,
        floatingElements: true,
        animated: 'northern-lights',
        isDark: true
      }
    },
    {
      id: 'confetti-rain',
      name: 'Confetti',
      icon: Sparkles,
      description: 'Falling celebration',
      preview: 'bg-gradient-to-br from-yellow-200 via-pink-200 to-cyan-200',
      isPremium: true,
      isAnimated: true,
      styles: {
        background: 'bg-gradient-to-br from-yellow-50 via-pink-50 to-cyan-50',
        pattern: '',
        cardGlow: true,
        floatingElements: false,
        animated: 'confetti-rain'
      }
    },
    // === GLASS & PREMIUM THEMES ===
    {
      id: 'glassmorphism',
      name: 'Glass',
      icon: Sparkles,
      description: 'Frosted glass effect',
      preview: 'bg-gradient-to-br from-white/80 via-slate-100/80 to-white/80',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-slate-100 via-white to-slate-100',
        pattern: 'glass-blur',
        cardGlow: true,
        floatingElements: true,
        glass: true
      }
    },
    {
      id: 'luxury-gold',
      name: 'Luxury Gold',
      icon: Crown,
      description: 'Premium gold accents',
      preview: 'bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-200',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50',
        pattern: 'gold-shimmer',
        cardGlow: true,
        floatingElements: true,
        luxuryAccent: 'gold'
      }
    },
    {
      id: 'luxury-rose',
      name: 'Rose Quartz',
      icon: Heart,
      description: 'Elegant rose tones',
      preview: 'bg-gradient-to-br from-pink-200 via-rose-100 to-pink-200',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50',
        pattern: 'shimmer',
        cardGlow: true,
        floatingElements: true,
        luxuryAccent: 'rose'
      }
    },
    {
      id: 'dark-elegance',
      name: 'Dark Elegance',
      icon: Moon,
      description: 'Sophisticated dark',
      preview: 'bg-gradient-to-br from-zinc-900 via-neutral-800 to-zinc-900',
      isPremium: true,
      styles: {
        background: 'bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950',
        pattern: 'subtle-grid',
        cardGlow: true,
        floatingElements: true,
        isDark: true,
        luxuryAccent: 'silver'
      }
    }
  ];

  // === PAGE THEME BACKGROUND COMPONENT ===
  const PageThemeBackground = ({ themeId, children }) => {
    const currentTheme = PAGE_THEMES.find(t => t.id === themeId) || PAGE_THEMES[0];
    const { background, pattern, overlay, floatingElements, isDark, neonAccent, animated, interactive, glass, luxuryAccent } = currentTheme.styles;

    // CSS for patterns
    const patternStyles = {
      'aurora-waves': `
        background-image: 
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
          radial-gradient(ellipse 60% 40% at 80% 50%, rgba(255, 119, 198, 0.2), transparent),
          radial-gradient(ellipse 50% 30% at 20% 80%, rgba(59, 130, 246, 0.2), transparent);
      `,
      'stars': `
        background-image: 
          radial-gradient(2px 2px at 20px 30px, white, transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 90px 40px, white, transparent),
          radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 160px 120px, white, transparent);
        background-size: 200px 200px;
        animation: twinkle 4s ease-in-out infinite alternate;
      `,
      'waves': `
        background-image: 
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2306b6d4' fill-opacity='0.1' d='M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
        background-position: bottom;
        background-size: cover;
        animation: wave-shift 8s ease-in-out infinite;
      `,
      'mesh': `
        background-image: 
          radial-gradient(at 40% 20%, rgba(251, 146, 60, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(236, 72, 153, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(251, 146, 60, 0.2) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(236, 72, 153, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(251, 146, 60, 0.3) 0px, transparent 50%);
      `,
      'leaves': `
        background-image: 
          radial-gradient(ellipse at 20% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(132, 204, 22, 0.15) 0%, transparent 50%);
      `,
      'frost': `
        background-image: 
          radial-gradient(circle at 20% 20%, rgba(186, 230, 253, 0.4) 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(165, 180, 252, 0.4) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(224, 231, 255, 0.3) 0%, transparent 60%);
      `,
      'rain': `
        background-image: linear-gradient(to bottom, transparent 0%, rgba(100, 116, 139, 0.1) 100%);
      `,
      'grid': `
        background-image: 
          linear-gradient(rgba(217, 70, 239, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(217, 70, 239, 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
      `,
      'rays': `
        background-image: 
          radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.3) 0%, transparent 60%);
      `,
      'bubbles': `
        background-image: 
          radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 30%),
          radial-gradient(circle at 90% 80%, rgba(232, 121, 249, 0.15) 0%, transparent 30%),
          radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.1) 0%, transparent 40%);
      `,
      'galaxy': `
        background-image: 
          radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
          radial-gradient(2px 2px at 10% 10%, white, transparent),
          radial-gradient(2px 2px at 20% 80%, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 70% 30%, white, transparent),
          radial-gradient(2px 2px at 80% 90%, rgba(255,255,255,0.6), transparent);
        background-size: 100% 100%, 150px 150px, 200px 200px, 180px 180px, 220px 220px;
      `,
      'glass-blur': `
        backdrop-filter: blur(20px);
        background: rgba(255,255,255,0.6);
      `,
      'gold-shimmer': `
        background-image: linear-gradient(135deg, rgba(251,191,36,0.1) 0%, transparent 50%, rgba(251,191,36,0.1) 100%);
        animation: shimmer 3s ease-in-out infinite;
      `,
      'shimmer': `
        background-image: linear-gradient(135deg, rgba(244,114,182,0.1) 0%, transparent 50%, rgba(244,114,182,0.1) 100%);
        animation: shimmer 3s ease-in-out infinite;
      `,
      'subtle-grid': `
        background-image: 
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 30px 30px;
      `
    };

    return (
      <div className={`relative w-full h-full overflow-hidden ${background}`}>
        {/* Pattern Overlay */}
        {pattern && patternStyles[pattern] && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ cssText: patternStyles[pattern] }}
          />
        )}
        
        {/* Gradient Overlay */}
        {overlay && (
          <div className={`absolute inset-0 pointer-events-none ${overlay}`} />
        )}
        
        {/* Glass Effect */}
        {glass && (
          <div className="absolute inset-0 pointer-events-none backdrop-blur-xl bg-white/30" />
        )}
        
        {/* Animated Theme Effects */}
        {animated && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {animated === 'breathing' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-rose-200/30 via-transparent to-pink-200/30"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {animated === 'wave-motion' && (
              <>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-200/40 to-transparent"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-200/30 to-transparent"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </>
            )}
            {animated === 'particle-storm' && (
              <>
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-violet-400 rounded-full"
                    initial={{ x: `${Math.random() * 100}%`, y: '-5%', opacity: 0 }}
                    animate={{ 
                      y: '105%', 
                      opacity: [0, 1, 1, 0],
                      x: `${Math.random() * 100}%`
                    }}
                    transition={{ 
                      duration: 4 + Math.random() * 3, 
                      repeat: Infinity, 
                      delay: Math.random() * 4,
                      ease: "linear"
                    }}
                  />
                ))}
              </>
            )}
            {animated === 'gradient-shift' && (
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 50%, rgba(251,146,60,0.2) 100%)',
                    'linear-gradient(135deg, rgba(251,146,60,0.2) 0%, rgba(139,92,246,0.2) 50%, rgba(236,72,153,0.2) 100%)',
                    'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(251,146,60,0.2) 50%, rgba(139,92,246,0.2) 100%)',
                    'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 50%, rgba(251,146,60,0.2) 100%)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            )}
            {animated === 'northern-lights' && (
              <>
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-emerald-400/20 via-cyan-400/15 to-transparent"
                  animate={{ opacity: [0.3, 0.6, 0.3], x: [-20, 20, -20] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-0 left-1/4 right-1/4 h-1/3 bg-gradient-to-b from-violet-400/25 via-fuchsia-400/15 to-transparent"
                  animate={{ opacity: [0.4, 0.7, 0.4], x: [20, -20, 20] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </>
            )}
            {animated === 'confetti-rain' && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 rounded-sm ${['bg-yellow-400', 'bg-pink-400', 'bg-cyan-400', 'bg-violet-400', 'bg-green-400'][i % 5]}`}
                    initial={{ 
                      x: `${5 + Math.random() * 90}%`, 
                      y: '-5%', 
                      rotate: 0,
                      opacity: 0.8
                    }}
                    animate={{ 
                      y: '105%', 
                      rotate: 360,
                      opacity: [0.8, 0.8, 0]
                    }}
                    transition={{ 
                      duration: 5 + Math.random() * 3, 
                      repeat: Infinity, 
                      delay: Math.random() * 5,
                      ease: "linear"
                    }}
                  />
                ))}
              </>
            )}
          </div>
        )}
        
        {/* Floating Elements for Premium Themes */}
        {floatingElements && !animated && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className={`absolute w-64 h-64 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-violet-500' : 'bg-violet-300'}`}
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ top: '10%', left: '10%' }}
            />
            <motion.div
              className={`absolute w-48 h-48 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-pink-500' : 'bg-pink-300'}`}
              animate={{
                x: [0, -20, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              style={{ bottom: '20%', right: '15%' }}
            />
            {neonAccent && (
              <>
                <motion.div
                  className="absolute w-32 h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 blur-sm opacity-60"
                  animate={{ x: [-100, 500], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                  style={{ top: '30%' }}
                />
                <motion.div
                  className="absolute w-24 h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 blur-sm opacity-60"
                  animate={{ x: [500, -100], opacity: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  style={{ bottom: '40%' }}
                />
              </>
            )}
          </div>
        )}
        
        {/* Luxury Accent Effects */}
        {luxuryAccent && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {luxuryAccent === 'gold' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
              />
            )}
            {luxuryAccent === 'rose' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
              />
            )}
            {luxuryAccent === 'silver' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/5 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              />
            )}
          </div>
        )}
        
        {/* Card Glow Effect & Animations */}
        {currentTheme.styles.cardGlow && (
          <style>{`
            @keyframes twinkle {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes wave-shift {
              0%, 100% { background-position-x: 0; }
              50% { background-position-x: 100px; }
            }
            @keyframes shimmer {
              0%, 100% { background-position: -100% 0; }
              50% { background-position: 200% 0; }
            }
            .premium-card-glow {
              box-shadow: 0 0 40px -10px ${isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'};
            }
          `}</style>
        )}
        
        {/* Content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    );
  };

  // Get current page theme
  const getCurrentPageTheme = () => {
    return PAGE_THEMES.find(t => t.id === themeConfig.pageTheme) || PAGE_THEMES[0];
  };

  // --- Derived State (Single Source of Truth) ---
  const themeConfig = formSettings.theme_config || DEFAULT_THEME_CONFIG;

  // Helper to update theme config safely
  const updateThemeConfig = (updates) => {
    setFormSettings(prev => ({
      ...prev,
      theme_config: {
        ...(prev.theme_config || DEFAULT_THEME_CONFIG),
        ...updates
      }
    }));
  };

  // --- LOGO STATE MANAGEMENT ---
  const [logoMode, setLogoMode] = useState(formSettings.logo_url ? 'upload' : 'upload'); 
  const [logoPreview, setLogoPreview] = useState(formSettings.logo_url || null);
  const [logoFile, setLogoFile] = useState(null);
  const [imageError, setImageError] = useState(false); // To track broken links

  // Sync logoPreview if DB changes
  useEffect(() => {
    setLogoPreview(formSettings.logo_url || null);
    setImageError(false); // Reset error state on new logo
  }, [formSettings.logo_url]);

  // Helper to check if URL is internal/blob (to hide it in input)
  const isInternalUrl = (url) => {
    if (!url) return false;
    return url.includes('blob:') || url.includes('supabase') || url.includes('space_logos');
  };

  // --- Interaction State for Preview ---
  const [previewStep, setPreviewStep] = useState('welcome'); 
  const [flowMode, setFlowMode] = useState('text'); 
  const [mockRating, setMockRating] = useState(5);
  const [mockText, setMockText] = useState('');
  const [mockPhoto, setMockPhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [saveStatus, setSaveStatus] = useState('idle');

  // --- Helpers ---

  const getThemeClasses = () => {
    const isDark = themeConfig.theme === 'dark';
    return {
      card: isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-white text-slate-900',
      input: isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-500',
      textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
      textHeader: isDark ? 'text-white' : 'text-slate-900',
      iconBg: isDark ? 'bg-slate-800' : 'bg-slate-100',
    };
  };

  const getButtonStyle = () => {
    if (themeConfig.accentColor === 'custom') return { background: themeConfig.customColor, color: '#fff' };
    return {}; 
  };
  
  const getButtonClass = () => {
    if (themeConfig.accentColor === 'custom') return `w-full shadow-md hover:opacity-90 transition-opacity text-white`;
    return `w-full shadow-md bg-gradient-to-r ${accentColors[themeConfig.accentColor]} hover:opacity-90 transition-opacity text-white`;
  };

  // 1. FULL RESET (Used by "Reset Default" button) - Resets Theme AND Preview
  const handleReset = () => {
    setPreviewStep('welcome');
    setMockText('');
    setMockRating(5);
    setMockPhoto(null);
    setIsCameraOpen(false);
    setFlowMode('text');

    updateThemeConfig({
        ...DEFAULT_THEME_CONFIG,
        viewMode: themeConfig.viewMode 
    });
  };

  // 2. PREVIEW RESTART (Used by "Submit Another") - Resets ONLY Preview, KEEPS Theme
  const restartPreview = () => {
    setPreviewStep('welcome');
    setMockText('');
    setMockRating(5);
    setMockPhoto(null);
    setIsCameraOpen(false);
    setFlowMode('text');
    // NOTE: We do NOT touch themeConfig here.
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const newUrl = URL.createObjectURL(file);
      setLogoPreview(newUrl);
      setImageError(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormSettings({ ...formSettings, logo_url: null });
    setImageError(false);
  };

  // --- SAVE HANDLER ---
  const handleSave = async () => {
    setSaveStatus('loading');
    
    try {
      const finalSettings = {
        ...formSettings,
        theme_config: themeConfig,
        logo_url: logoPreview 
      };
      
      await saveFormSettings(finalSettings, logoFile);
      
      setSaveStatus('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#a78bfa', '#ffffff']
      });

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2500);

    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  // --- Flow Navigation ---
  const startVideoFlow = () => { setFlowMode('video'); setPreviewStep('video'); };
  const startPhotoFlow = () => { setFlowMode('photo'); setPreviewStep('photo'); };
  const startTextFlow = () => { setFlowMode('text'); setPreviewStep('text'); };

  const handleBackFromText = () => {
    if (flowMode === 'video') setPreviewStep('video');
    else if (flowMode === 'photo') setPreviewStep('photo');
    else setPreviewStep('welcome');
  };

  const takeMockPhoto = () => {
    setMockPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'); 
    setIsCameraOpen(false);
  };
  const closeCamera = () => setIsCameraOpen(false);
  const removeMockPhoto = () => setMockPhoto(null);

  const themeClasses = getThemeClasses();

  // --- Reusable Logo Component with Fallback & Fixed Color ---
  const FormLogo = () => (
    <div className="flex justify-center mb-6">
      {logoPreview && !imageError ? (
          <img 
            src={logoPreview} 
            alt="Logo" 
            className="w-16 h-16 object-contain" 
            onError={() => setImageError(true)} // Fallback if broken
          />
      ) : (
          // STATIC COLOR for Default Star (Ignore Accent Color)
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-white bg-gradient-to-br from-violet-600 to-indigo-600">
            <Star className="w-8 h-8" />
          </div>
      )}
    </div>
  );

  // Theme Button Component with Lock logic
  const ThemeButton = ({ theme, isSelected, isLocked, onSelect }) => {
    const [showUpgrade, setShowUpgrade] = useState(false);
    const IconComponent = theme.icon;
    
    const handleClick = () => {
      if (isLocked) {
        setShowUpgrade(true);
      } else {
        onSelect();
      }
    };
    
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className={`relative p-2 rounded-xl border-2 transition-all group ${
            isSelected 
              ? 'border-violet-500 shadow-lg shadow-violet-500/20' 
              : isLocked
                ? 'border-slate-200 opacity-70 cursor-pointer'
                : 'border-slate-200 hover:border-violet-300 hover:shadow-md'
          }`}
        >
          {/* Preview Gradient */}
          <div className={`h-12 rounded-lg mb-2 ${theme.preview} relative overflow-hidden`}>
            {/* Selected Check */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            
            {/* Lock Badge for Premium Themes */}
            {isLocked && !isSelected && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center shadow-md">
                <Lock className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
              <IconComponent className={`w-6 h-6 ${theme.styles?.isDark ? 'text-white' : 'text-slate-700'}`} />
            </div>
          </div>
          
          {/* Name */}
          <p className={`text-[10px] font-medium text-center truncate ${isSelected ? 'text-violet-700' : 'text-slate-600'}`}>
            {theme.name}
          </p>
        </motion.button>
        
        {/* Upgrade Modal */}
        <UpgradeBanner open={showUpgrade} onOpenChange={setShowUpgrade} featureKey="edit_form.page_theme" />
      </>
    );
  };

  const PremiumHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30`}>
        <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
      </div>
      <h3 className="font-semibold text-sm flex items-center gap-2">
        {title}
      </h3>
    </div>
  );

  return (
    // UPDATED: Main Container with Mobile-First Order Logic and Responsive Heights
    <div className="flex flex-col xl:flex-row gap-6 xl:h-[calc(100vh-200px)] xl:min-h-[800px]">
      
      {/* RIGHT (Now TOP on Mobile via order-1): Live Interactive Preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner relative order-1 xl:order-2 h-[650px] xl:h-auto">
        
        {/* Device Toggle Bar - UPDATED: Now visible on all screen sizes */}
        <div className="h-14 border-b bg-white dark:bg-slate-950 flex items-center justify-between px-4 sm:px-6 z-20 shadow-sm shrink-0">
           <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="animate-pulse border-violet-200 text-violet-700 bg-violet-50 hidden sm:flex">Live Preview</Badge>
              {/* Show Icon only on very small screens if badge is hidden */}
              <Monitor className="w-4 h-4 text-violet-600 sm:hidden" />
           </div>
           
           {/* DEVICE TOGGLES: Removed 'hidden sm:flex' so it shows on mobile too */}
           <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
              {[ { id: 'mobile', icon: Smartphone }, { id: 'tablet', icon: Tablet }, { id: 'desktop', icon: Monitor } ].map((device) => (
                <button key={device.id} onClick={() => updateThemeConfig({ viewMode: device.id })} className={`p-2 rounded-md transition-all ${themeConfig.viewMode === device.id ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  <device.icon className="w-4 h-4" />
                </button>
              ))}
           </div>

           {/* Global Reset Button */}
           <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-muted-foreground hover:text-red-500 shrink-0">
             <RotateCcw className="w-3 h-3 mr-1.5" /> Reset
           </Button>
        </div>

        {/* Canvas Area - DEVICE FRAMES */}
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] p-2 sm:p-4">
           <motion.div 
             layout
             initial={false}
             animate={{ 
               width: themeConfig.viewMode === 'desktop' ? '100%' : (themeConfig.viewMode === 'tablet' ? '768px' : '375px'),
               height: '100%',
               borderRadius: themeConfig.viewMode === 'mobile' ? '40px' : (themeConfig.viewMode === 'tablet' ? '24px' : '12px'),
             }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             className={`relative shadow-2xl transition-all duration-500 overflow-hidden flex flex-col
               ${themeConfig.viewMode === 'desktop' ? 'bg-slate-100 border border-slate-300 rounded-lg' : 'bg-slate-900 border-[8px] border-slate-900'}
               ${themeConfig.viewMode === 'mobile' ? 'max-w-[375px]' : themeConfig.viewMode === 'tablet' ? 'max-w-[768px]' : 'max-w-full'}
             `}
           >
              {/* Mobile notch */}
              {themeConfig.viewMode === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-50" />
              )}
              
              {/* Screen Content with Page Theme Background */}
              <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative flex-1
                  ${themeConfig.viewMode === 'mobile' ? 'rounded-[32px]' : (themeConfig.viewMode === 'tablet' ? 'rounded-[16px]' : 'rounded-t-[8px]')}
              `}>
                <PageThemeBackground themeId={themeConfig.pageTheme || 'minimal'}>
                {/* --- MOCK FORM START --- */}
                 <div className="min-h-full w-full flex flex-col items-center justify-center p-6">
                    <AnimatePresence mode="wait">
                       
                       {/* 1. WELCOME STEP */}
                       {previewStep === 'welcome' && (
                          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
                            <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                              <CardContent className="p-8">
                                <FormLogo />
                                <div className="text-center mb-8">
                                  <h1 className={`text-2xl font-bold mb-2 ${themeClasses.textHeader}`}>{formSettings.header_title || 'Header Title'}</h1>
                                  <p className={`${themeClasses.textMuted}`}>{formSettings.custom_message || 'Your message here...'}</p>
                                </div>
                                <div className="space-y-3">
                                  {(formSettings.collect_video ?? true) && (
                                    <Button onClick={startVideoFlow} className={`w-full h-14 text-lg ${getButtonClass()}`} style={getButtonStyle()}>
                                      <Video className="w-5 h-5 mr-2" /> Record a Video
                                    </Button>
                                  )}

                                  {(formSettings.collect_photo) && (
                                    <Button onClick={startPhotoFlow} className={`w-full h-14 text-lg ${getButtonClass()}`} style={getButtonStyle()}>
                                      <ImageIcon className="w-5 h-5 mr-2" /> Upload Photo
                                    </Button>
                                  )}
                                  
                                  <Button 
                                    onClick={startTextFlow} 
                                    variant={(!(formSettings.collect_video ?? true) && !formSettings.collect_photo) ? "default" : "outline"}
                                    className={`w-full h-14 text-lg 
                                      ${(!(formSettings.collect_video ?? true) && !formSettings.collect_photo)
                                        ? getButtonClass() 
                                        : `${themeClasses.input} hover:bg-slate-100 dark:hover:bg-slate-800`
                                      }`}
                                    style={(!(formSettings.collect_video ?? true) && !formSettings.collect_photo) ? getButtonStyle() : {}}
                                  >
                                    <FileText className="w-5 h-5 mr-2" /> 
                                    {(!(formSettings.collect_video ?? true) && !formSettings.collect_photo) ? 'Write a Testimonial' : 'Write Text'}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                       )}

                       {/* 2. VIDEO STEP */}
                       {previewStep === 'video' && (
                          <motion.div key="video" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-6">
                                  <FormLogo />
                                  <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="icon" onClick={() => setPreviewStep('welcome')} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Record Your Video</h2>
                                  </div>
                                  <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                                     <div className="text-white text-center p-4">
                                        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Camera Preview</p>
                                     </div>
                                     <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> 0:00 / 1:00
                                     </div>
                                  </div>
                                  <div className="flex justify-center gap-3">
                                    <Button variant="destructive" size="lg" className="rounded-full w-16 h-16" onClick={() => setPreviewStep('text')}>
                                       <span className="w-6 h-6 bg-white rounded-sm" />
                                    </Button>
                                  </div>
                                  <p className={`text-center text-sm mt-4 ${themeClasses.textMuted}`}>Maximum 60 seconds</p>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                       {/* 2.5 PHOTO STEP */}
                       {previewStep === 'photo' && (
                          <motion.div key="photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-6">
                                  <FormLogo />
                                  <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="icon" onClick={() => setPreviewStep('welcome')} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Upload Photo</h2>
                                  </div>
                                  
                                  {isCameraOpen ? (
                                    <div className="relative aspect-square bg-black rounded-xl overflow-hidden mb-6 flex flex-col items-center justify-end pb-6">
                                       <div className="absolute top-4 right-4 z-10">
                                           <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full" onClick={closeCamera}>
                                               <X className="w-6 h-6" />
                                           </Button>
                                       </div>
                                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                           <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                                       </div>
                                       <p className="text-white text-xs mb-8 absolute top-4 left-4">Camera Active</p>
                                       <Button variant="destructive" size="lg" className="rounded-full w-14 h-14 border-4 border-white" onClick={takeMockPhoto}>
                                       </Button>
                                    </div>
                                  ) : mockPhoto ? (
                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-6 group bg-slate-100">
                                       <img src={mockPhoto} alt="Captured" className="w-full h-full object-cover" />
                                       <button onClick={removeMockPhoto} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors">
                                          <X className="w-4 h-4" />
                                       </button>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                      <div onClick={() => setMockPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')} className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                         <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                         <span className={`text-xs font-medium ${themeClasses.textHeader}`}>Upload</span>
                                      </div>
                                      <div onClick={() => setIsCameraOpen(true)} className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                         <Aperture className="w-8 h-8 text-slate-400 mb-2" />
                                         <span className={`text-xs font-medium ${themeClasses.textHeader}`}>Camera</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <Button onClick={() => setPreviewStep('text')} className={getButtonClass()} style={getButtonStyle()}>Continue</Button>
                                  <Button variant="ghost" onClick={() => setPreviewStep('text')} className={`w-full mt-2 ${themeClasses.textMuted}`}>Skip</Button>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                       {/* 3. TEXT STEP */}
                       {previewStep === 'text' && (
                          <motion.div key="text" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-6">
                                  <FormLogo />
                                  <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="icon" onClick={handleBackFromText} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Write Testimonial</h2>
                                  </div>
                                  {formSettings.collect_star_rating && (
                                    <div className="mb-6">
                                       <Label className={`mb-2 block ${themeClasses.textHeader}`}>Your Rating</Label>
                                       <div className="flex gap-1">
                                          {[1,2,3,4,5].map(s => (
                                             <Star key={s} className={`w-8 h-8 ${s <= mockRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} onClick={() => setMockRating(s)} />
                                          ))}
                                       </div>
                                    </div>
                                  )}
                                  <div className="space-y-4">
                                     <div>
                                        <Label className={themeClasses.textHeader}>Your Testimonial</Label>
                                        <Textarea value={mockText} onChange={e => setMockText(e.target.value)} placeholder="Share your experience..." rows={5} className={`mt-2 ${themeClasses.input}`} />
                                     </div>
                                     <Button onClick={() => setPreviewStep('details')} className={getButtonClass()} style={getButtonStyle()}>Continue</Button>
                                  </div>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                       {/* 4. DETAILS STEP */}
                       {previewStep === 'details' && (
                          <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-6">
                                  <FormLogo />
                                  <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="icon" onClick={() => setPreviewStep('text')} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Your Details</h2>
                                  </div>
                                  <div className="space-y-4">
                                     <div>
                                        <Label className={themeClasses.textHeader}>Your Name *</Label>
                                        <div className="relative mt-2">
                                           <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                           <Input placeholder="John Doe" className={`pl-9 ${themeClasses.input}`} />
                                        </div>
                                     </div>
                                     <div>
                                        <Label className={themeClasses.textHeader}>Your Email *</Label>
                                        <Input placeholder="john@example.com" className={`mt-2 ${themeClasses.input}`} />
                                     </div>
                                     <div>
                                        <Label className={themeClasses.textHeader}>Role (Optional)</Label>
                                        <Input placeholder="CEO at Company" className={`mt-2 ${themeClasses.input}`} />
                                     </div>
                                     <Button onClick={() => setPreviewStep('success')} className={`mt-4 ${getButtonClass()}`} style={getButtonStyle()}>Submit Testimonial</Button>
                                  </div>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                       {/* 5. SUCCESS STEP */}
                       {previewStep === 'success' && (
                          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-8 text-center">
                                  <FormLogo />
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                  >
                                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                                  </motion.div>
                                  <h2 className={`text-2xl font-bold mb-2 ${themeClasses.textHeader}`}>
                                    {formSettings.thank_you_title || 'Thank You!'}
                                  </h2>
                                  <p className={`mb-6 ${themeClasses.textMuted}`}>
                                    {formSettings.thank_you_message || 'Your testimonial has been submitted successfully.'}
                                  </p>
                                  {/* Promo/Redirect Section - Shows custom link if set, else default */}
                                  <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                                    {formSettings.extra_settings?.thank_you_url ? (
                                      /* Custom Thank You Redirect - PRO Feature */
                                      <span className="text-violet-600 font-medium hover:underline cursor-pointer inline-flex items-center gap-1">
                                        {formSettings.extra_settings?.thank_you_link_text || 'Continue'}
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </span>
                                    ) : (
                                      /* Default TrustFlow Promo */
                                      <>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                          Want to collect testimonials like this?
                                        </p>
                                        <span className="text-violet-600 font-medium hover:underline cursor-pointer">
                                          Create your own Wall of Love →
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="mt-4">
                                    {/* USE restartPreview HERE TO AVOID RESETTING THEME */}
                                    <Button variant="outline" onClick={restartPreview} className={themeClasses.input}>Submit Another</Button>
                                  </div>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                    </AnimatePresence>
                    
                    {/* FOOTER - Respects hide_branding */}
                    {!formSettings.extra_settings?.hide_branding && (
                      <div className="text-center mt-6">
                        <p className={`text-sm ${themeClasses.textMuted}`}>Powered by <span className="font-medium text-violet-600">TrustFlow</span></p>
                      </div>
                    )}

                 </div>
                 {/* --- MOCK FORM END --- */}
                </PageThemeBackground>
              </div>
           </motion.div>
        </div> 
      </div>

      {/* LEFT (Now BOTTOM on Mobile via order-2): Designer Controls */}
      <Card className="w-full xl:w-[420px] flex flex-col border-violet-100 dark:border-violet-900/20 shadow-xl shadow-violet-500/5 bg-white/80 backdrop-blur-sm overflow-hidden flex-shrink-0 order-2 xl:order-1 h-[650px] xl:h-full">
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-violet-50/50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-lg shadow-violet-500/20">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Form Designer</CardTitle>
                <CardDescription className="text-xs">Customize collection experience</CardDescription>
              </div>
            </div>
            
            {/* Save Button in Header */}
            <Button 
              onClick={handleSave} 
              disabled={saveStatus !== 'idle'} 
              size="sm"
              className={`transition-all duration-300 shadow-lg ${
                saveStatus === 'success' 
                  ? 'bg-green-600 hover:bg-green-600 shadow-green-500/25' 
                  : saveStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-600'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-violet-500/25'
              }`}
            >
              {saveStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              {saveStatus === 'success' && <Check className="w-4 h-4 mr-1.5" />}
              {saveStatus === 'error' && <AlertCircle className="w-4 h-4 mr-1.5" />}
              {saveStatus === 'idle' && <Save className="w-4 h-4 mr-1.5" />}
              {saveStatus === 'idle' && 'Save'}
              {saveStatus === 'loading' && 'Saving...'}
              {saveStatus === 'success' && 'Saved!'}
              {saveStatus === 'error' && 'Error'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
           {/* Logo Section */}
           <FeatureGate featureKey="edit_form.custom_logo" showBadge={false}>
             <div>
              <div className="flex items-center justify-between mb-4">
                <PremiumHeader icon={ImageIcon} title="Logo & Branding" />
                <FeatureIndicator featureKey="edit_form.custom_logo" />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                 {/* Logo Preview in Control Panel */}
                 <div className="h-16 w-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden shrink-0 relative group">
                    {logoPreview && !imageError ? (
                      <>
                        <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-1" />
                        {/* Hover Overlay for removal visual hint (optional, but button below is better) */}
                      </>
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                 </div>

                 {/* Remove Button (Visible if logo exists) */}
                 {logoPreview && (
                    <Button variant="ghost" size="sm" onClick={handleRemoveLogo} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2">
                       <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                 )}
              </div>

              <Tabs defaultValue="upload" value={logoMode} onValueChange={setLogoMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="upload" className="text-xs"><Upload className="w-3 h-3 mr-2" /> Upload</TabsTrigger>
                  <TabsTrigger value="url" className="text-xs"><LinkIcon className="w-3 h-3 mr-2" /> URL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-0">
                    <div className="flex-1">
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full px-4 py-2 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 text-xs font-medium transition-colors">
                          {logoPreview ? 'Change File' : 'Choose File'}
                        </div>
                        <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </Label>
                      <p className="text-[10px] text-muted-foreground mt-2 leading-tight">Rec: <span className="font-medium text-slate-700">400x400px PNG</span> (Transparent).</p>
                    </div>
                </TabsContent>
                
                <TabsContent value="url" className="mt-0">
                  <Input 
                    placeholder="https://example.com/logo.png" 
                    // If it's an internal/blob URL, show empty to keep it clean for user input
                    value={isInternalUrl(formSettings.logo_url) ? '' : (formSettings.logo_url || '')} 
                    onChange={(e) => { 
                      setLogoPreview(e.target.value); 
                      setFormSettings({...formSettings, logo_url: e.target.value});
                      // If user types, we assume they are overriding the file upload
                      setLogoFile(null);
                      setImageError(false);
                    }} 
                    className="text-xs" 
                  />
                  <p className="text-[10px] text-muted-foreground mt-2">Paste a direct link to your logo image.</p>
                </TabsContent>
              </Tabs>
             </div>
           </FeatureGate>
          <Separator />
          
          {/* Visual Theme */}
          <div>
            <PremiumHeader icon={Palette} title="Visual Theme" />
            <div className="space-y-5">
               <div>
                  <Label className="text-xs text-slate-500 mb-2 block">Accent Color</Label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(accentColors).filter(k => k !== 'custom').map(color => (
                      <button key={color} onClick={() => updateThemeConfig({ accentColor: color })} className={`w-8 h-8 rounded-full bg-gradient-to-br ${accentColors[color]} transition-all shadow-sm ${themeConfig.accentColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105 hover:shadow-md'}`} />
                    ))}
                    <button onClick={() => updateThemeConfig({ accentColor: 'custom' })} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm border border-slate-200 ${themeConfig.accentColor === 'custom' ? 'ring-2 ring-offset-2 ring-slate-400 scale-110 bg-white' : 'bg-slate-50 hover:bg-slate-100'}`} style={themeConfig.accentColor === 'custom' ? { background: themeConfig.customColor } : {}}>
                      {themeConfig.accentColor !== 'custom' && <Plus className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {themeConfig.accentColor === 'custom' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                         <div className="flex items-center gap-3">
                            <input type="color" value={themeConfig.customColor} onChange={(e) => updateThemeConfig({ customColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0" />
                            <Input value={themeConfig.customColor} onChange={(e) => updateThemeConfig({ customColor: e.target.value })} className="h-8 text-xs font-mono uppercase" />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               <div>
                  <Label className="text-xs text-slate-500 mb-2 block">Card Theme</Label>
                  <PremiumToggle id="theme-mode" current={themeConfig.theme} onChange={(val) => updateThemeConfig({ theme: val })} options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]} />
               </div>
            </div>
          </div>
          <Separator />

          {/* === PAGE THEMES SECTION - Free themes available to all === */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    Page Theme
                  </h3>
                  <p className="text-[10px] text-slate-500">Choose a background style</p>
                </div>
              </div>
            </div>
          
          {/* Theme Grid */}
          <div className="grid grid-cols-3 gap-2">
            {PAGE_THEMES.map((theme) => {
              const isSelected = themeConfig.pageTheme === theme.id;
              const isPremiumTheme = theme.isPremium;
              const isLocked = isPremiumTheme && !hasPageThemeAccess;
              
              return (
                <ThemeButton 
                  key={theme.id}
                  theme={theme}
                  isSelected={isSelected}
                  isLocked={isLocked}
                  onSelect={() => !isLocked && updateThemeConfig({ pageTheme: theme.id })}
                />
              );
            })}
          </div>
          
          {/* Current Theme Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={themeConfig.pageTheme}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100"
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const current = getCurrentPageTheme();
                  const IconComponent = current.icon;
                  return (
                    <>
                      <div className={`p-1.5 rounded-lg ${current.preview}`}>
                        <IconComponent className={`w-4 h-4 ${current.styles?.isDark ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-violet-800">{current.name}</p>
                        <p className="text-[10px] text-violet-600">{current.description}</p>
                      </div>
                      {current.isPremium && (
                        <Badge className="ml-auto text-[8px] bg-amber-500 text-white border-0 px-1.5 py-0.5">
                          STARTER
                        </Badge>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
          <Separator />
          
          {/* Text Content */}
          <div>
            <SectionHeader icon={Type} title="Text Content" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="header_title" className="text-xs">Header Title</Label>
                <Input id="header_title" value={formSettings.header_title} onChange={(e) => setFormSettings({ ...formSettings, header_title: e.target.value })} placeholder="Share your experience..." className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom_message" className="text-xs">Custom Message</Label>
                <Textarea id="custom_message" value={formSettings.custom_message} onChange={(e) => setFormSettings({ ...formSettings, custom_message: e.target.value })} placeholder="We appreciate your feedback..." rows={3} className="bg-slate-50 resize-none" />
              </div>
            </div>
          </div>
          <Separator />

          {/* Thank You Page */}
          <div>
            <SectionHeader icon={Heart} title="Thank You Page" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thank_you_title" className="text-xs">Title</Label>
                <Input 
                  id="thank_you_title" 
                  value={formSettings.thank_you_title || 'Thank you!'} 
                  onChange={(e) => setFormSettings({ ...formSettings, thank_you_title: e.target.value })} 
                  className="bg-slate-50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thank_you_message" className="text-xs">Message</Label>
                <Textarea 
                  id="thank_you_message" 
                  value={formSettings.thank_you_message || 'Your testimonial has been submitted.'} 
                  onChange={(e) => setFormSettings({ ...formSettings, thank_you_message: e.target.value })} 
                  rows={2} 
                  className="bg-slate-50 resize-none" 
                />
              </div>
            </div>
          </div>
          <Separator />
          
          {/* PRO SETTINGS - Custom Thank You Page & Branding */}
          <div>
            <div className="flex items-center justify-between mb-4">
               <SectionHeader icon={Crown} title="Advanced Settings" />
            </div>
            
            <div className="space-y-4">
              {/* Custom Link Redirect - Pro Feature */}
              <FeatureGate featureKey="edit_form.custom_link" showBadge={false}>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-violet-600" />
                    <Label className="text-sm font-semibold text-slate-800">Custom Link Redirect</Label>
                  </div>
                  <FeatureIndicator featureKey="edit_form.custom_link" />
                </div>
                <p className="text-[10px] text-slate-500 -mt-2 mb-3">Redirect users after submission to your website or custom page</p>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Button Text</Label>
                    <Input 
                      value={formSettings.extra_settings?.thank_you_link_text || ''} 
                      onChange={(e) => {
                        console.log('DEBUG: Updating thank_you_link_text:', e.target.value);
                        setFormSettings({ 
                          ...formSettings, 
                          extra_settings: {
                            ...(formSettings.extra_settings || {}),
                            thank_you_link_text: e.target.value
                          }
                        });
                      }}
                      className="h-8 text-xs bg-white"
                      placeholder="e.g., Go to our website"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> Redirect URL
                    </Label>
                    <Input 
                      value={formSettings.extra_settings?.thank_you_url || ''} 
                      onChange={(e) => {
                        console.log('DEBUG: Updating thank_you_url:', e.target.value);
                        setFormSettings({ 
                          ...formSettings, 
                          extra_settings: {
                            ...(formSettings.extra_settings || {}),
                            thank_you_url: e.target.value
                          }
                        });
                      }}
                      className="h-8 text-xs bg-white"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
              </FeatureGate>
              
              {/* Remove Form Branding - STARTER */}
              <FeatureGate featureKey="edit_form.remove_branding" showBadge={false}>
              <div className={`p-4 rounded-xl border transition-all duration-300 ${formSettings.extra_settings?.hide_branding ? 'bg-violet-50 border-violet-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-semibold text-slate-800">Remove Form Branding</Label>
                      <FeatureIndicator featureKey="edit_form.remove_branding" size="xs" />
                    </div>
                    <p className="text-[10px] text-slate-500">Hide "Powered by TrustFlow" from submission form</p>
                  </div>
                  <Switch 
                    checked={formSettings.extra_settings?.hide_branding || false} 
                    onCheckedChange={(checked) => {
                      console.log('DEBUG: Updating hide_branding:', checked);
                      setFormSettings({ 
                        ...formSettings, 
                        extra_settings: {
                          ...(formSettings.extra_settings || {}),
                          hide_branding: checked
                        }
                      });
                    }}
                  />
                </div>
              </div>
              </FeatureGate>
            </div>
          </div>
          <Separator />
          
          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <PremiumHeader icon={Layout} title="Form Features" />
            </div>
            <div className="space-y-3">
              {/* Text testimonials - FREE for all */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-sm">Text Testimonials</Label>
                  <p className="text-[10px] text-muted-foreground">Always enabled for all users</p>
                </div>
                <Badge variant="outline" className="text-[9px] bg-green-50 text-green-600 border-green-200">FREE</Badge>
              </div>
              
              {/* Video Testimonials - STARTER */}
              <FeatureGate featureKey="edit_form.form_features" showBadge={false}>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Video Testimonials</Label>
                    <FeatureIndicator featureKey="edit_form.form_features" size="xs" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Allow users to record videos</p>
                </div>
                <Switch checked={formSettings.collect_video ?? true} onCheckedChange={(checked) => setFormSettings({ ...formSettings, collect_video: checked })} />
              </div>
              </FeatureGate>
              
              {/* Photo/Image - STARTER */}
              <FeatureGate featureKey="edit_form.form_features" showBadge={false}>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Photo/Image</Label>
                    <FeatureIndicator featureKey="edit_form.form_features" size="xs" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Allow image uploads</p>
                </div>
                <Switch checked={formSettings.collect_photo ?? false} onCheckedChange={(checked) => setFormSettings({ ...formSettings, collect_photo: checked })} />
              </div>
              </FeatureGate>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-sm">Star Rating</Label>
                  <p className="text-[10px] text-muted-foreground">Collect 1-5 star ratings</p>
                </div>
                <Switch checked={formSettings.collect_star_rating} onCheckedChange={(checked) => setFormSettings({ ...formSettings, collect_star_rating: checked })} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default EditFormTab;