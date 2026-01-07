import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, HeartOff, Trash2, Play, Inbox, Star, Video 
} from 'lucide-react';

const InboxTab = ({ 
  testimonials, 
  toggleLike, 
  deleteTestimonial, 
  setSelectedVideo, 
  copySubmitLink 
}) => {
  if (testimonials.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
          <Inbox className="w-10 h-10 text-violet-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No testimonials yet</h2>
        <p className="text-muted-foreground mb-6">Share your collection link to start receiving testimonials.</p>
        <Button onClick={copySubmitLink} className="bg-gradient-to-r from-violet-600 to-indigo-600">
          <Inbox className="w-4 h-4 mr-2" />
          Copy Collection Link
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={`transition-all hover:shadow-md ${testimonial.is_liked ? 'border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/10' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={testimonial.respondent_photo_url} />
                  <AvatarFallback className="bg-violet-100 text-violet-600">
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
                    {testimonial.type === 'video' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video
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
                  {testimonial.type === 'video' ? (
                    <Button variant="outline" size="sm" onClick={() => setSelectedVideo(testimonial.video_url)}>
                      <Play className="w-4 h-4 mr-2" />
                      Play Video
                    </Button>
                  ) : (
                    <p className="text-foreground/90">"{testimonial.content}"</p>
                  )}
                  <div className="text-xs text-muted-foreground mt-3">
                    {new Date(testimonial.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleLike(testimonial.id, testimonial.is_liked)}
                    className={testimonial.is_liked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
                  >
                    {testimonial.is_liked ? <Heart className="w-5 h-5 fill-current" /> : <HeartOff className="w-5 h-5" />}
                  </Button>
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
      ))}
    </div>
  );
};

export default InboxTab;