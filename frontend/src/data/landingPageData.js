/**
 * Landing Page Data - Centralized Content for Marketing Pages
 * 
 * This file contains all dynamic content for the public/marketing pages.
 * Content can be updated here or later connected to a Supabase Admin Dashboard.
 * 
 * IMPORTANT: Do not hardcode content in JSX - always reference this file.
 */

// =============================================================================
// COMPANY INFORMATION
// =============================================================================
export const companyInfo = {
  name: 'TrustWall',
  tagline: 'Social Proof on Autopilot',
  description: 'Collect and display beautiful testimonials in minutes',
  foundedYear: 2024,
  email: 'hello@trustwall.app',
  supportEmail: 'support@trustwall.app',
  website: 'https://trustwall.app',
  socialLinks: {
    twitter: 'https://twitter.com/trustwallapp',
    linkedin: 'https://linkedin.com/company/trustwall',
    github: 'https://github.com/trustwall',
    youtube: 'https://youtube.com/@trustwall',
  },
};

// =============================================================================
// NAVIGATION LINKS
// =============================================================================
export const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Wall of Love', href: '/wall-of-love' },
  { label: 'Demo', href: '/demo' },
  { label: 'Pricing', href: '/pricing' },
];

// =============================================================================
// FOOTER LINKS
// =============================================================================
export const footerLinks = {
  product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Wall of Love', href: '/wall-of-love' },
    { label: 'Demo', href: '/demo' },
    { label: 'Submit Testimonial', href: '/submit-testimonial' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: 'mailto:hello@trustwall.app' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/privacy#cookies' },
  ],
  feedback: [
    { label: 'Report a Bug', href: '/report-bug' },
    { label: 'Suggest a Feature', href: '/suggest-feature' },
  ],
};

// =============================================================================
// TRUSTED BY LOGOS (Social Proof Strip)
// =============================================================================
export const trustedByLogos = [
  {
    id: 1,
    name: 'Vercel',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/vercel.svg',
    altText: 'Vercel Logo',
  },
  {
    id: 2,
    name: 'Stripe',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
    altText: 'Stripe Logo',
  },
  {
    id: 3,
    name: 'Notion',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/notion-2.svg',
    altText: 'Notion Logo',
  },
  {
    id: 4,
    name: 'Linear',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/linear-1.svg',
    altText: 'Linear Logo',
  },
  {
    id: 5,
    name: 'Figma',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/figma-icon.svg',
    altText: 'Figma Logo',
  },
  {
    id: 6,
    name: 'Supabase',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/supabase-icon.svg',
    altText: 'Supabase Logo',
  },
  {
    id: 7,
    name: 'Loom',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/loom-1.svg',
    altText: 'Loom Logo',
  },
  {
    id: 8,
    name: 'Intercom',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/intercom-2.svg',
    altText: 'Intercom Logo',
  },
];

// =============================================================================
// FRAMEWORK INTEGRATION LOGOS
// =============================================================================
export const frameworkLogos = [
  {
    id: 'react',
    name: 'React',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/react-2.svg',
    brandColor: '#61DAFB',
    altText: 'React Logo',
  },
  {
    id: 'vue',
    name: 'Vue.js',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/vue-9.svg',
    brandColor: '#4FC08D',
    altText: 'Vue.js Logo',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/next-js.svg',
    brandColor: '#000000',
    altText: 'Next.js Logo',
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/wordpress-blue.svg',
    brandColor: '#21759B',
    altText: 'WordPress Logo',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
    brandColor: '#96BF48',
    altText: 'Shopify Logo',
  },
  {
    id: 'webflow',
    name: 'Webflow',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/webflow-1.svg',
    brandColor: '#4353FF',
    altText: 'Webflow Logo',
  },
  {
    id: 'remix',
    name: 'Remix',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/remix-letter-glowing.svg',
    brandColor: '#000000',
    altText: 'Remix Logo',
  },
  {
    id: 'svelte',
    name: 'Svelte',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/svelte-1.svg',
    brandColor: '#FF3E00',
    altText: 'Svelte Logo',
  },
];

// =============================================================================
// HERO SECTION CONTENT
// =============================================================================
export const heroContent = {
  badge: 'Social Proof on Autopilot',
  headlineStart: 'Collect & Display',
  headlineHighlight: 'Testimonials',
  headlineEnd: 'in Minutes',
  subheadline: 'Create dedicated spaces for your projects, send a simple link to clients, and showcase stunning text & video testimonials on your website.',
  primaryCTA: {
    label: 'Start for Free',
    href: '/signup',
  },
  secondaryCTA: {
    label: 'View Demo',
    href: '/demo',
  },
  stats: [
    { value: '10,000+', label: 'Testimonials Collected' },
    { value: '2,500+', label: 'Happy Businesses' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' },
  ],
};

// =============================================================================
// BENTO GRID FEATURES
// =============================================================================
export const bentoFeatures = [
  {
    id: 'video-collection',
    title: 'Video Collection',
    description: 'Let clients record stunning video testimonials directly in their browser. No apps needed.',
    icon: 'Video',
    gradient: 'from-violet-600 to-purple-600',
    size: 'large', // large, medium, small
    isPremium: false,
    image: null,
  },
  {
    id: 'space-management',
    title: 'Space Management',
    description: 'Organize testimonials by project, client, or product with dedicated spaces.',
    icon: 'FolderOpen',
    gradient: 'from-indigo-600 to-blue-600',
    size: 'medium',
    isPremium: false,
    image: null,
  },
  {
    id: 'dark-mode',
    title: 'Dark Mode',
    description: 'Beautiful dark mode support for all widgets and forms.',
    icon: 'Moon',
    gradient: 'from-slate-700 to-slate-900',
    size: 'small',
    isPremium: false,
    image: null,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track views, clicks, and conversions with built-in analytics.',
    icon: 'BarChart3',
    gradient: 'from-amber-500 to-orange-500',
    size: 'medium',
    isPremium: true,
    image: null,
  },
  {
    id: 'custom-branding',
    title: 'Custom Branding',
    description: 'Remove our branding and add your logo for a white-label experience.',
    icon: 'Palette',
    gradient: 'from-pink-500 to-rose-500',
    size: 'small',
    isPremium: true,
    image: null,
  },
  {
    id: 'embeddable-widgets',
    title: 'Embeddable Widgets',
    description: 'Add beautiful testimonial widgets to any website with one line of code.',
    icon: 'Code',
    gradient: 'from-green-500 to-emerald-500',
    size: 'large',
    isPremium: false,
    image: null,
  },
];

// =============================================================================
// HOW IT WORKS STEPS
// =============================================================================
export const howItWorksSteps = [
  {
    step: 1,
    title: 'Create a Space',
    description: 'Set up a dedicated space for each project with your branding and custom questions.',
    icon: 'FolderPlus',
  },
  {
    step: 2,
    title: 'Send the Link',
    description: 'Share a unique link with clients to collect text or video testimonials effortlessly.',
    icon: 'Send',
  },
  {
    step: 3,
    title: 'Embed Anywhere',
    description: 'Add a beautiful Wall of Love widget to your website with one line of code.',
    icon: 'Code',
  },
];

// =============================================================================
// TESTIMONIALS (Wall of Love)
// =============================================================================
export const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart',
    avatar: 'https://i.pravatar.cc/100?img=1',
    content: 'TrustWall transformed how we collect testimonials. Our conversion rate increased by 40% after adding the Wall of Love to our website!',
    rating: 5,
    type: 'text',
    featured: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Freelance Designer',
    company: 'Self-employed',
    avatar: 'https://i.pravatar.cc/100?img=3',
    content: 'As a freelancer, social proof is everything. TrustWall makes it so easy to collect and showcase client reviews.',
    rating: 5,
    type: 'text',
    featured: true,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    company: 'GrowthLabs',
    avatar: 'https://i.pravatar.cc/100?img=5',
    content: 'The video testimonial feature is a game-changer. Authentic video reviews convert way better than text.',
    rating: 5,
    type: 'text',
    featured: true,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Agency Owner',
    company: 'Digital Spark',
    avatar: 'https://i.pravatar.cc/100?img=8',
    content: 'We use TrustWall for all our client projects. The embeddable widget is beautiful and super easy to customize.',
    rating: 5,
    type: 'text',
    featured: true,
  },
  {
    id: 5,
    name: 'Jessica Martinez',
    role: 'Product Manager',
    company: 'SaaSify',
    avatar: 'https://i.pravatar.cc/100?img=9',
    content: 'Switched from a competitor and never looked back. The customization options are unmatched!',
    rating: 5,
    type: 'text',
    featured: false,
  },
  {
    id: 6,
    name: 'Alex Thompson',
    role: 'Founder',
    company: 'LaunchPad',
    avatar: 'https://i.pravatar.cc/100?img=11',
    content: 'Our landing page conversions went up 25% within the first week of adding TrustWall widgets. Incredible ROI!',
    rating: 5,
    type: 'text',
    featured: false,
  },
  {
    id: 7,
    name: 'Rachel Green',
    role: 'E-commerce Manager',
    company: 'StyleHub',
    avatar: 'https://i.pravatar.cc/100?img=16',
    content: 'The social proof popups are amazing! We see customers engaging with testimonials in real-time.',
    rating: 5,
    type: 'text',
    featured: false,
  },
  {
    id: 8,
    name: 'James Wilson',
    role: 'CTO',
    company: 'DevFlow',
    avatar: 'https://i.pravatar.cc/100?img=12',
    content: 'The API is clean and well-documented. Integration took less than an hour. Great developer experience!',
    rating: 5,
    type: 'text',
    featured: false,
  },
];

// =============================================================================
// FEATURES PAGE DATA
// =============================================================================
export const featuresPageData = {
  hero: {
    badge: 'Powerful Features',
    headline: 'Everything you need to build trust',
    subheadline: 'From collection to display, TrustWall provides all the tools you need to leverage social proof effectively.',
  },
  sections: [
    {
      id: 'collection',
      title: 'Effortless Collection',
      description: 'Collect video and text testimonials with beautiful, branded forms. No technical knowledge required.',
      features: [
        {
          title: 'Video Recording',
          description: 'Clients record directly in their browser. No apps, no friction.',
          icon: 'Video',
        },
        {
          title: 'Star Ratings',
          description: 'Collect quantitative feedback alongside testimonials.',
          icon: 'Star',
        },
        {
          title: 'Photo Uploads',
          description: 'Allow customers to add photos for extra authenticity.',
          icon: 'Image',
        },
        {
          title: 'Custom Branding',
          description: 'Match the collection form to your brand perfectly.',
          icon: 'Palette',
        },
      ],
      image: 'collection-mockup',
      imagePosition: 'right',
    },
    {
      id: 'presets',
      title: 'Widget Presets',
      description: 'Choose from 15+ professionally designed presets. One click to transform your testimonial widget.',
      features: [
        {
          title: '15+ Presets',
          description: 'From minimal to bold, find your perfect style.',
          icon: 'Palette',
        },
        {
          title: 'Dark & Light Themes',
          description: 'Automatic theme switching for all presets.',
          icon: 'Moon',
        },
        {
          title: 'One-Click Apply',
          description: 'Instantly preview and apply any preset.',
          icon: 'Zap',
        },
        {
          title: 'Regular Updates',
          description: 'New presets added every month.',
          icon: 'Star',
        },
      ],
      image: 'presets-mockup',
      imagePosition: 'left',
    },
    {
      id: 'card-layouts',
      title: 'Card Layouts',
      description: 'Choose how each testimonial is displayed with 8+ unique card layout styles.',
      features: [
        {
          title: 'Twitter Style',
          description: 'Social media inspired card design.',
          icon: 'MessageSquare',
        },
        {
          title: 'Quote Cards',
          description: 'Elegant quote-focused layouts.',
          icon: 'MessageSquare',
        },
        {
          title: 'Modern Split',
          description: 'Profile and content side by side.',
          icon: 'Layout',
        },
        {
          title: 'Video Hero',
          description: 'Video testimonials front and center.',
          icon: 'Video',
        },
      ],
      image: 'cards-mockup',
      imagePosition: 'right',
    },
    {
      id: 'combos',
      title: 'Combo Packs',
      description: 'Pre-matched preset + card layout combinations for stunning results. One click, complete transformation.',
      features: [
        {
          title: 'Expert Curated',
          description: 'Designer-picked combinations that work perfectly.',
          icon: 'Star',
        },
        {
          title: 'Instant Apply',
          description: 'Apply preset + layout together in one click.',
          icon: 'Zap',
        },
        {
          title: 'Custom Headings',
          description: 'Each combo includes matching heading styles.',
          icon: 'Layout',
        },
        {
          title: 'Growing Library',
          description: 'New combo packs added regularly.',
          icon: 'Blocks',
        },
      ],
      image: 'combos-mockup',
      imagePosition: 'left',
    },
    {
      id: 'widget-designer',
      title: 'Widget Designer',
      description: 'Fine-tune every detail of your testimonial widget with our powerful visual editor.',
      features: [
        {
          title: 'Custom Colors',
          description: 'Pick any color for any element.',
          icon: 'Palette',
        },
        {
          title: 'Typography Controls',
          description: 'Custom fonts, sizes, and weights.',
          icon: 'Layout',
        },
        {
          title: 'Animation Effects',
          description: 'Smooth transitions and hover effects.',
          icon: 'Zap',
        },
        {
          title: 'Live Preview',
          description: 'See changes in real-time as you design.',
          icon: 'Monitor',
        },
      ],
      image: 'designer-mockup',
      imagePosition: 'right',
    },
    {
      id: 'fomo-popups',
      title: 'FOMO Popups',
      description: 'Show real-time testimonial popups to create urgency and boost conversions by up to 15%.',
      features: [
        {
          title: 'Non-Intrusive',
          description: 'Beautifully designed popups that don\'t annoy.',
          icon: 'MessageSquare',
        },
        {
          title: 'Smart Timing',
          description: 'Customizable display intervals and delays.',
          icon: 'Zap',
        },
        {
          title: 'Mobile Friendly',
          description: 'Perfect display on all screen sizes.',
          icon: 'Monitor',
        },
        {
          title: 'Position Control',
          description: 'Choose corner placement and animation style.',
          icon: 'Layout',
        },
      ],
      image: 'fomo-mockup',
      imagePosition: 'left',
    },
    {
      id: 'cta-analytics',
      title: 'CTA Analytics',
      description: 'Add custom CTA buttons to your widget and track every click with detailed analytics.',
      features: [
        {
          title: 'Custom CTA Buttons',
          description: 'Add action buttons with custom text and links.',
          icon: 'MessageSquare',
        },
        {
          title: 'Click Tracking',
          description: 'Track every button click in real-time.',
          icon: 'BarChart3',
        },
        {
          title: 'Impression Data',
          description: 'See how many people view your widget.',
          icon: 'Search',
        },
        {
          title: 'Conversion Metrics',
          description: 'Calculate click-through rates automatically.',
          icon: 'BarChart3',
        },
      ],
      image: 'cta-mockup',
      imagePosition: 'right',
    },
  ],
  techSpecs: [
    { label: 'Page Load Impact', value: '< 50kb gzipped' },
    { label: 'CDN', value: 'Global Edge Network' },
    { label: 'Uptime', value: '99.9% SLA' },
    { label: 'Security', value: 'SOC 2 Compliant' },
    { label: 'GDPR', value: 'Fully Compliant' },
    { label: 'Support', value: '24/7 Available' },
  ],
};

// =============================================================================
// DEMO PAGE DATA
// =============================================================================
export const demoPageData = {
  headline: 'Try TrustWall Live',
  subheadline: 'Customize and preview the widget in real-time. No signup required.',
  defaultSettings: {
    darkMode: false,
    showAvatar: true,
    showRating: true,
    starColor: '#FBBF24', // Amber
    layout: 'grid',
    columns: 3,
    cardStyle: 'default',
  },
  previewTestimonials: [
    {
      id: 1,
      name: 'Sarah J.',
      role: 'CEO, TechStart',
      avatar: 'https://i.pravatar.cc/100?img=1',
      content: 'Absolutely love this product! It has transformed how we showcase customer feedback.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Mike R.',
      role: 'Founder',
      avatar: 'https://i.pravatar.cc/100?img=3',
      content: 'Simple, elegant, and effective. Highly recommend!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Lisa K.',
      role: 'Marketing Lead',
      avatar: 'https://i.pravatar.cc/100?img=5',
      content: 'The best testimonial tool we\'ve used. Period.',
      rating: 5,
    },
  ],
};

// =============================================================================
// LEGAL PAGE DATA
// =============================================================================
export const legalPageData = {
  privacyPolicy: {
    lastUpdated: 'January 15, 2026',
    effectiveDate: 'January 15, 2026',
  },
  termsOfService: {
    lastUpdated: 'January 15, 2026',
    effectiveDate: 'January 15, 2026',
  },
};

// =============================================================================
// CTA SECTION DATA
// =============================================================================
export const ctaSection = {
  headline: 'Ready to build trust?',
  subheadline: 'Join thousands of businesses using TrustWall to showcase social proof and boost conversions.',
  primaryCTA: {
    label: 'Start for Free',
    href: '/signup',
  },
  secondaryCTA: {
    label: 'View Pricing',
    href: '/pricing',
  },
};

// =============================================================================
// SEO META DATA
// =============================================================================
export const seoData = {
  home: {
    title: 'TrustWall - Collect & Display Beautiful Testimonials',
    description: 'Create dedicated spaces for your projects, collect stunning text & video testimonials, and showcase them on your website with beautiful widgets.',
    keywords: 'testimonials, social proof, reviews, video testimonials, wall of love, customer feedback',
  },
  features: {
    title: 'Features - TrustWall',
    description: 'Discover all the powerful features TrustWall offers for collecting and displaying customer testimonials.',
    keywords: 'testimonial features, video collection, widget embed, social proof tools',
  },
  pricing: {
    title: 'Pricing - TrustWall',
    description: 'Simple, transparent pricing for businesses of all sizes. Start free and upgrade as you grow.',
    keywords: 'testimonial pricing, social proof plans, TrustWall pricing',
  },
  demo: {
    title: 'Live Demo - TrustWall',
    description: 'Try TrustWall live without signing up. Customize and preview testimonial widgets in real-time.',
    keywords: 'testimonial demo, widget preview, TrustWall demo',
  },
  wallOfLove: {
    title: 'Wall of Love - TrustWall',
    description: 'See what our customers are saying about TrustWall. Real testimonials from real users.',
    keywords: 'customer testimonials, reviews, TrustWall reviews',
  },
  privacy: {
    title: 'Privacy Policy - TrustWall',
    description: 'Learn how TrustWall collects, uses, and protects your personal information.',
    keywords: 'privacy policy, data protection, GDPR',
  },
  terms: {
    title: 'Terms of Service - TrustWall',
    description: 'Read the terms and conditions for using TrustWall services.',
    keywords: 'terms of service, terms and conditions, legal',
  },
};
