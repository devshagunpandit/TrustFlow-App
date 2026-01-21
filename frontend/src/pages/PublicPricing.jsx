import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Star, Check, X, ArrowRight, Sparkles, Shield, Clock, HeadphonesIcon,
  CreditCard, Zap, Crown, ChevronDown, Heart, Users, Building2, Rocket,
  Palette, Layout, Layers, Bell, BarChart3, Video, Code, Settings,
  MessageSquare, Infinity, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import confetti from 'canvas-confetti';

const PublicPricing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Plan configurations
  const plans = [
    {
      name: 'Free',
      icon: Zap,
      description: 'Perfect for trying out TrustWall',
      monthlyPrice: 0,
      annualPrice: 0,
      color: 'slate',
      gradient: 'from-slate-500 to-slate-600',
      features: [
        '1 Space',
        '10 Testimonials total',
        'Text testimonials only',
        '1 Default widget preset',
        '1 Default card layout',
        'Basic embed widget',
        'TrustWall branding',
      ],
      limitations: [
        'No video testimonials',
        'No custom branding',
        'No FOMO popups',
        'No CTA analytics',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Starter',
      icon: Rocket,
      description: 'Great for freelancers & creators',
      monthlyPrice: 19,
      annualPrice: 15,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        '3 Spaces',
        '50 Testimonials per space',
        'Text & Video testimonials',
        '5 Widget presets',
        '4 Card layouts',
        '3 Combo packs',
        'Custom branding',
        'Remove TrustWall branding',
        'Basic analytics',
      ],
      limitations: [
        'No FOMO popups',
        'No CTA tracking',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      icon: Crown,
      description: 'For growing businesses & agencies',
      monthlyPrice: 49,
      annualPrice: 39,
      color: 'violet',
      gradient: 'from-violet-500 to-purple-600',
      features: [
        'Unlimited Spaces',
        'Unlimited Testimonials',
        'Text & Video testimonials',
        '15+ Widget presets',
        '8+ Card layouts',
        'All Combo packs',
        'Full Widget Designer',
        'FOMO Popups',
        'CTA Buttons & Analytics',
        'Priority support',
        'Team collaboration',
        'Advanced analytics',
      ],
      limitations: [],
      cta: 'Go Pro',
      popular: true,
    },
  ];

  // Feature comparison categories
  const featureCategories = [
    {
      name: 'Core Features',
      icon: Zap,
      features: [
        { name: 'Spaces', free: '1', starter: '3', pro: 'Unlimited' },
        { name: 'Testimonials per Space', free: '10', starter: '50', pro: 'Unlimited' },
        { name: 'Text Testimonials', free: true, starter: true, pro: true },
        { name: 'Video Testimonials', free: false, starter: true, pro: true },
        { name: 'Embed Widget', free: true, starter: true, pro: true },
      ],
    },
    {
      name: 'Widget Customization',
      icon: Palette,
      features: [
        { name: 'Widget Presets', free: '1 Default', starter: '5 Presets', pro: '15+ Presets' },
        { name: 'Card Layouts', free: '1 Default', starter: '4 Layouts', pro: '8+ Layouts' },
        { name: 'Combo Packs', free: false, starter: '3 Combos', pro: 'All Combos' },
        { name: 'Widget Designer', free: false, starter: 'Basic', pro: 'Full Access' },
        { name: 'Custom Colors', free: false, starter: true, pro: true },
        { name: 'Remove Branding', free: false, starter: true, pro: true },
      ],
    },
    {
      name: 'Marketing & Analytics',
      icon: BarChart3,
      features: [
        { name: 'FOMO Popups', free: false, starter: false, pro: true },
        { name: 'CTA Buttons', free: false, starter: false, pro: true },
        { name: 'Click Tracking', free: false, starter: false, pro: true },
        { name: 'Impression Analytics', free: false, starter: 'Basic', pro: 'Advanced' },
        { name: 'Export Reports', free: false, starter: false, pro: true },
      ],
    },
    {
      name: 'Support & Extras',
      icon: HeadphonesIcon,
      features: [
        { name: 'Email Support', free: true, starter: true, pro: true },
        { name: 'Priority Support', free: false, starter: false, pro: true },
        { name: 'Team Collaboration', free: false, starter: false, pro: true },
        { name: 'Custom Domain', free: false, starter: false, pro: true },
      ],
    },
  ];

  // FAQs
  const faqs = [
    {
      q: 'Can I try TrustWall for free?',
      a: 'Absolutely! Our Free plan gives you 1 space and 10 testimonials to try out TrustWall. No credit card required.',
    },
    {
      q: 'Can I upgrade or downgrade anytime?',
      a: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor Stripe.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'Yes! We offer a 3-day money-back guarantee. If you\'re not satisfied within 3 days of your purchase, we\'ll give you a full refund - no questions asked.',
    },
    {
      q: 'What happens when I reach my testimonial limit?',
      a: 'When you reach your limit, you won\'t be able to add new testimonials until you upgrade or delete existing ones. Your existing testimonials will continue to work normally.',
    },
    {
      q: 'Can I use TrustWall for client projects?',
      a: 'Yes! Many agencies use TrustWall for their clients. With the Pro plan, you get unlimited spaces - perfect for managing multiple client projects.',
    },
  ];

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const handleSelectPlan = (planName) => {
    if (user) {
      navigate('/dashboard', { state: { openPricing: true, selectedPlan: planName.toLowerCase() } });
    } else {
      navigate('/signup', { state: { selectedPlan: planName.toLowerCase() } });
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-violet-50/30 to-background dark:via-violet-950/10 overflow-x-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 sm:py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            TrustWall
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-xs sm:text-sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-xs sm:text-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-1" /> Simple, Transparent Pricing
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
            Start free, upgrade when you're ready. All plans include a 3-day money-back guarantee.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-violet-600"
            />
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                Save 20%
              </Badge>
            )}
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 shadow-lg">
                    <Crown className="w-3 h-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`h-full relative overflow-hidden ${
                plan.popular 
                  ? 'border-2 border-violet-500 shadow-xl shadow-violet-500/20' 
                  : 'border border-slate-200 dark:border-slate-800'
              }`}>
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 pointer-events-none" />
                )}
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold">
                        {formatPrice(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-muted-foreground text-sm">/month</span>
                      )}
                    </div>
                    {plan.monthlyPrice > 0 && isAnnual && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed annually (${plan.annualPrice * 12}/year)
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full py-5 text-sm font-semibold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      What's included
                    </p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Shield, text: 'Secure Payments', subtext: 'SSL Encrypted' },
            { icon: Clock, text: '3-Day Refund', subtext: 'Money-back guarantee' },
            { icon: HeadphonesIcon, text: 'Email Support', subtext: 'Quick response' },
            { icon: CreditCard, text: 'Cancel Anytime', subtext: 'No lock-in' },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
            >
              <badge.icon className="w-6 h-6 text-violet-600 mb-2" />
              <p className="font-semibold text-sm">{badge.text}</p>
              <p className="text-xs text-muted-foreground">{badge.subtext}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Compare All Features</h2>
          <p className="text-muted-foreground text-sm sm:text-base">See exactly what you get with each plan</p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-t-xl mb-1">
            <div className="text-sm font-semibold">Feature</div>
            <div className="text-sm font-semibold text-center">Free</div>
            <div className="text-sm font-semibold text-center">Starter</div>
            <div className="text-sm font-semibold text-center text-violet-600">Pro</div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            {featureCategories.map((category, catIndex) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.05 }}
              >
                <button
                  onClick={() => setExpandedCategory(expandedCategory === catIndex ? null : catIndex)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-violet-600" />
                    <span className="font-semibold text-sm">{category.name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedCategory === catIndex ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {expandedCategory === catIndex && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-lg bg-white dark:bg-slate-900/50">
                        {category.features.map((feature, featureIndex) => (
                          <div
                            key={feature.name}
                            className={`grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 px-4 py-3 ${
                              featureIndex < category.features.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                            }`}
                          >
                            <div className="text-sm font-medium md:font-normal">{feature.name}</div>
                            
                            {/* Mobile view */}
                            <div className="md:hidden grid grid-cols-3 gap-2">
                              <div className="text-center">
                                <span className="text-[10px] text-muted-foreground block mb-0.5">Free</span>
                                {typeof feature.free === 'boolean' ? (
                                  feature.free ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                                ) : (
                                  <span className="text-xs">{feature.free}</span>
                                )}
                              </div>
                              <div className="text-center">
                                <span className="text-[10px] text-muted-foreground block mb-0.5">Starter</span>
                                {typeof feature.starter === 'boolean' ? (
                                  feature.starter ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                                ) : (
                                  <span className="text-xs">{feature.starter}</span>
                                )}
                              </div>
                              <div className="text-center">
                                <span className="text-[10px] text-muted-foreground block mb-0.5">Pro</span>
                                {typeof feature.pro === 'boolean' ? (
                                  feature.pro ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                                ) : (
                                  <span className="text-xs font-semibold text-violet-600">{feature.pro}</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Desktop view */}
                            <div className="hidden md:flex justify-center items-center">
                              {typeof feature.free === 'boolean' ? (
                                feature.free ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-slate-300" />
                              ) : (
                                <span className="text-sm">{feature.free}</span>
                              )}
                            </div>
                            <div className="hidden md:flex justify-center items-center">
                              {typeof feature.starter === 'boolean' ? (
                                feature.starter ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-slate-300" />
                              ) : (
                                <span className="text-sm">{feature.starter}</span>
                              )}
                            </div>
                            <div className="hidden md:flex justify-center items-center">
                              {typeof feature.pro === 'boolean' ? (
                                feature.pro ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-slate-300" />
                              ) : (
                                <span className="text-sm font-semibold text-violet-600">{feature.pro}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Got questions? We've got answers.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`faq-${index}`}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 bg-white dark:bg-slate-900/50"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-medium hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/30"
        >
          <Crown className="w-12 h-12 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Transform Your Social Proof?
          </h2>
          <p className="text-sm sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using TrustWall to collect and display beautiful testimonials.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-violet-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
              >
                Start Free Today <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-xs sm:text-sm opacity-70 mt-4">
            No credit card required • 3-day money-back guarantee
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 sm:py-12 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              TrustWall
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2026 TrustWall. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicPricing;
