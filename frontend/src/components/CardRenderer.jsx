// ============================================
// TRUSTFLOW - CARD RENDERER COMPONENT
// 12 Unique Structural Card Layouts
// ============================================

import React, { useState, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Play, BadgeCheck, Quote, MessageCircle, Twitter, CheckCircle } from 'lucide-react';

// === VIDEO PLAYER COMPONENT ===
const VideoPlayer = ({ videoUrl, corners = 'rounded-xl', className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (videoRef.current) videoRef.current.play();
  };

  return (
    <div className={`relative overflow-hidden bg-black shadow-md ring-1 ring-black/5 ${corners} ${className}`}>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors backdrop-blur-[1px] cursor-pointer z-10"
          >
            <motion.div
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg"
            >
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// === STAR RATING COMPONENT ===
const StarRating = ({ rating, size = 'sm', className = '' }) => {
  const sizeClasses = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`${sizeClasses[size]} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

// ============================================
// CARD LAYOUT PRESETS
// ============================================

export const CARD_STYLE_PRESETS = [
  {
    id: 'x-social',
    name: 'X-Social (Tweet)',
    description: 'Twitter/X inspired card with verified badge and social feel',
    category: 'social',
    icon: '𝕏'
  },
  {
    id: 'video-spotlight',
    name: 'Video Spotlight',
    description: 'Media-first layout with 70% video coverage',
    category: 'video',
    icon: '🎬'
  },
  {
    id: 'modern-bento',
    name: 'Modern Bento',
    description: 'Grid-style informational blocks layout',
    category: 'modern',
    icon: '🍱'
  },
  {
    id: 'speech-bubble',
    name: 'Speech Bubble',
    description: 'Chat UI style with tail pointing to avatar',
    category: 'creative',
    icon: '💬'
  },
  {
    id: 'full-background',
    name: 'Full Background',
    description: 'Photo/video as card background with overlay text',
    category: 'premium',
    icon: '🖼️'
  },
  {
    id: 'minimalist-split',
    name: 'Minimalist Split',
    description: 'Vertical split with avatar left, content right',
    category: 'modern',
    icon: '⬜'
  },
  {
    id: 'testimonial-hero',
    name: 'Testimonial Hero',
    description: 'Large quote with signed-by style footer',
    category: 'premium',
    icon: '✍️'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    description: '9:16 vertical card with story-like design',
    category: 'social',
    icon: '📱'
  },
  {
    id: 'neumorphic-inset',
    name: 'Neumorphic Inset',
    description: 'Soft UI with inset text and raised elements',
    category: 'premium',
    icon: '🔘'
  },
  {
    id: 'gradient-stroke',
    name: 'Gradient Stroke',
    description: 'Simple card with animated gradient border',
    category: 'creative',
    icon: '🌈'
  },
  {
    id: 'vertical-magazine',
    name: 'Vertical Magazine',
    description: 'Premium magazine-style vertical layout',
    category: 'premium',
    icon: '📰'
  },
  {
    id: 'floating-badge',
    name: 'Floating Badge',
    description: 'Avatar floating outside card boundary',
    category: 'creative',
    icon: '🎯'
  }
];

// ============================================
// INDIVIDUAL CARD LAYOUTS
// ============================================

// 1. X-Social (Tweet Structure)
const XSocialCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering XSocialCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        p-4 sm:p-5 rounded-2xl transition-all duration-300
        ${isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900 border border-slate-200'}
        hover:shadow-lg ${className}
      `}
      whileHover={{ y: -2 }}
    >
      {/* Header: Profile Info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src={testimonial.respondent_photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-600 text-white">
              {testimonial.respondent_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base">{testimonial.respondent_name}</span>
              <BadgeCheck className="w-4 h-4 text-sky-500 fill-sky-500" />
            </div>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              @{testimonial.respondent_name?.toLowerCase().replace(/\s/g, '')}
            </span>
          </div>
        </div>
        <div className="text-sky-500">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        {testimonial.type === 'video' && testimonial.video_url ? (
          <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-xl" className="aspect-video" />
        ) : (
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {testimonial.content}
          </p>
        )}
      </div>

      {/* Footer: Date & Interactions */}
      <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {new Date(testimonial.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        {testimonial.rating && <StarRating rating={testimonial.rating} size="xs" />}
      </div>
    </motion.div>
  );
});

// 2. Video Spotlight (Media First)
const VideoSpotlightCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering VideoSpotlightCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300
        ${isDark ? 'bg-slate-900' : 'bg-white'}
        shadow-xl hover:shadow-2xl ${className}
      `}
      style={{ minHeight: '320px' }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Video/Image Background - 70% */}
      <div className="relative h-[70%] min-h-[220px]">
        {testimonial.type === 'video' && testimonial.video_url ? (
          <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-none" className="w-full h-full" />
        ) : testimonial.respondent_photo_url ? (
          <img 
            src={testimonial.respondent_photo_url} 
            alt={testimonial.respondent_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600" />
        )}
      </div>

      {/* Glassmorphic Overlay */}
      <div className={`
        absolute bottom-0 left-0 right-0 p-4 sm:p-5
        bg-gradient-to-t ${isDark ? 'from-slate-900 via-slate-900/95' : 'from-white via-white/95'} to-transparent
        backdrop-blur-md
      `}>
        <p className={`text-sm line-clamp-2 mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {testimonial.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border-2 border-white shadow-md">
              <AvatarImage src={testimonial.respondent_photo_url} />
              <AvatarFallback className="bg-violet-500 text-white text-xs">
                {testimonial.respondent_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {testimonial.respondent_name}
            </span>
          </div>
          {testimonial.rating && <StarRating rating={testimonial.rating} size="xs" />}
        </div>
      </div>
    </motion.div>
  );
});

// 3. Modern Bento (Grid Style)
const ModernBentoCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering ModernBentoCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        rounded-3xl overflow-hidden transition-all duration-300
        ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}
        shadow-lg hover:shadow-xl ${className}
      `}
      whileHover={{ y: -4 }}
    >
      <div className="grid grid-cols-3 gap-1 p-1">
        {/* Avatar Block */}
        <div className={`
          col-span-1 row-span-2 rounded-2xl overflow-hidden
          ${isDark ? 'bg-slate-800' : 'bg-slate-100'}
          flex items-center justify-center p-4
        `}>
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
            <AvatarImage src={testimonial.respondent_photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl">
              {testimonial.respondent_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name Block */}
        <div className={`
          col-span-2 rounded-2xl p-3 sm:p-4
          ${isDark ? 'bg-slate-800' : 'bg-slate-100'}
        `}>
          <h4 className="font-bold text-sm sm:text-base truncate">{testimonial.respondent_name}</h4>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {testimonial.respondent_role || 'Verified Customer'}
          </p>
        </div>

        {/* Rating Block */}
        <div className={`
          col-span-2 rounded-2xl p-3 sm:p-4
          ${isDark ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20' : 'bg-gradient-to-r from-amber-50 to-orange-50'}
          flex items-center justify-center
        `}>
          {testimonial.rating ? (
            <StarRating rating={testimonial.rating} size="md" />
          ) : (
            <Badge variant="secondary" className="bg-green-100 text-green-700">Verified</Badge>
          )}
        </div>

        {/* Content Block */}
        <div className={`
          col-span-3 rounded-2xl p-4 sm:p-5
          ${isDark ? 'bg-slate-800' : 'bg-slate-100'}
        `}>
          {testimonial.type === 'video' && testimonial.video_url ? (
            <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-xl" className="aspect-video" />
          ) : (
            <p className="text-sm leading-relaxed line-clamp-4">{testimonial.content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// 4. Speech Bubble (Chat UI)
const SpeechBubbleCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering SpeechBubbleCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`flex flex-col transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      {/* Bubble */}
      <div className={`
        relative p-5 sm:p-6 rounded-2xl rounded-bl-md mb-4
        ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}
        shadow-lg
      `}>
        {/* Tail */}
        <div className={`
          absolute -bottom-3 left-6 w-0 h-0
          border-l-[12px] border-l-transparent
          border-r-[12px] border-r-transparent
          border-t-[12px] ${isDark ? 'border-t-slate-800' : 'border-t-slate-100'}
        `} />
        
        {testimonial.rating && <StarRating rating={testimonial.rating} size="sm" className="mb-3" />}
        
        {testimonial.type === 'video' && testimonial.video_url ? (
          <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-xl" className="aspect-video" />
        ) : (
          <p className="text-sm sm:text-base leading-relaxed">
            <MessageCircle className="w-4 h-4 inline-block mr-2 opacity-50" />
            {testimonial.content}
          </p>
        )}
      </div>

      {/* Respondent */}
      <div className="flex items-center gap-3 pl-2">
        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white shadow-md">
          <AvatarImage src={testimonial.respondent_photo_url} />
          <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-600 text-white">
            {testimonial.respondent_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {testimonial.respondent_name}
          </h4>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {testimonial.respondent_role || 'Verified Customer'}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

// 5. Full Background Image/Video
const FullBackgroundCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  console.log('[CardRenderer] Rendering FullBackgroundCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300
        min-h-[280px] sm:min-h-[320px]
        shadow-xl hover:shadow-2xl ${className}
      `}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background */}
      {testimonial.type === 'video' && testimonial.video_url ? (
        <video 
          src={testimonial.video_url} 
          className="absolute inset-0 w-full h-full object-cover"
          muted loop autoPlay playsInline
        />
      ) : testimonial.respondent_photo_url ? (
        <img 
          src={testimonial.respondent_photo_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-800" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center text-white">
        {testimonial.rating && <StarRating rating={testimonial.rating} size="md" className="mb-4" />}
        
        <p className="text-lg sm:text-xl font-medium leading-relaxed mb-6 max-w-sm">
          "{testimonial.content}"
        </p>

        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white/50">
            <AvatarImage src={testimonial.respondent_photo_url} />
            <AvatarFallback className="bg-white/20 text-white">
              {testimonial.respondent_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <h4 className="font-semibold text-sm">{testimonial.respondent_name}</h4>
            <p className="text-xs text-white/70">{testimonial.respondent_role || 'Verified'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// 6. Minimalist Split
const MinimalistSplitCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering MinimalistSplitCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        flex rounded-2xl overflow-hidden transition-all duration-300
        ${isDark ? 'bg-slate-900' : 'bg-white'}
        shadow-lg hover:shadow-xl ${className}
      `}
      whileHover={{ y: -2 }}
    >
      {/* Left: Avatar */}
      <div className={`
        w-1/3 min-w-[100px] flex items-center justify-center
        ${isDark ? 'bg-slate-800' : 'bg-slate-100'}
      `}>
        <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
          <AvatarImage src={testimonial.respondent_photo_url} />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
            {testimonial.respondent_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Right: Content */}
      <div className={`flex-1 p-5 sm:p-6 flex flex-col justify-between ${isDark ? 'text-white' : 'text-slate-800'}`}>
        {testimonial.rating && <StarRating rating={testimonial.rating} size="sm" className="mb-3" />}
        
        {testimonial.type === 'video' && testimonial.video_url ? (
          <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-lg" className="aspect-video mb-3" />
        ) : (
          <p className="text-sm leading-relaxed line-clamp-4 mb-4 flex-1">{testimonial.content}</p>
        )}

        <div className={`pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <h4 className="font-bold text-sm">{testimonial.respondent_name}</h4>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {testimonial.respondent_role || 'Verified Customer'}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

// 7. Testimonial Hero
const TestimonialHeroCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering TestimonialHeroCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        p-6 sm:p-8 rounded-2xl transition-all duration-300
        ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}
        shadow-xl hover:shadow-2xl ${className}
      `}
      whileHover={{ y: -4 }}
    >
      {/* Large Quote Icon */}
      <Quote className={`w-10 h-10 sm:w-12 sm:h-12 mb-4 ${isDark ? 'text-violet-400' : 'text-violet-500'} opacity-50`} />

      {/* Main Content - Hero Style */}
      {testimonial.type === 'video' && testimonial.video_url ? (
        <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-xl" className="aspect-video mb-6" />
      ) : (
        <p className="text-xl sm:text-2xl font-serif leading-relaxed mb-8">
          {testimonial.content}
        </p>
      )}

      {testimonial.rating && <StarRating rating={testimonial.rating} size="md" className="mb-6" />}

      {/* Signed By Footer */}
      <div className="flex items-center justify-end gap-3">
        <div className="text-right">
          <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'} mb-1`}>
            — Signed by
          </p>
          <h4 className="font-bold text-sm sm:text-base">{testimonial.respondent_name}</h4>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {testimonial.respondent_role || 'Verified Customer'}
          </p>
        </div>
        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-violet-200">
          <AvatarImage src={testimonial.respondent_photo_url} />
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            {testimonial.respondent_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    </motion.div>
  );
});

// 8. Instagram Story Card
const InstagramStoryCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  console.log('[CardRenderer] Rendering InstagramStoryCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300
        shadow-xl hover:shadow-2xl ${className}
      `}
      style={{ aspectRatio: '9/16', maxHeight: '500px' }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background */}
      {testimonial.type === 'video' && testimonial.video_url ? (
        <video 
          src={testimonial.video_url} 
          className="absolute inset-0 w-full h-full object-cover"
          muted loop autoPlay playsInline
        />
      ) : testimonial.respondent_photo_url ? (
        <img 
          src={testimonial.respondent_photo_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Story Progress Bar (Static) */}
      <div className="absolute top-3 left-3 right-3 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className={`h-0.5 flex-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`} 
          />
        ))}
      </div>

      {/* Top Header */}
      <div className="absolute top-8 left-0 right-0 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 border-2 border-pink-500">
            <AvatarImage src={testimonial.respondent_photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs">
              {testimonial.respondent_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-medium text-sm">{testimonial.respondent_name}</span>
          <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400" />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        {testimonial.rating && <StarRating rating={testimonial.rating} size="sm" className="mb-3" />}
        <p className="text-sm leading-relaxed line-clamp-5">{testimonial.content}</p>
      </div>
    </motion.div>
  );
});

// 9. Neumorphic Inset
const NeumorphicInsetCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-slate-800' : 'bg-slate-100';
  
  console.log('[CardRenderer] Rendering NeumorphicInsetCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        p-5 sm:p-6 rounded-3xl transition-all duration-300
        ${bgColor} ${isDark ? 'text-white' : 'text-slate-800'}
        ${className}
      `}
      style={{
        boxShadow: isDark 
          ? '8px 8px 16px #1e293b, -8px -8px 16px #334155'
          : '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff'
      }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Inset Content Area */}
      <div 
        className="p-4 sm:p-5 rounded-2xl mb-4"
        style={{
          boxShadow: isDark
            ? 'inset 4px 4px 8px #1e293b, inset -4px -4px 8px #334155'
            : 'inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff'
        }}
      >
        {testimonial.type === 'video' && testimonial.video_url ? (
          <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-xl" className="aspect-video" />
        ) : (
          <p className="text-sm leading-relaxed">{testimonial.content}</p>
        )}
      </div>

      {/* Raised Footer */}
      <div 
        className="flex items-center justify-between p-3 rounded-xl"
        style={{
          boxShadow: isDark
            ? '4px 4px 8px #1e293b, -4px -4px 8px #334155'
            : '4px 4px 8px #d1d5db, -4px -4px 8px #ffffff'
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={testimonial.respondent_photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white">
              {testimonial.respondent_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm">{testimonial.respondent_name}</h4>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {testimonial.respondent_role || 'Verified'}
            </p>
          </div>
        </div>
        {testimonial.rating && <StarRating rating={testimonial.rating} size="xs" />}
      </div>
    </motion.div>
  );
});

// 10. Gradient Stroke
const GradientStrokeCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering GradientStrokeCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`relative p-[3px] rounded-2xl transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #10b981, #8b5cf6)',
        backgroundSize: '300% 300%',
        animation: 'gradient-rotate 4s ease infinite'
      }}
      whileHover={{ scale: 1.02 }}
    >
      <style>{`
        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <div className={`
        p-5 sm:p-6 rounded-[13px] h-full
        ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}
      `}>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src={testimonial.respondent_photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500 text-white">
              {testimonial.respondent_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
              {testimonial.respondent_name}
              <BadgeCheck className="w-4 h-4 text-violet-500 fill-violet-500" />
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {testimonial.respondent_role || 'Verified Customer'}
            </p>
          </div>
        </div>

        {testimonial.rating && <StarRating rating={testimonial.rating} size="sm" className="mb-3" />}

        {testimonial.type === 'video' && testimonial.video_url ? (
          <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-xl" className="aspect-video" />
        ) : (
          <p className="text-sm leading-relaxed text-center">{testimonial.content}</p>
        )}
      </div>
    </motion.div>
  );
});

// 11. Vertical Magazine
const VerticalMagazineCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering VerticalMagazineCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300
        ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}
        shadow-xl hover:shadow-2xl ${className}
      `}
      whileHover={{ y: -4 }}
    >
      {/* Vertical Name Strip */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-12 sm:w-14 flex items-center justify-center
        ${isDark ? 'bg-gradient-to-b from-violet-600 to-purple-700' : 'bg-gradient-to-b from-violet-500 to-purple-600'}
      `}>
        <span 
          className="text-white font-black text-sm sm:text-base tracking-widest uppercase"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
        >
          {testimonial.respondent_name}
        </span>
      </div>

      {/* Main Content */}
      <div className="ml-12 sm:ml-14 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-violet-200">
            <AvatarImage src={testimonial.respondent_photo_url} />
            <AvatarFallback className="bg-slate-200 text-slate-600">
              {testimonial.respondent_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              Featured Review
            </p>
            {testimonial.rating && <StarRating rating={testimonial.rating} size="sm" className="mt-1" />}
          </div>
        </div>

        {testimonial.type === 'video' && testimonial.video_url ? (
          <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-lg" className="aspect-video" />
        ) : (
          <p className="text-sm sm:text-base leading-relaxed font-serif italic">
            "{testimonial.content}"
          </p>
        )}

        <p className={`mt-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {testimonial.respondent_role || 'Verified Customer'} • {new Date(testimonial.created_at).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
});

// 12. Floating Badge
const FloatingBadgeCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  console.log('[CardRenderer] Rendering FloatingBadgeCard:', testimonial?.id);
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`relative pt-8 transition-all duration-300 ${className}`}
      whileHover={{ y: -4 }}
    >
      {/* Floating Avatar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <Avatar className="w-16 h-16 border-4 border-white shadow-xl">
          <AvatarImage src={testimonial.respondent_photo_url} />
          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xl">
            {testimonial.respondent_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Card Body */}
      <div className={`
        pt-12 pb-6 px-6 rounded-2xl
        ${isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-800 border border-slate-100'}
        shadow-lg
      `}>
        <div className="text-center mb-4">
          <h4 className="font-bold text-base">{testimonial.respondent_name}</h4>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {testimonial.respondent_role || 'Verified Customer'}
          </p>
        </div>

        {testimonial.rating && (
          <div className="flex justify-center mb-4">
            <StarRating rating={testimonial.rating} size="sm" />
          </div>
        )}

        {testimonial.type === 'video' && testimonial.video_url ? (
          <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-xl" className="aspect-video" />
        ) : (
          <p className="text-sm text-center leading-relaxed">{testimonial.content}</p>
        )}
      </div>
    </motion.div>
  );
});

// ============================================
// MAIN CARD RENDERER
// ============================================

const CARD_COMPONENTS = {
  'x-social': XSocialCard,
  'video-spotlight': VideoSpotlightCard,
  'modern-bento': ModernBentoCard,
  'speech-bubble': SpeechBubbleCard,
  'full-background': FullBackgroundCard,
  'minimalist-split': MinimalistSplitCard,
  'testimonial-hero': TestimonialHeroCard,
  'instagram-story': InstagramStoryCard,
  'neumorphic-inset': NeumorphicInsetCard,
  'gradient-stroke': GradientStrokeCard,
  'vertical-magazine': VerticalMagazineCard,
  'floating-badge': FloatingBadgeCard
};

// Default Card (fallback)
const DefaultCard = forwardRef(({ testimonial, theme = 'light', className = '', onClick }, ref) => {
  const isDark = theme === 'dark';
  
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={`
        p-5 rounded-xl transition-all duration-300
        ${isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-800 border border-slate-200'}
        shadow-md hover:shadow-lg ${className}
      `}
      whileHover={{ y: -2 }}
    >
      {testimonial.rating && <StarRating rating={testimonial.rating} size="sm" className="mb-3" />}
      
      {testimonial.type === 'video' && testimonial.video_url ? (
        <VideoPlayer videoUrl={testimonial.video_url} corners="rounded-lg" className="aspect-video mb-4" />
      ) : (
        <p className="text-sm leading-relaxed mb-4">{testimonial.content}</p>
      )}

      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={testimonial.respondent_photo_url} />
          <AvatarFallback className="bg-violet-100 text-violet-700">
            {testimonial.respondent_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-sm">{testimonial.respondent_name}</h4>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {testimonial.respondent_role || 'Verified Customer'}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

// Main Export Component
const CardRenderer = forwardRef(({ 
  testimonial, 
  cardStyle = 'default', 
  theme = 'light',
  className = '',
  onClick
}, ref) => {
  console.log('[CardRenderer] Rendering card with style:', cardStyle, 'for testimonial:', testimonial?.id);
  
  if (!testimonial) {
    console.warn('[CardRenderer] No testimonial provided');
    return null;
  }

  const CardComponent = CARD_COMPONENTS[cardStyle] || DefaultCard;
  
  return (
    <CardComponent
      ref={ref}
      testimonial={testimonial}
      theme={theme}
      className={className}
      onClick={onClick}
    />
  );
});

CardRenderer.displayName = 'CardRenderer';

export { 
  CardRenderer, 
  CARD_COMPONENTS, 
  StarRating, 
  VideoPlayer,
  // Individual exports for direct use
  XSocialCard,
  VideoSpotlightCard,
  ModernBentoCard,
  SpeechBubbleCard,
  FullBackgroundCard,
  MinimalistSplitCard,
  TestimonialHeroCard,
  InstagramStoryCard,
  NeumorphicInsetCard,
  GradientStrokeCard,
  VerticalMagazineCard,
  FloatingBadgeCard
};

export default CardRenderer;
