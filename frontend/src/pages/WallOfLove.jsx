import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Star, Play } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import '@/index.css';

// --- Custom Video Player Component ---
// This component ONLY handles the video element styles/interactions
const StylishVideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-black shadow-md ring-1 ring-black/5 aspect-video mb-4">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        // Native controls only appear when playing
        controls={isPlaying} 
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        // Sync UI state with video state
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Custom Overlay - Only appears when NOT playing */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors backdrop-blur-[1px] cursor-pointer z-10"
          >
            {/* Play Button */}
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
  const containerRef = useRef(null); 
  
  const theme = searchParams.get('theme') || 'light';
  const layout = searchParams.get('layout') || 'grid';
  console.log('Layout:', layout, 'Theme:', theme, 'Space ID:', spaceId);

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add('force-transparent');
    document.documentElement.classList.add('force-transparent'); 

    return () => {
      document.body.classList.remove('force-transparent');
      document.documentElement.classList.remove('force-transparent');
    };
  }, []);

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

  useEffect(() => {
    const sendHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.scrollHeight;
        window.parent.postMessage({ type: 'trustflow-resize', height }, '*');
      }
    };

    sendHeight();
    const resizeObserver = new ResizeObserver(() => sendHeight());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [testimonials, layout, loading]);

  if (loading) return <div className="p-4 text-center"></div>;

  if (testimonials.length === 0) {
    return (
      <div ref={containerRef} className="p-8 text-center text-gray-500">
        <p>No testimonials yet</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="p-4 bg-transparent overflow-hidden">
      <div className={`
        ${layout === 'masonry' ? 'block' : 'grid'} 
        gap-6
        ${
          layout === 'carousel' 
            ? 'grid-flow-col auto-cols-[300px] overflow-x-auto pb-4' 
            : layout === 'masonry'
            ? 'columns-1 md:columns-2 lg:columns-3 space-y-6'
            : 'md:grid-cols-2 lg:grid-cols-3'
        }
      `}>
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            // ORIGINAL CARD STYLING RESTORED
            className={`
              p-6 rounded-xl shadow-sm border transition-all hover:shadow-md
              ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-800'} 
              ${layout === 'masonry' ? 'break-inside-avoid mb-6 inline-block w-full' : ''}
            `}
          >
            {/* Rating */}
            {testimonial.rating && ( 
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            {testimonial.type === 'video' && testimonial.video_url ? (
              // Replaced only the video tag with the Custom Component
              <StylishVideoPlayer videoUrl={testimonial.video_url} />
            ) : (
              <p className={`text-sm mb-4 leading-relaxed opacity-90`}>
                "{testimonial.content}"
              </p>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 mt-auto">
              {testimonial.respondent_photo_url ? (
                <img 
                  src={testimonial.respondent_photo_url} 
                  alt={testimonial.respondent_name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                // Original Avatar Styling Restored
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  theme === 'dark' 
                    ? 'bg-violet-900/50 text-violet-300' 
                    : 'bg-violet-100 text-violet-600'
                }`}>
                  {testimonial.respondent_name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
              
              <div>
                <div className={`font-medium text-sm`}>
                  {testimonial.respondent_name || "Anonymous"}
                </div>
                {testimonial.respondent_role && (
                  <div className={`text-xs opacity-70`}>
                    {testimonial.respondent_role}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallOfLove;