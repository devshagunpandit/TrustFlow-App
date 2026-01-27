import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { signUpWithEmail, verifySignupOtp, signInWithGoogle, signInWithGithub, supabase } from '@/lib/supabase';
import { Github, Loader2, Mail, AlertCircle, Star, Sparkles, Shield, Zap, Users, Eye, EyeOff, Check, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Testimonials data - rotates randomly on each page load
// TODO: Later can be connected to a space to show real testimonials
const testimonials = [
  { quote: "TrustWall helped us increase conversions by 40%. The testimonial widgets are beautiful and easy to embed.", name: "Sarah Johnson", role: "CEO, TechStart", avatar: "SJ" },
  { quote: "We went from 0 to 200+ testimonials in just 2 months. Our customers love how easy it is to leave video reviews.", name: "Michael Chen", role: "Founder, SaaSify", avatar: "MC" },
  { quote: "The Wall of Love widget is absolutely stunning. It's the first thing visitors notice on our landing page.", name: "Emily Rodriguez", role: "Head of Marketing, GrowthCo", avatar: "ER" },
  { quote: "Finally, a testimonial tool that's both powerful AND beautiful. TrustWall is now essential to our sales process.", name: "David Kim", role: "Sales Director, CloudBase", avatar: "DK" },
  { quote: "Setting up took less than 5 minutes. I was collecting video testimonials the same day. Absolutely brilliant!", name: "Jessica Thompson", role: "Product Manager, AppFlow", avatar: "JT" },
  { quote: "Our conversion rate jumped 25% after adding TrustWall testimonials. The ROI is incredible.", name: "Ryan Martinez", role: "CEO, MarketPro", avatar: "RM" },
  { quote: "The embed codes work flawlessly with our React app. Best testimonial solution we've tried.", name: "Amanda Lee", role: "CTO, DevStack", avatar: "AL" },
  { quote: "Video testimonials were a game-changer for us. TrustWall made it so easy to collect and display them.", name: "Chris Brown", role: "Founder, VideoFirst", avatar: "CB" },
  { quote: "I love how professional everything looks. Our testimonials now match our premium brand perfectly.", name: "Sophie Anderson", role: "Brand Manager, LuxeStyle", avatar: "SA" },
  { quote: "TrustWall's analytics helped us understand which testimonials drive the most conversions.", name: "James Wilson", role: "Growth Lead, MetricsMaster", avatar: "JW" },
  { quote: "The star ratings and customizable themes are perfect. We can match any client's branding.", name: "Olivia Taylor", role: "Agency Owner, DigitalEdge", avatar: "OT" },
  { quote: "Customer support is exceptional. They helped us set up a custom integration in no time.", name: "Nathan Davis", role: "Tech Lead, IntegrateHub", avatar: "ND" },
  { quote: "We embedded TrustWall on our pricing page and saw immediate improvement in conversions.", name: "Maria Garcia", role: "VP Sales, PriceSmart", avatar: "MG" },
  { quote: "The multi-space feature is perfect for our agency. We manage all clients from one dashboard.", name: "Alex Turner", role: "Agency Director, WebPro", avatar: "AT" },
  { quote: "Collecting testimonials used to be a chore. TrustWall automated the entire process for us.", name: "Laura White", role: "Operations, StreamLine", avatar: "LW" },
  { quote: "The Wall of Love is my favorite feature. It's like having a live feed of happy customers.", name: "Daniel Moore", role: "Founder, HappyClients", avatar: "DM" },
  { quote: "TrustWall integrates beautifully with our Webflow site. The widgets are responsive and fast.", name: "Rachel Green", role: "Designer, PixelPerfect", avatar: "RG" },
  { quote: "We replaced three different tools with TrustWall. It does everything we need in one place.", name: "Kevin Scott", role: "Product Lead, AllInOne", avatar: "KS" },
  { quote: "The form customization is amazing. We match our brand colors and even add custom questions.", name: "Hannah Baker", role: "Marketing Lead, BrandFirst", avatar: "HB" },
  { quote: "Our team loves the notification system. We never miss a new testimonial submission now.", name: "Tom Harris", role: "Customer Success, NotifyPro", avatar: "TH" }
];

// Get a random testimonial on component mount
const getRandomTestimonial = () => testimonials[Math.floor(Math.random() * testimonials.length)];

const Signup = () => {
  // Random testimonial for branding side
  const [randomTestimonial] = useState(getRandomTestimonial);
  
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Error States ---
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const ensureCleanSession = async () => {
      if (step === 'form') {
        await supabase.auth.signOut();
        localStorage.clear();
      }
    };
    ensureCleanSession();
  }, [step]);

  useEffect(() => {
    if (!authLoading && user && step !== 'otp') {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate, step]);

  // --- Validation Helpers ---
  const clearFieldError = (field) => {
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
    setError('');
  };

  const handleEmailBlur = () => {
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
    }
  };

  const handlePasswordBlur = () => {
    if (!password) return;
    if (password.length < 6) {
      setFieldErrors(prev => ({ ...prev, password: "Password must be at least 6 characters." }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validation Logic
    let isValid = true;
    const newErrors = { fullName: '', email: '', password: '' };

    if (!fullName.trim()) { newErrors.fullName = "Full Name is required."; isValid = false; }
    if (!email.trim()) { newErrors.email = "Email is required."; isValid = false; }
    if (!password) { newErrors.password = "Password is required."; isValid = false; }
    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(newErrors);
      return; 
    }
    if (fieldErrors.email || fieldErrors.password) return;

    setLoading(true);

    try {
      // 2. Database Check (Pre-check for duplicate email)
      const { data: emailExists, error: rpcError } = await supabase.rpc('check_email_exists', { 
        email_to_check: email 
      });

      if (rpcError) {
         console.error("RPC Error:", rpcError);
         throw new Error("system_error");
      }

      if (emailExists) {
        setFieldErrors(prev => ({ ...prev, email: "This email is already registered." }));
        setLoading(false);
        return;
      }

      // 3. Perform Signup
      const { error } = await signUpWithEmail(email, password, fullName);

      if (error) throw error;
      
      setStep('otp');
      toast.success('Verification code sent!', { description: 'Please check your email inbox.' });

    } catch (error) {
      console.error("Signup Error:", error);
      
      const msg = error.message?.toLowerCase() || "";

      if (
        msg.includes("fetch") || 
        msg.includes("network") || 
        msg.includes("upstream") ||
        msg.includes("connection") ||
        msg.includes("system_error") ||
        msg.includes("body stream") ||
        msg.includes("json") ||
        msg.includes("failed to execute")
      ) {
        setError("An error occurred. Please try again later.");
        toast.error('Signup failed', { description: 'An error occurred. Please try again later.' });
      } 
      else if (msg.includes("password")) {
        setFieldErrors(prev => ({ ...prev, password: "Please choose a stronger password." }));
      }
      else if (msg.includes("valid email")) {
        setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
      }
      else if (msg.includes("already registered") || msg.includes("unique constraint")) {
         setFieldErrors(prev => ({ ...prev, email: "This email is already registered." }));
      }
      else {
        setError("An error occurred. Please try again.");
        toast.error('Signup failed', { description: 'An error occurred. Please try again.' });
      }

    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await verifySignupOtp(email, otp);
      if (error) throw error;

      toast.success('Account verified! 🎉', { description: 'Welcome to TrustWall.' });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Verification failed', { description: 'Invalid code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      toast.error('Signup failed', { description: error.message });
    }
  };

  const handleGithubSignup = async () => {
    try {
      const { error } = await signInWithGithub();
      if (error) throw error;
    } catch (error) {
      toast.error('Signup failed', { description: error.message });
    }
  };

  if (user && step !== 'otp') return null;

  const benefits = [
    "Unlimited testimonial collection",
    "Beautiful embed widgets",
    "Custom branding options",
    "Analytics & insights",
  ];

  const features = [
    { icon: Rocket, title: "Get Started Fast", desc: "Set up in under 2 minutes" },
    { icon: Shield, title: "Secure & Private", desc: "Enterprise-grade security" },
    { icon: Zap, title: "Boost Conversions", desc: "Increase sales by up to 40%" },
  ];

  return (
    <div className="min-h-screen flex">
      <Helmet>
        <title>Sign Up | TrustWall - Start for Free</title>
        <meta name="description" content="Create your free TrustWall account today. Start collecting video and text testimonials in minutes. No credit card required." />
        <link rel="canonical" href="https://trustwall.live/signup" />
        <meta property="og:title" content="Join TrustWall - Build Your Wall of Love" />
        <meta property="og:description" content="The easiest way to collect social proof. Sign up for free and boost your conversions." />
        <meta property="og:url" content="https://trustwall.live/signup" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          {/* Logo - Top */}
          <Link to="/" className="flex items-center gap-3">
             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                          </div>
            <span className="text-2xl font-bold text-white">TrustWall</span>
          </Link>

          {/* Testimonial Card - Center */}
          <div className="flex-1 flex items-center justify-center py-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="bg-white rounded-2xl p-8 shadow-2xl shadow-black/20 max-w-md w-full"
            >
              {/* Quote */}
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                "{randomTestimonial.quote}"
              </p>
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
                  {randomTestimonial.avatar}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">{randomTestimonial.name}</p>
                  <p className="text-gray-500 text-base">{randomTestimonial.role}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom - Feature highlights */}
          <div className="flex items-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              <span>Quick setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Free to start</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Star className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              TrustWall
            </span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-violet-500/10 border border-gray-100 dark:border-gray-800 p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-4 shadow-lg shadow-violet-500/25">
                {step === 'otp' ? (
                  <Mail className="w-6 h-6 text-white" />
                ) : (
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {step === 'otp' ? 'Verify your email' : 'Create an account'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {step === 'otp' 
                  ? `We sent a code to ${email}` 
                  : 'Start collecting testimonials in minutes'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 'otp' ? (
                /* OTP FORM VIEW */
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center py-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-violet-400 rounded-full blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-br from-violet-500 to-indigo-600 p-5 rounded-2xl">
                        <Mail className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        className="gap-3"
                      >
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot 
                              key={index}
                              index={index} 
                              className="w-12 h-14 text-xl font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500" 
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 font-medium text-base shadow-lg shadow-violet-500/25"
                      disabled={loading || otp.length < 6}
                    >
                      {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                      Verify Account
                    </Button>

                    <div className="text-center">
                      <button 
                        type="button" 
                        onClick={() => setStep('form')}
                        className="text-sm text-gray-500 hover:text-violet-600 font-medium"
                      >
                        Wrong email? Go back
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                /* SIGNUP FORM VIEW */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Social Logins */}
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" 
                      onClick={handleGoogleSignup}
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" 
                      onClick={handleGithubSignup}
                    >
                      <Github className="w-5 h-5 mr-3" />
                      Continue with GitHub
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-8">
                    <Separator className="bg-gray-200 dark:bg-gray-700" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 px-4 text-sm text-gray-400">
                      or continue with email
                    </span>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSignup} className="space-y-5" noValidate>
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className={`text-sm font-medium ${fieldErrors.fullName ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); setError(''); }}
                        onFocus={() => clearFieldError('fullName')}
                        className={`h-12 rounded-xl px-4 ${fieldErrors.fullName 
                          ? "border-red-500 focus-visible:ring-red-500" 
                          : "border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500"}`}
                      />
                      {fieldErrors.fullName && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.fullName}
                        </motion.p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`text-sm font-medium ${fieldErrors.email ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        onBlur={handleEmailBlur}
                        onFocus={() => clearFieldError('email')}
                        className={`h-12 rounded-xl px-4 ${fieldErrors.email 
                          ? "border-red-500 focus-visible:ring-red-500" 
                          : "border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500"}`}
                      />
                      {fieldErrors.email && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.email}
                        </motion.p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className={`text-sm font-medium ${fieldErrors.password ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(''); }}
                          onBlur={handlePasswordBlur}
                          onFocus={() => clearFieldError('password')}
                          className={`h-12 rounded-xl px-4 pr-12 ${fieldErrors.password 
                            ? "border-red-500 focus-visible:ring-red-500" 
                            : "border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500"}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.password}
                        </motion.p>
                      )}
                      <p className="text-xs text-gray-400">Must be at least 6 characters</p>
                    </div>

                    {/* General Error Message */}
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      >
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 font-medium text-base shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                      Create Account
                    </Button>
                  </form>

                  <p className="mt-4 text-xs text-center text-gray-400">
                    By signing up, you agree to our{' '}
                    <Link to="/terms-of-service" className="text-violet-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="text-violet-600 hover:underline">Privacy Policy</Link>.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Link */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold">
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
