/**
 * SuggestFeature - Feature Request Page
 * 
 * Functional feature suggestion form that stores submissions in localStorage.
 * Can be extended to send to backend/Supabase later.
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Lightbulb, Send, CheckCircle, AlertTriangle,
  Loader2, ArrowRight, Sparkles, Star, Zap, Heart
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

const SuggestFeature = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    title: '',
    description: '',
    useCase: '',
    priority: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'collection', label: 'Testimonial Collection' },
    { value: 'display', label: 'Display & Widgets' },
    { value: 'integration', label: 'Integrations' },
    { value: 'analytics', label: 'Analytics & Insights' },
    { value: 'workflow', label: 'Workflow & Automation' },
    { value: 'ui', label: 'User Interface' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: 'nice-to-have', label: 'Nice to Have', icon: Sparkles, color: 'text-blue-500' },
    { value: 'would-help', label: 'Would Really Help', icon: Star, color: 'text-amber-500' },
    { value: 'critical', label: 'Critical for My Workflow', icon: Zap, color: 'text-orange-500' },
    { value: 'blocker', label: 'Blocking My Business', icon: Heart, color: 'text-red-500' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please provide a title for your suggestion';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe your feature idea';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Please provide more details (at least 20 characters)';
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

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store in localStorage
      const existingSuggestions = JSON.parse(localStorage.getItem('trustflow_feature_suggestions') || '[]');
      const newSuggestion = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending',
        votes: 0,
      };
      existingSuggestions.push(newSuggestion);
      localStorage.setItem('trustflow_feature_suggestions', JSON.stringify(existingSuggestions));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        category: '',
        title: '',
        description: '',
        useCase: '',
        priority: '',
      });
    } catch (error) {
      console.error('Error submitting feature suggestion:', error);
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
            <Badge className="mb-6 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-0">
              <Lightbulb className="w-3 h-3 mr-1" />
              Feature Request
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Got an{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Amazing Idea?
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              We love hearing from our users! Share your feature ideas and help 
              shape the future of TrustWall.
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
                <Card className="bg-white dark:bg-slate-800/50 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      Idea Submitted! 🎉
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Thank you for sharing your brilliant idea! We review every suggestion 
                      and consider them for our roadmap.
                    </p>
                    
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      Share Another Idea
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
                      {/* Contact Info */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                            Your Name <span className="text-slate-400">(optional)</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                          />
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

                      {/* Feature Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                          Feature Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Slack Integration for New Testimonials"
                          className={`bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 ${
                            errors.title ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.title}
                          </p>
                        )}
                      </div>

                      {/* Category & Priority */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-slate-300">
                            Category <span className="text-slate-400">(optional)</span>
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleSelectChange('category', value)}
                          >
                            <SelectTrigger className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
                              <SelectValue placeholder="Select category..." />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-slate-300">
                            Priority <span className="text-slate-400">(optional)</span>
                          </Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) => handleSelectChange('priority', value)}
                          >
                            <SelectTrigger className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
                              <SelectValue placeholder="How important is this?" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  <div className={`flex items-center gap-2 ${priority.color}`}>
                                    <priority.icon className="w-4 h-4" />
                                    {priority.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Feature Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">
                          Feature Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your feature idea in detail..."
                          rows={4}
                          className={`bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 ${
                            errors.description ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.description}
                          </p>
                        )}
                      </div>

                      {/* Use Case */}
                      <div className="space-y-2">
                        <Label htmlFor="useCase" className="text-slate-700 dark:text-slate-300">
                          Use Case / Problem It Solves <span className="text-slate-400">(optional)</span>
                        </Label>
                        <Textarea
                          id="useCase"
                          name="useCase"
                          value={formData.useCase}
                          onChange={handleInputChange}
                          placeholder="How would this feature help you? What problem does it solve?"
                          rows={3}
                          className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold h-12"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Lightbulb className="w-5 h-5 mr-2" />
                            Submit Feature Request
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Popular Requests */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-violet-900 dark:text-violet-300 mb-1">
                        We're always improving
                      </h3>
                      <p className="text-sm text-violet-700 dark:text-violet-400">
                        Many of TrustWall's best features came from user suggestions just like yours. 
                        Every idea matters!
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default SuggestFeature;
