# ============================================================
# LEMON SQUEEZY INTEGRATION - SETUP GUIDE
# ============================================================

## 1. Environment Variables

Add these to your `backend/.env` file:

```env
# Lemon Squeezy Configuration
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here

# Frontend URL (for checkout redirects)
FRONTEND_URL=https://your-domain.com
```

### How to get these values:

1. **API Key**: 
   - Go to https://app.lemonsqueezy.com/settings/api
   - Create a new API key with full permissions
   - Copy the key (it starts with `lmsq_`)

2. **Store ID**:
   - Go to https://app.lemonsqueezy.com/settings/stores
   - Click on your store
   - The Store ID is in the URL or visible in store settings

3. **Webhook Secret**:
   - Generated when you create a webhook (Step 3 below)

---

## 2. Database Setup (Already Done ✓)

You mentioned these queries have already been run:

```sql
-- Add Variant IDs to plans table
ALTER TABLE public.plans 
ADD COLUMN lemon_squeezy_variant_id_monthly TEXT,
ADD COLUMN lemon_squeezy_variant_id_yearly TEXT;

-- Add LS tracking columns to subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN lemon_squeezy_customer_id TEXT,
ADD COLUMN lemon_squeezy_subscription_id TEXT,
ADD COLUMN lemon_squeezy_order_id TEXT;
```

### Update Plans with Variant IDs:

1. Go to Lemon Squeezy Dashboard → Products → Your Product → Variants
2. Copy the Variant ID for each pricing tier (monthly & yearly)
3. Run these queries:

```sql
-- Starter Plan
UPDATE public.plans 
SET 
  lemon_squeezy_variant_id_monthly = 'YOUR_STARTER_MONTHLY_ID',
  lemon_squeezy_variant_id_yearly = 'YOUR_STARTER_YEARLY_ID'
WHERE id = 'starter';

-- Pro Plan
UPDATE public.plans 
SET 
  lemon_squeezy_variant_id_monthly = 'YOUR_PRO_MONTHLY_ID',
  lemon_squeezy_variant_id_yearly = 'YOUR_PRO_YEARLY_ID'
WHERE id = 'pro';
```

---

## 3. Webhook Configuration

### Create Webhook in Lemon Squeezy:

1. Go to https://app.lemonsqueezy.com/settings/webhooks
2. Click "Add Webhook"
3. Configure:
   - **URL**: `https://your-backend-url.com/api/webhooks/lemonsqueezy`
   - **Secret**: Generate a strong secret and save it as `LEMON_SQUEEZY_WEBHOOK_SECRET`
   - **Events** (select all these):
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `subscription_resumed`
     - `subscription_expired`
     - `subscription_paused`
     - `order_created`

4. Save the webhook

### Webhook URL Examples:
- **Production**: `https://trust-flow-app.vercel.app/api/webhooks/lemonsqueezy`
- **Development (with ngrok)**: `https://abc123.ngrok.io/api/webhooks/lemonsqueezy`

---

## 4. Testing the Integration

### Test Checkout Flow:

1. Start your backend server
2. Go to the Pricing page
3. Click on a paid plan (Starter or Pro)
4. You should be redirected to Lemon Squeezy checkout
5. Use Lemon Squeezy test cards:
   - Success: `4242 4242 4242 4242`
   - Any expiry date in the future
   - Any 3-digit CVV

### Test Webhook:

1. Use Lemon Squeezy's "Send Test Webhook" feature
2. Or complete a test purchase
3. Check your server logs for webhook processing

### Verify Subscription:

```sql
SELECT * FROM public.subscriptions 
WHERE lemon_squeezy_subscription_id IS NOT NULL;
```

---

## 5. API Endpoints Reference

### Create Checkout Session
```
POST /api/create-checkout-session

Body:
{
  "plan_id": "starter",
  "variant_id": "123456",
  "user_id": "user-uuid",
  "user_email": "user@example.com",
  "billing_cycle": "monthly"
}

Response:
{
  "url": "https://trustflow.lemonsqueezy.com/checkout/...",
  "status": "success"
}
```

### Webhook Handler
```
POST /api/webhooks/lemonsqueezy

Headers:
- X-Signature: HMAC SHA256 signature

Body: Lemon Squeezy webhook payload

Response:
{
  "status": "success",
  "message": "Subscription subscription_created processed"
}
```

### Get Subscription Status
```
GET /api/subscription/status/{user_id}

Response:
{
  "status": "success",
  "subscription": {
    "plan_id": "starter",
    "status": "active",
    "provider": "lemonsqueezy",
    ...
  }
}
```

---

## 6. Troubleshooting

### Common Issues:

1. **"Payment service not configured"**
   - Check that `LEMON_SQUEEZY_API_KEY` and `LEMON_SQUEEZY_STORE_ID` are set

2. **"This plan is not available for purchase"**
   - Run the UPDATE queries to set variant IDs for your plans

3. **Webhook returning 401**
   - Verify `LEMON_SQUEEZY_WEBHOOK_SECRET` matches what's in LS dashboard

4. **Subscription not updating after payment**
   - Check server logs for webhook errors
   - Verify the webhook URL is accessible (not blocked by firewall)
   - Ensure custom data (user_id) is being passed correctly

### Debug Logs:

Check your backend logs for detailed error messages:
```
docker logs <container_id> --tail 100
# or
tail -f backend/logs/server.log
```

---

## 7. Security Checklist

- [ ] API Key stored securely (not in code)
- [ ] Webhook secret is unique and strong
- [ ] HTTPS enabled for webhook endpoint
- [ ] Rate limiting enabled on checkout endpoint
- [ ] User authentication verified before checkout

---

## Support

- Lemon Squeezy Docs: https://docs.lemonsqueezy.com/
- API Reference: https://docs.lemonsqueezy.com/api
- Webhook Events: https://docs.lemonsqueezy.com/api/webhooks
