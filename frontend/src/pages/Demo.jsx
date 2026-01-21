/**
 * DemoPage - Interactive Widget Playground
 * 
 * Allows users to test-drive the TrustFlow widget without signing up.
 * Split screen: Controls on left, live preview on right.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Play, Settings, Eye, Star, Moon, Sun, User, Palette, 
  Layout, Grid3X3, Rows3, ArrowRight, Sparkles, Code,
  Layers, CreditCard, Bell, Zap, Check
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';
import CTASection from '@/components/marketing/CTASection';
import { demoPageData } from '@/data/landingPageData';
import { cn } from '@/lib/utils';

const DemoPage = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    showAvatar: true,
    showRating: true,
    starColor: '#FBBF24',
    layout: 'grid',
    columns: 3,
    cardStyle: 'default',
    showBorder: true,
    showShadow: true,
  });

  const [activePreset, setActivePreset] = useState(0);
  const [activeCardLayout, setActiveCardLayout] = useState(0);
  const [activeCombo, setActiveCombo] = useState(0);
  const [activeTab, setActiveTab] = useState('widget');

  const starColorOptions = [
    { label: 'Amber', value: '#FBBF24' },
    { label: 'Rose', value: '#F43F5E' },
    { label: 'Violet', value: '#8B5CF6' },
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Green', value: '#22C55E' },
  ];

  // Preset data
  const presets = [
    { name: 'TrustWall Default', bg: 'bg-slate-50', text: 'text-slate-900', card: 'bg-white border-slate-200' },
    { name: 'Dark Elegance', bg: 'bg-slate-900', text: 'text-white', card: 'bg-slate-800 border-slate-700' },
    { name: 'Violet Dream', bg: 'bg-gradient-to-br from-violet-500 to-purple-600', text: 'text-white', card: 'bg-white/10 backdrop-blur border-white/20' },
    { name: 'Ocean Breeze', bg: 'bg-gradient-to-br from-cyan-500 to-blue-600', text: 'text-white', card: 'bg-white/10 backdrop-blur border-white/20' },
    { name: 'Sunset Glow', bg: 'bg-gradient-to-br from-amber-400 to-rose-500', text: 'text-white', card: 'bg-white/10 backdrop-blur border-white/20' },
  ];

  // Card layout data
  const cardLayouts = [
    { name: 'Classic', style: 'classic' },
    { name: 'Twitter Style', style: 'twitter' },
    { name: 'Quote Card', style: 'quote' },
    { name: 'Split View', style: 'split' },
  ];

  // Combo data
  const combos = [
    { name: 'Social Media Pro', preset: 'Smooth Carousel', card: 'Twitter Style', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Quote Gallery', preset: 'Dark Elegance', card: 'Quote Card', gradient: 'from-slate-700 to-slate-900' },
    { name: 'Dream Showcase', preset: 'Violet Dream', card: 'Floating Badge', gradient: 'from-violet-500 to-purple-600' },
    { name: 'Sunset Vibes', preset: 'Sunset Glow', card: 'Classic', gradient: 'from-amber-400 to-rose-500' },
  ];

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-0">
              <Play className="w-3 h-3 mr-1" />
              Interactive Demo
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              {demoPageData.headline}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
              {demoPageData.subheadline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo Playground */}
      <section className="pb-20 md:pb-28 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Controls Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:col-span-1 order-2 lg:order-1"
            >
              <Card className="lg:sticky lg:top-24 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="w-5 h-5 text-violet-600" />
                    Widget Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.darkMode ? (
                        <Moon className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500" />
                      )}
                      <Label htmlFor="darkMode">Dark Mode</Label>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                    />
                  </div>

                  {/* Show Avatar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <Label htmlFor="showAvatar">Show Avatar</Label>
                    </div>
                    <Switch
                      id="showAvatar"
                      checked={settings.showAvatar}
                      onCheckedChange={(checked) => updateSetting('showAvatar', checked)}
                    />
                  </div>

                  {/* Show Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <Label htmlFor="showRating">Show Rating</Label>
                    </div>
                    <Switch
                      id="showRating"
                      checked={settings.showRating}
                      onCheckedChange={(checked) => updateSetting('showRating', checked)}
                    />
                  </div>

                  {/* Star Color */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-slate-500" />
                      <Label>Star Color</Label>
                    </div>
                    <div className="flex gap-2">
                      {starColorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateSetting('starColor', color.value)}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 transition-all',
                            settings.starColor === color.value
                              ? 'border-slate-900 dark:border-white scale-110'
                              : 'border-transparent hover:scale-105'
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Layout */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-slate-500" />
                      <Label>Layout</Label>
                    </div>
                    <Select
                      value={settings.layout}
                      onValueChange={(value) => updateSetting('layout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">
                          <div className="flex items-center gap-2">
                            <Grid3X3 className="w-4 h-4" />
                            Grid
                          </div>
                        </SelectItem>
                        <SelectItem value="list">
                          <div className="flex items-center gap-2">
                            <Rows3 className="w-4 h-4" />
                            List
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Card Style */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Show Border</Label>
                      <Switch
                        checked={settings.showBorder}
                        onCheckedChange={(checked) => updateSetting('showBorder', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show Shadow</Label>
                      <Switch
                        checked={settings.showShadow}
                        onCheckedChange={(checked) => updateSetting('showShadow', checked)}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Link to="/signup">
                      <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                        Create Your Widget
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full lg:col-span-2 order-1 lg:order-2"
            >
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 overflow-hidden">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Eye className="w-5 h-5 text-violet-600" />
                      Live Preview
                    </CardTitle>
                    <Badge variant="outline" className="gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Preview container with theme */}
                  <div
                    className={cn(
                      'p-4 sm:p-6 md:p-8 min-h-[300px] md:min-h-[500px] transition-colors duration-300 overflow-hidden',
                      settings.darkMode
                        ? 'bg-slate-900'
                        : 'bg-slate-50'
                    )}
                  >
                    {/* Widget preview */}
                    <div
                      className={cn(
                        settings.layout === 'grid'
                          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'
                          : 'space-y-3 sm:space-y-4'
                      )}
                    >
                      {demoPageData.previewTestimonials.map((testimonial, index) => (
                        <motion.div
                          key={testimonial.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={cn(
                            'p-5 rounded-xl transition-all',
                            settings.darkMode
                              ? 'bg-slate-800'
                              : 'bg-white',
                            settings.showBorder &&
                              (settings.darkMode
                                ? 'border border-slate-700'
                                : 'border border-slate-200'),
                            settings.showShadow && 'shadow-lg'
                          )}
                        >
                          {/* Rating */}
                          {settings.showRating && (
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4"
                                  style={{
                                    fill: i < testimonial.rating ? settings.starColor : 'transparent',
                                    color: i < testimonial.rating ? settings.starColor : '#D1D5DB',
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          {/* Content */}
                          <p
                            className={cn(
                              'text-sm mb-4 leading-relaxed',
                              settings.darkMode ? 'text-slate-300' : 'text-slate-700'
                            )}
                          >
                            "{testimonial.content}"
                          </p>

                          {/* Author */}
                          <div className="flex items-center gap-3">
                            {settings.showAvatar && (
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7c3aed&color=fff`;
                                }}
                              />
                            )}
                            <div>
                              <div
                                className={cn(
                                  'font-semibold text-sm',
                                  settings.darkMode ? 'text-white' : 'text-slate-900'
                                )}
                              >
                                {testimonial.name}
                              </div>
                              <div
                                className={cn(
                                  'text-xs',
                                  settings.darkMode ? 'text-slate-400' : 'text-slate-500'
                                )}
                              >
                                {testimonial.role}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Embed Code Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6"
              >
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm text-slate-400">
                      <Code className="w-4 h-4" />
                      Embed Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <pre className="text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all">
                      <code className="text-violet-400">
                        {'<script src="https://trustwall.app/embed.js" data-space-id="your-space-id"></script>'}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* More Interactive Demos */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              <Sparkles className="w-3 h-3 mr-1" /> More Demos
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore Our Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Try out presets, card layouts, and combo packs interactively</p>
          </motion.div>

          <Tabs defaultValue="presets" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="presets" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Presets</span>
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Card Layouts</span>
              </TabsTrigger>
              <TabsTrigger value="combos" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Combos</span>
              </TabsTrigger>
            </TabsList>

            {/* Presets Tab */}
            <TabsContent value="presets">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Widget Presets</CardTitle>
                  <p className="text-sm text-muted-foreground">Click on a preset to see it in action</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Preset selector */}
                    <div className="p-4 sm:p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                      <div className="grid grid-cols-2 gap-3">
                        {presets.map((preset, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActivePreset(i)}
                            className={cn(
                              'p-3 rounded-xl border-2 transition-all text-left',
                              activePreset === i
                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-violet-300'
                            )}
                          >
                            <div className={cn('h-12 rounded-lg mb-2', preset.bg)}>
                              <div className="p-2 flex gap-1">
                                {[1,2,3].map(j => (
                                  <div key={j} className="flex-1 h-2 rounded bg-white/30" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs font-medium truncate">{preset.name}</p>
                            {activePreset === i && (
                              <Badge className="mt-1 text-[9px] bg-violet-500 text-white">Selected</Badge>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    {/* Preview */}
                    <div className={cn('p-6 min-h-[300px] transition-all', presets[activePreset].bg)}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activePreset}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={cn('p-4 rounded-xl border', presets[activePreset].card)}
                        >
                          <div className="flex gap-1 mb-3">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                          </div>
                          <p className={cn('text-sm mb-4', presets[activePreset].text)}>
                            "This product completely changed how I work. Highly recommend to everyone!"
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500" />
                            <div>
                              <p className={cn('font-semibold text-sm', presets[activePreset].text)}>Sarah Johnson</p>
                              <p className={cn('text-xs opacity-70', presets[activePreset].text)}>CEO, TechStart</p>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Card Layouts Tab */}
            <TabsContent value="cards">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Card Layouts</CardTitle>
                  <p className="text-sm text-muted-foreground">Choose how each testimonial card looks</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Layout selector */}
                    <div className="p-4 sm:p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                      <div className="space-y-3">
                        {cardLayouts.map((layout, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setActiveCardLayout(i)}
                            className={cn(
                              'w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between',
                              activeCardLayout === i
                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-violet-300'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5 text-violet-600" />
                              <span className="font-medium">{layout.name}</span>
                            </div>
                            {activeCardLayout === i && <Check className="w-5 h-5 text-violet-600" />}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    {/* Preview */}
                    <div className="p-6 bg-slate-100 dark:bg-slate-800/50 min-h-[300px] flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeCardLayout}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-xs"
                        >
                          {activeCardLayout === 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-200 dark:border-slate-700">
                              <div className="flex gap-1 mb-3">
                                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                              </div>
                              <p className="text-sm mb-4">"Classic layout with rating at top and author at bottom."</p>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-violet-200" />
                                <div>
                                  <p className="font-semibold text-sm">John Doe</p>
                                  <p className="text-xs text-muted-foreground">Product Manager</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {activeCardLayout === 1 && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-blue-400" />
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">Sarah M.</p>
                                  <p className="text-xs text-muted-foreground">@sarahm</p>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">X</div>
                              </div>
                              <p className="text-sm">"Twitter-style card with social media vibes. Perfect for tech products!"</p>
                            </div>
                          )}
                          {activeCardLayout === 2 && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-200 dark:border-slate-700">
                              <div className="text-4xl text-violet-300 mb-2">"</div>
                              <p className="text-sm mb-4 italic">Beautiful quote-focused design that puts the testimonial front and center.</p>
                              <div className="flex items-center justify-end gap-2">
                                <p className="text-sm font-medium">— Emily R.</p>
                                <div className="w-8 h-8 rounded-full bg-amber-200" />
                              </div>
                            </div>
                          )}
                          {activeCardLayout === 3 && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex overflow-hidden">
                              <div className="w-1/3 bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur" />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex gap-0.5 mb-2">
                                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-xs mb-2">"Split view with image on the side."</p>
                                <p className="text-xs font-semibold">Mike Chen</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Combos Tab */}
            <TabsContent value="combos">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Combo Packs</CardTitle>
                  <p className="text-sm text-muted-foreground">Pre-matched preset + card layout combinations</p>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {combos.map((combo, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveCombo(i)}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-left',
                          activeCombo === i
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-violet-300'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn('w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center', combo.gradient)}>
                            <Layers className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{combo.name}</p>
                            <p className="text-xs text-muted-foreground">{combo.preset} + {combo.card}</p>
                          </div>
                          {activeCombo === i && (
                            <Badge className="bg-violet-500 text-white">Active</Badge>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-3">Selected combo will be applied instantly</p>
                    <Link to="/signup">
                      <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Try {combos[activeCombo].name}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FOMO Popup Demo */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
              <Bell className="w-3 h-3 mr-1" /> FOMO Popups
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Social Proof Popups</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">See how FOMO popups appear on your website</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-slate-100 dark:bg-slate-800/50 p-6 min-h-[400px]">
                  {/* Mock website */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                    <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded mb-4" />
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
                    <div className="h-10 w-40 bg-violet-500 rounded-lg" />
                  </div>

                  {/* Animated popup */}
                  <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                    className="absolute bottom-8 left-8 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-4 border border-slate-200 dark:border-slate-700 max-w-xs"
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src="https://i.pravatar.cc/50?img=12" 
                        alt="" 
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Emma just left a 5-star review!</p>
                        <div className="flex gap-0.5 my-1">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">"Incredible product, exceeded all my expectations!"</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">Just now</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </MarketingLayout>
  );
};

export default DemoPage;
