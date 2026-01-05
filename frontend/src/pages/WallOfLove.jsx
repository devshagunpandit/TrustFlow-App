import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom'; 
import { supabase } from '@/lib/supabase';
import { Star } from 'lucide-react';
import '@/index.css';

const WallOfLove = () => {
  const { spaceId } = useParams(); 
  const [searchParams] = useSearchParams();
  const containerRef = useRef(null); // Ref to measure height
  
  const theme = searchParams.get('theme') || 'light';
  const layout = searchParams.get('layout') || 'grid';
  console.log('Layout:', layout, 'Theme:', theme, 'Space ID:', spaceId);

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When this component mounts (widget loads):
    document.body.classList.add('force-transparent');
    document.documentElement.classList.add('force-transparent'); // Adds to <html> tag too

    // When this component unmounts (cleanup):
    return () => {
      document.body.classList.remove('force-transparent');
      document.documentElement.classList.remove('force-transparent');
    };
  }, []);

  // 1. Fetch Data
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

  // 2. AUTO-RESIZE LOGIC (Added this block)
  useEffect(() => {
    const sendHeight = () => {
      if (containerRef.current) {
        // Send the current height to the parent window (embed.js)
        const height = containerRef.current.scrollHeight;
        window.parent.postMessage({ type: 'trustflow-resize', height }, '*');
      }
    };

    // Send height immediately and whenever content changes
    sendHeight();
    
    // Watch for layout shifts (like images loading)
    const resizeObserver = new ResizeObserver(() => sendHeight());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, [testimonials, layout, loading]);

  if (loading) return <div className="p-4 text-center"></div>; // Empty while loading

  if (testimonials.length === 0) {
    return (
      <div ref={containerRef} className="p-8 text-center text-gray-500">
        <p>No testimonials yet</p>
      </div>
    );
  }

  return (
    // 3. REMOVED BACKGROUND COLOR (Now bg-transparent)
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
            // 4. CARD STYLING (Cards have color, background is see-through)
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
              <video
                src={testimonial.video_url}
                controls
                className="w-full rounded-lg mb-4 aspect-video object-cover"
              />
            ) : (
              <p className={`text-sm mb-4 leading-relaxed opacity-90`}>
                "{testimonial.content}"
              </p>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 mt-auto">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                theme === 'dark' 
                  ? 'bg-violet-900/50 text-violet-300' 
                  : 'bg-violet-100 text-violet-600'
              }`}>
                {testimonial.respondent_name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <div className={`font-medium text-sm`}>
                  {testimonial.respondent_name || "Anonymous"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallOfLove;