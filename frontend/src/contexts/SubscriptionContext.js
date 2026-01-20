/**
 * SubscriptionContext - Manages user subscription state
 * 
 * Fetches subscription data from Supabase and provides
 * plan information, feature access, and quota limits.
 * 
 * PRIORITY: custom_overrides > plan features
 * This allows admin to grant specific features without changing plan
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Default subscription for free users or when data fails to load
const DEFAULT_SUBSCRIPTION = {
  plan_id: 'free',
  status: 'active',
  provider: 'manual',
  custom_overrides: null,
  plans: {
    id: 'free',
    name: 'Free Tier',
    amount_usd: 0,
    amount_inr: 0,
    max_spaces: 1,
    max_text_testimonials: 10,
    max_videos: 0,
    features: {
      edit_form: {
        form_features: false,
        remove_branding: false,
        custom_link: false, // Custom thank you redirect - Pro only
        custom_logo: false,
        page_theme: false
      },
      widget: {
        custom_button: false, // Custom action button - Starter+
        remove_branding: false,
        motion_effects: false,
        card_styling: false,
        typography: false,
        social_proof_popups: false,
        share_qr: false // QR Code - Starter+
      },
      advanced: {
        custom_domains: false,
        webhooks: false,
        cta: false,
        export_data: false
      },
      gallery: {
        premium_presets: false,
        pro_presets: false,
        premium_layouts: false,
        pro_layouts: false,
        premium_combos: false,
        pro_combos: false
      }
    }
  }
};

// Plan hierarchy for comparison
const PLAN_HIERARCHY = { free: 0, starter: 1, pro: 2 };

// Feature to plan mapping - determines which plan unlocks each feature
export const FEATURE_PLAN_MAPPING = {
  // Edit Form Features
  'edit_form.form_features': 'starter',
  'edit_form.remove_branding': 'starter',
  'edit_form.custom_link': 'pro', // Custom thank you redirect - Pro only
  'edit_form.custom_logo': 'starter',
  'edit_form.page_theme': 'starter',
  
  // Widget Features  
  'widget.custom_button': 'starter', // Custom action button - Starter+
  'widget.remove_branding': 'starter',
  'widget.motion_effects': 'starter',
  'widget.card_styling': 'starter',
  'widget.typography': 'starter',
  'widget.social_proof_popups': 'starter',
  'widget.share_qr': 'starter', // QR Code feature - Starter+
  
  // Advanced Features
  'advanced.custom_domains': 'pro',
  'advanced.webhooks': 'pro',
  'advanced.cta': 'starter',
  'advanced.export_data': 'starter',
  
  // Gallery Features
  'gallery.premium_presets': 'starter',
  'gallery.pro_presets': 'pro',
  'gallery.premium_layouts': 'starter',
  'gallery.pro_layouts': 'pro',
  'gallery.premium_combos': 'starter',
  'gallery.pro_combos': 'pro'
};

// All available plans data cache (fetched from DB)
let cachedPlans = null;

const SubscriptionContext = createContext({});

/**
 * Fetch all plans from database (cached)
 */
export const fetchAllPlans = async () => {
  if (cachedPlans) return cachedPlans;
  
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('amount_usd', { ascending: true });
    
    if (error) throw error;
    cachedPlans = data || [];
    return cachedPlans;
  } catch (err) {
    console.error('Error fetching plans:', err);
    return [];
  }
};

/**
 * Hook to access subscription context
 */
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context || Object.keys(context).length === 0) {
    // Return safe defaults if context is not available
    return {
      subscription: DEFAULT_SUBSCRIPTION,
      allPlans: [],
      loading: false,
      error: null,
      effectivePlan: DEFAULT_SUBSCRIPTION.plans,
      hasFeature: () => false,
      getRequiredPlan: () => 'starter',
      quotas: { maxSpaces: 1, maxTextTestimonials: 10, maxVideos: 0 },
      isPlan: () => false,
      planHierarchy: {
        isFree: true,
        isStarter: false,
        isPro: false,
        isAtLeast: (planId) => planId === 'free',
        currentPlanId: 'free',
        currentPlanName: 'Free Tier'
      },
      refreshSubscription: () => Promise.resolve()
    };
  }
  return context;
};

/**
 * SubscriptionProvider component
 */
export const SubscriptionProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all plans on mount
  useEffect(() => {
    fetchAllPlans().then(plans => setAllPlans(plans));
  }, []);

  /**
   * Fetch subscription data from Supabase
   */
  const fetchSubscription = useCallback(async (userId) => {
    if (!userId) {
      setSubscription(DEFAULT_SUBSCRIPTION);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plans (*)
        `)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        // PGRST116 = No rows found, user doesn't have a subscription record
        if (fetchError.code === 'PGRST116') {
          // Create a subscription record for new users
          const { data: newSub, error: createError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              plan_id: 'free',
              status: 'active',
              provider: 'manual'
            })
            .select(`
              *,
              plans (*)
            `)
            .single();

          if (createError) {
            console.error('Error creating subscription:', createError);
            setSubscription(DEFAULT_SUBSCRIPTION);
          } else {
            setSubscription(newSub || DEFAULT_SUBSCRIPTION);
          }
        } else {
          console.error('Error fetching subscription:', fetchError);
          setError(fetchError.message);
          setSubscription(DEFAULT_SUBSCRIPTION);
          toast.error('Failed to load subscription data');
        }
      } else {
        setSubscription(data || DEFAULT_SUBSCRIPTION);
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError(err.message);
      setSubscription(DEFAULT_SUBSCRIPTION);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh subscription data
   */
  const refreshSubscription = useCallback(() => {
    if (user?.id) {
      return fetchSubscription(user.id);
    }
    return Promise.resolve();
  }, [user?.id, fetchSubscription]);

  // Fetch subscription when user changes
  useEffect(() => {
    if (!authLoading) {
      fetchSubscription(user?.id);
    }
  }, [user?.id, authLoading, fetchSubscription]);

  // Note: Realtime subscription removed due to compatibility issues
  // Subscription data will be refreshed when user navigates or manually refreshes
  // If you need realtime updates, use polling or upgrade Supabase client

  /**
   * Get the effective plan data (with overrides applied)
   */
  const effectivePlan = useMemo(() => {
    if (!subscription?.plans) return DEFAULT_SUBSCRIPTION.plans;

    const basePlan = subscription.plans;
    const overrides = subscription.custom_overrides;

    if (!overrides) return basePlan;

    // Deep merge overrides into base plan
    return {
      ...basePlan,
      max_spaces: overrides.max_spaces ?? basePlan.max_spaces,
      max_text_testimonials: overrides.max_text_testimonials ?? basePlan.max_text_testimonials,
      max_videos: overrides.max_videos ?? basePlan.max_videos,
      features: {
        edit_form: {
          ...basePlan.features?.edit_form,
          ...overrides.features?.edit_form
        },
        widget: {
          ...basePlan.features?.widget,
          ...overrides.features?.widget
        },
        advanced: {
          ...basePlan.features?.advanced,
          ...overrides.features?.advanced
        },
        gallery: {
          ...basePlan.features?.gallery,
          ...overrides.features?.gallery
        }
      }
    };
  }, [subscription]);

  /**
   * Check if a specific feature is allowed
   * @param {string} featureKey - Dot notation key (e.g., 'widget.remove_branding')
   */
  const hasFeature = useCallback((featureKey) => {
    if (!featureKey) return false;

    const parts = featureKey.split('.');
    if (parts.length !== 2) return false;

    const [category, feature] = parts;
    const features = effectivePlan.features;

    // Check override first, then plan features
    const overrideValue = subscription?.custom_overrides?.features?.[category]?.[feature];
    if (overrideValue !== undefined) return overrideValue;

    return features?.[category]?.[feature] ?? false;
  }, [effectivePlan, subscription?.custom_overrides]);

  /**
   * Get quota limits
   */
  const quotas = useMemo(() => ({
    maxSpaces: effectivePlan.max_spaces || 1,
    maxTextTestimonials: effectivePlan.max_text_testimonials || 10,
    maxVideos: effectivePlan.max_videos || 0
  }), [effectivePlan]);

  /**
   * Check if user is on a specific plan
   */
  const isPlan = useCallback((planId) => {
    return subscription?.plan_id === planId;
  }, [subscription?.plan_id]);

  /**
   * Get the required plan for a feature
   */
  const getRequiredPlan = useCallback((featureKey) => {
    return FEATURE_PLAN_MAPPING[featureKey] || 'starter';
  }, []);

  /**
   * Check plan hierarchy
   */
  const planHierarchy = useMemo(() => {
    const currentLevel = PLAN_HIERARCHY[subscription?.plan_id] ?? 0;
    
    return {
      isFree: subscription?.plan_id === 'free',
      isStarter: subscription?.plan_id === 'starter',
      isPro: subscription?.plan_id === 'pro',
      isAtLeast: (planId) => currentLevel >= (PLAN_HIERARCHY[planId] ?? 0),
      currentPlanId: subscription?.plan_id || 'free',
      currentPlanName: effectivePlan.name || 'Free Tier'
    };
  }, [subscription?.plan_id, effectivePlan.name]);

  const value = useMemo(() => ({
    subscription,
    allPlans,
    loading: loading || authLoading,
    error,
    effectivePlan,
    hasFeature,
    getRequiredPlan,
    quotas,
    isPlan,
    planHierarchy,
    refreshSubscription
  }), [
    subscription,
    allPlans,
    loading,
    authLoading,
    error,
    effectivePlan,
    hasFeature,
    getRequiredPlan,
    quotas,
    isPlan,
    planHierarchy,
    refreshSubscription
  ]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
