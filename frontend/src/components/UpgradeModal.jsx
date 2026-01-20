/**
 * UpgradeModal - Premium Upgrade Dialog
 * 
 * A beautiful, conversion-optimized modal that appears when users
 * interact with locked features. Designed to encourage upgrades
 * with clear value propositions.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Rocket,
  Crown,
  Check,
  ArrowRight,
  Zap,
  Star,
  Shield,
  Lock,
  TrendingUp
} from 'lucide-react';
import { usePlanCheck } from '@/hooks/useFeature';

/**
 * Feature descriptions for the upgrade modal
 */
const FEATURE_INFO = {
  // Widget Features
  'widget.remove_branding': {
    name: 'Remove Branding',
    description: 'Display testimonials without TrustFlow watermark for a clean, professional look.',
    icon: Crown,
    benefits: ['Professional appearance', 'Your brand only', 'White-label ready']
  },
  'widget.motion_effects': {
    name: 'Motion Effects',
    description: 'Add stunning animations and transitions to your testimonial displays.',
    icon: Sparkles,
    benefits: ['Eye-catching animations', 'Smooth transitions', 'Interactive hover effects']
  },
  'widget.card_styling': {
    name: 'Card Styling',
    description: 'Customize card appearance with advanced styling options.',
    icon: Zap,
    benefits: ['Custom shadows', 'Border styles', 'Premium themes']
  },
  'widget.social_proof_popups': {
    name: 'Social Proof Popups',
    description: 'Show real-time testimonial popups to boost conversions.',
    icon: TrendingUp,
    benefits: ['Increase trust', 'Boost conversions', 'Real-time notifications']
  },
  'widget.typography': {
    name: 'Typography Controls',
    description: 'Choose from premium fonts and customize text styling.',
    icon: Star,
    benefits: ['Premium fonts', 'Custom sizing', 'Brand consistency']
  },
  
  // Edit Form Features
  'edit_form.page_theme': {
    name: 'Page Themes',
    description: 'Choose from beautiful premium themes for your testimonial collection page.',
    icon: Sparkles,
    benefits: ['Premium themes', 'Custom backgrounds', 'Professional look']
  },
  'edit_form.custom_logo': {
    name: 'Custom Logo',
    description: 'Upload your own logo for a fully branded experience.',
    icon: Crown,
    benefits: ['Brand identity', 'Professional trust', 'Custom branding']
  },
  'edit_form.remove_branding': {
    name: 'Remove Branding',
    description: 'Remove TrustFlow branding from your collection forms.',
    icon: Shield,
    benefits: ['White-label ready', 'Professional forms', 'Your brand only']
  },
  
  // Advanced Features
  'advanced.custom_domains': {
    name: 'Custom Domains',
    description: 'Connect your own domain for a fully branded testimonial experience.',
    icon: Shield,
    benefits: ['Your domain', 'SEO benefits', 'Complete branding']
  },
  'advanced.webhooks': {
    name: 'Webhooks',
    description: 'Integrate with any tool via webhooks for automated workflows.',
    icon: Zap,
    benefits: ['Automation', 'Third-party integrations', 'Real-time sync']
  },
  'advanced.cta': {
    name: 'CTA Buttons',
    description: 'Add call-to-action buttons to your testimonial widgets.',
    icon: Rocket,
    benefits: ['Drive conversions', 'Custom CTAs', 'Track clicks']
  },

  // Gallery Features
  'gallery.premium_presets': {
    name: 'Premium Presets',
    description: 'Access beautiful premium widget presets designed by experts.',
    icon: Sparkles,
    benefits: ['Pro designs', 'One-click apply', 'Stand out']
  },
  'gallery.pro_presets': {
    name: 'Pro Presets',
    description: 'Unlock exclusive pro-level presets for maximum impact.',
    icon: Crown,
    benefits: ['Exclusive designs', 'Agency-grade', 'Maximum conversions']
  },
  'gallery.premium_layouts': {
    name: 'Premium Layouts',
    description: 'Access advanced card layout options.',
    icon: Zap,
    benefits: ['Unique layouts', 'Professional look', 'Better engagement']
  },
  'gallery.premium_combos': {
    name: 'Premium Combos',
    description: 'Pre-configured layout + style combinations for instant setup.',
    icon: Star,
    benefits: ['One-click setup', 'Curated designs', 'Save time']
  }
};

/**
 * Plan features for comparison
 */
const PLAN_HIGHLIGHTS = {
  starter: {
    name: 'Starter',
    price: '$19',
    priceINR: '₹1,499',
    period: '/month',
    highlights: [
      '3 Spaces',
      '500 Text Testimonials',
      '20 Video Testimonials',
      'Remove Branding',
      'Premium Themes',
      'Social Proof Popups',
      'CTA Buttons'
    ]
  },
  pro: {
    name: 'Pro',
    price: '$49',
    priceINR: '₹3,999',
    period: '/month',
    highlights: [
      '10 Spaces',
      'Unlimited Testimonials',
      '100 Videos',
      'Custom Domains',
      'Webhooks',
      'Priority Support',
      'API Access'
    ]
  }
};

/**
 * UpgradeModal Component
 */
export const UpgradeModal = ({ 
  open, 
  onOpenChange, 
  featureKey,
  customTitle,
  customDescription 
}) => {
  const navigate = useNavigate();
  const { currentPlanId } = usePlanCheck();
  const [showConfetti, setShowConfetti] = useState(false);

  // Get feature info
  const featureInfo = FEATURE_INFO[featureKey] || {
    name: 'Premium Feature',
    description: 'This feature is available on paid plans.',
    icon: Lock,
    benefits: ['Unlock more features', 'Boost conversions', 'Grow faster']
  };

  // Determine which plan to highlight
  const requiredPlan = featureKey?.includes('custom_domains') || 
                       featureKey?.includes('webhooks') || 
                       featureKey?.includes('pro_') 
                       ? 'pro' : 'starter';

  const planInfo = PLAN_HIGHLIGHTS[requiredPlan];
  const FeatureIcon = featureInfo.icon;

  // Sparkle animation effect
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowConfetti(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [open]);

  const handleViewPlans = () => {
    onOpenChange(false);
    navigate(`/pricing?highlight=${requiredPlan}&feature=${encodeURIComponent(featureKey || '')}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-0 shadow-2xl">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 pb-8">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute top-1/2 -left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
            {showConfetti && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-12"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="absolute top-8 right-24"
                >
                  <Star className="w-3 h-3 text-pink-300 fill-pink-300" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-8 right-8"
                >
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                </motion.div>
              </>
            )}
          </div>

          {/* Header Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg"
            >
              <FeatureIcon className="w-8 h-8 text-white" />
            </motion.div>
            
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl font-bold text-white">
                  {customTitle || `Unlock ${featureInfo.name}`}
                </DialogTitle>
                <Rocket className="w-5 h-5 text-yellow-300" />
              </div>
              <DialogDescription className="text-white/80 text-base">
                {customDescription || featureInfo.description}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Plan Badge */}
          <Badge className="absolute -bottom-3 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1">
            <Crown className="w-3 h-3 mr-1" />
            Available on {planInfo.name}
          </Badge>
        </div>

        {/* Body Content */}
        <div className="p-6 pt-8">
          {/* Benefits List */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              What you'll get:
            </p>
            {featureInfo.benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Plan Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Starting at</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {planInfo.price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {planInfo.period}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                {planInfo.name} Plan
              </Badge>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleViewPlans}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
            >
              <span>View All Plans</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
            <Shield className="w-3 h-3 inline mr-1" />
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * QuotaExceededModal - Shows when user reaches usage limits
 */
export const QuotaExceededModal = ({
  open,
  onOpenChange,
  quotaType, // 'spaces' | 'testimonials' | 'videos'
  currentUsage,
  maxAllowed
}) => {
  const navigate = useNavigate();

  const quotaInfo = {
    spaces: {
      name: 'Spaces',
      description: 'You\'ve reached your space limit. Upgrade to create more spaces.',
      icon: Shield
    },
    testimonials: {
      name: 'Testimonials',
      description: 'You\'ve collected the maximum testimonials for your plan.',
      icon: Star
    },
    videos: {
      name: 'Video Testimonials',
      description: 'You\'ve reached your video testimonial limit.',
      icon: Zap
    }
  };

  const info = quotaInfo[quotaType] || quotaInfo.spaces;
  const QuotaIcon = info.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6 bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <QuotaIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {info.name} Limit Reached
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              {info.description}
            </DialogDescription>
          </DialogHeader>

          {/* Usage Indicator */}
          <div className="my-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Current Usage</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentUsage} / {maxAllowed}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate('/pricing');
              }}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
