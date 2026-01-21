/**
 * ReportBug - Bug Report Page
 * 
 * Functional bug report form that stores submissions in localStorage.
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
  Bug, Send, CheckCircle, AlertTriangle, Info,
  Loader2, ArrowRight, Shield
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

const ReportBug = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    severity: '',
    page: '',
    description: '',
    steps: '',
    expected: '',
    actual: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const severityLevels = [
    { value: 'low', label: 'Low - Minor inconvenience', color: 'text-blue-500' },
    { value: 'medium', label: 'Medium - Feature not working correctly', color: 'text-amber-500' },
    { value: 'high', label: 'High - Major feature broken', color: 'text-orange-500' },
    { value: 'critical', label: 'Critical - App is unusable', color: 'text-red-500' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.severity) {
      newErrors.severity = 'Please select a severity level';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the bug';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Please provide more details (at least 20 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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
      const existingReports = JSON.parse(localStorage.getItem('trustflow_bug_reports') || '[]');
      const newReport = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      existingReports.push(newReport);
      localStorage.setItem('trustflow_bug_reports', JSON.stringify(existingReports));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        severity: '',
        page: '',
        description: '',
        steps: '',
        expected: '',
        actual: '',
      });
    } catch (error) {
      console.error('Error submitting bug report:', error);
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
            <Badge className="mb-6 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-0">
              <Bug className="w-3 h-3 mr-1" />
              Report a Bug
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Found Something{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Buggy?
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Help us improve TrustWall by reporting any issues you encounter. 
              We take every bug report seriously.
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
                <Card className="bg-white dark:bg-slate-800/50 border-green-200 dark:border-green-800">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      Bug Report Submitted!
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Thank you for helping us improve TrustWall. We'll investigate this issue 
                      and get back to you if we need more information.
                    </p>
                    
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                    >
                      Report Another Bug
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

                      {/* Severity & Page */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-slate-300">
                            Severity <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.severity}
                            onValueChange={(value) => handleSelectChange('severity', value)}
                          >
                            <SelectTrigger className={`bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 ${
                              errors.severity ? 'border-red-500' : ''
                            }`}>
                              <SelectValue placeholder="Select severity..." />
                            </SelectTrigger>
                            <SelectContent>
                              {severityLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <span className={level.color}>{level.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.severity && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {errors.severity}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="page" className="text-slate-700 dark:text-slate-300">
                            Page/Feature <span className="text-slate-400">(optional)</span>
                          </Label>
                          <Input
                            id="page"
                            name="page"
                            value={formData.page}
                            onChange={handleInputChange}
                            placeholder="e.g., Dashboard, Settings"
                            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      {/* Bug Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">
                          Bug Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe the bug in detail..."
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

                      {/* Steps to Reproduce */}
                      <div className="space-y-2">
                        <Label htmlFor="steps" className="text-slate-700 dark:text-slate-300">
                          Steps to Reproduce <span className="text-slate-400">(optional)</span>
                        </Label>
                        <Textarea
                          id="steps"
                          name="steps"
                          value={formData.steps}
                          onChange={handleInputChange}
                          placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                          rows={3}
                          className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      {/* Expected vs Actual */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expected" className="text-slate-700 dark:text-slate-300">
                            Expected Behavior <span className="text-slate-400">(optional)</span>
                          </Label>
                          <Textarea
                            id="expected"
                            name="expected"
                            value={formData.expected}
                            onChange={handleInputChange}
                            placeholder="What should happen..."
                            rows={2}
                            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="actual" className="text-slate-700 dark:text-slate-300">
                            Actual Behavior <span className="text-slate-400">(optional)</span>
                          </Label>
                          <Textarea
                            id="actual"
                            name="actual"
                            value={formData.actual}
                            onChange={handleInputChange}
                            placeholder="What actually happens..."
                            rows={2}
                            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      {/* Privacy Notice */}
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                        <Shield className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Your report will help us improve TrustWall. We'll only use your email 
                          to follow up on this report if needed.
                        </p>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold h-12"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Submit Bug Report
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Tips for a great bug report
                      </h3>
                      <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>• Be specific about what you were doing when the bug occurred</li>
                        <li>• Include the browser/device you're using if relevant</li>
                        <li>• Screenshots or recordings can be very helpful</li>
                      </ul>
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

export default ReportBug;
