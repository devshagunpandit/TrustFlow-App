// ============================================
// TRUSTFLOW - WIDGET PRESETS CONFIGURATION
// Premium preset themes for Wall of Love
// ============================================

// === PRESET CATEGORIES ===
export const PRESET_CATEGORIES = [
  { id: 'all', name: 'All Presets', icon: 'Sparkles' },
  { id: 'popular', name: 'Popular', icon: 'TrendingUp' },
  { id: 'minimal', name: 'Minimal', icon: 'Zap' },
  { id: 'premium', name: 'Premium', icon: 'Crown' },
  { id: 'colorful', name: 'Colorful', icon: 'Palette' },
  { id: 'creative', name: 'Creative', icon: 'Palette' },
  { id: 'professional', name: 'Professional', icon: 'Briefcase' },
  { id: 'social', name: 'Social', icon: 'MessageCircle' },
  { id: 'video', name: 'Video', icon: 'Video' },
  { id: 'dark', name: 'Dark Mode', icon: 'MousePointer' }
];

// === PRESET THUMBNAIL THEMES (for Mini Preview) ===
export const PRESET_THUMBNAILS = {
  'minimalist': {
    bg: 'bg-slate-50',
    cardBg: 'bg-white',
    accent: 'bg-slate-300'
  },
  'dark-elegant': {
    bg: 'bg-slate-900',
    cardBg: 'bg-slate-800',
    accent: 'bg-slate-600'
  },
  'violet-dream': {
    bg: 'bg-gradient-to-br from-violet-100 to-purple-100',
    cardBg: 'bg-white',
    accent: 'bg-violet-400'
  },
  'sunset-glow': {
    bg: 'bg-gradient-to-br from-orange-100 to-pink-100',
    cardBg: 'bg-white',
    accent: 'bg-orange-400'
  },
  'ocean-breeze': {
    bg: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    cardBg: 'bg-white',
    accent: 'bg-cyan-400'
  },
  'forest-calm': {
    bg: 'bg-gradient-to-br from-green-100 to-emerald-100',
    cardBg: 'bg-white',
    accent: 'bg-green-400'
  },
  'midnight-purple': {
    bg: 'bg-gradient-to-br from-indigo-900 to-purple-900',
    cardBg: 'bg-slate-800/80',
    accent: 'bg-purple-500'
  },
  'rose-gold': {
    bg: 'bg-gradient-to-br from-rose-100 to-amber-100',
    cardBg: 'bg-white',
    accent: 'bg-rose-400'
  },
  'electric-blue': {
    bg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    cardBg: 'bg-white/90',
    accent: 'bg-blue-500'
  },
  'aurora': {
    bg: 'bg-gradient-to-br from-green-400 via-cyan-500 to-blue-500',
    cardBg: 'bg-white/90',
    accent: 'bg-emerald-400'
  },
  'monochrome': {
    bg: 'bg-gray-100',
    cardBg: 'bg-white',
    accent: 'bg-gray-500'
  },
  'neon-dark': {
    bg: 'bg-gray-950',
    cardBg: 'bg-gray-900',
    accent: 'bg-fuchsia-500'
  },
  'corporate': {
    bg: 'bg-slate-100',
    cardBg: 'bg-white',
    accent: 'bg-blue-600'
  },
  'warm-earth': {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
    cardBg: 'bg-white',
    accent: 'bg-amber-500'
  },
  'glass': {
    bg: 'bg-gradient-to-br from-white/50 to-slate-100/50',
    cardBg: 'bg-white/60',
    accent: 'bg-slate-400'
  }
};

// === MAIN WIDGET PRESETS ===
export const WIDGET_PRESETS = [
  // 1. DEFAULT - Must always be first
  {
    id: 'default',
    name: 'TrustWall Default',
    description: 'Clean, professional layout - our recommended starting point',
    category: 'minimal',
    thumbnail: 'minimalist',
    popular: true,
    isDefault: true,
    isPro: false,
    settings: {
      layout: 'grid',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'medium',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 12,
      shuffle: false,
      gridRows: 2,
      autoScroll: false,
      carouselFocusZoom: false,
      carouselSameSize: true,
      smoothContinuousScroll: false,
      showBranding: true,
      popupsEnabled: false
    }
  },

  // 2. Minimalist White
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    description: 'Ultra-clean design with subtle shadows and no borders',
    category: 'minimal',
    thumbnail: 'minimalist',
    popular: true,
    isPro: false,
    settings: {
      layout: 'grid',
      theme: 'light',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'light',
      border: false,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'slideUp',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 9,
      shuffle: false,
      gridRows: 2,
      autoScroll: false,
      carouselSameSize: true,
      smoothContinuousScroll: false,
      showBranding: true
    }
  },

  // 3. Dark Elegance
  {
    id: 'dark-elegance',
    name: 'Dark Elegance',
    description: 'Sophisticated dark theme with glowing accents',
    category: 'dark',
    thumbnail: 'dark-elegant',
    popular: true,
    isPro: false,
    settings: {
      layout: 'masonry',
      theme: 'dark',
      cardTheme: 'dark',
      corners: 'smooth',
      shadow: 'strong',
      border: true,
      hoverEffect: 'glow',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 12,
      shuffle: false,
      autoScroll: false,
      smoothContinuousScroll: false,
      showBranding: true
    }
  },

  // 4. Violet Dream - PREMIUM
  {
    id: 'violet-dream',
    name: 'Violet Dream',
    description: 'Beautiful violet gradients with floating cards',
    category: 'premium',
    thumbnail: 'violet-dream',
    popular: true,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'scale',
      nameSize: 'medium',
      testimonialStyle: 'bubble',
      animation: 'pop',
      speed: 'normal',
      cardSize: 'large',
      maxCount: 10,
      shuffle: false,
      autoScroll: true,
      scrollSpeed: 4,
      carouselFocusZoom: true,
      carouselSameSize: true,
      smoothContinuousScroll: false,
      showBranding: false
    }
  },

  // 5. Corporate Pro
  {
    id: 'corporate-pro',
    name: 'Corporate Professional',
    description: 'Clean business look with blue accents',
    category: 'professional',
    thumbnail: 'corporate',
    popular: false,
    isPro: false,
    settings: {
      layout: 'grid',
      theme: 'light',
      cardTheme: 'light',
      corners: 'sharp',
      shadow: 'medium',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'small',
      testimonialStyle: 'quote',
      animation: 'slideUp',
      speed: 'fast',
      cardSize: 'medium',
      maxCount: 6,
      shuffle: false,
      gridRows: 2,
      autoScroll: false,
      showBranding: true
    }
  },

  // 6. Smooth Carousel
  {
    id: 'smooth-carousel',
    name: 'Infinite Flow',
    description: 'Mesmerizing smooth continuous scroll animation',
    category: 'premium',
    thumbnail: 'violet-dream',
    popular: true,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'medium',
      border: true,
      hoverEffect: 'scale',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 12,
      shuffle: false,
      autoScroll: false,
      smoothContinuousScroll: true,
      smoothScrollSpeed: 40,
      carouselSameSize: true,
      showBranding: false
    }
  },

  // 7. Sunset Glow - PREMIUM
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm orange and pink tones for a friendly vibe',
    category: 'colorful',
    thumbnail: 'sunset-glow',
    popular: false,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'masonry',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'scale',
      nameSize: 'large',
      testimonialStyle: 'clean',
      animation: 'pop',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 12,
      shuffle: true,
      showBranding: false
    }
  },

  // 8. Ocean Breeze
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Fresh cyan and blue palette for tech brands',
    category: 'colorful',
    thumbnail: 'ocean-breeze',
    popular: false,
    isPro: false,
    settings: {
      layout: 'grid',
      theme: 'light',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'medium',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'bubble',
      animation: 'slideUp',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 9,
      shuffle: false,
      showBranding: true
    }
  },

  // 9. Midnight Purple - PREMIUM
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: 'Deep purple dark theme with neon accents',
    category: 'premium',
    thumbnail: 'midnight-purple',
    popular: true,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'carousel',
      theme: 'dark',
      cardTheme: 'dark',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'glow',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'scale',
      speed: 'normal',
      cardSize: 'large',
      maxCount: 10,
      autoScroll: true,
      scrollSpeed: 5,
      carouselFocusZoom: true,
      showBranding: false
    }
  },

  // 10. Rose Gold - PREMIUM
  {
    id: 'rose-gold',
    name: 'Rose Gold Luxury',
    description: 'Elegant rose gold gradients for luxury brands',
    category: 'premium',
    thumbnail: 'rose-gold',
    popular: false,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'masonry',
      theme: 'light',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'scale',
      nameSize: 'large',
      testimonialStyle: 'quote',
      animation: 'pop',
      speed: 'slow',
      cardSize: 'large',
      maxCount: 8,
      shuffle: false,
      showBranding: false
    }
  },

  // 11. Monochrome Clean
  {
    id: 'monochrome-clean',
    name: 'Monochrome',
    description: 'Timeless black and white minimalism',
    category: 'minimal',
    thumbnail: 'monochrome',
    popular: false,
    isPro: false,
    settings: {
      layout: 'list',
      theme: 'light',
      cardTheme: 'light',
      corners: 'sharp',
      shadow: 'none',
      border: true,
      hoverEffect: 'none',
      nameSize: 'small',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'fast',
      cardSize: 'medium',
      maxCount: 8,
      shuffle: false,
      showBranding: true
    }
  },

  // 12. Neon Dark - PREMIUM
  {
    id: 'neon-dark',
    name: 'Neon Nights',
    description: 'Cyberpunk-inspired with neon glow effects',
    category: 'dark',
    thumbnail: 'neon-dark',
    popular: false,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'grid',
      theme: 'dark',
      cardTheme: 'dark',
      corners: 'smooth',
      shadow: 'strong',
      border: true,
      hoverEffect: 'glow',
      nameSize: 'medium',
      testimonialStyle: 'bubble',
      animation: 'pop',
      speed: 'fast',
      cardSize: 'medium',
      maxCount: 9,
      shuffle: true,
      showBranding: false
    }
  },

  // 13. Aurora - PREMIUM
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Stunning gradient background inspired by northern lights',
    category: 'premium',
    thumbnail: 'aurora',
    popular: true,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'scale',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'slideUp',
      speed: 'normal',
      cardSize: 'large',
      maxCount: 10,
      smoothContinuousScroll: true,
      smoothScrollSpeed: 35,
      showBranding: false
    }
  },

  // 14. Glass Morphism - PREMIUM
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    description: 'Frosted glass effect with beautiful blur',
    category: 'premium',
    thumbnail: 'glass',
    popular: true,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'grid',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'medium',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'scale',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 9,
      shuffle: false,
      showBranding: false
    }
  },

  // 15. Social Proof Power - PREMIUM
  {
    id: 'social-proof-power',
    name: 'Social Proof Power',
    description: 'With popup notifications for maximum FOMO',
    category: 'premium',
    thumbnail: 'violet-dream',
    popular: true,
    isPro: true,
    isPremium: true,
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'medium',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 10,
      autoScroll: true,
      scrollSpeed: 4,
      popupsEnabled: true,
      popupPosition: 'bottom-left',
      popupDuration: 5,
      popupGap: 15,
      popupMessage: '🔥 Someone just shared love!',
      showBranding: false
    }
  },

  // === NEW PREMIUM PRESETS WITH CUSTOM TEXT ===

  // 16. Customer Love Wall - PRO
  {
    id: 'customer-love-wall',
    name: 'Customer Love Wall',
    description: 'Perfect for showcasing customer testimonials with a heartfelt theme',
    category: 'premium',
    thumbnail: 'rose-gold',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: 'What Our Customers Say',
    customSubheading: 'Real stories from people who love our product',
    settings: {
      layout: 'masonry',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'scale',
      nameSize: 'large',
      testimonialStyle: 'quote',
      animation: 'pop',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 12,
      shuffle: false,
      showBranding: false
    }
  },

  // 17. Social Proof Bar - PRO
  {
    id: 'social-proof-bar',
    name: 'Social Proof Bar',
    description: 'Compact horizontal carousel for page headers',
    category: 'professional',
    thumbnail: 'minimalist',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: 'Trusted by Industry Leaders',
    customSubheading: 'Join thousands of satisfied customers',
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'light',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'small',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'fast',
      cardSize: 'small',
      maxCount: 20,
      autoScroll: true,
      scrollSpeed: 3,
      smoothContinuousScroll: true,
      smoothScrollSpeed: 30,
      carouselSameSize: true,
      showBranding: false
    }
  },

  // 18. Startup Success Stories - PRO
  {
    id: 'startup-success',
    name: 'Startup Success Stories',
    description: 'Modern look perfect for SaaS and startups',
    category: 'professional',
    thumbnail: 'electric-blue',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: '🚀 Success Stories',
    customSubheading: 'See how companies grow with us',
    settings: {
      layout: 'grid',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'medium',
      border: true,
      hoverEffect: 'scale',
      nameSize: 'medium',
      testimonialStyle: 'bubble',
      animation: 'slideUp',
      speed: 'normal',
      cardSize: 'large',
      maxCount: 6,
      gridRows: 1,
      shuffle: false,
      showBranding: false
    }
  },

  // 19. Creator Spotlight - PRO
  {
    id: 'creator-spotlight',
    name: 'Creator Spotlight',
    description: 'Perfect for course creators and influencers',
    category: 'colorful',
    thumbnail: 'aurora',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: '⭐ What Students Are Saying',
    customSubheading: 'Real results from our community',
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'glow',
      nameSize: 'large',
      testimonialStyle: 'quote',
      animation: 'pop',
      speed: 'normal',
      cardSize: 'large',
      maxCount: 8,
      autoScroll: true,
      scrollSpeed: 5,
      carouselFocusZoom: true,
      carouselSameSize: true,
      showBranding: false
    }
  },

  // 20. Agency Portfolio - PRO
  {
    id: 'agency-portfolio',
    name: 'Agency Portfolio',
    description: 'Professional client testimonials for agencies',
    category: 'professional',
    thumbnail: 'monochrome',
    popular: false,
    isPro: true,
    isPremium: true,
    customHeading: 'Client Testimonials',
    customSubheading: 'Trusted by leading brands worldwide',
    settings: {
      layout: 'grid',
      theme: 'light',
      cardTheme: 'light',
      corners: 'sharp',
      shadow: 'medium',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'quote',
      animation: 'fade',
      speed: 'fast',
      cardSize: 'medium',
      maxCount: 9,
      gridRows: 3,
      shuffle: false,
      showBranding: false
    }
  },

  // 21. E-commerce Reviews - PRO
  {
    id: 'ecommerce-reviews',
    name: 'E-commerce Reviews',
    description: 'Product review style with verified badges',
    category: 'professional',
    thumbnail: 'warm-earth',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: '💯 Verified Reviews',
    customSubheading: 'From real customers who purchased',
    settings: {
      layout: 'masonry',
      theme: 'light',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'medium',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'slideUp',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 15,
      shuffle: true,
      showBranding: false
    }
  },

  // 22. Dark Mode Premium - PRO
  {
    id: 'dark-premium',
    name: 'Dark Mode Premium',
    description: 'Sleek dark theme with neon accents',
    category: 'dark',
    thumbnail: 'neon-dark',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: '✨ What People Are Saying',
    customSubheading: '',
    settings: {
      layout: 'carousel',
      theme: 'dark',
      cardTheme: 'dark',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'glow',
      nameSize: 'large',
      testimonialStyle: 'clean',
      animation: 'scale',
      speed: 'normal',
      cardSize: 'large',
      maxCount: 10,
      autoScroll: true,
      scrollSpeed: 4,
      carouselFocusZoom: true,
      showBranding: false
    }
  },

  // 23. Minimalist Quote - PRO
  {
    id: 'minimalist-quote',
    name: 'Minimalist Quote',
    description: 'Ultra-clean with large typography',
    category: 'minimal',
    thumbnail: 'minimalist',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: '',
    customSubheading: '',
    settings: {
      layout: 'grid',
      theme: 'light',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'light',
      border: false,
      hoverEffect: 'lift',
      nameSize: 'large',
      testimonialStyle: 'quote',
      animation: 'fade',
      speed: 'slow',
      cardSize: 'large',
      maxCount: 4,
      gridRows: 1,
      shuffle: false,
      showBranding: false
    }
  },

  // ============================================
  // IMPORTED PRESETS WITH CUSTOM HEADINGS
  // (From external gallery - PRO features)
  // ============================================

  // 24. Minimalist Pro
  {
    id: 'minimalist-pro',
    name: 'Minimalist Pro',
    description: 'Clean, distraction-free design with subtle shadows',
    category: 'minimal',
    thumbnail: 'minimalist',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: 'What our customers say',
    customSubheading: 'Real stories from real people',
    settings: {
      layout: 'grid',
      theme: 'light',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'light',
      border: false,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 6,
      gridRows: 2,
      wallPadding: 'large',
      showHeading: true,
      headingText: 'What our customers say',
      headingFont: 'Inter',
      headingColor: '#1e293b',
      headingBold: true,
      showSubheading: true,
      subheadingText: 'Real stories from real people',
      subheadingFont: 'Inter',
      subheadingColor: '#64748b',
      carouselFocusZoom: false,
      carouselSameSize: true,
      autoScroll: false,
      popupsEnabled: false,
      showBranding: false
    }
  },

  // 25. Dark Glassmorphism
  {
    id: 'dark-glassmorphism',
    name: 'Dark Glassmorphism',
    description: 'Premium dark mode with frosted glass effect',
    category: 'premium',
    thumbnail: 'dark-elegant',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: 'Trusted by thousands',
    customSubheading: 'Join our growing community',
    settings: {
      layout: 'grid',
      theme: 'dark',
      cardTheme: 'dark',
      corners: 'round',
      shadow: 'strong',
      border: true,
      hoverEffect: 'glow',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'scale',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 9,
      gridRows: 3,
      wallPadding: 'medium',
      showHeading: true,
      headingText: 'Trusted by thousands',
      headingFont: 'Poppins',
      headingColor: '#f8fafc',
      headingBold: true,
      showSubheading: true,
      subheadingText: 'Join our growing community',
      subheadingFont: 'Inter',
      subheadingColor: '#94a3b8',
      carouselFocusZoom: false,
      carouselSameSize: true,
      autoScroll: false,
      popupsEnabled: false,
      showBranding: false
    }
  },

  // 26. Masonry Elegant
  {
    id: 'masonry-elegant',
    name: 'Masonry Grid',
    description: 'Pinterest-style staggered layout for variety',
    category: 'creative',
    thumbnail: 'warm-earth',
    popular: false,
    isPro: true,
    isPremium: true,
    customHeading: 'Wall of Love',
    customSubheading: 'Stories that inspire us every day',
    settings: {
      layout: 'masonry',
      theme: 'light',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'medium',
      border: true,
      hoverEffect: 'scale',
      nameSize: 'medium',
      testimonialStyle: 'bubble',
      animation: 'slideUp',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 12,
      wallPadding: 'medium',
      showHeading: true,
      headingText: 'Wall of Love',
      headingFont: 'Playfair Display',
      headingColor: '#1e293b',
      headingBold: true,
      showSubheading: true,
      subheadingText: 'Stories that inspire us every day',
      subheadingFont: 'Inter',
      subheadingColor: '#64748b',
      carouselFocusZoom: false,
      carouselSameSize: false,
      autoScroll: false,
      popupsEnabled: false,
      showBranding: false
    }
  },

  // 27. Carousel Spotlight
  {
    id: 'carousel-spotlight',
    name: 'Carousel Spotlight',
    description: 'Smooth auto-scrolling slider with focus zoom',
    category: 'premium',
    thumbnail: 'electric-blue',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: 'What people are saying',
    customSubheading: '',
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'lift',
      nameSize: 'large',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'normal',
      cardSize: 'large',
      maxCount: 10,
      wallPadding: 'medium',
      showHeading: true,
      headingText: 'What people are saying',
      headingFont: 'Montserrat',
      headingColor: '#0f172a',
      headingBold: true,
      showSubheading: false,
      subheadingText: '',
      subheadingFont: 'Inter',
      subheadingColor: '#64748b',
      carouselFocusZoom: true,
      carouselSameSize: true,
      autoScroll: true,
      scrollSpeed: 4,
      popupsEnabled: false,
      showBranding: false
    }
  },

  // 28. Single Highlight
  {
    id: 'single-highlight',
    name: 'Single Highlight',
    description: 'Feature one powerful testimonial at a time',
    category: 'minimal',
    thumbnail: 'forest-calm',
    popular: false,
    isPro: true,
    isPremium: true,
    customHeading: 'Featured Review',
    customSubheading: 'Hand-picked by our team',
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: true,
      hoverEffect: 'none',
      nameSize: 'large',
      testimonialStyle: 'quote',
      animation: 'fade',
      speed: 'slow',
      cardSize: 'large',
      maxCount: 5,
      wallPadding: 'large',
      showHeading: true,
      headingText: 'Featured Review',
      headingFont: 'Crimson Text',
      headingColor: '#1e293b',
      headingBold: true,
      showSubheading: true,
      subheadingText: 'Hand-picked by our team',
      subheadingFont: 'Inter',
      subheadingColor: '#64748b',
      carouselFocusZoom: false,
      carouselSameSize: true,
      autoScroll: true,
      scrollSpeed: 6,
      popupsEnabled: false,
      showBranding: false
    }
  },

  // 29. Bento Grid
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    description: 'Modern asymmetric layout like Apple keynotes',
    category: 'premium',
    thumbnail: 'rose-gold',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: 'Loved by everyone',
    customSubheading: 'See why teams choose us',
    settings: {
      layout: 'grid',
      theme: 'light',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'medium',
      border: false,
      hoverEffect: 'scale',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'pop',
      speed: 'fast',
      cardSize: 'medium',
      maxCount: 6,
      gridRows: 2,
      wallPadding: 'medium',
      showHeading: true,
      headingText: 'Loved by everyone',
      headingFont: 'DM Sans',
      headingColor: '#0f172a',
      headingBold: true,
      showSubheading: true,
      subheadingText: 'See why teams choose us',
      subheadingFont: 'DM Sans',
      subheadingColor: '#64748b',
      carouselFocusZoom: false,
      carouselSameSize: false,
      autoScroll: false,
      popupsEnabled: true,
      popupPosition: 'bottom-right',
      popupDelay: 3,
      popupDuration: 5,
      popupGap: 15,
      popupMessage: '🎉 New review!',
      showBranding: false
    }
  },

  // 30. Twitter Social Style
  {
    id: 'twitter-social',
    name: 'Twitter Style',
    description: 'Social media inspired card design',
    category: 'social',
    thumbnail: 'ocean-breeze',
    popular: false,
    isPro: true,
    isPremium: true,
    customHeading: 'What people tweet about us',
    customSubheading: '',
    settings: {
      layout: 'masonry',
      theme: 'light',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'light',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'small',
      testimonialStyle: 'clean',
      animation: 'slideUp',
      speed: 'fast',
      cardSize: 'compact',
      maxCount: 12,
      wallPadding: 'small',
      showHeading: true,
      headingText: 'What people tweet about us',
      headingFont: 'Inter',
      headingColor: '#14171a',
      headingBold: true,
      showSubheading: false,
      subheadingText: '',
      subheadingFont: 'Inter',
      subheadingColor: '#657786',
      carouselFocusZoom: false,
      carouselSameSize: false,
      autoScroll: false,
      popupsEnabled: false,
      showBranding: false
    }
  },

  // 31. LinkedIn Professional
  {
    id: 'linkedin-pro',
    name: 'LinkedIn Professional',
    description: 'Corporate-ready professional testimonials',
    category: 'professional',
    thumbnail: 'corporate',
    popular: false,
    isPro: true,
    isPremium: true,
    customHeading: 'Recommendations',
    customSubheading: 'What professionals say about working with us',
    settings: {
      layout: 'list',
      theme: 'light',
      cardTheme: 'light',
      corners: 'smooth',
      shadow: 'light',
      border: true,
      hoverEffect: 'lift',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'fade',
      speed: 'normal',
      cardSize: 'medium',
      maxCount: 6,
      wallPadding: 'medium',
      showHeading: true,
      headingText: 'Recommendations',
      headingFont: 'Source Sans Pro',
      headingColor: '#000000',
      headingBold: true,
      showSubheading: true,
      subheadingText: 'What professionals say about working with us',
      subheadingFont: 'Source Sans Pro',
      subheadingColor: '#666666',
      carouselFocusZoom: false,
      carouselSameSize: true,
      autoScroll: false,
      popupsEnabled: false,
      showBranding: false
    }
  },

  // 32. Video Showcase
  {
    id: 'video-showcase',
    name: 'Video Showcase',
    description: 'Optimized for video testimonials with vertical scroll',
    category: 'video',
    thumbnail: 'midnight-purple',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: 'Watch their stories',
    customSubheading: 'Real customers, real experiences',
    settings: {
      layout: 'grid',
      theme: 'dark',
      cardTheme: 'dark',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'scale',
      nameSize: 'medium',
      testimonialStyle: 'clean',
      animation: 'scale',
      speed: 'normal',
      cardSize: 'large',
      maxCount: 6,
      gridRows: 2,
      wallPadding: 'medium',
      showHeading: true,
      headingText: 'Watch their stories',
      headingFont: 'Montserrat',
      headingColor: '#ffffff',
      headingBold: true,
      showSubheading: true,
      subheadingText: 'Real customers, real experiences',
      subheadingFont: 'Inter',
      subheadingColor: '#a1a1aa',
      carouselFocusZoom: false,
      carouselSameSize: true,
      autoScroll: false,
      popupsEnabled: false,
      showBranding: false
    }
  },

  // 33. Gradient Vibrant
  {
    id: 'gradient-vibrant',
    name: 'Vibrant Gradient',
    description: 'Eye-catching colorful cards with gradient accents',
    category: 'colorful',
    thumbnail: 'aurora',
    popular: true,
    isPro: true,
    isPremium: true,
    customHeading: '💜 Customer Love',
    customSubheading: 'Spreading joy, one review at a time',
    settings: {
      layout: 'carousel',
      theme: 'transparent',
      cardTheme: 'light',
      corners: 'round',
      shadow: 'strong',
      border: false,
      hoverEffect: 'glow',
      nameSize: 'medium',
      testimonialStyle: 'bubble',
      animation: 'pop',
      speed: 'fast',
      cardSize: 'medium',
      maxCount: 8,
      wallPadding: 'medium',
      showHeading: true,
      headingText: '💜 Customer Love',
      headingFont: 'Poppins',
      headingColor: '#7c3aed',
      headingBold: true,
      showSubheading: true,
      subheadingText: 'Spreading joy, one review at a time',
      subheadingFont: 'Poppins',
      subheadingColor: '#a78bfa',
      carouselFocusZoom: true,
      carouselSameSize: true,
      autoScroll: true,
      scrollSpeed: 3,
      popupsEnabled: true,
      popupPosition: 'bottom-left',
      popupDelay: 2,
      popupDuration: 4,
      popupGap: 8,
      popupMessage: '✨ Fresh feedback!',
      showBranding: false
    }
  }
];

// === COMBO PRESETS (Preset + Card Layout Combinations) ===
export const COMBO_PRESETS = [
  // Default combo for free users
  {
    id: 'combo-default',
    name: 'TrustWall Default',
    description: 'Clean classic layout with professional cards',
    presetId: 'default',
    cardStyle: 'default',
    thumbnail: 'minimalist',
    category: 'default',
    isDefault: true,
    isPro: false,
    isPremium: false,
    customHeading: 'What Our Customers Say',
    customSubheading: 'Real testimonials from real people'
  },
  {
    id: 'combo-social-twitter',
    name: 'Social Media Pro',
    description: 'Twitter-style cards with smooth carousel',
    presetId: 'smooth-carousel',
    cardStyle: 'twitter-style',
    thumbnail: 'violet-dream',
    category: 'social',
    isPro: true,
    isPremium: true,
    customHeading: 'What People Are Tweeting',
    customSubheading: 'Real posts from our community'
  },
  {
    id: 'combo-quote-elegant',
    name: 'Quote Gallery',
    description: 'Beautiful quote cards with dark elegance',
    presetId: 'dark-elegance',
    cardStyle: 'quote-card',
    thumbnail: 'dark-elegant',
    category: 'premium',
    isPro: true,
    isPremium: true,
    customHeading: 'Words That Inspire',
    customSubheading: ''
  },
  {
    id: 'combo-corporate-classic',
    name: 'Enterprise Ready',
    description: 'Professional testimonials for business',
    presetId: 'corporate-pro',
    cardStyle: 'testimonial-classic',
    thumbnail: 'corporate',
    category: 'professional',
    isPro: false,
    isPremium: false,
    customHeading: 'Trusted by Enterprise',
    customSubheading: 'Fortune 500 companies rely on us'
  },
  {
    id: 'combo-floating-violet',
    name: 'Dream Showcase',
    description: 'Floating avatars with violet theme',
    presetId: 'violet-dream',
    cardStyle: 'floating-badge',
    thumbnail: 'violet-dream',
    category: 'premium',
    isPro: true,
    isPremium: true,
    customHeading: '✨ Happy Customers',
    customSubheading: 'Stories from our amazing community'
  },
  {
    id: 'combo-split-modern',
    name: 'Split Modern',
    description: 'Modern split cards with glassmorphism',
    presetId: 'glassmorphism',
    cardStyle: 'modern-split',
    thumbnail: 'glass',
    category: 'premium',
    isPro: true,
    isPremium: true,
    customHeading: 'Customer Stories',
    customSubheading: ''
  },
  {
    id: 'combo-video-sunset',
    name: 'Video Spotlight',
    description: 'Video hero cards with warm theme',
    presetId: 'sunset-glow',
    cardStyle: 'video-hero',
    thumbnail: 'sunset-glow',
    category: 'video',
    isPro: true,
    isPremium: true,
    customHeading: '🎬 Video Testimonials',
    customSubheading: 'Watch real customers share their experience'
  },
  {
    id: 'combo-mixpanel-ocean',
    name: 'Brand Showcase',
    description: 'Brand-endorsed cards with ocean theme',
    presetId: 'ocean-breeze',
    cardStyle: 'mixpanel-style',
    thumbnail: 'ocean-breeze',
    category: 'professional',
    isPro: false,
    isPremium: false,
    customHeading: 'Industry Leaders Trust Us',
    customSubheading: ''
  },
  {
    id: 'combo-neon-twitter',
    name: 'Neon Social',
    description: 'Twitter cards with neon dark theme',
    presetId: 'neon-city',
    cardStyle: 'twitter-style',
    thumbnail: 'neon-dark',
    category: 'dark',
    isPro: true,
    isPremium: true,
    customHeading: '🔥 Hot Takes',
    customSubheading: 'What people are saying'
  }
];

// === COMBO PRESET CATEGORIES ===
export const COMBO_CATEGORIES = [
  { id: 'all', name: 'All Combos', icon: 'Sparkles' },
  { id: 'default', name: 'Default', icon: 'Zap' },
  { id: 'social', name: 'Social', icon: 'MessageCircle' },
  { id: 'professional', name: 'Professional', icon: 'Briefcase' },
  { id: 'premium', name: 'Premium', icon: 'Crown' },
  { id: 'dark', name: 'Dark', icon: 'Moon' },
  { id: 'video', name: 'Video', icon: 'Video' }
];

// === CARD LAYOUT PRESETS ===
export const CARD_LAYOUT_PRESETS = [
  // 1. DEFAULT - Current TrustWall layout
  {
    id: 'default',
    name: 'TrustWall Classic',
    description: 'Stars on top, content in middle, profile at bottom',
    category: 'default',
    icon: '⭐',
    isDefault: true,
    isPro: false,
    structure: 'rating-content-profile'
  },

  // 2. Testimonial.to Style (from screenshot 1 - Andrew Gazdecki)
  {
    id: 'testimonial-classic',
    name: 'Profile First',
    description: 'Profile and name on top, then rating and content with hearts',
    category: 'social',
    icon: '💜',
    isPro: false,
    structure: 'profile-rating-content',
    features: ['highlight-text', 'heart-reactions', 'show-more']
  },

  // 3. Mixpanel Style (from screenshot 2 - Hannah Maslar)
  {
    id: 'mixpanel-style',
    name: 'Brand Endorsed',
    description: 'Profile on top with company logo at bottom',
    category: 'professional',
    icon: '🏢',
    isPro: false,
    structure: 'profile-content-brand',
    features: ['company-logo', 'highlight-text']
  },

  // 4. Video Testimonial Style (from screenshot 3 - Blaine Anderson)
  {
    id: 'video-hero',
    name: 'Video Hero',
    description: 'Large video with overlay profile and floating hearts',
    category: 'video',
    icon: '🎬',
    isPro: true,
    isPremium: true,
    structure: 'video-overlay-profile',
    features: ['video-focus', 'hearts', 'quote-bottom']
  },

  // 5. Twitter/X Style (from screenshot 4 - Paeh Brian)
  {
    id: 'twitter-style',
    name: 'Social Feed',
    description: 'Twitter-like card with profile, content, and timestamp',
    category: 'social',
    icon: '🐦',
    isPro: false,
    structure: 'profile-content-timestamp',
    features: ['verified-badge', 'timestamp', 'clean-border']
  },

  // 6. Quote Card - PREMIUM
  {
    id: 'quote-card',
    name: 'Quote Highlight',
    description: 'Large quote with author signature style',
    category: 'premium',
    icon: '✍️',
    isPro: true,
    isPremium: true,
    structure: 'quote-signature',
    features: ['large-quote', 'signature-footer']
  },

  // 7. Modern Split - PREMIUM
  {
    id: 'modern-split',
    name: 'Modern Split',
    description: 'Vertical split with avatar on left side',
    category: 'premium',
    icon: '⬜',
    isPro: true,
    isPremium: true,
    structure: 'split-avatar-content',
    features: ['avatar-left', 'content-right']
  },

  // 8. Floating Badge - PREMIUM
  {
    id: 'floating-badge',
    name: 'Floating Avatar',
    description: 'Avatar floats outside the card boundary',
    category: 'premium',
    icon: '🎯',
    isPro: true,
    isPremium: true,
    structure: 'floating-avatar-content',
    features: ['floating-avatar', 'centered-text']
  }
];

// === HELPER FUNCTIONS ===

// Get presets by category
export const getPresetsByCategory = (category) => {
  if (category === 'all') return WIDGET_PRESETS;
  if (category === 'popular') return WIDGET_PRESETS.filter(p => p.popular);
  return WIDGET_PRESETS.filter(p => p.category === category);
};

// Get card layouts by category
export const getCardLayoutsByCategory = (category) => {
  if (category === 'all') return CARD_LAYOUT_PRESETS;
  return CARD_LAYOUT_PRESETS.filter(l => l.category === category);
};

// Get combo presets by category
export const getComboPresetsByCategory = (category) => {
  if (category === 'all') return COMBO_PRESETS;
  return COMBO_PRESETS.filter(c => c.category === category);
};

// Get default preset
export const getDefaultPreset = () => {
  return WIDGET_PRESETS.find(p => p.isDefault) || WIDGET_PRESETS[0];
};

// Get default card layout
export const getDefaultCardLayout = () => {
  return CARD_LAYOUT_PRESETS.find(l => l.isDefault) || CARD_LAYOUT_PRESETS[0];
};

// Find preset by ID
export const getPresetById = (id) => {
  return WIDGET_PRESETS.find(p => p.id === id);
};

// Find card layout by ID
export const getCardLayoutById = (id) => {
  return CARD_LAYOUT_PRESETS.find(l => l.id === id);
};

// Find combo preset by ID
export const getComboPresetById = (id) => {
  return COMBO_PRESETS.find(c => c.id === id);
};

// Get all presets with custom text (headings/subheadings)
export const getPresetsWithCustomText = () => {
  return WIDGET_PRESETS.filter(p => p.customHeading || p.customSubheading);
};

export default WIDGET_PRESETS;
