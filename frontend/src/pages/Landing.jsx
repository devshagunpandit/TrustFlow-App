import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Star, Video, FileText, Code, ArrowRight, CheckCircle, Sparkles, Heart,
  Layout, Palette, Bell, MousePointer, BarChart3, Layers, CreditCard,
  Zap, Play, Grid3X3, MessageSquare, Eye, Settings, Crown, ChevronRight,
  Send, Check, Loader2, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import confetti from 'canvas-confetti';

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activePreset, setActivePreset] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Auto-rotate demos
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePreset(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard(prev => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || isSubscribing) return;
    
    setIsSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsSubscribing(false);
    
    // Celebration confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.7 },
      colors: ['#8b5cf6', '#6366f1', '#ec4899', '#10b981', '#f59e0b']
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6, x: 0.3 }
      });
    }, 200);
    
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6, x: 0.7 }
      });
    }, 400);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  // Demo data
  const presetNames = ['TrustWall Default', 'Dark Elegance', 'Violet Dream', 'Ocean Breeze'];
  const cardLayouts = ['Classic', 'Twitter Style', 'Quote Card', 'Modern Split'];

  const demoTestimonials = [
    { id: 1, name: 'Sarah Johnson', role: 'CEO, TechStart', content: 'TrustWall transformed how we collect testimonials. Our conversion rate increased by 40%!', rating: 5, avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: 2, name: 'Michael Chen', role: 'Freelance Designer', content: 'As a freelancer, social proof is everything. TrustWall makes it so easy to collect and showcase client reviews.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: 3, name: 'Emily Rodriguez', role: 'Marketing Director', content: 'The video testimonial feature is a game-changer. Authentic video reviews convert way better than text.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=5' },
    { id: 4, name: 'David Kim', role: 'Agency Owner', content: 'We use TrustWall for all our client projects. The embeddable widget is beautiful and super easy to customize.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=8' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 sm:py-6 flex justify-between items-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            TrustWall
          </span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 sm:gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Login</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-xs sm:text-sm">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-4xl mx-auto">
          <motion.div variants={fadeInUp} className="mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-medium">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              Social Proof on Autopilot
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-violet-800 to-indigo-900 dark:from-white dark:via-violet-200 dark:to-indigo-200 bg-clip-text text-transparent">
            Collect & Display
            <br />
            <span className="text-violet-600">Beautiful Testimonials</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Create spaces for your projects, send a simple link to clients, and showcase stunning testimonials on your website.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-lg shadow-violet-500/25">
                Start for Free <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link to="/public-pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                View Pricing
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">How It Works</h2>
          <p className="text-muted-foreground text-sm sm:text-lg">Three simple steps to social proof success</p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
          {[
            { icon: FileText, title: 'Create a Space', desc: 'Set up a dedicated space for each project with your branding' },
            { icon: Video, title: 'Send the Link', desc: 'Share a unique link with clients to collect text or video testimonials' },
            { icon: Code, title: 'Embed Anywhere', desc: 'Add a beautiful Wall of Love widget to your website with one line of code' }
          ].map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <Card className="text-center p-4 sm:p-8 h-full hover:shadow-xl transition-all hover:-translate-y-1 border-violet-100 dark:border-violet-900/50">
                <CardContent className="p-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600" />
                  </div>
                  <div className="text-xs sm:text-sm text-violet-600 font-semibold mb-1 sm:mb-2">Step {index + 1}</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== FEATURE 1: Widget Presets ========== */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Demo UI */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-muted-foreground">Widget Presets</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {presetNames.map((name, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: activePreset === i ? 1.05 : 1, opacity: activePreset === i ? 1 : 0.6 }}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        activePreset === i ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30' : 'border-slate-200 dark:border-slate-700'
                      }`}
                      onClick={() => setActivePreset(i)}
                    >
                      <div className={`h-16 rounded-lg mb-2 ${
                        i === 0 ? 'bg-gradient-to-br from-slate-100 to-slate-200' :
                        i === 1 ? 'bg-gradient-to-br from-slate-800 to-slate-900' :
                        i === 2 ? 'bg-gradient-to-br from-violet-400 to-purple-500' :
                        'bg-gradient-to-br from-cyan-400 to-blue-500'
                      }`}>
                        <div className="p-2 flex gap-1">
                          {[1,2,3].map(j => (
                            <div key={j} className="flex-1 h-3 rounded bg-white/30" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-medium truncate">{name}</p>
                      {activePreset === i && (
                        <Badge className="mt-1 text-[9px] bg-violet-500 text-white">Active</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">15+ Premium Presets</span>
                  <Badge variant="outline" className="text-[10px]">One-Click Apply</Badge>
                </div>
              </div>
            </motion.div>
            
            {/* Right: Text */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                <Palette className="w-3 h-3 mr-1" /> Widget Presets
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Beautiful Presets,{' '}
                <span className="text-violet-600">One Click Apply</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Choose from 15+ professionally designed widget presets. From minimal clean layouts to bold colorful themes - find the perfect style for your brand in seconds.
              </p>
              <ul className="space-y-3">
                {['15+ Premium Presets', 'Dark & Light Themes', 'Grid, Carousel & Masonry Layouts', 'Instant Preview'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== FEATURE 2: Card Layouts ========== */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <CreditCard className="w-3 h-3 mr-1" /> Card Layouts
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Multiple Card Styles,{' '}
                <span className="text-emerald-600">Unique Designs</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Pick from 8+ card layout styles - from Twitter-style cards to elegant quote designs. Each testimonial looks stunning with the layout that fits your brand.
              </p>
              <ul className="space-y-3">
                {['8+ Card Layout Styles', 'Twitter, Quote & Split Designs', 'Profile First or Content First', 'Video Hero Cards'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Right: Demo UI */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  {cardLayouts.map((name, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: activeCard === i ? 1.03 : 0.97, opacity: activeCard === i ? 1 : 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-800"
                    >
                      {i === 0 && (
                        <div className="space-y-2">
                          <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div>
                          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded" />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-violet-200" />
                            <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                          </div>
                        </div>
                      )}
                      {i === 1 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-400" />
                            <div className="flex-1">
                              <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
                              <div className="h-1.5 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                            </div>
                            <div className="w-4 h-4 rounded-full bg-blue-400" />
                          </div>
                          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                      )}
                      {i === 2 && (
                        <div className="space-y-2">
                          <div className="text-2xl text-violet-300">"</div>
                          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded" />
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="w-6 h-6 rounded-full bg-amber-200" />
                          </div>
                        </div>
                      )}
                      {i === 3 && (
                        <div className="flex gap-2 h-full">
                          <div className="w-1/3 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500" />
                          </div>
                          <div className="flex-1 space-y-2 py-1">
                            <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className="w-2 h-2 fill-yellow-400 text-yellow-400" />)}</div>
                            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                          </div>
                        </div>
                      )}
                      <p className="text-[10px] font-medium mt-2 text-center">{name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== FEATURE 3: Combo Packs ========== */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Demo UI */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold">Combo Packs</span>
                  <Badge className="ml-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px]">HOT</Badge>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Social Media Pro', preset: 'Smooth Carousel', card: 'Twitter Style', color: 'from-blue-500 to-cyan-500' },
                    { name: 'Quote Gallery', preset: 'Dark Elegance', card: 'Quote Card', color: 'from-slate-700 to-slate-900' },
                    { name: 'Dream Showcase', preset: 'Violet Dream', card: 'Floating Badge', color: 'from-violet-500 to-purple-600' }
                  ].map((combo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${combo.color} flex items-center justify-center`}>
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{combo.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{combo.preset} + {combo.card}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        Apply
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Right: Text */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <Layers className="w-3 h-3 mr-1" /> Combo Packs
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Pre-matched Themes,{' '}
                <span className="text-amber-600">Perfect Combos</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Don't know what looks best together? Our Combo Packs combine the perfect widget preset + card layout for stunning results. One click, complete transformation.
              </p>
              <ul className="space-y-3">
                {['Preset + Card Layout Combined', 'Custom Headings Included', 'Expert-Curated Designs', 'Instant Apply'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== FEATURE 4: Widget Designer ========== */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Settings className="w-3 h-3 mr-1" /> Widget Designer
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Full Control,{' '}
                <span className="text-blue-600">Every Detail</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Fine-tune every aspect of your testimonial widget. Colors, fonts, shadows, animations, spacing - you control it all with our powerful Widget Designer.
              </p>
              <ul className="space-y-3">
                {['Custom Colors & Gradients', 'Typography Controls', 'Animation Effects', 'Shadow & Border Styling', 'Live Preview'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Right: Demo UI */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-muted-foreground">Widget Designer</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['Layout', 'Colors', 'Effects'].map((tab, i) => (
                    <motion.div
                      key={tab}
                      whileHover={{ scale: 1.05 }}
                      className={`text-center py-2 px-3 rounded-lg cursor-pointer text-xs font-medium ${
                        i === 1 ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {tab}
                    </motion.div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Primary Color</span>
                    <div className="flex gap-1">
                      {['bg-violet-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500'].map((c, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.2 }} className={`w-5 h-5 rounded-full ${c} cursor-pointer ${i === 0 ? 'ring-2 ring-offset-2 ring-violet-500' : ''}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Shadow</span>
                    <div className="flex gap-2">
                      {['None', 'Light', 'Strong'].map((s, i) => (
                        <span key={s} className={`text-[10px] px-2 py-1 rounded ${i === 1 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground'}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Animation</span>
                    <span className="text-xs text-muted-foreground">Fade In ▾</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== FEATURE 5: FOMO Popups ========== */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Demo UI */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
              <div className="relative h-64 sm:h-80">
                {/* Mock website */}
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
                  <div className="h-3 w-24 bg-slate-300 dark:bg-slate-700 rounded mb-3" />
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                  <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                  <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                
                {/* Popup */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute bottom-4 left-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 max-w-[250px] sm:max-w-xs"
                >
                  <div className="flex items-start gap-3">
                    <img src="https://i.pravatar.cc/40?img=12" alt="" className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium">Sarah just left a review!</p>
                      <div className="flex gap-0.5 my-1">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />)}
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">"Amazing product, highly recommend!"</p>
                    </div>
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-2">2 minutes ago</div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Right: Text */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <Badge className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                <Bell className="w-3 h-3 mr-1" /> FOMO Popups
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Social Proof Popups,{' '}
                <span className="text-rose-600">Boost Conversions</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Show real-time testimonial popups to create urgency and build trust. Proven to increase conversions by up to 15%. Non-intrusive, beautifully designed.
              </p>
              <ul className="space-y-3">
                {['Real-time Notifications', 'Customizable Timing', 'Non-intrusive Design', 'Mobile Friendly', '+15% Conversion Boost'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== FEATURE 6: CTA Analytics ========== */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <BarChart3 className="w-3 h-3 mr-1" /> CTA Analytics
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Track Performance,{' '}
                <span className="text-green-600">Measure ROI</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Add custom CTA buttons to your widget and track every click. See impressions, click-through rates, and conversion data in real-time.
              </p>
              <ul className="space-y-3">
                {['Custom CTA Buttons', 'Click Tracking', 'Impression Analytics', 'Conversion Metrics', 'Export Reports'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Right: Demo UI */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">CTA Analytics</span>
                  <Badge variant="outline" className="text-[10px]">Last 7 Days</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Impressions', value: '12,453', color: 'text-blue-600' },
                    { label: 'Clicks', value: '1,847', color: 'text-green-600' },
                    { label: 'CTR', value: '14.8%', color: 'text-amber-600' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className={`text-lg sm:text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                
                <div className="h-20 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t"
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <span key={d} className="text-[8px] text-muted-foreground">{d}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wall of Love */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Wall of Love</h2>
          <p className="text-muted-foreground text-sm sm:text-lg">See what our users are saying about TrustWall</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {demoTestimonials.map((testimonial, index) => (
            <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1 border-violet-100 dark:border-violet-900/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-foreground/90">"{testimonial.content}"</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-xs sm:text-sm">{testimonial.name}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Subscribe */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Send className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Stay Updated</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">Get the latest updates, tips, and features delivered to your inbox.</p>
          
          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                >
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-green-600 mb-1">You're Subscribed! 🎉</h3>
                  <p className="text-sm text-muted-foreground">Thanks for joining! Check your inbox soon.</p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-11 sm:h-12"
                />
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="h-11 sm:h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  {isSubscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/30">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Boost Your Conversions?</h2>
          <p className="text-sm sm:text-lg opacity-90 mb-6 sm:mb-8">Join thousands of businesses using TrustWall to showcase their social proof.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-white text-violet-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                Get Started Free <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link to="/public-pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 sm:py-12 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              TrustWall
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/public-pricing" className="hover:text-foreground transition-colors">Pricing</Link>
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

export default Landing;
