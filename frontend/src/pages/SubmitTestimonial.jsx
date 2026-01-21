import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { 
  Video, FileText, Star, Loader2, CheckCircle, Camera, RotateCcw, 
  Upload, ArrowLeft, User, Briefcase, Trash2, Image as ImageIcon, AlertCircle, AlertTriangle, Plus, X, ExternalLink
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';

const SubmitTestimonial = ({ customSlug }) => {
  // Use customSlug prop if provided (for custom domains), otherwise use URL param
  const { slug: urlSlug } = useParams();
  const slug = customSlug || urlSlug;
  
  const [space, setSpace] = useState(null);
  const [formSettings, setFormSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Steps: welcome, video, photo, text, details, uploading, success
  const [step, setStep] = useState('welcome'); 
  const [testimonialType, setTestimonialType] = useState(null); // 'video', 'text', 'photo'
  
  // Data State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  
  // Photo State (Multi-image)
  const [attachedImages, setAttachedImages] = useState([]); // Array of { file, preview }
  const [isPhotoCameraOpen, setIsPhotoCameraOpen] = useState(false);
  
  // Respondent Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(''); 
  const [avatarFile, setAvatarFile] = useState(null); 
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Validation & Error State
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const photoVideoRef = useRef(null); // Separate ref for photo camera

  // --- THEME CONSTANTS ---
  const DEFAULT_THEME_CONFIG = {
    theme: 'light', 
    accentColor: 'violet', 
    customColor: '#8b5cf6',
    pageBackground: 'gradient-violet',
    pageTheme: 'minimal', // NEW: Premium page theme
    viewMode: 'mobile'
  };

  const accentColors = {
    violet: 'from-violet-600 to-indigo-600',
    blue: 'from-blue-600 to-cyan-600',
    rose: 'from-rose-600 to-pink-600',
    emerald: 'from-emerald-600 to-teal-600',
    custom: 'custom' 
  };

  // === PREMIUM PAGE THEMES (Same as EditFormTab) ===
  const PAGE_THEMES = {
    'minimal': {
      background: 'bg-gradient-to-br from-slate-50 via-white to-slate-50',
      pattern: '',
      overlay: '',
      cardGlow: false,
      floatingElements: false
    },
    'aurora': {
      background: 'bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100',
      pattern: 'aurora-waves',
      cardGlow: true,
      floatingElements: true
    },
    'cosmic': {
      background: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950',
      pattern: 'stars',
      cardGlow: true,
      floatingElements: true,
      isDark: true
    },
    'ocean': {
      background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
      pattern: 'waves',
      cardGlow: true,
      floatingElements: true
    },
    'sunset': {
      background: 'bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50',
      pattern: 'mesh',
      cardGlow: true,
      floatingElements: true
    },
    'forest': {
      background: 'bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50',
      pattern: 'leaves',
      cardGlow: true,
      floatingElements: true
    },
    'arctic': {
      background: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50',
      pattern: 'frost',
      cardGlow: true,
      floatingElements: true
    },
    'midnight': {
      background: 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950',
      pattern: 'rain',
      cardGlow: true,
      floatingElements: true,
      isDark: true
    },
    'neon': {
      background: 'bg-gradient-to-br from-slate-950 via-fuchsia-950 to-slate-950',
      pattern: 'grid',
      cardGlow: true,
      floatingElements: true,
      isDark: true,
      neonAccent: true
    },
    'sunrise': {
      background: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
      pattern: 'rays',
      cardGlow: true,
      floatingElements: true
    },
    'lavender': {
      background: 'bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50',
      pattern: 'bubbles',
      cardGlow: true,
      floatingElements: true
    },
    'galaxy': {
      background: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950',
      pattern: 'galaxy',
      cardGlow: true,
      floatingElements: true,
      isDark: true
    },
    // === INTERACTIVE THEMES ===
    'spotlight': {
      background: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
      cardGlow: true,
      floatingElements: false,
      interactive: 'spotlight'
    },
    'magnetic': {
      background: 'bg-gradient-to-br from-violet-50 via-white to-purple-50',
      cardGlow: true,
      floatingElements: false,
      interactive: 'magnetic'
    },
    'ripple': {
      background: 'bg-gradient-to-br from-cyan-50 via-white to-blue-50',
      cardGlow: true,
      floatingElements: false,
      interactive: 'ripple'
    },
    'glow-trail': {
      background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
      cardGlow: true,
      floatingElements: false,
      interactive: 'glow-trail',
      isDark: true
    },
    // === ANIMATED THEMES ===
    'breathing': {
      background: 'bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50',
      cardGlow: true,
      floatingElements: true,
      animated: 'breathing'
    },
    'wave-motion': {
      background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
      cardGlow: true,
      floatingElements: true,
      animated: 'wave-motion'
    },
    'particle-storm': {
      background: 'bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950',
      cardGlow: true,
      floatingElements: true,
      isDark: true,
      animated: 'particle-storm'
    },
    'gradient-shift': {
      background: 'bg-gradient-to-br from-violet-100 via-pink-100 to-orange-100',
      cardGlow: true,
      floatingElements: false,
      animated: 'gradient-shift'
    },
    'northern-lights': {
      background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
      cardGlow: true,
      floatingElements: true,
      isDark: true,
      animated: 'northern-lights'
    },
    'confetti-rain': {
      background: 'bg-gradient-to-br from-yellow-50 via-pink-50 to-cyan-50',
      cardGlow: true,
      floatingElements: false,
      animated: 'confetti-rain'
    },
    // === GLASS & LUXURY THEMES ===
    'glassmorphism': {
      background: 'bg-gradient-to-br from-slate-100 via-white to-slate-100',
      cardGlow: true,
      floatingElements: true,
      glass: true
    },
    'luxury-gold': {
      background: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50',
      pattern: 'gold-shimmer',
      cardGlow: true,
      floatingElements: true,
      luxuryAccent: 'gold'
    },
    'luxury-rose': {
      background: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50',
      pattern: 'shimmer',
      cardGlow: true,
      floatingElements: true,
      luxuryAccent: 'rose'
    },
    'dark-elegance': {
      background: 'bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950',
      pattern: 'subtle-grid',
      cardGlow: true,
      floatingElements: true,
      isDark: true,
      luxuryAccent: 'silver'
    }
  };

  // Get current page theme styles
  const getPageThemeStyles = () => {
    const themeId = formSettings?.theme_config?.pageTheme || 'minimal';
    return PAGE_THEMES[themeId] || PAGE_THEMES['minimal'];
  };

  useEffect(() => {
    fetchSpace();
    return () => {
      cleanupMedia();
    };
  }, [slug]);

  const cleanupMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const fetchSpace = async () => {
    try {
      console.log('DEBUG: Fetching space data for slug:', slug);
      const { data, error } = await supabase
        .from('spaces')
        .select(`*, space_form_settings (*)`)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      let fetchedSettings = {};
      if (Array.isArray(data.space_form_settings) && data.space_form_settings.length > 0) {
        fetchedSettings = data.space_form_settings[0];
      } else if (data.space_form_settings && typeof data.space_form_settings === 'object') {
        fetchedSettings = data.space_form_settings;
      }
      
      console.log('DEBUG: Fetched extra_settings:', fetchedSettings?.extra_settings);

      const mergedSettings = {
        header_title: fetchedSettings.header_title || data.header_title || '',
        custom_message: fetchedSettings.custom_message || data.custom_message || '',
        collect_star_rating: fetchedSettings.collect_star_rating ?? true,
        collect_video: fetchedSettings.collect_video ?? true,
        collect_photo: fetchedSettings.collect_photo ?? false,
        thank_you_title: fetchedSettings.thank_you_title || 'Thank you!',
        thank_you_message: fetchedSettings.thank_you_message || 'Your testimonial has been submitted.',
        theme_config: {
          ...DEFAULT_THEME_CONFIG,
          ...(fetchedSettings.theme_config || {})
        },
        // NEW: Fetch extra_settings for branding and thank you redirect
        extra_settings: fetchedSettings.extra_settings || {}
      };

      setSpace(data);
      setFormSettings(mergedSettings);

    } catch (error) {
      console.error('Error fetching space:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Dynamic Style Helpers ---
  const getThemeClasses = () => {
    if (!formSettings) return {};
    const isDark = formSettings.theme_config.theme === 'dark';
    return {
      card: isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-white text-slate-900',
      input: isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-500',
      textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
      textHeader: isDark ? 'text-white' : 'text-slate-900',
    };
  };

  const getButtonStyle = () => {
    if (!formSettings) return {};
    const { accentColor, customColor } = formSettings.theme_config;
    if (accentColor === 'custom') return { background: customColor, color: '#fff' };
    return {}; 
  };
  
  const getButtonClass = () => {
    if (!formSettings) return '';
    const { accentColor } = formSettings.theme_config;
    if (accentColor === 'custom') return `w-full shadow-md hover:opacity-90 transition-opacity text-white`;
    return `w-full shadow-md bg-gradient-to-r ${accentColors[accentColor]} hover:opacity-90 transition-opacity text-white`;
  };

  // --- Flows (Updated: Clear errors when starting a flow) ---
  const startVideoFlow = () => {
    setSubmissionError(null); // Clear previous errors
    setTestimonialType('video');
    setStep('video');
    setTimeout(startCamera, 100);
  };

  const startPhotoFlow = () => {
    setSubmissionError(null); // Clear previous errors
    setTestimonialType('photo');
    setStep('photo');
  };

  const startTextFlow = () => {
    setSubmissionError(null); // Clear previous errors
    setTestimonialType('text');
    setStep('text');
  };

  // --- Navigation Logic ---
  const handleNextFromMedia = () => {
    // Enforcement: Must have media
    if (testimonialType === 'video' && !recordedBlob) {
      setSubmissionError('Please record a video to continue.');
      return;
    }
    if (testimonialType === 'photo' && attachedImages.length === 0) {
      setSubmissionError('Please upload at least one photo.');
      return;
    }
    
    setSubmissionError(null);
    stopCamera();
    // Video/Photo flow ALWAYS goes to Text step next
    setStep('text');
  };

  const handleNextFromText = () => {
    // Enforcement: Text is mandatory ONLY if testimonialType is 'text'
    if (testimonialType === 'text' && !content.trim()) {
      setSubmissionError('Please write your testimonial.');
      return;
    }
    setSubmissionError(null);
    setStep('details');
  };

  const handleSkipText = () => {
    // Only allowed for video/photo flows
    setStep('details');
  };

  // --- Video Logic ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      setSubmissionError('Camera access denied. Please check permissions.');
    }
  };

  const startRecording = () => {
    setSubmissionError(null); // Clear error when action starts
    if (!streamRef.current) return;
    const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp9' });
    const chunks = [];
    
    mediaRecorder.ondataavailable = (e) => { 
        if (e.data && e.data.size > 0) chunks.push(e.data); 
    };
    
    mediaRecorder.onerror = (e) => {
        console.error("Recording error:", e);
        setSubmissionError("Video recording failed. Please try again.");
    };

    mediaRecorder.onstop = () => {
      try {
        const blob = new Blob(chunks, { type: 'video/webm' });
        if (blob.size > 0) {
            setRecordedBlob(blob);
            setRecordedUrl(URL.createObjectURL(blob));
        } else {
            console.error("Recorded blob is empty");
        }
      } catch (err) {
        console.error("Failed to process video blob", err);
      }
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 60) { stopRecording(); return prev; }
        return prev + 1;
      });
    }, 1000);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsPhotoCameraOpen(false);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const retakeVideo = () => {
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingTime(0);
    setSubmissionError(null); // Clear error on retake
    startCamera();
  };

  // --- Photo Logic (Multi-Image) ---
  const handlePhotoUpload = (e) => {
    setSubmissionError(null); // Clear error when action starts
    try {
      const files = Array.from(e.target.files);
      if (files.length + attachedImages.length > 4) {
        setSubmissionError("Maximum 4 photos allowed.");
        return;
      }
      setSubmissionError(null);

      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setAttachedImages([...attachedImages, ...newImages]);
    } catch (err) {
      console.error("Error handling photo upload:", err);
      setSubmissionError("Failed to load selected photos.");
    }
  };

  const startPhotoCamera = async () => {
    setSubmissionError(null); // Clear error when action starts
    try {
      setIsPhotoCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      // Slight delay to ensure ref is mounted
      setTimeout(() => {
        if (photoVideoRef.current) photoVideoRef.current.srcObject = stream;
      }, 100);
    } catch (error) {
      setSubmissionError('Camera access denied.');
    }
  };

  // --- ROBUST CAPTURE LOGIC (FIXED) ---
  const capturePhoto = () => {
    if (!photoVideoRef.current) return;
    
    // 1. Ensure video stream is valid and has dimensions
    if (photoVideoRef.current.videoWidth === 0 || photoVideoRef.current.videoHeight === 0) {
       console.warn("Video stream not ready yet.");
       return; 
    }

    const canvas = document.createElement('canvas');
    canvas.width = photoVideoRef.current.videoWidth;
    canvas.height = photoVideoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        setSubmissionError("Device not supported for capture.");
        return;
    }

    ctx.drawImage(photoVideoRef.current, 0, 0);
    
    canvas.toBlob(blob => {
      // 2. Critical Null Check for Blob
      if (!blob) {
         console.error("Failed to capture photo: Blob is null");
         setSubmissionError("Failed to capture photo. Please try again.");
         return; 
      }
      
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // 3. Re-check limits before state update
      if (attachedImages.length >= 4) {
        setSubmissionError("Maximum 4 photos allowed.");
        stopCamera();
        return;
      }
      
      // 4. Safe URL creation
      try {
        const previewUrl = URL.createObjectURL(blob);
        setAttachedImages(prev => [...prev, { file, preview: previewUrl }]);
        stopCamera(); // Close camera after taking one photo
      } catch (e) {
        console.error("Failed to create object URL", e);
        setSubmissionError("Error saving photo.");
      }
    }, 'image/jpeg');
  };

  const removeAttachedImage = (index) => {
    setAttachedImages(prev => {
        const newImages = [...prev];
        newImages.splice(index, 1);
        return newImages;
    });
  };

  // --- Avatar Logic ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } catch (err) {
        console.error("Avatar preview error", err);
      }
    }
  };
  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  // --- Validation ---
  const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
    }
  };

  const handleEmailFocus = () => {
    setErrors(prev => ({ ...prev, email: null }));
  };

  // --- Submit Logic ---
  const submitTestimonial = async (e) => {
    e.preventDefault();
    
    // Final Validation check
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email address";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setStep('uploading');

    try {
      let videoUrl = null;
      let avatarUrl = null;
      let imageUrls = [];
      let progress = 0;
      
      const updateProgress = (increment) => {
        progress += increment;
        setUploadProgress(Math.min(progress, 90));
      };

      // 1. Upload Avatar
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${space.id}/avatars/${uuidv4()}.${fileExt}`;
        const { error: avatarError } = await supabase.storage.from('respondent_photo').upload(fileName, avatarFile);
        if (avatarError) throw avatarError;
        const { data: { publicUrl } } = supabase.storage.from('respondent_photo').getPublicUrl(fileName);
        avatarUrl = publicUrl;
        updateProgress(20);
      }

      // 2. Upload Video
      if (testimonialType === 'video' && recordedBlob) {
        const fileName = `${space.id}/${uuidv4()}.webm`;
        const { error: uploadError } = await supabase.storage.from('videos').upload(fileName, recordedBlob, { contentType: 'video/webm' });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
        videoUrl = publicUrl;
        updateProgress(30);
      }

      // 3. Upload Attached Images (Multiple)
      if (testimonialType === 'photo' && attachedImages.length > 0) {
        for (const imgObj of attachedImages) {
          const fileExt = imgObj.file.name.split('.').pop() || 'jpg';
          const fileName = `${space.id}/attached/${uuidv4()}.${fileExt}`;
          const { error: imgError } = await supabase.storage.from('testimonial_attached_photos').upload(fileName, imgObj.file);
          if (!imgError) {
             const { data: { publicUrl } } = supabase.storage.from('testimonial_attached_photos').getPublicUrl(fileName);
             imageUrls.push(publicUrl);
          }
        }
        updateProgress(30);
      }
      
      updateProgress(10); // Final buffer

      // 4. Insert DB
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          id: uuidv4(),
          space_id: space.id,
          type: testimonialType,
          content: content,
          video_url: videoUrl,
          rating: formSettings.collect_star_rating ? rating : null,
          respondent_name: name,
          respondent_email: email,
          respondent_role: role, 
          respondent_photo_url: avatarUrl,
           attached_photos: imageUrls, 
          is_liked: false,
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      setUploadProgress(100);
      setStep('success');
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    } catch (error) {
      console.error('Error submitting:', error);
      console.log(error.message, error);
      setSubmissionError('Upload failed. Please check your connection.');
      setStep('details');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  if (!space) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><h1 className="text-2xl font-bold mb-2">Space Not Found</h1><p className="text-muted-foreground">Invalid link.</p></div></div>;

  const themeClasses = getThemeClasses();
  const themeConfig = formSettings.theme_config;
  const pageThemeStyles = getPageThemeStyles();

  // Pattern CSS for different page themes
  const getPatternCSS = (pattern) => {
    const patterns = {
      'aurora-waves': `
        background-image: 
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
          radial-gradient(ellipse 60% 40% at 80% 50%, rgba(255, 119, 198, 0.2), transparent),
          radial-gradient(ellipse 50% 30% at 20% 80%, rgba(59, 130, 246, 0.2), transparent);
      `,
      'stars': `
        background-image: 
          radial-gradient(2px 2px at 20px 30px, white, transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 90px 40px, white, transparent),
          radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 160px 120px, white, transparent);
        background-size: 200px 200px;
      `,
      'waves': `
        background-image: 
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2306b6d4' fill-opacity='0.1' d='M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
        background-position: bottom;
        background-size: cover;
      `,
      'mesh': `
        background-image: 
          radial-gradient(at 40% 20%, rgba(251, 146, 60, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(236, 72, 153, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(251, 146, 60, 0.2) 0px, transparent 50%);
      `,
      'leaves': `
        background-image: 
          radial-gradient(ellipse at 20% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(132, 204, 22, 0.15) 0%, transparent 50%);
      `,
      'frost': `
        background-image: 
          radial-gradient(circle at 20% 20%, rgba(186, 230, 253, 0.4) 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(165, 180, 252, 0.4) 0%, transparent 40%);
      `,
      'grid': `
        background-image: 
          linear-gradient(rgba(217, 70, 239, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(217, 70, 239, 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
      `,
      'rays': `
        background-image: 
          radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.3) 0%, transparent 60%);
      `,
      'bubbles': `
        background-image: 
          radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 30%),
          radial-gradient(circle at 90% 80%, rgba(232, 121, 249, 0.15) 0%, transparent 30%);
      `,
      'galaxy': `
        background-image: 
          radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
          radial-gradient(2px 2px at 10% 10%, white, transparent),
          radial-gradient(2px 2px at 20% 80%, rgba(255,255,255,0.8), transparent);
        background-size: 100% 100%, 150px 150px, 200px 200px;
      `,
      'rain': `
        background-image: linear-gradient(to bottom, transparent 0%, rgba(100, 116, 139, 0.1) 100%);
      `,
      'subtle-grid': `
        background-image: 
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 30px 30px;
      `,
      'gold-shimmer': `
        background-image: linear-gradient(135deg, rgba(251,191,36,0.1) 0%, transparent 50%, rgba(251,191,36,0.1) 100%);
      `,
      'shimmer': `
        background-image: linear-gradient(135deg, rgba(244,114,182,0.1) 0%, transparent 50%, rgba(244,114,182,0.1) 100%);
      `
    };
    return patterns[pattern] || '';
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${pageThemeStyles.background}`}>
      {/* Pattern Overlay */}
      {pageThemeStyles.pattern && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ cssText: getPatternCSS(pageThemeStyles.pattern) }}
        />
      )}
      
      {/* Glass Effect */}
      {pageThemeStyles.glass && (
        <div className="absolute inset-0 pointer-events-none backdrop-blur-xl bg-white/30" />
      )}
      
      {/* Animated Theme Effects */}
      {pageThemeStyles.animated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {pageThemeStyles.animated === 'breathing' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-rose-200/30 via-transparent to-pink-200/30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          {pageThemeStyles.animated === 'wave-motion' && (
            <>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-200/40 to-transparent"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-200/30 to-transparent"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </>
          )}
          {pageThemeStyles.animated === 'particle-storm' && (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-violet-400 rounded-full"
                  initial={{ x: `${Math.random() * 100}%`, y: '-5%', opacity: 0 }}
                  animate={{ 
                    y: '105%', 
                    opacity: [0, 1, 1, 0],
                    x: `${Math.random() * 100}%`
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 3, 
                    repeat: Infinity, 
                    delay: Math.random() * 4,
                    ease: "linear"
                  }}
                />
              ))}
            </>
          )}
          {pageThemeStyles.animated === 'gradient-shift' && (
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 50%, rgba(251,146,60,0.2) 100%)',
                  'linear-gradient(135deg, rgba(251,146,60,0.2) 0%, rgba(139,92,246,0.2) 50%, rgba(236,72,153,0.2) 100%)',
                  'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(251,146,60,0.2) 50%, rgba(139,92,246,0.2) 100%)',
                  'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 50%, rgba(251,146,60,0.2) 100%)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          )}
          {pageThemeStyles.animated === 'northern-lights' && (
            <>
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-emerald-400/20 via-cyan-400/15 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3], x: [-20, 20, -20] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-0 left-1/4 right-1/4 h-1/3 bg-gradient-to-b from-violet-400/25 via-fuchsia-400/15 to-transparent"
                animate={{ opacity: [0.4, 0.7, 0.4], x: [20, -20, 20] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </>
          )}
          {pageThemeStyles.animated === 'confetti-rain' && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-sm ${['bg-yellow-400', 'bg-pink-400', 'bg-cyan-400', 'bg-violet-400', 'bg-green-400'][i % 5]}`}
                  initial={{ 
                    x: `${5 + Math.random() * 90}%`, 
                    y: '-5%', 
                    rotate: 0,
                    opacity: 0.8
                  }}
                  animate={{ 
                    y: '105%', 
                    rotate: 360,
                    opacity: [0.8, 0.8, 0]
                  }}
                  transition={{ 
                    duration: 5 + Math.random() * 3, 
                    repeat: Infinity, 
                    delay: Math.random() * 5,
                    ease: "linear"
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}
      
      {/* Floating Elements for Premium Themes */}
      {pageThemeStyles.floatingElements && !pageThemeStyles.animated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 ${pageThemeStyles.isDark ? 'bg-violet-500' : 'bg-violet-300'}`}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: '5%', left: '5%' }}
          />
          <motion.div
            className={`absolute w-72 h-72 rounded-full blur-3xl opacity-20 ${pageThemeStyles.isDark ? 'bg-pink-500' : 'bg-pink-300'}`}
            animate={{
              x: [0, -30, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{ bottom: '10%', right: '10%' }}
          />
          {pageThemeStyles.neonAccent && (
            <motion.div
              className="absolute w-32 h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 blur-sm opacity-60"
              animate={{ x: [-200, window.innerWidth || 1000], opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
              style={{ top: '40%' }}
            />
          )}
        </div>
      )}
      
      {/* Luxury Accent Effects */}
      {pageThemeStyles.luxuryAccent && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {pageThemeStyles.luxuryAccent === 'gold' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            />
          )}
          {pageThemeStyles.luxuryAccent === 'rose' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            />
          )}
          {pageThemeStyles.luxuryAccent === 'silver' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/5 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
          )}
        </div>
      )}
      
      {/* Card Glow Styles */}
      {pageThemeStyles.cardGlow && (
        <style>{`
          .premium-card-glow {
            box-shadow: 0 0 60px -15px ${pageThemeStyles.isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.25)'};
          }
        `}</style>
      )}
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <AnimatePresence mode="wait">
          
          {/* STEP 1: WELCOME */}
          {step === 'welcome' && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card} ${pageThemeStyles.cardGlow ? 'premium-card-glow' : ''}`}>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    {space.logo_url ? (
                      <img src={space.logo_url} alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
                    ) : (
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><Star className="w-8 h-8 text-white" /></div>
                    )}
                    <h1 className={`text-2xl font-bold mb-2 ${themeClasses.textHeader}`}>{formSettings.header_title}</h1>
                    <p className={`${themeClasses.textMuted}`}>{formSettings.custom_message}</p>
                  </div>

                  <div className="space-y-3">
                    {formSettings.collect_video && (
                      <Button onClick={startVideoFlow} className={`w-full h-14 text-lg ${getButtonClass()}`} style={getButtonStyle()}>
                        <Video className="w-5 h-5 mr-2" /> Record a Video
                      </Button>
                    )}
                    
                    {formSettings.collect_photo && (
                       <Button onClick={startPhotoFlow} className={`w-full h-14 text-lg ${getButtonClass()}`} style={getButtonStyle()}>
                          <ImageIcon className="w-5 h-5 mr-2" /> Upload Photo
                       </Button>
                    )}

                    <Button onClick={startTextFlow} variant={(!formSettings.collect_video && !formSettings.collect_photo) ? "default" : "outline"}
                      className={`w-full h-14 text-lg ${(!formSettings.collect_video && !formSettings.collect_photo) ? getButtonClass() : `${themeClasses.input} hover:bg-slate-100 dark:hover:bg-slate-800`}`}
                      style={(!formSettings.collect_video && !formSettings.collect_photo) ? getButtonStyle() : {}}
                    >
                      <FileText className="w-5 h-5 mr-2" /> Write Text
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: VIDEO (Updated Back Button) */}
          {step === 'video' && (
            <motion.div key="video" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card} ${pageThemeStyles.cardGlow ? 'premium-card-glow' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => { stopCamera(); setStep('welcome'); setSubmissionError(null); }} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Record Video</h2>
                  </div>
                  <div className="relative aspect-[9/16] max-h-[400px] bg-black rounded-xl overflow-hidden mb-4">
                    {recordedUrl ? <video src={recordedUrl} className="w-full h-full object-cover" controls /> : <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror" style={{ transform: 'scaleX(-1)' }} />}
                    {isRecording && <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> {formatTime(recordingTime)} / 1:00</div>}
                  </div>
                  {/* Validation Error Banner */}
                  {submissionError && <div className="mb-4 text-center text-red-500 text-sm bg-red-50 p-2 rounded">{submissionError}</div>}
                  
                  <div className="flex justify-center gap-3">
                    {recordedUrl ? (
                      <>
                        <Button variant="outline" onClick={retakeVideo} className={themeClasses.input}><RotateCcw className="w-4 h-4 mr-2" /> Retake</Button>
                        <Button onClick={handleNextFromMedia} className={getButtonClass()} style={getButtonStyle()}>Use This Video</Button>
                      </>
                    ) : isRecording ? (
                      <Button onClick={stopRecording} variant="destructive" size="lg" className="rounded-full w-16 h-16"><span className="w-6 h-6 bg-white rounded-sm" /></Button>
                    ) : (
                      <Button onClick={startRecording} size="lg" className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"><Camera className="w-6 h-6" /></Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: PHOTO (Updated Back Button) */}
          {step === 'photo' && (
            <motion.div key="photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card} ${pageThemeStyles.cardGlow ? 'premium-card-glow' : ''}`}>
                <CardContent className="p-6">
                   <div className="flex items-center gap-2 mb-4">
                      <Button variant="ghost" size="icon" onClick={() => { setStep('welcome'); setSubmissionError(null); }} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                      <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Upload Photos</h2>
                   </div>

                   {/* Camera View */}
                   {isPhotoCameraOpen ? (
                     <div className="relative aspect-square bg-black rounded-xl overflow-hidden mb-4 flex flex-col items-center justify-end pb-4">
                        <video ref={photoVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover mirror" style={{ transform: 'scaleX(-1)' }} />
                        <div className="relative z-10 flex gap-4">
                          <Button variant="ghost" onClick={stopCamera} className="text-white bg-black/50 hover:bg-black/70 rounded-full">Cancel</Button>
                          <Button onClick={capturePhoto} size="icon" className="h-14 w-14 rounded-full border-4 border-white bg-transparent hover:bg-white/20"></Button>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-4 mb-6">
                        {/* Options */}
                        {attachedImages.length < 4 && (
                          <div className="grid grid-cols-2 gap-3">
                            <Label className="aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                               <Upload className="w-6 h-6 text-slate-400 mb-1" />
                               <span className={`text-xs ${themeClasses.textMuted}`}>Upload</span>
                               <Input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                            </Label>
                            <div onClick={startPhotoCamera} className="aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                               <Camera className="w-6 h-6 text-slate-400 mb-1" />
                               <span className={`text-xs ${themeClasses.textMuted}`}>Camera</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Preview Grid */}
                        {attachedImages.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                             {attachedImages.map((img, idx) => (
                               <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                  <img src={img.preview} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                  <button onClick={() => removeAttachedImage(idx)} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600"><X className="w-3 h-3" /></button>
                               </div>
                             ))}
                          </div>
                        )}
                        {attachedImages.length === 0 && <p className="text-center text-xs text-muted-foreground">Max 4 photos</p>}
                     </div>
                   )}
                   
                   {submissionError && <div className="mb-4 text-center text-red-500 text-sm bg-red-50 p-2 rounded">{submissionError}</div>}

                   {!isPhotoCameraOpen && (
                     <Button onClick={handleNextFromMedia} className={`w-full ${getButtonClass()}`} style={getButtonStyle()}>Continue</Button>
                   )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: TEXT (Updated Back Button & OnChange) */}
          {step === 'text' && (
            <motion.div key="text" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card} ${pageThemeStyles.cardGlow ? 'premium-card-glow' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => { setSubmissionError(null); setStep(testimonialType === 'photo' ? 'photo' : (testimonialType === 'video' ? 'video' : 'welcome')); }} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Write Testimonial</h2>
                  </div>
                  {formSettings.collect_star_rating && (
                    <div className="mb-6">
                      <Label className={`mb-2 block ${themeClasses.textHeader}`}>Your Rating</Label>
                      <div className="flex gap-1">{[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="p-1 transition-transform hover:scale-110"><Star className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} /></button>))}</div>
                    </div>
                  )}
                  <div className="space-y-4">
                    <Label htmlFor="content" className={themeClasses.textHeader}>Your Testimonial</Label>
                    <Textarea id="content" value={content} onChange={(e) => { setContent(e.target.value); setSubmissionError(null); }} placeholder="Share your experience..." rows={5} className={`mt-2 ${themeClasses.input}`} />
                    
                    {submissionError && <div className="text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {submissionError}</div>}

                    <div className="flex flex-col gap-2">
                       <Button onClick={handleNextFromText} className={`w-full ${getButtonClass()}`} style={getButtonStyle()}>Continue</Button>
                       {/* Show SKIP if type is NOT text (meaning we have video/photo) */}
                       {testimonialType !== 'text' && (
                         <Button variant="ghost" onClick={handleSkipText} className={`w-full ${themeClasses.textMuted}`}>Skip</Button>
                       )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 5: DETAILS (With Premium Validation) */}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card} ${pageThemeStyles.cardGlow ? 'premium-card-glow' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => setStep('text')} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Your Details</h2>
                  </div>

                  {submissionError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> {submissionError}
                    </div>
                  )}

                  <form onSubmit={submitTestimonial} className="space-y-5">
                    {/* Profile Photo */}
                       <div className="flex flex-col items-center justify-center mb-6">
                          <div className="relative group">
                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                              <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${avatarPreview ? 'border-transparent shadow-md' : 'border-slate-300 hover:border-violet-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'}`}>
                                {avatarPreview ? (
                                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex flex-col items-center text-center p-2">
                                    <Camera className="w-6 h-6 text-slate-400 mb-1" />
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Photo</span>
                                  </div>
                                )}
                              </div>
                            </Label>
                            <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            {avatarPreview && (
                              <button type="button" onClick={removeAvatar} className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors z-10"><Trash2 className="w-3 h-3" /></button>
                            )}
                          </div>
                       </div>
                    <div>
                      <Label htmlFor="name" className={themeClasses.textHeader}>Your Name *</Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="name" value={name} onChange={(e) => { setName(e.target.value); setErrors({...errors, name: null}) }} placeholder="John Doe" className={`pl-9 ${themeClasses.input} ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`} />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className={themeClasses.textHeader}>Your Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        onBlur={handleEmailBlur} // Validate on Leave
                        onFocus={handleEmailFocus} // Clear on Enter
                        placeholder="john@example.com" 
                        className={`mt-2 ${themeClasses.input} ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                      />
                      {errors.email ? (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>
                      ) : (
                        <p className={`text-xs mt-1 ${themeClasses.textMuted}`}>Your email won't be displayed publicly</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="role" className={themeClasses.textHeader}>Job Title (Optional)</Label>
                      <div className="relative mt-2">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="CEO at Company" className={`pl-9 ${themeClasses.input}`} />
                      </div>
                    </div>

                    <Button type="submit" disabled={submitting} className={`w-full mt-4 ${getButtonClass()}`} style={getButtonStyle()}>
                      {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Submit Testimonial
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 6: UPLOADING */}
          {step === 'uploading' && (
            <motion.div key="uploading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card} ${pageThemeStyles.cardGlow ? 'premium-card-glow' : ''}`}>
                <CardContent className="p-8 text-center">
                  <Upload className={`w-12 h-12 mx-auto mb-4 animate-bounce ${formSettings.theme_config.accentColor === 'custom' ? 'text-black dark:text-white' : 'text-violet-600'}`} />
                  <h2 className={`text-lg font-semibold mb-2 ${themeClasses.textHeader}`}>Uploading...</h2>
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className={`text-sm ${themeClasses.textMuted}`}>{uploadProgress}%</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 7: SUCCESS */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card} ${pageThemeStyles.cardGlow ? 'premium-card-glow' : ''}`}>
                <CardContent className="p-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}><CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" /></motion.div>
                  <h2 className={`text-2xl font-bold mb-2 ${themeClasses.textHeader}`}>{formSettings.thank_you_title}</h2>
                  <p className={`mb-6 ${themeClasses.textMuted}`}>{formSettings.thank_you_message}</p>
                  
                  {/* Promo/Redirect Section - Custom link replaces default if set */}
                  <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    {formSettings.extra_settings?.thank_you_url ? (
                      /* Custom Thank You Redirect - PRO Feature */
                      <a 
                        href={formSettings.extra_settings.thank_you_url}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-violet-600 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        {formSettings.extra_settings?.thank_you_link_text || 'Continue'}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      /* Default TrustWall Promo */
                      <>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Want to collect testimonials like this?</p>
                        <a href="/" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-medium hover:underline">Create your own Wall of Love →</a>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
        
        {/* Footer - Respects hide_branding */}
        {!formSettings.extra_settings?.hide_branding && (
          <div className="text-center mt-6">
            <a href="/" target="_blank" rel="noopener noreferrer" className={`text-sm hover:underline transition-colors ${themeClasses.textMuted}`}>Powered by <span className="font-medium text-violet-600">TrustWall</span></a>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default SubmitTestimonial;