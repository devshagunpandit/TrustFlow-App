/**
 * useFeature Hook - Feature Access Control
 * 
 * Checks if the current user has access to a specific feature
 * based on their subscription plan and any admin overrides.
 * 
 * @param {string} featureKey - Dot notation key (e.g., 'widget.remove_branding')
 * @returns {Object} Feature access state
 * 
 * @example
 * const { isAllowed, isLoading, planName, upgradeLink } = useFeature('widget.remove_branding');
 */

import { useMemo } from 'react';
import { useSubscription, FEATURE_PLAN_MAPPING } from '@/contexts/SubscriptionContext';

/**
 * Plan display names & branding
 */
const PLAN_NAMES = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro'
};

/**
 * Feature display names - User-friendly labels for UI
 */
export const FEATURE_DISPLAY_NAMES = {
  // Edit Form Features
  'edit_form.form_features': 'Rich Media Collection',
  'edit_form.remove_branding': 'White Label Forms',
  'edit_form.custom_link': 'Custom Link Redirect',
  'edit_form.custom_logo': 'Custom Brand Logo',
  'edit_form.page_theme': 'Premium Page Themes',
  
  // Widget Features
  'widget.custom_button': 'Custom Action Button',
  'widget.remove_branding': 'White Label Widget',
  'widget.motion_effects': 'Motion Effects',
  'widget.card_styling': 'Advanced Card Styling',
  'widget.typography': 'Custom Typography',
  'widget.social_proof_popups': 'Social Proof Popups',
  'widget.share_qr': 'Share & QR Code',
  
  // Advanced Features
  'advanced.custom_domains': 'Custom Domains',
  'advanced.webhooks': 'Webhooks & Integrations',
  'advanced.cta': 'CTA Analytics Dashboard',
  'advanced.export_data': 'Export Data',
  
  // Gallery Features
  'gallery.premium_presets': 'Premium Presets',
  'gallery.pro_presets': 'Pro Presets',
  'gallery.premium_layouts': 'Premium Layouts',
  'gallery.pro_layouts': 'Pro Layouts',
  'gallery.premium_combos': 'Premium Combos',
  'gallery.pro_combos': 'Pro Combos'
};

/**
 * useFeature Hook
 * 
 * @param {string} featureKey - The feature key to check
 * @returns {Object} Feature access information
 */
export const useFeature = (featureKey) => {
  const { hasFeature, loading, planHierarchy, error, getRequiredPlan } = useSubscription();

  return useMemo(() => {
    // If loading, return loading state
    if (loading) {
      return {
        isAllowed: false,
        isLoading: true,
        planName: null,
        requiredPlan: null,
        requiredPlanName: null,
        featureDisplayName: FEATURE_DISPLAY_NAMES[featureKey] || 'Premium Feature',
        upgradeLink: '/pricing',
        error: null
      };
    }

    // Check if feature is allowed
    const isAllowed = hasFeature(featureKey);
    
    // Get required plan for this feature
    const requiredPlan = getRequiredPlan ? getRequiredPlan(featureKey) : (FEATURE_PLAN_MAPPING[featureKey] || 'starter');
    const requiredPlanName = PLAN_NAMES[requiredPlan] || 'Starter';

    return {
      isAllowed,
      isLoading: false,
      planName: planHierarchy.currentPlanName,
      currentPlanId: planHierarchy.currentPlanId,
      requiredPlan,
      requiredPlanName,
      featureDisplayName: FEATURE_DISPLAY_NAMES[featureKey] || 'Premium Feature',
      upgradeLink: `/pricing?highlight=${requiredPlan}&feature=${encodeURIComponent(featureKey)}`,
      error: error || null
    };
  }, [featureKey, hasFeature, loading, planHierarchy, error, getRequiredPlan]);
};

/**
 * useFeatureMultiple Hook
 * 
 * Check multiple features at once - useful for components with many locked features
 * 
 * @param {string[]} featureKeys - Array of feature keys to check
 * @returns {Object} Map of feature keys to their access state
 */
export const useFeatureMultiple = (featureKeys) => {
  const { hasFeature, loading, planHierarchy, error, getRequiredPlan } = useSubscription();

  return useMemo(() => {
    if (loading) {
      return {
        isLoading: true,
        features: {},
        anyLocked: false,
        allLocked: true
      };
    }

    const features = {};
    let anyLocked = false;
    let allLocked = true;

    featureKeys.forEach((key) => {
      const isAllowed = hasFeature(key);
      const requiredPlan = getRequiredPlan ? getRequiredPlan(key) : (FEATURE_PLAN_MAPPING[key] || 'starter');
      
      features[key] = {
        isAllowed,
        requiredPlan,
        requiredPlanName: PLAN_NAMES[requiredPlan],
        featureDisplayName: FEATURE_DISPLAY_NAMES[key] || 'Premium Feature'
      };

      if (!isAllowed) anyLocked = true;
      if (isAllowed) allLocked = false;
    });

    return {
      isLoading: false,
      features,
      anyLocked,
      allLocked,
      currentPlanId: planHierarchy.currentPlanId,
      currentPlanName: planHierarchy.currentPlanName,
      error
    };
  }, [featureKeys, hasFeature, loading, planHierarchy, error, getRequiredPlan]);
};

/**
 * useQuota Hook
 * 
 * Check quota limits for the current plan
 * 
 * @returns {Object} Quota limits and usage helpers
 */
export const useQuota = () => {
  const { quotas, loading, planHierarchy } = useSubscription();

  return useMemo(() => ({
    isLoading: loading,
    maxSpaces: quotas.maxSpaces,
    maxTextTestimonials: quotas.maxTextTestimonials,
    maxVideos: quotas.maxVideos,
    currentPlanId: planHierarchy.currentPlanId,
    currentPlanName: planHierarchy.currentPlanName,
    
    /**
     * Check if a quota has been reached
     * @param {string} quotaType - 'spaces' | 'testimonials' | 'videos'
     * @param {number} currentCount - Current usage count
     */
    isQuotaReached: (quotaType, currentCount) => {
      switch (quotaType) {
        case 'spaces':
          return currentCount >= quotas.maxSpaces;
        case 'testimonials':
          return currentCount >= quotas.maxTextTestimonials;
        case 'videos':
          return currentCount >= quotas.maxVideos;
        default:
          return false;
      }
    },
    
    /**
     * Get remaining quota
     * @param {string} quotaType - 'spaces' | 'testimonials' | 'videos'
     * @param {number} currentCount - Current usage count
     */
    getRemaining: (quotaType, currentCount) => {
      switch (quotaType) {
        case 'spaces':
          return Math.max(0, quotas.maxSpaces - currentCount);
        case 'testimonials':
          return Math.max(0, quotas.maxTextTestimonials - currentCount);
        case 'videos':
          return Math.max(0, quotas.maxVideos - currentCount);
        default:
          return 0;
      }
    }
  }), [loading, quotas, planHierarchy]);
};

/**
 * usePlanCheck Hook
 * 
 * Simple hook to check plan level
 * 
 * @returns {Object} Plan level checks
 */
export const usePlanCheck = () => {
  const { planHierarchy, loading } = useSubscription();

  return useMemo(() => ({
    isLoading: loading,
    isFree: planHierarchy.isFree,
    isStarter: planHierarchy.isStarter,
    isPro: planHierarchy.isPro,
    isAtLeast: planHierarchy.isAtLeast,
    currentPlanId: planHierarchy.currentPlanId,
    currentPlanName: planHierarchy.currentPlanName
  }), [loading, planHierarchy]);
};

export default useFeature;
