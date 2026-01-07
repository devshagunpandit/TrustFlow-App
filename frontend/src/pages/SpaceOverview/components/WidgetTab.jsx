import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, Copy, Layout, Grid3X3, GalleryHorizontal, StretchHorizontal, AlignJustify,
  Palette, Monitor, Box, Type, AlignLeft, MessageSquare, Quote, Hand, Square, Circle,
  Check, X, Sparkles, RefreshCw, Gauge, ChevronLeft, ChevronRight, Star, BadgeCheck 
} from 'lucide-react';
import { StylishVideoPlayer, PremiumToggle, SectionHeader, CARD_WIDTH, GAP, PADDING_X } from './SharedComponents';

const WidgetTab = ({ testimonials, spaceId, activeTab }) => {
  const { toast } = useToast();
  const likedTestimonials = testimonials.filter(t => t.is_liked);

  // Widget State (Moved from parent)
  const [widgetSettings, setWidgetSettings] = useState({
    layout: 'grid',       
    theme: 'light',       
    cardTheme: 'light',   
    corners: 'smooth',    
    shadow: 'medium',     
    border: true,         
    hoverEffect: 'lift',  
    nameSize: 'medium',   
    testimonialStyle: 'clean', 
    animation: 'fade',    
    speed: 'normal'       
  });

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [maskWidth, setMaskWidth] = useState('100%');
  const containerRef = useRef(null);
  
  // Animation Replay Trigger
  const [replayTrigger, setReplayTrigger] = useState(0);

  const isCarousel = widgetSettings.layout === 'carousel';

  // --- Strict Fit Calculation ---
  useEffect(() => {
    if (widgetSettings.layout !== 'carousel' || !containerRef.current) {
      setMaskWidth('100%');
      return;
    }

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableWidth = rect.width - PADDING_X;
        const count = Math.floor((availableWidth + GAP) / (CARD_WIDTH + GAP));
        const safeCount = Math.max(1, count);
        setVisibleCount(safeCount);
        const exactWidth = (safeCount * CARD_WIDTH) + ((safeCount - 1) * GAP);
        setMaskWidth(`${exactWidth + 8}px`);
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [widgetSettings.layout, activeTab]); 

  // Trigger animation replay
  useEffect(() => {
    setReplayTrigger(prev => prev + 1);
  }, [widgetSettings.animation, widgetSettings.speed]);

  const copyEmbedCode = () => {
    const code = `<script 
  src="${window.location.origin}/embed.js" 
  data-space-id="${spaceId}" 
  data-theme="${widgetSettings.theme}"
  data-card-theme="${widgetSettings.cardTheme}"
  data-layout="${widgetSettings.layout}"
  data-corners="${widgetSettings.corners}"
  data-shadow="${widgetSettings.shadow}"
  data-border="${widgetSettings.border}"
  data-hover-effect="${widgetSettings.hoverEffect}"
  data-name-size="${widgetSettings.nameSize}"
  data-testimonial-style="${widgetSettings.testimonialStyle}"
  data-animation="${widgetSettings.animation}"
  data-animation-speed="${widgetSettings.speed}">
</script>`;
    navigator.clipboard.writeText(code);
    toast({ title: 'Embed code copied!', description: 'Code includes all your selected customizations.' });
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, likedTestimonials.length - visibleCount);
    if (carouselIndex >= maxIndex) setCarouselIndex(0); 
    else setCarouselIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    const maxIndex = Math.max(0, likedTestimonials.length - visibleCount);
    if (carouselIndex <= 0) setCarouselIndex(maxIndex); 
    else setCarouselIndex(prev => prev - 1);
  };

  const getPreviewCardStyles = () => {
    const { cardTheme, layout, corners, shadow, border, hoverEffect } = widgetSettings;
    let classes = 'p-6 transition-all duration-300 flex flex-col ';
    
    if (layout === 'masonry' || layout === 'list') classes += 'h-auto ';
    else classes += '!h-full '; 
    
    if (corners === 'sharp') classes += 'rounded-none ';
    else if (corners === 'round') classes += 'rounded-3xl ';
    else classes += 'rounded-xl '; 

    if (shadow === 'none') classes += 'shadow-none ';
    else if (shadow === 'light') classes += 'shadow-sm ';
    else if (shadow === 'strong') classes += 'shadow-xl ';
    else classes += 'shadow-md '; 

    if (hoverEffect === 'lift') classes += 'hover:-translate-y-1 hover:shadow-lg ';
    else if (hoverEffect === 'scale') classes += 'hover:scale-[1.02] hover:shadow-lg ';
    else if (hoverEffect === 'glow') classes += 'hover:shadow-violet-500/20 hover:border-violet-300 ';

    if (cardTheme === 'dark') {
      classes += 'bg-slate-900 text-slate-100 ';
      classes += border ? 'border border-slate-800 ' : 'border-0 ';
    } else {
      classes += 'bg-white text-slate-800 ';
      classes += border ? 'border border-slate-100 ' : 'border-0 ';
    }

    if (layout === 'masonry') classes += 'break-inside-avoid mb-6 inline-block w-full ';
    else if (layout === 'carousel') classes += 'flex-shrink-0 w-[300px] '; 
    else if (layout === 'list') classes += 'w-full mb-4 ';

    return classes;
  };

  const getNameSizeClass = () => {
    switch (widgetSettings.nameSize) {
      case 'small': return 'text-xs';
      case 'large': return 'text-base';
      default: return 'text-sm';
    }
  };

  const getAnimationVariants = () => {
    const { animation, speed } = widgetSettings;
    const durations = { slow: 0.8, normal: 0.5, fast: 0.3 };
    const dur = durations[speed] || 0.5;
    const stagger = speed === 'fast' ? 0.05 : 0.1;

    switch(animation) {
      case 'slideUp': return { hidden: { opacity: 0, y: 50 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * stagger, duration: dur, ease: "easeOut" } }) };
      case 'slideDown': return { hidden: { opacity: 0, y: -50 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * stagger, duration: dur, ease: "easeOut" } }) };
      case 'scale': return { hidden: { opacity: 0, scale: 0.8 }, visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * stagger, duration: dur } }) };
      case 'pop': return { hidden: { opacity: 0, scale: 0.5 }, visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * stagger, type: 'spring', stiffness: 300, damping: 20 } }) };
      case 'flip': return { hidden: { opacity: 0, rotateX: 90 }, visible: (i) => ({ opacity: 1, rotateX: 0, transition: { delay: i * stagger, duration: dur } }) };
      case 'elastic': return { hidden: { opacity: 0, x: -100 }, visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * stagger, type: 'spring', bounce: 0.6 } }) };
      case 'none': return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
      case 'fade': default: return { hidden: { opacity: 0 }, visible: (i) => ({ opacity: 1, transition: { delay: i * stagger, duration: dur } }) };
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-200px)] min-h-[800px]">
      {/* Left Column: Control Deck */}
      <Card className="w-full xl:w-[400px] flex flex-col border-violet-100 dark:border-violet-900/20 shadow-xl shadow-violet-500/5 bg-white/80 backdrop-blur-sm overflow-hidden flex-shrink-0">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-violet-600 fill-violet-100" />
                Widget Designer
              </CardTitle>
              <CardDescription>Customize your wall of love</CardDescription>
            </div>
            <Button size="sm" onClick={copyEmbedCode} className="bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 text-xs">
               <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Code
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          {/* Layout Section */}
          <div>
            <SectionHeader icon={Layout} title="Layout Structure" />
            <PremiumToggle 
              id="layout"
              current={widgetSettings.layout}
              onChange={(val) => { setWidgetSettings({ ...widgetSettings, layout: val }); setCarouselIndex(0); }}
              options={[
                { label: 'Grid', value: 'grid', icon: Grid3X3 },
                { label: 'Masonry', value: 'masonry', icon: GalleryHorizontal },
                { label: 'Carousel', value: 'carousel', icon: StretchHorizontal },
                { label: 'List', value: 'list', icon: AlignJustify },
              ]}
            />
          </div>

          <Separator />

          {/* Appearance Section */}
          <div>
            <SectionHeader icon={Palette} title="Visual Appearance" />
            <div className="space-y-4">
              {/* Container Theme */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Background Theme</Label>
                <PremiumToggle 
                  id="theme"
                  current={widgetSettings.theme}
                  onChange={(val) => setWidgetSettings({ ...widgetSettings, theme: val })}
                  options={[
                    { label: 'Light', value: 'light', icon: Monitor },
                    { label: 'Dark', value: 'dark', icon: Monitor },
                    { label: 'Clear', value: 'transparent', icon: Box },
                  ]}
                />
              </div>
              
              {/* Card Theme */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Card Theme</Label>
                <PremiumToggle 
                  id="cardTheme"
                  current={widgetSettings.cardTheme}
                  onChange={(val) => setWidgetSettings({ ...widgetSettings, cardTheme: val })}
                  options={[
                    { label: 'Light', value: 'light', icon: Monitor },
                    { label: 'Dark', value: 'dark', icon: Monitor },
                  ]}
                />
              </div>

              {/* Card Styling Group */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border space-y-4">
                 {/* Typography */}
                 <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                       <Type className="w-3 h-3" /> Name Size
                    </Label>
                    <PremiumToggle 
                      id="nameSize"
                      current={widgetSettings.nameSize}
                      onChange={(val) => setWidgetSettings({ ...widgetSettings, nameSize: val })}
                      options={[
                        { label: 'Small', value: 'small' },
                        { label: 'Normal', value: 'medium' },
                        { label: 'Large', value: 'large' },
                      ]}
                    />
                 </div>

                 {/* Content Style */}
                 <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                       <AlignLeft className="w-3 h-3" /> Content Style
                    </Label>
                    <PremiumToggle 
                      id="testimonialStyle"
                      current={widgetSettings.testimonialStyle}
                      onChange={(val) => setWidgetSettings({ ...widgetSettings, testimonialStyle: val })}
                      options={[
                        { label: 'Clean', value: 'clean' },
                        { label: 'Bubble', value: 'bubble', icon: MessageSquare },
                        { label: 'Quote', value: 'quote', icon: Quote },
                      ]}
                    />
                 </div>

                 {/* Hover Effects */}
                 <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                       <Hand className="w-3 h-3" /> Hover Interaction
                    </Label>
                    <PremiumToggle 
                      id="hoverEffect"
                      current={widgetSettings.hoverEffect}
                      onChange={(val) => setWidgetSettings({ ...widgetSettings, hoverEffect: val })}
                      options={[
                        { label: 'None', value: 'none' },
                        { label: 'Lift', value: 'lift' },
                        { label: 'Scale', value: 'scale' },
                        { label: 'Glow', value: 'glow' },
                      ]}
                    />
                 </div>

                 <Separator className="bg-slate-200 dark:bg-slate-800" />

                 {/* Corners */}
                 <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-2 block">Card Corners</Label>
                    <PremiumToggle 
                      id="corners"
                      current={widgetSettings.corners}
                      onChange={(val) => setWidgetSettings({ ...widgetSettings, corners: val })}
                      options={[
                        { label: 'Sharp', value: 'sharp', icon: Square },
                        { label: 'Smooth', value: 'smooth', icon: Circle },
                        { label: 'Round', value: 'round', icon: Circle },
                      ]}
                    />
                 </div>
                 {/* Shadows */}
                 <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-2 block">Shadow Intensity</Label>
                    <PremiumToggle 
                      id="shadow"
                      current={widgetSettings.shadow}
                      onChange={(val) => setWidgetSettings({ ...widgetSettings, shadow: val })}
                      options={[
                        { label: 'None', value: 'none' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Strong', value: 'strong' },
                      ]}
                    />
                 </div>
                 {/* Border */}
                 <div className="flex items-center justify-between pt-1">
                    <Label className="text-[10px] uppercase font-bold text-slate-400">Show Borders</Label>
                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-full p-1 border shadow-sm">
                       <button onClick={() => setWidgetSettings({ ...widgetSettings, border: true })} className={`w-8 h-6 rounded-full flex items-center justify-center transition-all ${widgetSettings.border ? 'bg-violet-100 text-violet-600' : 'text-slate-300'}`}><Check className="w-3.5 h-3.5" /></button>
                       <button onClick={() => setWidgetSettings({ ...widgetSettings, border: false })} className={`w-8 h-6 rounded-full flex items-center justify-center transition-all ${!widgetSettings.border ? 'bg-red-50 text-red-500' : 'text-slate-300'}`}><X className="w-3.5 h-3.5" /></button>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Animation Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
               <SectionHeader icon={Sparkles} title="Motion & Effects" />
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 hover:text-violet-700"
                  onClick={() => setReplayTrigger(prev => prev + 1)}
                  title="Replay Animation"
               >
                  <RefreshCw className="h-3 w-3" />
               </Button>
            </div>
            
            <div className="space-y-4">
               <div>
                  <Label className="text-xs text-slate-500 mb-1.5 block">Entrance Animation</Label>
                  <div className="grid grid-cols-2 gap-2">
                     {['fade', 'slideUp', 'slideDown', 'scale', 'pop', 'flip', 'elastic', 'none'].map((anim) => (
                       <Button
                         key={anim}
                         variant={widgetSettings.animation === anim ? "default" : "outline"}
                         size="sm"
                         onClick={() => setWidgetSettings({ ...widgetSettings, animation: anim })}
                         className={`justify-start capitalize text-xs h-8 ${widgetSettings.animation === anim ? 'bg-violet-600 hover:bg-violet-700' : ''}`}
                       >
                         {widgetSettings.animation === anim && <Sparkles className="w-3 h-3 mr-2 text-violet-200" />}
                         {anim.replace(/([A-Z])/g, ' $1').trim()}
                       </Button>
                     ))}
                  </div>
               </div>
               
               <div>
                  <Label className="text-xs text-slate-500 mb-1.5 block">Animation Speed</Label>
                  <PremiumToggle 
                     id="speed"
                     current={widgetSettings.speed}
                     onChange={(val) => setWidgetSettings({ ...widgetSettings, speed: val })}
                     options={[
                       { label: 'Slow', value: 'slow', icon: Gauge },
                       { label: 'Normal', value: 'normal', icon: Gauge },
                       { label: 'Fast', value: 'fast', icon: Zap },
                     ]}
                  />
               </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Right Column: Live Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
         <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="bg-white/50 backdrop-blur border-violet-200 text-violet-700 animate-pulse">
                  Live Preview
               </Badge>
               <span className="text-xs text-muted-foreground">{likedTestimonials.length} testimonials approved</span>
            </div>
            {isCarousel && (
               <div className="text-xs text-muted-foreground">Carousel Mode</div>
            )}
         </div>

         <Card className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 overflow-hidden relative shadow-inner">
            <CardContent 
               ref={containerRef}
               className={`h-full w-full p-8 transition-colors duration-500 overflow-y-auto custom-scrollbar 
                 ${widgetSettings.theme === 'dark' ? 'bg-slate-950' : widgetSettings.theme === 'transparent' ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]' : 'bg-slate-50'}
               `}
            >
               {likedTestimonials.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <Star className="w-16 h-16 opacity-20 mb-4" />
                   <p>No approved testimonials yet.</p>
                 </div>
               ) : (
                 <>
                   {/* Carousel Controls */}
                   {isCarousel && likedTestimonials.length > visibleCount && (
                     <>
                       <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition-all"><ChevronLeft className="w-5 h-5 text-slate-700" /></button>
                       <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition-all"><ChevronRight className="w-5 h-5 text-slate-700" /></button>
                     </>
                   )}

                   <div 
                     key={widgetSettings.layout} // Force re-render on layout change
                     className="relative mx-auto transition-all duration-300"
                     style={isCarousel ? { width: maskWidth, overflow: 'hidden' } : { width: '100%', maxWidth: '1000px' }}
                   >
                      <motion.div
                        layout 
                        className={`
                          ${isCarousel ? 'flex gap-6 items-stretch py-12 px-2' : ''} 
                          ${widgetSettings.layout === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
                          ${widgetSettings.layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6' : ''}
                          ${widgetSettings.layout === 'list' ? 'max-w-2xl mx-auto flex flex-col gap-4' : ''}
                        `}
                        style={isCarousel ? { transform: `translateX(-${carouselIndex * (CARD_WIDTH + GAP)}px)`, transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' } : {}}
                      >
                         <AnimatePresence mode='wait'>
                            {(isCarousel ? likedTestimonials : likedTestimonials).map((testimonial, i) => (
                               <motion.div
                                 key={`${testimonial.id}-${replayTrigger}`} // Key change forces re-animation
                                 custom={i}
                                 initial="hidden"
                                 animate="visible"
                                 variants={getAnimationVariants()}
                                 className={getPreviewCardStyles()}
                               >
                                  {/* Testimonial Content */}
                                  <div className="flex items-center gap-1 mb-3">
                                     {[...Array(testimonial.rating || 5)].map((_, idx) => (
                                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                     ))}
                                  </div>

                                  {/* Content Wrapper */}
                                  <div className="flex-1 mb-4 flex flex-col">
                                    {testimonial.type === 'video' && testimonial.video_url ? (
                                       <StylishVideoPlayer videoUrl={testimonial.video_url} corners={widgetSettings.corners === 'sharp' ? 'rounded-none' : 'rounded-xl'} />
                                    ) : (
                                       <p className={`text-sm leading-relaxed line-clamp-6 whitespace-pre-line
                                          ${widgetSettings.testimonialStyle === 'bubble' 
                                            ? (widgetSettings.cardTheme === 'dark' ? 'p-4 bg-slate-800 text-slate-200 rounded-lg relative' : 'p-4 bg-slate-100 text-slate-800 rounded-lg relative') 
                                            : ''}
                                          ${widgetSettings.testimonialStyle === 'quote' 
                                            ? (widgetSettings.cardTheme === 'dark' ? 'pl-4 border-l-4 border-violet-400 italic text-slate-300' : 'pl-4 border-l-4 border-violet-400 italic text-slate-600') 
                                            : ''}
                                          ${widgetSettings.testimonialStyle === 'clean' ? 'opacity-90' : ''}
                                       `}>
                                          {testimonial.content}
                                       </p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 pt-4 border-t border-dashed border-gray-200/10 mt-auto">
                                     {/* AVATAR WITH ZOOM */}
                                     <Avatar className="w-12 h-12 border border-white/20 overflow-hidden shrink-0">
                                        <AvatarImage 
                                           src={testimonial.respondent_photo_url} 
                                           className="w-full h-full object-cover scale-110" 
                                        />
                                        <AvatarFallback className="bg-violet-100 text-violet-700 text-xs">{testimonial.respondent_name?.charAt(0)}</AvatarFallback>
                                     </Avatar>
                                     <div>
                                        <div className={`font-bold ${getNameSizeClass()} flex items-center gap-1.5`}>
                                           {testimonial.respondent_name}
                                           <BadgeCheck className="w-4 h-4 text-white fill-blue-500 shrink-0" />
                                        </div>
                                        <div className="text-[10px] opacity-70">{testimonial.respondent_role || 'Verified User'}</div>
                                     </div>
                                  </div>
                               </motion.div>
                            ))}
                         </AnimatePresence>
                      </motion.div>
                   </div>
                 </>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default WidgetTab;