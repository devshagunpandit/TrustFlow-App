CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY, -- 'free', 'starter', 'pro'
    name TEXT NOT NULL,
    
    -- Pricing (Global & India)
    price_stripe_id TEXT,    -- e.g. price_123
    price_razorpay_id TEXT,  -- e.g. plan_456
    amount_usd INTEGER DEFAULT 0,
    amount_inr INTEGER DEFAULT 0,
    
    -- Plan Limits (Quota)
    max_spaces INTEGER DEFAULT 1,
    max_videos INTEGER DEFAULT 0,
    max_text_testimonials INTEGER DEFAULT 10,
    
    -- Feature Gating (JSONB - True/False toggles)
    features JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans Data Seed (Tere Requirements ke hisaab se configured)
INSERT INTO public.plans (id, name, amount_usd, amount_inr, max_spaces, max_text_testimonials, max_videos, features)
VALUES 
    ('free', 'Free Tier', 0, 0, 1, 10, 0, '{
        "edit_form": {
            "form_features": false,
            "remove_branding": false,
            "custom_link": false,
            "custom_logo": false,
            "page_theme": false
        },
        "widget": {
            "custom_button": false,
            "remove_branding": false,
            "motion_effects": false,
            "card_styling": false,
            "typography": false,
            "social_proof_popups": false,
            "share_qr": false
        },
        "advanced": {
            "custom_domains": false,
            "webhooks": false,
            "cta": false,
            "export_data": false
        },
        "gallery": {
            "premium_presets": false,
            "pro_presets": false,
            "premium_layouts": false,
            "pro_layouts": false,
            "premium_combos": false,
            "pro_combos": false
        }
    }'),
    
    ('starter', 'Starter', 19, 1499, 3, 500, 20, '{
        "edit_form": {
            "form_features": true,
            "remove_branding": true,
            "custom_link": false,
            "custom_logo": true,
            "page_theme": true
        },
        "widget": {
            "custom_button": true,
            "remove_branding": true,
            "motion_effects": true,
            "card_styling": true,
            "typography": true,
            "social_proof_popups": true,
            "share_qr": true
        },
        "advanced": {
            "custom_domains": false, 
            "webhooks": false,
            "cta": true,
            "export_data": true
        },
        "gallery": {
            "premium_presets": true,
            "pro_presets": false,
            "premium_layouts": true,
            "pro_layouts": false,
            "premium_combos": true,
            "pro_combos": false
        }
    }'),
    
    ('pro', 'Pro Agency', 49, 3999, 10, 999999, 100, '{
        "edit_form": {
            "form_features": true,
            "remove_branding": true,
            "custom_link": true,
            "custom_logo": true,
            "page_theme": true
        },
        "widget": {
            "custom_button": true,
            "remove_branding": true,
            "motion_effects": true,
            "card_styling": true,
            "typography": true,
            "social_proof_popups": true,
            "share_qr": true
        },
        "advanced": {
            "custom_domains": true,
            "webhooks": true,
            "cta": true,
            "export_data": true
        },
        "gallery": {
            "premium_presets": true,
            "pro_presets": true,
            "premium_layouts": true,
            "pro_layouts": true,
            "premium_combos": true,
            "pro_combos": true
        }
    }');


    CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    plan_id TEXT REFERENCES public.plans(id) DEFAULT 'free',
    
    -- Payment Provider Info
    provider TEXT DEFAULT 'manual', -- 'stripe', 'razorpay', 'manual'
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    razorpay_customer_id TEXT,
    razorpay_subscription_id TEXT,
    
    -- Status
    status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled'
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    
    -- 🔥 Admin Override Column (Dashboard Feature)
    -- Agar tu kisi ko extra space dena chahta hai bina plan change kiye, to yahan JSON save hoga
    -- e.g. {"max_spaces": 10, "features": {"advanced": {"custom_domains": true}}}
    custom_overrides JSONB DEFAULT NULL, 
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy (User sirf apna subscription dekh sake)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User view own sub" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY, -- 'LAUNCH50'
    discount_type TEXT CHECK (discount_type IN ('percent', 'fixed')), -- % off ya Flat off
    discount_value INTEGER NOT NULL, -- e.g. 20
    currency TEXT DEFAULT 'USD', -- 'USD' or 'INR'
    
    max_uses INTEGER DEFAULT -1, -- Unlimited uses ke liye -1
    used_count INTEGER DEFAULT 0,
    
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);