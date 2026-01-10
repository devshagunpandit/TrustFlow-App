import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Heart, HeartOff, Trash2, Play, Inbox, Star, Video, Search, X, 
  Grid3x3, List, Image as ImageIcon, Maximize2, Info,
  Calendar as CalendarIcon, ArrowUpDown, AlertTriangle, CheckCircle, AlertCircle
} from 'lucide-react';

// --- COMPONENTS START ---

// 1. Premium Notification Toast (Handles Success & Error - Bottom Centered)
const NotificationToast = ({ message, type, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        >
          {type === 'success' ? (
            <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="bg-red-100 dark:bg-red-900/30 p-1 rounded-full">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          )}
          <span className={`text-sm font-medium ${type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}`}>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 2. Premium Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isDeleting ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-sm bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Delete Testimonial?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. This testimonial will be permanently removed from your collection.
              </p>
              
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white border-none flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"/>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('InboxTab Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">We encountered an error loading your testimonials.</p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Reload Widget
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Lightbox Component for Images
const ImageLightbox = ({ src, alt, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.img
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>
    </motion.div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ 
  testimonial, 
  toggleLike, 
  onRequestDelete, 
  setSelectedVideo,
  viewMode 
}) => {
  const [lightboxImage, setLightboxImage] = React.useState(null);
  const [isLiking, setIsLiking] = React.useState(false);

  const photos = testimonial.attached_photos && Array.isArray(testimonial.attached_photos) && testimonial.attached_photos.length > 0
    ? testimonial.attached_photos
    : (testimonial.attached_photo ? [testimonial.attached_photo] : []);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await toggleLike(testimonial.id, testimonial.is_liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setTimeout(() => setIsLiking(false), 300);
    }
  };

  // --- GRID VIEW (FIXED: No Blur, Thumbnail Video) ---
  if (viewMode === 'grid') {
    return (
      <>
        <motion.div layout className="h-full">
          <Card className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] transform-gpu backface-hidden h-full flex flex-col ${
            testimonial.is_liked 
              ? 'border-violet-300 dark:border-violet-700 bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-900/10 dark:to-transparent shadow-violet-100 dark:shadow-violet-900/20' 
              : 'border-gray-200 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg'
          }`}>
            <CardContent className="p-3.5 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start gap-3 mb-2">
                <Avatar className="w-9 h-9 ring-2 ring-violet-100 dark:ring-violet-900 shrink-0">
                  <AvatarImage src={testimonial.respondent_photo_url} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs">
                    {testimonial.respondent_name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="font-semibold text-sm truncate">{testimonial.respondent_name}</span>
                    
                    {testimonial.respondent_role && (
                      <span className="text-[10px] text-muted-foreground bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full truncate max-w-[100px]">
                        {testimonial.respondent_role}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {testimonial.type === 'video' && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-[9px] px-1 h-4">
                        <Video className="w-2 h-2" />
                        Video
                      </Badge>
                    )}
                    {photos.length > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-[9px] px-1 h-4 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                        <ImageIcon className="w-2 h-2" />
                        {photos.length}
                      </Badge>
                    )}
                  </div>

                  {testimonial.respondent_email && (
                      <div className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                        {testimonial.respondent_email}
                      </div>
                  )}
                </div>
              </div>

              {testimonial.rating && (
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              )}

              {/* Content Body */}
              <div className="flex-1 min-h-[40px]">
                {testimonial.type === 'video' ? (
                  /* --- NEW VIDEO THUMBNAIL UI --- */
                  <div 
                    onClick={() => setSelectedVideo(testimonial.video_url)}
                    className="relative w-full h-24 mb-2 bg-slate-900 rounded-md flex items-center justify-center cursor-pointer group/video overflow-hidden border border-slate-800"
                  >
                    {/* Dark gradient background simulating a thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-100" />
                    
                    {/* Play Button */}
                    <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover/video:scale-110 border border-white/30">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover/video:bg-black/10 transition-colors duration-300" />
                  </div>
                ) : (
                  <p className="text-sm text-foreground/90 line-clamp-3 mb-2 italic leading-relaxed">"{testimonial.content}"</p>
                )}

                {/* Compact Image Grid */}
                {photos.length > 0 && (
                  <div className={`grid gap-0.5 mb-2 rounded-md overflow-hidden border border-gray-100 dark:border-gray-800 ${
                    photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  }`}>
                    {photos.map((photo, index) => (
                      <div 
                        key={index}
                        className={`relative group/img cursor-pointer bg-gray-100 dark:bg-gray-800 overflow-hidden ${
                          photos.length === 3 && index === 0 ? 'col-span-2' : ''
                        }`}
                        style={{ height: photos.length === 1 ? '120px' : '60px' }}
                        onClick={() => setLightboxImage(photo)}
                      >
                        <img 
                          src={photo} 
                          alt={`Proof ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize2 className="w-3 h-3 text-white opacity-0 group-hover/img:opacity-100 transition-all transform scale-75 group-hover/img:scale-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(testimonial.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-0.5">
                  <motion.div
                    animate={isLiking ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLike}
                      className={`h-7 w-7 ${testimonial.is_liked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      {testimonial.is_liked ? <Heart className="w-3.5 h-3.5 fill-current" /> : <HeartOff className="w-3.5 h-3.5" />}
                    </Button>
                  </motion.div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRequestDelete(testimonial.id)}
                    className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <AnimatePresence>
          {lightboxImage && (
            <ImageLightbox 
              src={lightboxImage} 
              alt="Testimonial attachment" 
              onClose={() => setLightboxImage(null)} 
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // --- LIST VIEW (Standard) ---
  return (
    <>
      <motion.div layout>
        <Card className={`group transition-all duration-300 hover:shadow-lg ${
          testimonial.is_liked 
            ? 'border-violet-300 dark:border-violet-700 bg-gradient-to-r from-violet-50/50 via-transparent to-transparent dark:from-violet-900/10 dark:via-transparent dark:to-transparent' 
            : 'border-gray-200 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800'
        }`}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12 ring-2 ring-violet-100 dark:ring-violet-900 shrink-0">
                <AvatarImage src={testimonial.respondent_photo_url} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                  {testimonial.respondent_name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold">{testimonial.respondent_name}</span>
                  {testimonial.respondent_role && (
                    <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {testimonial.respondent_role}
                    </span>
                  )}
                  {testimonial.type === 'video' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Video
                    </Badge>
                  )}
                  {photos.length > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                      <ImageIcon className="w-3 h-3" />
                      {photos.length} Photo{photos.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {testimonial.respondent_email}
                </div>
                
                {testimonial.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    {testimonial.type === 'video' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedVideo(testimonial.video_url)}
                        className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-violet-200 dark:border-violet-800"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Video
                      </Button>
                    ) : (
                      <p className="text-foreground/90 mb-2 italic">"{testimonial.content}"</p>
                    )}
                  </div>
                  
                  {/* List View Image Strip */}
                  {photos.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                      {photos.map((photo, index) => (
                        <div 
                          key={index}
                          className="relative shrink-0 h-16 w-16 rounded-md overflow-hidden cursor-pointer group/img border border-gray-100 dark:border-gray-800"
                          onClick={() => setLightboxImage(photo)}
                        >
                          <img 
                            src={photo} 
                            alt="Attached proof" 
                            className="h-full w-full object-cover transition-transform group-hover/img:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize2 className="w-3 h-3 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-muted-foreground">
                    {new Date(testimonial.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-start">
                <motion.div
                  animate={isLiking ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    className={testimonial.is_liked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
                  >
                    {testimonial.is_liked ? <Heart className="w-5 h-5 fill-current" /> : <HeartOff className="w-5 h-5" />}
                  </Button>
                </motion.div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRequestDelete(testimonial.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <AnimatePresence>
        {lightboxImage && (
          <ImageLightbox 
            src={lightboxImage} 
            alt="Testimonial attachment" 
            onClose={() => setLightboxImage(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Main InboxTab Component
const InboxTab = ({ 
  testimonials, 
  toggleLike, 
  deleteTestimonial, 
  setSelectedVideo, 
  copySubmitLink 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [viewMode, setViewMode] = React.useState('list');
  const [showGridInfo, setShowGridInfo] = React.useState(false);
  
  // Sorting and Filtering State
  const [sortBy, setSortBy] = React.useState('newest'); // newest, oldest, name-asc, name-desc
  const [dateRange, setDateRange] = React.useState({ from: '', to: '' });

  // --- PREMIUM STATE ---
  const [deleteModal, setDeleteModal] = React.useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [notification, setNotification] = React.useState({ isVisible: false, message: '', type: 'success' });

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const handleCopyLink = () => {
    if (copySubmitLink) {
      copySubmitLink();
    }
  };

  // Delete Handlers
  const handleRequestDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    
    setIsDeleting(true);
    try {
      await deleteTestimonial(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      showNotification("Testimonial deleted successfully", "success");
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteModal({ isOpen: false, id: null });
      showNotification("Something went wrong. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'grid') {
      setShowGridInfo(true);
    } else {
      setShowGridInfo(false);
    }
  }, [viewMode]);

  // Filter, Search, and Sort Logic (PRESERVED)
  const filteredTestimonials = React.useMemo(() => {
    let filtered = [...testimonials];

    // 1. Type Filter
    if (activeFilter === 'video') {
      filtered = filtered.filter(t => t.type === 'video');
    } else if (activeFilter === 'text') {
      filtered = filtered.filter(t => t.type === 'text');
    } else if (activeFilter === 'image') {
      filtered = filtered.filter(t => 
        t.type === 'photo' || 
        t.attached_photo || 
        (t.attached_photos && t.attached_photos.length > 0)
      );
    } else if (activeFilter === 'liked') {
      filtered = filtered.filter(t => t.is_liked);
    }

    // 2. Date Range Filter
    if (dateRange.from) {
      filtered = filtered.filter(t => new Date(t.created_at) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => new Date(t.created_at) <= toDate);
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        (t.respondent_name && t.respondent_name.toLowerCase().includes(query)) ||
        (t.respondent_email && t.respondent_email.toLowerCase().includes(query)) ||
        (t.content && t.content.toLowerCase().includes(query)) ||
        (t.respondent_role && t.respondent_role.toLowerCase().includes(query))
      );
    }

    // 4. Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'name-asc':
          return (a.respondent_name || '').localeCompare(b.respondent_name || '');
        case 'name-desc':
          return (b.respondent_name || '').localeCompare(a.respondent_name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [testimonials, activeFilter, searchQuery, sortBy, dateRange]);

  if (testimonials.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
          <Inbox className="w-10 h-10 text-violet-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No testimonials yet</h2>
        <p className="text-muted-foreground mb-6">Share your collection link to start receiving testimonials.</p>
        <Button onClick={handleCopyLink} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
          <Inbox className="w-4 h-4 mr-2" />
          Copy Collection Link
        </Button>
        <NotificationToast 
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        
        {/* --- PREMIUM NOTIFICATION & MODALS --- */}
        <NotificationToast 
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
        
        <DeleteConfirmationModal 
          isOpen={deleteModal.isOpen}
          isDeleting={isDeleting}
          onClose={() => setDeleteModal({ isOpen: false, id: null })}
          onConfirm={handleConfirmDelete}
        />

        {/* Info Alert for Grid View */}
        <AnimatePresence>
          {viewMode === 'grid' && showGridInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Alert className="bg-violet-50/50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-violet-600" />
                  <AlertDescription className="text-violet-700 dark:text-violet-300">
                    Showing content in grid view. Cards auto-adjust to fit screen width.
                  </AlertDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-violet-100 dark:hover:bg-violet-800/50" onClick={() => setShowGridInfo(false)}>
                  <X className="w-3 h-3" />
                </Button>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- PREMIUM CONTROL BAR --- */}
        <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center w-full">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search testimonials..."
                className="pl-10 pr-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-violet-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between w-full border-t border-gray-100 dark:border-gray-800 pt-4">
             <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full lg:w-auto hide-scrollbar">
              {['all', 'text', 'video', 'image', 'liked'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                    activeFilter === filter
                      ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
                      : 'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter === 'all' && ` (${testimonials.length})`}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
               <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs">
                    <div className="flex items-center gap-2">
                       <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                       <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
               </Select>

               <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto h-9 text-xs justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {new Date(dateRange.from).toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {new Date(dateRange.to).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                          </>
                        ) : (
                          new Date(dateRange.from).toLocaleDateString()
                        )
                      ) : (
                        <span>Filter by Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="end">
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                          <h4 className="font-medium text-sm">Date Range</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] text-muted-foreground">From</label>
                              <Input 
                                 type="date" 
                                 className="h-8 text-xs" 
                                 value={dateRange.from} 
                                 onChange={(e) => setDateRange({...dateRange, from: e.target.value})} 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-muted-foreground">To</label>
                              <Input 
                                 type="date" 
                                 className="h-8 text-xs" 
                                 value={dateRange.to} 
                                 onChange={(e) => setDateRange({...dateRange, to: e.target.value})} 
                              />
                            </div>
                          </div>
                      </div>
                      <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setDateRange({from: '', to: ''})}>Clear</Button>
                      </div>
                    </div>
                  </PopoverContent>
               </Popover>
            </div>
          </div>
        </div>

        {(searchQuery || dateRange.from) && (
          <div className="text-xs text-muted-foreground px-1">
            Found {filteredTestimonials.length} result{filteredTestimonials.length !== 1 ? 's' : ''}
          </div>
        )}

        {filteredTestimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center z-10 relative shadow-sm"
              >
                <Search className="w-6 h-6 text-gray-400" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-violet-200 dark:bg-violet-800/20 rounded-full"
              />
            </div>
            
            <h3 className="text-sm font-semibold mb-1">No matches found</h3>
            <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
              Try adjusting your filters or search query.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setDateRange({from: '', to: ''});
              }}
            >
              Clear all filters
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className={viewMode === 'grid' 
              ? 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 auto-rows-fr' 
              : 'space-y-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  toggleLike={toggleLike}
                  onRequestDelete={handleRequestDelete}
                  setSelectedVideo={setSelectedVideo}
                  viewMode={viewMode}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default InboxTab;