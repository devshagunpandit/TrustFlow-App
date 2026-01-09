import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, HeartOff, Trash2, Play, Inbox, Star, Video, Search, X, 
  Grid3x3, List, Plus, Image as ImageIcon, Maximize2, Tag as TagIcon,
  Info
} from 'lucide-react';

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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.img
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        src={src}
        alt={alt}
        className="max-w-full max-h-full rounded-lg shadow-2xl"
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

// Tag Input Component
const TagInput = ({ testimonialId, existingTags = [], onAddTag }) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [tagValue, setTagValue] = React.useState('');

  const handleAddTag = () => {
    if (tagValue.trim()) {
      onAddTag(testimonialId, tagValue.trim());
      setTagValue('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {existingTags.map((tag, idx) => (
        <Badge key={idx} variant="outline" className="text-xs bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700">
          {tag}
        </Badge>
      ))}
      {isAdding ? (
        <div className="flex items-center gap-1">
          <Input
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTag();
              if (e.key === 'Escape') setIsAdding(false);
            }}
            placeholder="Tag name"
            className="h-6 w-24 text-xs"
            autoFocus
          />
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleAddTag}>
            <Plus className="w-3 h-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsAdding(false)}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs text-muted-foreground hover:text-violet-600"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-3 h-3 mr-1" />
          Tag
        </Button>
      )}
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ 
  testimonial, 
  toggleLike, 
  deleteTestimonial, 
  setSelectedVideo,
  onAddTag,
  viewMode 
}) => {
  const [lightboxImage, setLightboxImage] = React.useState(null);
  const [isLiking, setIsLiking] = React.useState(false);

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

  if (viewMode === 'grid') {
    return (
      <>
        <motion.div layout className="h-full">
          <Card className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] h-full flex flex-col ${
            testimonial.is_liked 
              ? 'border-violet-300 dark:border-violet-700 bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-900/10 dark:to-transparent shadow-violet-100 dark:shadow-violet-900/20' 
              : 'border-gray-200 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg'
          }`}>
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-10 h-10 ring-2 ring-violet-100 dark:ring-violet-900 shrink-0">
                  <AvatarImage src={testimonial.respondent_photo_url} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm">
                    {testimonial.respondent_name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  {/* Matching List View Header Style */}
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="font-semibold text-sm truncate">{testimonial.respondent_name}</span>
                    
                    {/* Role Badge - Same as List View */}
                    {testimonial.respondent_role && (
                      <span className="text-[10px] text-muted-foreground bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full truncate max-w-[120px]">
                        {testimonial.respondent_role}
                      </span>
                    )}

                    {/* Video Badge */}
                    {testimonial.type === 'video' && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-[10px] px-1.5 h-5">
                        <Video className="w-2.5 h-2.5" />
                        Video
                      </Badge>
                    )}
                    
                    {/* Image Badge */}
                    {testimonial.attached_photo && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-[10px] px-1.5 h-5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                        <ImageIcon className="w-2.5 h-2.5" />
                        Image
                      </Badge>
                    )}
                  </div>

                  {/* Email Display - Same as List View */}
                  {testimonial.respondent_email && (
                     <div className="text-xs text-muted-foreground truncate leading-tight">
                       {testimonial.respondent_email}
                     </div>
                  )}
                </div>
              </div>

              {testimonial.rating && (
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              )}

              {/* Content Body */}
              <div className="flex-1">
                {testimonial.type === 'video' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedVideo(testimonial.video_url)}
                    className="w-full mb-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-violet-200 dark:border-violet-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Video
                  </Button>
                ) : (
                  <p className="text-sm text-foreground/90 line-clamp-4 mb-3 italic">"{testimonial.content}"</p>
                )}

                {/* Explicitly Checking for Attached Photo */}
                {testimonial.attached_photo && (
                  <div 
                    className="relative mb-3 rounded-lg overflow-hidden cursor-pointer group/img border border-gray-100 dark:border-gray-800"
                    onClick={() => setLightboxImage(testimonial.attached_photo)}
                  >
                    <img 
                      src={testimonial.attached_photo} 
                      alt="Attached proof" 
                      className="w-full h-32 object-cover transition-transform group-hover/img:scale-105"
                      onError={(e) => {
                        console.error("Image failed to load:", testimonial.attached_photo);
                        e.target.style.display = 'none'; // Hide if broken
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
                
                <div className="mb-2">
                  <TagInput 
                    testimonialId={testimonial.id}
                    existingTags={testimonial.tags}
                    onAddTag={onAddTag}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs text-muted-foreground">
                  {new Date(testimonial.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={isLiking ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLike}
                      className={`h-8 w-8 ${testimonial.is_liked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      {testimonial.is_liked ? <Heart className="w-4 h-4 fill-current" /> : <HeartOff className="w-4 h-4" />}
                    </Button>
                  </motion.div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTestimonial(testimonial.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
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

  // List View
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{testimonial.respondent_name}</span>
                  {testimonial.respondent_role && (
                    <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {testimonial.respondent_role}
                    </span>
                  )}
                  {/* Video Badge */}
                  {testimonial.type === 'video' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Video
                    </Badge>
                  )}
                  {/* Image Badge */}
                  {testimonial.attached_photo && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                      <ImageIcon className="w-3 h-3" />
                      Image
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
                
                <div className="flex items-start gap-3">
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
                      <p className="text-foreground/90 mb-3 italic">"{testimonial.content}"</p>
                    )}
                    
                    {testimonial.attached_photo && (
                      <div 
                        className="relative inline-block mt-2 rounded-lg overflow-hidden cursor-pointer group/img border border-gray-100 dark:border-gray-800"
                        onClick={() => setLightboxImage(testimonial.attached_photo)}
                      >
                        <img 
                          src={testimonial.attached_photo} 
                          alt="Attached proof" 
                          className="h-20 w-auto rounded-lg transition-transform group-hover/img:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <TagInput 
                    testimonialId={testimonial.id}
                    existingTags={testimonial.tags}
                    onAddTag={onAddTag}
                  />
                  <div className="text-xs text-muted-foreground">
                    {new Date(testimonial.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
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
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="text-gray-400 hover:text-red-500"
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

  useEffect(() => {
    if (viewMode === 'grid') {
      setShowGridInfo(true);
    } else {
      setShowGridInfo(false);
    }
  }, [viewMode]);

  const handleAddTag = (testimonialId, tag) => {
    console.log('Adding tag:', tag, 'to testimonial:', testimonialId);
  };

  // Filter and search logic
  const filteredTestimonials = React.useMemo(() => {
    let filtered = testimonials;

    // Apply filter
    if (activeFilter === 'video') {
      filtered = filtered.filter(t => t.type === 'video');
    } else if (activeFilter === 'text') {
      filtered = filtered.filter(t => t.type === 'text');
    } else if (activeFilter === 'image') {
      filtered = filtered.filter(t => t.attached_photo || t.type === 'image');
    } else if (activeFilter === 'liked') {
      filtered = filtered.filter(t => t.is_liked);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        (t.respondent_name && t.respondent_name.toLowerCase().includes(query)) ||
        (t.respondent_email && t.respondent_email.toLowerCase().includes(query)) ||
        (t.content && t.content.toLowerCase().includes(query)) ||
        (t.respondent_role && t.respondent_role.toLowerCase().includes(query)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    return filtered;
  }, [testimonials, activeFilter, searchQuery]);

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
        <Button onClick={copySubmitLink} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
          <Inbox className="w-4 h-4 mr-2" />
          Copy Collection Link
        </Button>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
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
                    Showing content in grid view. Click card to view details.
                  </AlertDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-violet-100 dark:hover:bg-violet-800/50" onClick={() => setShowGridInfo(false)}>
                  <X className="w-3 h-3" />
                </Button>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900/50 dark:to-transparent rounded-lg border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search testimonials (name, email, content...)"
              className="pl-10 pr-10 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'text', 'video', 'image', 'liked'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter === 'all' && ` (${testimonials.length})`}
                {filter === 'text' && ` (${testimonials.filter(t => t.type === 'text').length})`}
                {filter === 'video' && ` (${testimonials.filter(t => t.type === 'video').length})`}
                {filter === 'image' && ` (${testimonials.filter(t => t.attached_photo || t.type === 'image').length})`}
                {filter === 'liked' && ` (${testimonials.filter(t => t.is_liked).length})`}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Found {filteredTestimonials.length} result{filteredTestimonials.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Testimonials Grid/List */}
        {filteredTestimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 flex flex-col items-center justify-center"
          >
            {/* Smooth Bouncing Animation for Empty State */}
            <div className="relative mb-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center z-10 relative"
              >
                <Search className="w-8 h-8 text-gray-400" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-violet-200 dark:bg-violet-800/20 rounded-full"
              />
            </div>
            
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              {searchQuery 
                ? `We couldn't find any testimonials matching "${searchQuery}"`
                : `No ${activeFilter} testimonials found`
              }
            </p>
            {(searchQuery || activeFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear filters
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            layout
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr'
              : 'space-y-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  toggleLike={toggleLike}
                  deleteTestimonial={deleteTestimonial}
                  setSelectedVideo={setSelectedVideo}
                  onAddTag={handleAddTag}
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