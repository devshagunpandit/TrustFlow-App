import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

// Constants shared across components
export const CARD_WIDTH = 300; 
export const GAP = 24; 
export const PADDING_X = 48; 

// --- StylishVideoPlayer ---
export const StylishVideoPlayer = ({ videoUrl, corners = 'rounded-xl' }) => {
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

// --- Premium Toggle Component ---
export const PremiumToggle = ({ options, current, onChange, id }) => (
  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg relative isolate">
    {options.map((opt) => {
      const Icon = opt.icon;
      const isActive = current === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          type="button"
          className={`
            relative flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium transition-colors z-10
            ${isActive ? 'text-violet-700 dark:text-violet-300' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
          `}
        >
          {isActive && (
            <motion.span
              layoutId={`active-pill-${id}`}
              className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm border border-black/5 dark:border-white/5 -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span className="capitalize whitespace-nowrap">{opt.label}</span>
        </button>
      );
    })}
  </div>
);

// --- Section Header ---
export const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
    <Icon className="w-3.5 h-3.5" />
    {title}
  </div>
);