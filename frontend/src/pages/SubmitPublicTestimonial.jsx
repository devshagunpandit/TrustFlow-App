/**
 * SubmitPublicTestimonial - Public Testimonial Submission for TrustFlow
 * 
 * Allows users to submit testimonials about TrustFlow itself.
 * Stores submissions in localStorage (can be extended to Supabase later).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MessageSquareHeart, Send, CheckCircle, AlertTriangle,
  Loader2, ArrowRight, Star, Building2, User, Globe
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';
import { companyInfo } from '@/data/landingPageData';

const SubmitPublicTestimonial = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    website: '',
    testimonial: '',
    rating: 5,
    allowPublic: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [hoveredStar, setHoveredStar] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.testimonial.trim()) {
      newErrors.testimonial = 'Please share your experience';
    } else if (formData.testimonial.trim().length < 20) {
      newErrors.testimonial = 'Please write at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRating = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store in localStorage
      const existingTestimonials = JSON.parse(localStorage.getItem('trustflow_public_testimonials') || '[]');
      const newTestimonial = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending',
        approved: false,
      };
      existingTestimonials.push(newTestimonial);
      localStorage.setItem('trustflow_public_testimonials', JSON.stringify(existingTestimonials));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        role: '',
        website: '',
        testimonial: '',
        rating: 5,
        allowPublic: true,
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MarketingLayout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge className="mb-6 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-0">
              <MessageSquareHeart className="w-3 h-3 mr-1" />
              Share Your Story
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Love Using{' '}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {companyInfo.name}?
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              We'd love to hear about your experience! Share your story and help 
              others discover the power of authentic testimonials.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-xl mx-auto"
              >
                <Card className="bg-white dark:bg-slate-800/50 border-violet-200 dark:border-violet-800">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      Thank You! 💜
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Your testimonial has been submitted! We'll review it and may feature 
                      it on our website. Thank you for being part of our community!
                    </p>
                    
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                    >
                      Submit Another
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Rating */}
                      <div className="space-y-3">
                        <Label className="text-slate-700 dark:text-slate-300">
                          How would you rate {companyInfo.name}?
                        </Label>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRating(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-10 h-10 transition-colors ${
                                  star <= (hoveredStar || formData.rating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Personal Info */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Your Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className={`bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 ${
                              errors.name ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.name && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {errors.name}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className={`bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 ${
                              errors.email ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Company Info */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Company <span className="text-slate-400">(optional)</span>
                          </Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Your Company"
                            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-slate-700 dark:text-slate-300">
                            Your Role <span className="text-slate-400">(optional)</span>
                          </Label>
                          <Input
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            placeholder="e.g., Founder, Marketing Manager"
                            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Website <span className="text-slate-400">(optional)</span>
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                          className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      {/* Testimonial */}
                      <div className="space-y-2">
                        <Label htmlFor="testimonial" className="text-slate-700 dark:text-slate-300">
                          Your Testimonial <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="testimonial"
                          name="testimonial"
                          value={formData.testimonial}
                          onChange={handleInputChange}
                          placeholder="Tell us about your experience with TrustWall..."
                          rows={5}
                          className={`bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 ${
                            errors.testimonial ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.testimonial && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.testimonial}
                          </p>
                        )}
                        <p className="text-xs text-slate-400">
                          Tip: Share specific results or features you love!
                        </p>
                      </div>

                      {/* Permission checkbox */}
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                        <input
                          type="checkbox"
                          id="allowPublic"
                          checked={formData.allowPublic}
                          onChange={(e) => setFormData((prev) => ({ ...prev, allowPublic: e.target.checked }))}
                          className="mt-1 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                        />
                        <label htmlFor="allowPublic" className="text-sm text-slate-600 dark:text-slate-400">
                          I allow {companyInfo.name} to use my testimonial on their website and 
                          marketing materials.
                        </label>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold h-12"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Submit Testimonial
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default SubmitPublicTestimonial;
