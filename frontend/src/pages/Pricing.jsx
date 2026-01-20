/**
 * PricingPage - Premium Pricing & Plans Page
 * 
 * A high-converting, beautiful pricing page with tiered plans,
 * feature comparisons, and smooth animations. Designed to maximize
 * conversions with clear value propositions.
 * 
 * NOW FETCHES PRICING FROM DATABASE
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Check, X, Crown, Sparkles, Zap, ArrowRight, Shield, 
  Star, Rocket, MessageSquare, Video, Users, Globe,
  Webhook, Palette, Layout, Bell, ChevronDown, ChevronUp,
  ArrowLeft, Heart, Award, TrendingUp, Lock, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanCheck } from '@/hooks/useFeature';
import { fetchAllPlans } from '@/contexts/SubscriptionContext';
import confetti from 'canvas-confetti';

/**
 * Plan Configuration (UI Only - prices from DB)
 */
const PLAN_CONFIG = {
  free: {
    description: 'Perfect for getting started',
    cta: 'Current Plan',
    ctaVariant: 'outline',
    icon: Zap,
    gradient: 'from-slate-500 to-slate-600',
    popular: false
  },
  starter: {
    description: 'For growing businesses',
    cta: 'Upgrade to Starter',
    ctaVariant: 'default',
    icon: Rocket,
    gradient: 'from-violet-600 to-indigo-600',
    popular: true
  },
  pro: {
    description: 'For agencies & power users',
    cta: 'Upgrade to Pro',
    ctaVariant: 'default',
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
    popular: false
  }
};

/**
 * Feature comparison data
 */
const FEATURE_COMPARISON = [
  {
    category: 'Collection',
    icon: MessageSquare,
    features: [
      { name: 'Spaces', free: '1', starter: '3', pro: '10' },
      { name: 'Text Testimonials', free: '10', starter: '500', pro: 'Unlimited' },
      { name: 'Video Testimonials', free: '0', starter: '20', pro: '100' },
      { name: 'Custom Questions', free: true, starter: true, pro: true },
      { name: 'Video Recording', free: false, starter: true, pro: true }
    ]
  },
  {
    category: 'Branding & Design',
    icon: Palette,
    features: [
      { name: 'Remove TrustFlow Branding', free: false, starter: true, pro: true },
      { name: 'Custom Logo Upload', free: false, starter: true, pro: true },
      { name: 'Premium Page Themes', free: false, starter: true, pro: true },
      { name: 'Widget Presets', free: 'Basic', starter: 'Premium', pro: 'All' },
      { name: 'Card Styling Options', free: false, starter: true, pro: true }
    ]
  },
  {
    category: 'Widget & Display',
    icon: Layout,
    features: [
      { name: 'Embed Widgets', free: true, starter: true, pro: true },
      { name: 'Motion Effects', free: false, starter: true, pro: true },
      { name: 'Typography Controls', free: false, starter: true, pro: true },
      { name: 'Social Proof Popups', free: false, starter: true, pro: true },
      { name: 'CTA Buttons', free: false, starter: true, pro: true }
    ]
  },
  {
    category: 'Advanced',
    icon: Globe,
    features: [
      { name: 'Custom Domains', free: false, starter: false, pro: true },
      { name: 'Webhooks', free: false, starter: false, pro: true },
      { name: 'API Access', free: false, starter: false, pro: true },
      { name: 'Priority Support', free: false, starter: false, pro: true },
      { name: 'White-label Reports', free: false, starter: false, pro: true }
    ]
  }
];

/**
 * FAQ Data
 */
const FAQS = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated amount. When downgrading, your new plan takes effect at the end of the billing cycle.'
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Your testimonials and spaces are safe! If you exceed the new plan\'s limits, you\'ll still have access to view them, but you won\'t be able to add new ones until you\'re within limits.'
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, contact us within 30 days for a full refund.'
  },
  {
    q: 'Is there a discount for yearly billing?',
    a: 'Absolutely! When you choose yearly billing, you get 2 months free - that\'s a 17% discount compared to monthly billing.'
  },
  {
    q: 'Can I use TrustFlow for multiple clients?',
    a: 'Yes! The Pro plan is perfect for agencies. You get 10 spaces to manage testimonials for multiple clients, plus custom domains for white-label solutions.'
  }
];

/**
 * Testimonials for social proof
 */
const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Founder, PixelPerfect',
    avatar: 'SC',
    content: 'TrustFlow doubled our conversion rate. The social proof popups are a game-changer!',
    rating: 5
  },
  {
    name: 'Mike Roberts',
    role: 'Marketing Director',
    avatar: 'MR',
    content: 'We switched from a competitor and never looked back. The customization options are unmatched.',
    rating: 5
  },
  {
    name: 'Emma Watson',
    role: 'Agency Owner',
    avatar: 'EW',
    content: 'Managing testimonials for 8 clients is effortless with the Pro plan. Custom domains are perfect.',
    rating: 5
  }
];

/**
 * PricingPage Component
 */
const PricingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { currentPlanId, isLoading: planLoading } = usePlanCheck();
  
  const [isYearly, setIsYearly] = useState(false);
  const [currency, setCurrency] = useState('usd');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [dbPlans, setDbPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get highlighted plan from URL params
  const highlightedPlan = searchParams.get('highlight') || 'starter';

  // Fetch plans from database
  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const plans = await fetchAllPlans();
        setDbPlans(plans);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  // Detect currency based on locale (simplified)
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Kolkata') || timezone.includes('India')) {
      setCurrency('inr');
    }
  }, []);

  // Merge DB plans with UI config
  const plans = useMemo(() => {
    if (!dbPlans.length) return [];
    
    return dbPlans.map(dbPlan => {
      const config = PLAN_CONFIG[dbPlan.id] || PLAN_CONFIG.free;
      
      // Build features object from DB data
      const features = {
        spaces: `${dbPlan.max_spaces} ${dbPlan.max_spaces === 1 ? 'Space' : 'Spaces'}`,
        textTestimonials: dbPlan.max_text_testimonials >= 999999 
          ? 'Unlimited' 
          : `${dbPlan.max_text_testimonials.toLocaleString()} Testimonials`,
        videoTestimonials: dbPlan.max_videos === 0 
          ? 'No Videos' 
          : `${dbPlan.max_videos} Videos`,
        branding: dbPlan.features?.edit_form?.remove_branding ? 'Remove Branding ✓' : 'TrustFlow Branding',
        customLogo: dbPlan.features?.edit_form?.custom_logo || false,
        pageThemes: dbPlan.features?.edit_form?.page_theme ? 'Premium Themes' : 'Basic Theme',
        widgetPresets: dbPlan.id === 'pro' ? 'All Presets' : dbPlan.id === 'starter' ? 'Premium Presets' : 'Free Presets',
        customDomains: dbPlan.features?.advanced?.custom_domains || false,
        webhooks: dbPlan.features?.advanced?.webhooks || false,
        socialProofPopups: dbPlan.features?.widget?.social_proof_popups || false,
        ctaButtons: dbPlan.features?.advanced?.cta || false,
        priority: dbPlan.id === 'pro' ? 'Priority Support' : dbPlan.id === 'starter' ? 'Email Support' : 'Community Support'
      };
      
      return {
        id: dbPlan.id,
        name: dbPlan.name,
        description: config.description,
        priceMonthly: { usd: dbPlan.amount_usd, inr: dbPlan.amount_inr },
        priceYearly: { 
          usd: Math.round(dbPlan.amount_usd * 10), // 10 months = yearly (2 free)
          inr: Math.round(dbPlan.amount_inr * 10)
        },
        popular: config.popular,
        cta: config.cta,
        ctaVariant: config.ctaVariant,
        icon: config.icon,
        gradient: config.gradient,
        features
      };
    });
  }, [dbPlans]);

  // Format price
  const formatPrice = (plan) => {
    const price = isYearly ? plan.priceYearly : plan.priceMonthly;
    const amount = currency === 'inr' ? price.inr : price.usd;
    const symbol = currency === 'inr' ? '₹' : '$';
    
    if (amount === 0) return { amount: '0', symbol, period: '' };
    
    return {
      amount: amount.toLocaleString(),
      symbol,
      period: isYearly ? '/year' : '/month'
    };
  };

  // Handle plan selection
  const handleSelectPlan = (planId) => {
    if (planId === 'free') return;
    
    // Trigger confetti on upgrade click
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // TODO: Integrate with Stripe/Razorpay
    console.log('Selected plan:', planId, isYearly ? 'yearly' : 'monthly');
    
    // For now, show a toast or redirect to checkout
    // navigate(`/checkout?plan=${planId}&billing=${isYearly ? 'yearly' : 'monthly'}`);
  };

  const isLoading = loading || planLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">TrustFlow</span>
            </div>
            
            {user ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Simple, Transparent Pricing
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Choose your perfect{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                growth plan
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Start free, upgrade when you need. All plans include our core features. 
              No hidden fees, cancel anytime.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-4"
          >
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                isYearly ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ left: isYearly ? '30px' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0 animate-pulse">
                Save 17%
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => {
              const price = formatPrice(plan);
              const isCurrentPlan = plan.id === currentPlanId;
              const isHighlighted = plan.id === highlightedPlan || plan.popular;
              const PlanIcon = plan.icon;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shadow-lg px-4 py-1">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`relative h-full transition-all duration-300 ${
                    isHighlighted 
                      ? 'border-2 border-violet-500 dark:border-violet-400 shadow-xl shadow-violet-500/10 scale-105 md:scale-110 z-10' 
                      : 'border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg'
                  }`}>
                    {/* Gradient Header */}
                    <div className={`h-2 rounded-t-lg bg-gradient-to-r ${plan.gradient}`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                          <PlanIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="mt-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-slate-900 dark:text-white">
                            {price.symbol}{price.amount}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {price.period}
                          </span>
                        </div>
                        {isYearly && plan.id !== 'free' && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            2 months free!
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* CTA Button */}
                      <Button
                        className={`w-full mb-6 ${
                          isCurrentPlan 
                            ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-default' 
                            : plan.id === 'free'
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                              : `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg`
                        }`}
                        onClick={() => !isCurrentPlan && handleSelectPlan(plan.id)}
                        disabled={isCurrentPlan}
                      >
                        {isCurrentPlan ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Current Plan
                          </>
                        ) : (
                          <>
                            {plan.cta}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                      
                      {/* Features List */}
                      <ul className="space-y-3">
                        {Object.entries(plan.features).map(([key, value]) => {
                          const isIncluded = value === true || (typeof value === 'string' && !value.includes('No'));
                          
                          return (
                            <li key={key} className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isIncluded 
                                  ? 'bg-green-100 dark:bg-green-900/30' 
                                  : 'bg-slate-100 dark:bg-slate-800'
                              }`}>
                                {isIncluded ? (
                                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                ) : (
                                  <X className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                )}
                              </div>
                              <span className={`text-sm ${
                                isIncluded 
                                  ? 'text-slate-700 dark:text-slate-300' 
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                {typeof value === 'string' ? value : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">30-Day Money-Back</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Lock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-medium">Loved by 1000+ Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Compare All Features
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              See exactly what's included in each plan
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowComparison(!showComparison)}
            className="w-full mb-6"
          >
            {showComparison ? 'Hide' : 'Show'} Detailed Comparison
            {showComparison ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
          </Button>
          
          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <div className="font-semibold text-slate-900 dark:text-white">Feature</div>
                    <div className="text-center font-semibold text-slate-600 dark:text-slate-400">Free</div>
                    <div className="text-center font-semibold text-violet-600 dark:text-violet-400">Starter</div>
                    <div className="text-center font-semibold text-amber-600 dark:text-amber-400">Pro</div>
                  </div>
                  
                  {/* Feature Groups */}
                  {FEATURE_COMPARISON.map((group) => {
                    const GroupIcon = group.icon;
                    return (
                      <div key={group.category}>
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                            <GroupIcon className="w-4 h-4" />
                            {group.category}
                          </div>
                        </div>
                        {group.features.map((feature, idx) => (
                          <div 
                            key={feature.name}
                            className={`grid grid-cols-4 gap-4 p-4 ${
                              idx !== group.features.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                            }`}
                          >
                            <div className="text-sm text-slate-600 dark:text-slate-400">{feature.name}</div>
                            <FeatureValue value={feature.free} />
                            <FeatureValue value={feature.starter} />
                            <FeatureValue value={feature.pro} />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Loved by Growing Businesses
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              See what our customers have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white dark:bg-slate-900">
                  <CardContent className="pt-6">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-slate-900 dark:text-white">
                        {faq.q}
                      </CardTitle>
                      <motion.div
                        animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="pt-0 pb-4">
                          <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-12 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to boost your conversions?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of businesses using TrustFlow to collect and display 
                authentic testimonials. Start free today!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-violet-700 hover:bg-slate-100 shadow-lg w-full sm:w-auto"
                  onClick={() => navigate('/signup')}
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                  onClick={() => window.open('https://cal.com', '_blank')}
                >
                  Schedule a Demo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2026 TrustFlow. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * Feature Value Component
 */
const FeatureValue = ({ value }) => {
  if (value === true) {
    return (
      <div className="text-center">
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      </div>
    );
  }
  
  if (value === false) {
    return (
      <div className="text-center">
        <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
      </div>
    );
  }
  
  return (
    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
      {value}
    </div>
  );
};

export default PricingPage;
