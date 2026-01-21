-- ============================================================
-- LEMON SQUEEZY INTEGRATION - SQL MIGRATION SCRIPT
-- ============================================================
-- NOTE: You mentioned these have already been run. 
-- This file is for documentation reference only.
-- ============================================================

-- 1. PLANS table - Add Lemon Squeezy Variant IDs (Monthly & Yearly)
-- Reason: Lemon Squeezy uses 'Variant ID' instead of Stripe's 'Price ID'
ALTER TABLE public.plans 
ADD COLUMN IF NOT EXISTS lemon_squeezy_variant_id_monthly TEXT,
ADD COLUMN IF NOT EXISTS lemon_squeezy_variant_id_yearly TEXT;

-- 2. SUBSCRIPTIONS table - Add Lemon Squeezy tracking columns
-- Reason: Track LS Order ID, Customer ID, and Subscription ID for each user
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_squeezy_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_squeezy_order_id TEXT;

-- ============================================================
-- IMPORTANT: Update your plans with Variant IDs from LS Dashboard
-- ============================================================
-- Go to: Lemon Squeezy Dashboard → Products → [Your Product] → Variants
-- Copy the Variant ID and run:

-- Example for Starter Plan:
-- UPDATE public.plans 
-- SET 
--   lemon_squeezy_variant_id_monthly = 'YOUR_STARTER_MONTHLY_VARIANT_ID',
--   lemon_squeezy_variant_id_yearly = 'YOUR_STARTER_YEARLY_VARIANT_ID'
-- WHERE id = 'starter';

-- Example for Pro Plan:
-- UPDATE public.plans 
-- SET 
--   lemon_squeezy_variant_id_monthly = 'YOUR_PRO_MONTHLY_VARIANT_ID',
--   lemon_squeezy_variant_id_yearly = 'YOUR_PRO_YEARLY_VARIANT_ID'
-- WHERE id = 'pro';

-- ============================================================
-- VERIFICATION QUERY
-- ============================================================
-- Run this to verify your setup:
-- SELECT id, name, lemon_squeezy_variant_id_monthly, lemon_squeezy_variant_id_yearly 
-- FROM public.plans;
