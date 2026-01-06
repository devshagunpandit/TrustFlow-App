import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom'; 
import { supabase } from '@/lib/supabase';
import { Star, Play, ChevronLeft, ChevronRight, Quote, MessageSquare } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import '@/index.css';

const CARD_WIDTH = 300; 
const GAP = 24; 
const PADDING_X = 32; 

// --- Custom Video Player Component ---
const StylishVideoPlayer = ({ videoUrl, corners = 'rounded-xl' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className={`relative overflow-hidden bg-black shadow-md ring-1 ring-black/5 aspect-video mb-4 ${corners}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        controls={isPlaying} 
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors backdrop-blur-[1px] cursor-pointer z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-all"
            >
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WallOfLove = () => {
  const { spaceId } = useParams(); 
  const [searchParams] = useSearchParams();
  const outerContainerRef = useRef(null); 
  
  // State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [maskWidth, setMaskWidth] = useState('100%');
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Parse Settings from URL (With Defaults) ---
  const settings = {
    layout: searchParams.get('layout') || 'grid',
    theme: searchParams.get('theme') || 'light',
    cardTheme: searchParams.get('card-theme') || 'light',
    corners: searchParams.get('corners') || 'smooth',
    shadow: searchParams.get('shadow') || 'medium',
    border: searchParams.get('border') !== 'false', // Default true
    hoverEffect: searchParams.get('hover-effect') || 'lift',
    nameSize: searchParams.get('name-size') || 'medium',
    testimonialStyle: searchParams.get('testimonial-style') || 'clean',
    animation: searchParams.get('animation') || 'fade',
    speed: searchParams.get('speed') || 'normal',
  };

  // --- 1. Transparent Background Setup ---
  useEffect(() => {
    document.body.classList.add('force-transparent');
    document.documentElement.classList.add('force-transparent'); 
    return () => {
      document.body.classList.remove('force-transparent');
      document.documentElement.classList.remove('force-transparent');
    };
  }, []);

  // --- 2. Fetch Data ---
  useEffect(() => {
    if (spaceId) fetchTestimonials();
  }, [spaceId]);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('space_id', spaceId)
        .eq('is_liked', true) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Resize Logic ---
  useEffect(() => {
    const handleResize = () => {
      if (outerContainerRef.current) {
        // Report Height to Parent (Iframe)
        const height = outerContainerRef.current.scrollHeight;
        window.parent.postMessage({ type: 'trustflow-resize', height }, '*');

        // Smart Carousel Calculation
        if (settings.layout === 'carousel') {
          const rect = outerContainerRef.current.getBoundingClientRect();
          const availableWidth = rect.width - PADDING_X; 
          
          const count = Math.floor((availableWidth + GAP) / (CARD_WIDTH + GAP));
          const safeCount = Math.max(1, count); 
          
          setVisibleCount(safeCount);
          
          // Strict Fit: width + buffer for side shadows
          const exactWidth = (safeCount * CARD_WIDTH) + ((safeCount - 1) * GAP);
          setMaskWidth(`${exactWidth + 10}px`);
        } else {
          setMaskWidth('100%');
        }
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (outerContainerRef.current) {
      observer.observe(outerContainerRef.current);
    }

    return () => observer.disconnect();
  }, [testimonials, settings.layout, loading]);

  // --- 4. Helper Functions (Style Logic) ---

  const getCardStyles = () => {
    const { cardTheme, layout, corners, shadow, border, hoverEffect } = settings;
    
    // Base classes (Important: flex-col for alignment)
    let classes = 'p-6 transition-all duration-300 flex flex-col ';
    
    // Sizing Logic: Grid/Carousel = Strict Height, Masonry = Auto Height
    if (layout === 'masonry' || layout === 'list') {
      classes += 'h-auto ';
    } else {
      classes += '!h-full '; 
    }
    
    // Corners
    if (corners === 'sharp') classes += 'rounded-none ';
    else if (corners === 'round') classes += 'rounded-3xl ';
    else classes += 'rounded-xl ';

    // Shadow
    if (shadow === 'none') classes += 'shadow-none ';
    else if (shadow === 'light') classes += 'shadow-sm ';
    else if (shadow === 'strong') classes += 'shadow-xl ';
    else classes += 'shadow-md ';

    // Hover Effects
    if (hoverEffect === 'lift') classes += 'hover:-translate-y-1 hover:shadow-lg ';
    else if (hoverEffect === 'scale') classes += 'hover:scale-[1.02] hover:shadow-lg ';
    else if (hoverEffect === 'glow') classes += 'hover:shadow-violet-500/20 hover:border-violet-300 ';

    // Card Theme & Border
    if (cardTheme === 'dark') {
      classes += 'bg-slate-900 text-slate-100 ';
      classes += border ? 'border border-slate-800 ' : 'border-0 ';
    } else {
      classes += 'bg-white text-slate-800 ';
      classes += border ? 'border border-slate-100 ' : 'border-0 ';
    }

    // Layout Specific Widths
    if (layout === 'masonry') {
      classes += 'break-inside-avoid mb-6 inline-block w-full ';
    } else if (layout === 'carousel') {
      classes += 'flex-shrink-0 w-[300px] '; 
    } else if (layout === 'list') {
      classes += 'w-full mb-4 ';
    }

    return classes;
  };

  const getNameSizeClass = () => {
    switch (settings.nameSize) {
      case 'small': return 'text-xs';
      case 'large': return 'text-base';
      default: return 'text-sm';
    }
  };

  const getAnimationVariants = () => {
    const { animation, speed } = settings;
    const durations = { slow: 0.8, normal: 0.5, fast: 0.3 };
    const dur = durations[speed] || 0.5;
    const stagger = speed === 'fast' ? 0.05 : 0.1;

    switch(animation) {
      case 'slideUp': return { hidden: { opacity: 0, y: 50 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * stagger, duration: dur } }) };
      case 'slideDown': return { hidden: { opacity: 0, y: -50 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * stagger, duration: dur } }) };
      case 'scale': return { hidden: { opacity: 0, scale: 0.8 }, visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * stagger, duration: dur } }) };
      case 'pop': return { hidden: { opacity: 0, scale: 0.5 }, visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * stagger, type: 'spring', stiffness: 300 } }) };
      case 'flip': return { hidden: { opacity: 0, rotateX: 90 }, visible: (i) => ({ opacity: 1, rotateX: 0, transition: { delay: i * stagger, duration: dur } }) };
      case 'elastic': return { hidden: { opacity: 0, x: -100 }, visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * stagger, type: 'spring', bounce: 0.6 } }) };
      case 'none': return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
      default: return { hidden: { opacity: 0 }, visible: (i) => ({ opacity: 1, transition: { delay: i * stagger, duration: dur } }) }; // fade
    }
  };

  // --- 5. Navigation ---
  const handleNext = () => {
    const maxIndex = Math.max(0, testimonials.length - visibleCount);
    if (carouselIndex >= maxIndex) setCarouselIndex(0);
    else setCarouselIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    const maxIndex = Math.max(0, testimonials.length - visibleCount);
    if (carouselIndex <= 0) setCarouselIndex(maxIndex);
    else setCarouselIndex((prev) => prev - 1);
  };

  if (loading) return <div className="p-4 text-center"></div>;

  if (testimonials.length === 0) {
    return (
      <div ref={outerContainerRef} className="p-8 text-center text-gray-500 font-sans">
        <p>No testimonials yet</p>
      </div>
    );
  }

  const isCarousel = settings.layout === 'carousel';

  return (
    <div ref={outerContainerRef} className="bg-transparent w-full relative group font-sans">
      
      {/* Navigation Buttons */}
      {isCarousel && testimonials.length > visibleCount && (
        <>
          <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:scale-110 text-gray-700 dark:text-gray-200">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:scale-110 text-gray-700 dark:text-gray-200">
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Main Container */}
      <div 
        className="relative mx-auto transition-[width] duration-300 ease-in-out"
        style={isCarousel ? { width: maskWidth, overflow: 'hidden' } : { width: '100%' }}
      >
        <motion.div 
          className={`
            ${isCarousel ? 'flex gap-6 items-stretch py-12 px-2' : ''} /* Padding for shadows */
            ${settings.layout === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4' : ''}
            ${settings.layout === 'masonry' ? 'block columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 p-4' : ''}
            ${settings.layout === 'list' ? 'max-w-2xl mx-auto flex flex-col gap-4 p-4' : ''}
          `}
          style={isCarousel ? { transform: `translateX(-${carouselIndex * (CARD_WIDTH + GAP)}px)`, transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' } : {}}
        >
          <AnimatePresence mode="wait">
            {(isCarousel ? testimonials : testimonials).map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={getAnimationVariants()}
                className={getCardStyles()}
              >
                {/* Rating */}
                {testimonial.rating && ( 
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                )}

                {/* Content Wrapper - Handles Styles */}
                <div className="flex-1 mb-4 flex flex-col">
                  {testimonial.type === 'video' && testimonial.video_url ? (
                    <StylishVideoPlayer videoUrl={testimonial.video_url} corners={settings.corners === 'sharp' ? 'rounded-none' : 'rounded-xl'} />
                  ) : (
                    <p className={`text-sm leading-relaxed line-clamp-6 whitespace-pre-line
                      ${settings.testimonialStyle === 'bubble' 
                        ? (settings.cardTheme === 'dark' ? 'p-4 bg-slate-800 text-slate-200 rounded-lg relative' : 'p-4 bg-slate-100 text-slate-800 rounded-lg relative') 
                        : ''}
                      ${settings.testimonialStyle === 'quote' 
                        ? (settings.cardTheme === 'dark' ? 'pl-4 border-l-4 border-violet-400 italic text-slate-300' : 'pl-4 border-l-4 border-violet-400 italic text-slate-600') 
                        : ''}
                      ${settings.testimonialStyle === 'clean' ? 'opacity-90' : ''}
                    `}>
                      {testimonial.content}
                    </p>
                  )}
                </div>

                {/* Author Footer */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-dashed border-gray-200/10">
                  <Avatar className="w-8 h-8 border border-white/20">
                    <AvatarImage src={testimonial.respondent_photo_url} />
                    <AvatarFallback className="bg-violet-100 text-violet-700 text-xs">{testimonial.respondent_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className={`font-bold ${getNameSizeClass()}`}>
                      {testimonial.respondent_name || "Anonymous"}
                    </div>
                    {/* UPDATED: Displays 'Verified User' if respondent_role is missing */}
                    <div className={`text-[10px] opacity-70`}>
                      {testimonial.respondent_role || 'Verified User'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default WallOfLove;