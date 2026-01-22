/**
 * FeatureGate - Premium Feature Access Control
 * 
 * Beautiful, branded feature gating with plan badges and upgrade modals.
 * Shows icons for locked features based on user's current plan.
 * 
 * Inspired by: senja.io, testimonials.to
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Crown, Sparkles, ArrowRight, Check, X, Zap, Rocket, 
  Star, Shield, TrendingUp, ChevronRight, Heart, Gem, Loader2, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useFeature, FEATURE_DISPLAY_NAMES } from '@/hooks/useFeature';
import { useSubscription, fetchAllPlans } from '@/contexts/SubscriptionContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// ============================================
// FEATURE INFO - Maps feature keys to display info
// ============================================
const FEATURE_INFO = {
  // Widget Features
  'widget.remove_branding': {
    title: 'White Label Widget',
    description: 'Remove "Powered by TrustWall" watermark for a clean, professional look',
    icon: '✨',
    benefits: ['Professional appearance', 'Your brand only', 'Agency-ready']
  },
  'widget.motion_effects': {
    title: 'Motion Effects',
    description: 'Add stunning animations and transitions to captivate visitors',
    icon: '🎬',
    benefits: ['Eye-catching animations', 'Smooth transitions', 'Higher engagement']
  },
  'widget.card_styling': {
    title: 'Advanced Card Styling',
    description: 'Customize cards with shadows, borders, and premium themes',
    icon: '🎨',
    benefits: ['Custom shadows', 'Border styles', 'Premium themes']
  },
  'widget.social_proof_popups': {
    title: 'Social Proof Popups',
    description: 'Show real-time testimonial popups to boost conversions',
    icon: '🔔',
    benefits: ['Increase trust', 'Boost conversions', 'FOMO notifications']
  },
  'widget.typography': {
    title: 'Custom Typography',
    description: 'Choose from premium fonts and customize text styling',
    icon: '📝',
    benefits: ['Premium fonts', 'Custom sizing', 'Brand consistency']
  },
  'widget.custom_button': {
    title: 'Custom Action Button',
    description: 'Add a branded call-to-action button to your widgets',
    icon: '🔗',
    benefits: ['Custom CTAs', 'Drive traffic', 'Branded links']
  },
  'widget.share_qr': {
    title: 'Share & QR Code',
    description: 'Generate custom QR codes for offline marketing',
    icon: '📱',
    benefits: ['Offline marketing', 'Custom branding', 'Track scans']
  },
  
  // Edit Form Features
  'edit_form.form_features': {
    title: 'Rich Media Collection',
    description: 'Collect video testimonials, photos, and custom fields',
    icon: '📹',
    benefits: ['Video testimonials', 'Photo uploads', 'Custom questions']
  },
  'edit_form.remove_branding': {
    title: 'White Label Forms',
    description: 'Remove TrustWall branding from your collection forms',
    icon: '✨',
    benefits: ['Your brand only', 'Professional forms', 'Agency-ready']
  },
  'edit_form.custom_link': {
    title: 'Custom Link Redirect',
    description: 'Redirect customers to any URL after submission',
    icon: '🔗',
    benefits: ['Custom redirects', 'Upsell opportunities', 'Better UX']
  },
  'edit_form.custom_logo': {
    title: 'Custom Brand Logo',
    description: 'Upload your own logo for fully branded experience',
    icon: '🖼️',
    benefits: ['Brand identity', 'Professional trust', 'Consistent branding']
  },
  'edit_form.page_theme': {
    title: 'Premium Page Themes',
    description: 'Choose from beautiful premium themes for your forms',
    icon: '🎨',
    benefits: ['Premium themes', 'Custom backgrounds', 'Stand out']
  },
  
  // Advanced Features  
  'advanced.custom_domains': {
    title: 'Custom Domains',
    description: 'Connect your own domain for a fully branded experience',
    icon: '🌐',
    benefits: ['Your domain', 'SEO benefits', 'Complete branding']
  },
  'advanced.webhooks': {
    title: 'Webhooks & Integrations',
    description: 'Connect to Zapier, Slack, and any tool via webhooks',
    icon: '🔗',
    benefits: ['Automation', 'Third-party integrations', 'Real-time sync']
  },
  'advanced.cta': {
    title: 'CTA Analytics Dashboard',
    description: 'Track impressions, clicks, and conversions on your CTAs',
    icon: '📊',
    benefits: ['Track ROI', 'Analytics', 'Optimize performance']
  },
  
  // Gallery Features
  'gallery.premium_presets': {
    title: 'Premium Presets',
    description: 'Access beautiful widget presets designed by experts',
    icon: '💎',
    benefits: ['Pro designs', 'One-click apply', 'Stand out']
  },
  'gallery.pro_presets': {
    title: 'Pro Presets',
    description: 'Unlock exclusive pro-level presets for maximum impact',
    icon: '👑',
    benefits: ['Exclusive designs', 'Agency-grade', 'Maximum conversions']
  }
};

// ============================================
// PLAN BADGE COMPONENT - Shows which plan unlocks feature
// ============================================
export const PlanBadge = ({ 
  plan = 'starter', 
  size = 'sm',
  onClick,
  showLock = true,
  animate = true,
  className 
}) => {
  const isProPlan = plan === 'pro';
  
  const sizeClasses = {
    xs: 'text-[8px] px-1.5 py-0.5 gap-0.5',
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1'
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5'
  };

  const gradients = {
    starter: 'from-violet-500 via-purple-500 to-indigo-500',
    pro: 'from-amber-400 via-orange-500 to-rose-500'
  };

  const content = (
    <motion.div
      whileHover={animate ? { scale: 1.05, y: -1 } : {}}
      whileTap={animate ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-wide rounded-full cursor-pointer select-none transition-all",
        `bg-gradient-to-r ${gradients[plan] || gradients.starter} text-white`,
        "shadow-md hover:shadow-lg",
        sizeClasses[size],
        onClick && "hover:brightness-110",
        className
      )}
    >
      {showLock ? (
        <Lock className={iconSizes[size]} />
      ) : isProPlan ? (
        <Crown className={iconSizes[size]} />
      ) : (
        <Zap className={iconSizes[size]} />
      )}
      <span>{isProPlan ? 'PRO' : 'STARTER'}</span>
    </motion.div>
  );

  if (!onClick) return content;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-slate-900 text-white border-slate-700 px-3 py-2"
        >
          <p className="text-xs font-medium flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-400" />
            Click to unlock with {isProPlan ? 'Pro' : 'Starter'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ============================================
// FEATURE INDICATOR - Shows plan badge next to locked features
// ============================================
export const FeatureIndicator = ({ featureKey, size = 'sm', className }) => {
  const { isAllowed, isLoading, requiredPlan } = useFeature(featureKey);
  const [showModal, setShowModal] = useState(false);
  
  // Don't show anything if feature is allowed or still loading
  if (isAllowed || isLoading) return null;
  
  return (
    <>
      <PlanBadge 
        plan={requiredPlan} 
        size={size} 
        onClick={() => setShowModal(true)} 
        className={className} 
      />
      <UpgradeBanner 
        open={showModal} 
        onOpenChange={setShowModal} 
        featureKey={featureKey} 
      />
    </>
  );
};

// ============================================
// LOCKED SWITCH - For toggle switches that are locked
// ============================================
export const LockedSwitch = ({ featureKey, className, children }) => {
  const { isAllowed, isLoading, requiredPlan } = useFeature(featureKey);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return <div className={cn("opacity-50 pointer-events-none", className)}>{children}</div>;
  }
  
  if (isAllowed) return children;

  return (
    <>
      <div 
        className={cn("flex items-center gap-2 cursor-pointer", className)}
        onClick={() => setShowModal(true)}
      >
        <div className="opacity-40 pointer-events-none">{children}</div>
        <PlanBadge plan={requiredPlan} size="sm" showLock={true} />
      </div>
      <UpgradeBanner open={showModal} onOpenChange={setShowModal} featureKey={featureKey} />
    </>
  );
};

// ============================================
// FEATURE GATE - Main wrapper component
// ============================================
export const FeatureGate = ({
  featureKey,
  children,
  fallback,
  showBadge = true,
  badgePosition = 'inline',
  className
}) => {
  const { isAllowed, isLoading, requiredPlan, requiredPlanName, featureDisplayName } = useFeature(featureKey);
  const [showModal, setShowModal] = useState(false);

  const handleLockedClick = useCallback((e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setShowModal(true);
  }, []);

  if (isLoading) {
    return <div className={cn("opacity-60", className)}>{children}</div>;
  }
  
  if (isAllowed) {
    return <>{children}</>;
  }

  // If custom fallback provided, use that
  if (fallback) {
    return (
      <>
        <div onClick={handleLockedClick} className="cursor-pointer">{fallback}</div>
        <UpgradeBanner open={showModal} onOpenChange={setShowModal} featureKey={featureKey} />
      </>
    );
  }

  // Default locked state UI
  return (
    <>
      <div 
        className={cn("relative cursor-pointer group", className)} 
        onClick={handleLockedClick}
      >
        <div className="opacity-50 pointer-events-none select-none transition-opacity group-hover:opacity-40">
          {children}
        </div>
        {showBadge && (
          <div className={cn(
            "absolute z-10",
            badgePosition === 'top-right' && "top-2 right-2",
            badgePosition === 'inline' && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            badgePosition === 'after' && "top-1/2 right-2 -translate-y-1/2"
          )}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 dark:bg-slate-800/95 shadow-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm"
            >
              <Lock className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {requiredPlanName}
              </span>
            </motion.div>
          </div>
        )}
      </div>
      <UpgradeBanner open={showModal} onOpenChange={setShowModal} featureKey={featureKey} />
    </>
  );
};

// ============================================
// UPGRADE BANNER - Premium branded upgrade modal
// ============================================
export const UpgradeBanner = ({ open, onOpenChange, featureKey }) => {
  const navigate = useNavigate();
  const { planHierarchy, allPlans } = useSubscription();
  const { requiredPlan, featureDisplayName } = useFeature(featureKey);
  const [plans, setPlans] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  
  // Fetch plans data
  useEffect(() => {
    if (open && allPlans?.length > 0) {
      setPlans(allPlans.filter(p => p.id !== 'free'));
    } else if (open) {
      fetchAllPlans().then(data => {
        setPlans(data.filter(p => p.id !== 'free'));
      });
    }
  }, [open, allPlans]);
  
  const featureInfo = FEATURE_INFO[featureKey] || {
    title: featureDisplayName || 'Premium Feature',
    description: 'Upgrade your plan to unlock this feature',
    icon: '✨',
    benefits: ['Unlock more features', 'Boost conversions', 'Grow faster']
  };
  
  const currentPlan = planHierarchy?.currentPlanId || 'free';
  const isFreeUser = currentPlan === 'free';
  const isStarterUser = currentPlan === 'starter';
  
  // Direct checkout handler - redirects immediately to payment
  const handleSelectPlan = async (planId) => {
    if (planId === 'free') return;
    
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) {
      toast.error('Plan not found. Please try again.');
      return;
    }
    
    // Get user from auth context via window or redirect to login
    const userStr = localStorage.getItem('sb-user') || sessionStorage.getItem('sb-user');
    let user = null;
    try {
      // Try to get user from supabase auth
      const { supabase } = await import('@/lib/supabase');
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;
    } catch (e) {
      console.error('Error getting user:', e);
    }
    
    if (!user) {
      toast.error('Please log in to upgrade your plan.');
      onOpenChange(false);
      navigate('/login?redirect=/pricing');
      return;
    }
    
    // Get variant ID (monthly by default from banner)
    const variantId = selectedPlan.lemon_squeezy_variant_id_monthly;
    
    if (!variantId) {
      toast.error(`${selectedPlan.name} plan is not available yet. Please try again later.`);
      return;
    }
    
    setCheckoutLoading(planId);
    
    try {
      // Trigger confetti for positive UX
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      const API_BASE = process.env.REACT_APP_BACKEND_URL || 
                       process.env.REACT_APP_API_URL || 
                       'https://trust-flow-app.vercel.app';
      
      const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          variant_id: variantId,
          user_id: user.id,
          user_email: user.email,
          billing_cycle: 'monthly'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create checkout session');
      }
      
      const data = await response.json();
      
      if (data.url) {
        toast.success('Redirecting to secure checkout...', { duration: 2000 });
        setTimeout(() => {
          window.location.href = data.url;
        }, 300);
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.message.includes('not configured')) {
        toast.error('Payment service is being set up. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        toast.error('Connection error. Please check your internet and try again.');
      } else {
        toast.error(error.message || 'Unable to start checkout. Please try again.');
      }
    } finally {
      setCheckoutLoading(null);
    }
  };
  
  // Navigate to pricing page for plan comparison
  const handleComparePlans = () => {
    onOpenChange(false);
    navigate('/pricing');
  };

  // Confetti animation on hover
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideCloseButton className="sm:max-w-2xl max-w-[95vw] p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Animated gradient header */}
        <div className="relative px-4 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 overflow-hidden">
          {/* Close button on header - always visible with higher z-index */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 sm:p-2 rounded-full bg-white/30 hover:bg-white/40 transition-colors backdrop-blur-sm shadow-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
          </button>
          
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          
          {/* Header content */}
          <div className="relative z-10 text-center pr-8 sm:pr-0">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl mb-3 sm:mb-5"
            >
              <span className="text-2xl sm:text-4xl">{featureInfo.icon}</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2"
            >
              Unlock {featureInfo.title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm sm:text-base text-white/80 max-w-md mx-auto"
            >
              {featureInfo.description}
            </motion.p>
            
            {/* Benefits tags */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4"
            >
              {featureInfo.benefits?.map((benefit, i) => (
                <Badge 
                  key={i}
                  className="bg-white/20 text-white border-white/20 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2"
                >
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  {benefit}
                </Badge>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Plans Grid */}
        <div className="p-4 sm:p-6">
          <div className={cn(
            "grid gap-3 sm:gap-4",
            isFreeUser ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          )}>
            {/* Starter Plan - Show for free users or when required */}
            {(isFreeUser || requiredPlan === 'starter') && plans.find(p => p.id === 'starter') && (
              <PlanCard 
                plan={plans.find(p => p.id === 'starter')}
                isRecommended={requiredPlan === 'starter'}
                onSelect={() => handleSelectPlan('starter')}
                isHovered={hoveredPlan === 'starter'}
                onHover={setHoveredPlan}
                isLoading={checkoutLoading === 'starter'}
                disabled={checkoutLoading !== null}
              />
            )}
            
            {/* Pro Plan - Always show for free users, show for starter if feature requires it */}
            {(isFreeUser || isStarterUser || requiredPlan === 'pro') && plans.find(p => p.id === 'pro') && (
              <PlanCard 
                plan={plans.find(p => p.id === 'pro')}
                isRecommended={requiredPlan === 'pro'}
                onSelect={() => handleSelectPlan('pro')}
                isHovered={hoveredPlan === 'pro'}
                onHover={setHoveredPlan}
                isLoading={checkoutLoading === 'pro'}
                disabled={checkoutLoading !== null}
              />
            )}
          </div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 sm:mt-6 text-center space-y-3"
          >
            {/* Compare All Plans Link */}
            <button
              onClick={handleComparePlans}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Compare all plans
            </button>
            
            <p className="text-[10px] sm:text-xs text-slate-400 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>3-day money-back</span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline">Cancel anytime</span>
              <span className="xs:hidden">• Cancel anytime</span>
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// PLAN CARD - Individual plan display in modal
// ============================================
const PlanCard = ({ plan, isRecommended, onSelect, isHovered, onHover, isLoading, disabled }) => {
  if (!plan) return null;
  
  const isPro = plan.id === 'pro';
  
  const config = isPro ? {
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: Crown,
    features: [
      `${plan.max_spaces} Spaces`,
      'Unlimited Testimonials',
      `${plan.max_videos} Videos`,
      'Custom Domains',
      'Webhooks & API',
      'Priority Support'
    ]
  } : {
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    bgGradient: 'from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30',
    borderColor: 'border-violet-200 dark:border-violet-800',
    icon: Zap,
    features: [
      `${plan.max_spaces} Spaces`,
      `${plan.max_text_testimonials?.toLocaleString()} Testimonials`,
      `${plan.max_videos} Videos`,
      'Remove Branding',
      'Premium Themes',
      'Social Proof Popups'
    ]
  };
  
  const IconComponent = config.icon;
  
  // Format price
  const formatPrice = (amount, currency = 'usd') => {
    if (currency === 'inr') {
      return `₹${plan.amount_inr?.toLocaleString()}`;
    }
    return `$${plan.amount_usd}`;
  };
  
  // Detect India for currency
  const isIndia = typeof Intl !== 'undefined' && 
    Intl.DateTimeFormat().resolvedOptions().timeZone?.includes('Kolkata');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => onHover?.(plan.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300",
        disabled ? "cursor-wait opacity-80" : "cursor-pointer",
        isRecommended 
          ? `bg-gradient-to-br ${config.bgGradient} ${config.borderColor} shadow-lg`
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
      )}
      onClick={disabled ? undefined : onSelect}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2">
          <Badge className={cn(
            "px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border-0 shadow-lg",
            `bg-gradient-to-r ${config.gradient} text-white`
          )}>
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 fill-current" />
            Recommended
          </Badge>
        </div>
      )}
      
      {/* Plan Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg",
            `bg-gradient-to-br ${config.gradient}`
          )}>
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{plan.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatPrice(plan.amount_usd, isIndia ? 'inr' : 'usd')}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">/month</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features List */}
      <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
        {config.features.map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="flex items-center gap-2 sm:gap-2.5"
          >
            <div className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0",
              `bg-gradient-to-r ${config.gradient}`
            )}>
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </div>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{feature}</span>
          </motion.div>
        ))}
      </div>
      
      {/* CTA Button */}
      <Button 
        className={cn(
          "w-full h-10 sm:h-12 font-semibold text-white shadow-lg transition-all group text-sm sm:text-base",
          `bg-gradient-to-r ${config.gradient}`,
          "hover:shadow-xl hover:brightness-110"
        )}
        disabled={disabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover:rotate-12 transition-transform" />
            Upgrade to {plan.name}
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </motion.div>
  );
};

// ============================================
// HELPER: Check if preset uses pro features
// ============================================
export const checkPresetFeatures = (presetSettings, hasFeatureFunc) => {
  if (!presetSettings || !hasFeatureFunc) return { isLocked: false, lockedFeatures: [] };
  
  const lockedFeatures = [];
  
  const proFeatureChecks = [
    { key: 'autoScroll', featureKey: 'widget.auto_scroll', check: (v) => v === true },
    { key: 'smoothContinuousScroll', featureKey: 'widget.smooth_scroll', check: (v) => v === true },
    { key: 'popupsEnabled', featureKey: 'widget.social_proof_popups', check: (v) => v === true },
    { key: 'showBranding', featureKey: 'widget.remove_branding', check: (v) => v === false },
    { key: 'hoverEffect', featureKey: 'widget.motion_effects', check: (v) => v && v !== 'none' },
    { key: 'animation', featureKey: 'widget.motion_effects', check: (v) => v && v !== 'none' && v !== 'fade' }
  ];
  
  for (const { key, featureKey, check } of proFeatureChecks) {
    if (presetSettings[key] !== undefined && check(presetSettings[key])) {
      if (!hasFeatureFunc(featureKey)) {
        if (!lockedFeatures.includes(featureKey)) {
          lockedFeatures.push(featureKey);
        }
      }
    }
  }
  
  return { isLocked: lockedFeatures.length > 0, lockedFeatures };
};

// Legacy exports for backward compatibility
export const ProBadge = PlanBadge;
export const LockedIndicator = FeatureIndicator;

export default FeatureGate;
