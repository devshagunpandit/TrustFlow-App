/**
 * Dashboard - Premium Analytics & Management Hub
 * Features: Analytics, Plan Management, Usage Tracking, Activity Timeline, Filtering
 */

import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/lib/supabase';
import { 
  Heart, Plus, Settings, LogOut, MoreVertical, ExternalLink, Copy, Trash2, Loader2, 
  Code, Layout, Palette, Eye, Star, TrendingUp, Users, MessageSquare, Sparkles, 
  ArrowUpRight, Clock, CheckCircle2, Video, Image, Zap, Crown, BarChart3, 
  Folder, RefreshCw, Search, Filter, Grid3X3, List, ChevronRight, Bell, 
  Activity, Target, Award, Flame, ArrowRight, Calendar, CreditCard, Shield,
  AlertTriangle, XCircle, Check, ChevronDown, ChevronUp, Download, Share2,
  TrendingDown, AlertCircle, Info, X, Rocket, CalendarDays,
  Receipt, Gauge, PieChart, Timer, Inbox, Eye as EyeIcon, FileText, 
  LayoutGrid, PlayCircle, PauseCircle, Layers, ArrowDownRight, Type,
  LineChart, AreaChart, ChevronLeft, Moon, Sun, Palette as PaletteIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import ProfileSlidePanel from '@/components/ProfileSlidePanel';
import UserProfileImage from '@/components/UserProfileImage';
import BrandedLoader from '@/components/BrandedLoader';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.05 }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// Animated Counter Hook - Fixed to re-animate when value changes
const useAnimatedCounter = (end, duration = 1500, startOnView = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false }); // Changed to false to allow re-triggering
  const prevEndRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (startOnView && !isInView) return;
    
    const endValue = typeof end === 'number' ? end : parseFloat(end) || 0;
    
    // If value hasn't changed and we already animated to it, skip
    if (prevEndRef.current === endValue && count === endValue) return;
    
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Store the new end value
    prevEndRef.current = endValue;
    
    // If end value is 0, just set it immediately
    if (endValue === 0) { 
      setCount(0); 
      return; 
    }
    
    const startValue = count;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      setCount(currentValue);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration, isInView, startOnView, count]);

  return { count, ref };
};

// Animated Number Component
const AnimatedNumber = memo(({ value, className = "", suffix = "" }) => {
  const { count, ref } = useAnimatedCounter(value);
  return <span ref={ref} className={className}>{count}{suffix}</span>;
});

// Enhanced Bar Chart Component with proper height scaling
const EnhancedBarChart = memo(({ data, height = 120, showLabels = true }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = height - (showLabels ? 24 : 0); // Reserve space for labels
  
  return (
    <TooltipProvider>
      <div className="flex flex-col h-full" style={{ height }}>
        <div className="flex items-end justify-between gap-1.5 flex-1 px-2">
          {data.map((item, i) => {
            const barHeight = maxValue > 0 ? Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 2) : 2;
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div 
                    className="flex-1 flex flex-col justify-end items-center cursor-pointer h-full"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
                      style={{ 
                        height: `${barHeight}%`,
                        transformOrigin: 'bottom'
                      }}
                      className={`w-full rounded-t-lg min-h-[4px] transition-all duration-200 ${
                        hoveredIndex === i 
                          ? 'bg-gradient-to-t from-violet-600 via-violet-500 to-violet-400 shadow-lg shadow-violet-500/40' 
                          : 'bg-gradient-to-t from-violet-500 via-violet-400 to-violet-300'
                      }`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-900 text-white border-0 shadow-xl">
                  <div className="text-center">
                    <p className="font-bold text-lg">{item.value}</p>
                    <p className="text-xs text-slate-400">{item.fullLabel || item.label}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        {showLabels && (
          <div className="flex justify-between px-2 pt-2">
            {data.map((item, i) => (
              <span 
                key={i} 
                className={`flex-1 text-center text-[10px] transition-colors ${
                  hoveredIndex === i ? 'text-violet-600 dark:text-violet-400 font-semibold' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
});

// Professional Line Chart Component - Responsive hover like ROI dashboard
const LineChartComponent = memo(({ data, height = 120 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  // Safe data handling - MUST be before any hooks that depend on it
  const safeData = useMemo(() => Array.isArray(data) && data.length > 0 ? data : [], [data]);
  const dataLength = safeData.length;
  
  // Handle mouse move for responsive hover - hooks must be called unconditionally
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || dataLength === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relX = x / rect.width;
    const idx = Math.round(relX * (dataLength - 1));
    const clampedIdx = Math.max(0, Math.min(dataLength - 1, idx));
    setHoveredIndex(clampedIdx);
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [dataLength]);
  
  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);
  
  // Early return AFTER hooks
  if (safeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        No data available
      </div>
    );
  }
  
  const maxValue = Math.max(...safeData.map(d => d.value || 0), 1);
  const padding = { top: 15, bottom: 30, left: 5, right: 5 };
  const chartWidth = 100;
  const chartHeight = 100;
  
  const points = safeData.map((item, i) => ({
    x: padding.left + (i / Math.max(safeData.length - 1, 1)) * (chartWidth - padding.left - padding.right),
    y: padding.top + (1 - (item.value || 0) / maxValue) * (chartHeight - padding.top - padding.bottom),
    ...item
  }));
  
  // Create smooth curve using bezier
  const createSmoothPath = (pts) => {
    if (!pts || pts.length < 2) return '';
    try {
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 >= pts.length ? i + 1 : i + 2];
        
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return path;
    } catch (e) {
      console.warn('LineChart path error:', e);
      return '';
    }
  };
  
  const pathD = createSmoothPath(points);
  const areaPath = pathD ? pathD + ` L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z` : '';
  
  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full cursor-crosshair" 
      style={{ height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="lineChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
          return (
            <line 
              key={i} 
              x1={padding.left} 
              y1={y} 
              x2={chartWidth - padding.right} 
              y2={y} 
              stroke="currentColor" 
              strokeWidth="0.2" 
              className="text-slate-200 dark:text-slate-700"
            />
          );
        })}
        
        {/* Area fill */}
        {areaPath && (
          <motion.path
            d={areaPath}
            fill="url(#lineChartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
        
        {/* Line */}
        {pathD && (
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#lineStrokeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}
        
        {/* Vertical hover line */}
        {hoveredPoint && (
          <line
            x1={hoveredPoint.x}
            y1={padding.top}
            x2={hoveredPoint.x}
            y2={chartHeight - padding.bottom}
            stroke="#8b5cf6"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />
        )}
        
        {/* Hover dot - only visible on hover */}
        {hoveredPoint && (
          <>
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="6" fill="#8b5cf6" opacity="0.2" />
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="white" stroke="#8b5cf6" strokeWidth="2" />
          </>
        )}
      </svg>
      
      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute pointer-events-none z-10 bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-center transform -translate-x-1/2"
          style={{ 
            left: `${(hoveredPoint.x / chartWidth) * 100}%`,
            top: '-8px',
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          <p className="font-bold text-lg">{hoveredPoint.value}</p>
          <p className="text-xs text-slate-400">{hoveredPoint.fullLabel || hoveredPoint.label}</p>
        </div>
      )}
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {safeData.filter((_, i) => i % Math.ceil(safeData.length / 6) === 0 || i === safeData.length - 1).map((item, i) => (
          <span key={i} className="text-[10px] text-muted-foreground">{item.label}</span>
        ))}
      </div>
    </div>
  );
});

// Professional Area Chart Component - Responsive hover like ROI dashboard
const AreaChartComponent = memo(({ data, height = 120 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);
  
  // Safe data handling - MUST be before any hooks that depend on it
  const safeData = useMemo(() => Array.isArray(data) && data.length > 0 ? data : [], [data]);
  const dataLength = safeData.length;
  
  // Handle mouse move for responsive hover - hooks must be called unconditionally
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || dataLength === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relX = x / rect.width;
    const idx = Math.round(relX * (dataLength - 1));
    const clampedIdx = Math.max(0, Math.min(dataLength - 1, idx));
    setHoveredIndex(clampedIdx);
  }, [dataLength]);
  
  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);
  
  // Early return AFTER hooks
  if (safeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        No data available
      </div>
    );
  }
  
  const maxValue = Math.max(...safeData.map(d => d.value || 0), 1);
  const padding = { top: 10, bottom: 28, left: 5, right: 5 };
  const chartWidth = 100;
  const chartHeight = 100;
  
  const points = safeData.map((item, i) => ({
    x: padding.left + (i / Math.max(safeData.length - 1, 1)) * (chartWidth - padding.left - padding.right),
    y: padding.top + (1 - (item.value || 0) / maxValue) * (chartHeight - padding.top - padding.bottom),
    ...item
  }));
  
  let pathD = '';
  let areaD = '';
  try {
    pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`;
  } catch (e) {
    console.warn('AreaChart path error:', e);
  }
  
  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full cursor-crosshair" 
      style={{ height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="areaFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="areaStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        
        {/* Grid */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
          return (
            <line 
              key={i} 
              x1={padding.left} 
              y1={y} 
              x2={chartWidth - padding.right} 
              y2={y} 
              stroke="currentColor"
              strokeWidth="0.15"
              className="text-slate-200 dark:text-slate-700"
            />
          );
        })}
        
        {/* Area fill */}
        {areaD && (
          <motion.path
            d={areaD}
            fill="url(#areaFillGradient)"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.8 }}
            style={{ transformOrigin: 'bottom' }}
          />
        )}
        
        {/* Line on top */}
        {pathD && (
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#areaStrokeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
        
        {/* Vertical hover line */}
        {hoveredPoint && (
          <line
            x1={hoveredPoint.x}
            y1={padding.top}
            x2={hoveredPoint.x}
            y2={chartHeight - padding.bottom}
            stroke="#7c3aed"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />
        )}
        
        {/* Hover dot - only visible on hover */}
        {hoveredPoint && (
          <>
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="6" fill="#7c3aed" opacity="0.2" />
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="white" stroke="#7c3aed" strokeWidth="2" />
          </>
        )}
      </svg>
      
      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute pointer-events-none z-10 bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-center transform -translate-x-1/2"
          style={{ 
            left: `${(hoveredPoint.x / chartWidth) * 100}%`,
            top: '-8px',
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          <p className="font-bold text-lg">{hoveredPoint.value}</p>
          <p className="text-xs text-slate-400">{hoveredPoint.fullLabel || hoveredPoint.label}</p>
        </div>
      )}
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {safeData.filter((_, i) => i % Math.ceil(safeData.length / 6) === 0 || i === safeData.length - 1).map((item, i) => (
          <span key={i} className="text-[10px] text-muted-foreground">{item.label}</span>
        ))}
      </div>
    </div>
  );
});

// Pie/Donut Chart Component
const PieChartComponent = memo(({ stats }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const data = [
    { label: 'Approved', value: stats.approvedTestimonials, color: '#10b981' },
    { label: 'Pending', value: stats.pendingTestimonials, color: '#f59e0b' },
    { label: 'Videos', value: stats.videoTestimonials, color: '#8b5cf6' },
  ].filter(d => d.value > 0);
  
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let currentAngle = -90;
  
  const slices = data.map((item, i) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    const endAngle = currentAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return {
      ...item,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: Math.round((item.value / total) * 100)
    };
  });
  
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-0">
            {slices.map((slice, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <motion.path
                    d={slice.path}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: hoveredIndex === i ? 1.05 : 1, 
                      opacity: 1 
                    }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="cursor-pointer origin-center"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-900 text-white">
                  <p className="font-semibold">{slice.label}: {slice.value}</p>
                  <p className="text-xs text-slate-400">{slice.percentage}%</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {/* Center circle for donut effect */}
            <circle cx="50" cy="50" r="22" fill="white" className="dark:fill-slate-800" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900 dark:text-white">{total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-2">
          {slices.map((slice, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-2 text-xs transition-opacity ${
                hoveredIndex !== null && hoveredIndex !== i ? 'opacity-50' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="text-slate-600 dark:text-slate-400">{slice.label}</span>
              <span className="font-medium text-slate-900 dark:text-white">{slice.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
});

// Chart Type Selector Component
const ChartTypeSelector = memo(({ chartType, onChartTypeChange }) => (
  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
    {[
      { id: 'bar', icon: BarChart3, label: 'Bar' },
      { id: 'line', icon: TrendingUp, label: 'Line' },
      { id: 'area', icon: Layers, label: 'Area' },
      { id: 'pie', icon: PieChart, label: 'Pie' },
    ].map((type) => (
      <Tooltip key={type.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => onChartTypeChange(type.id)}
            className={`p-1.5 rounded-md transition-all ${
              chartType === type.id
                ? 'bg-white dark:bg-slate-600 shadow-sm text-violet-600 dark:text-violet-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <type.icon className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{type.label} Chart</TooltipContent>
      </Tooltip>
    ))}
  </div>
));

// Animated Circular Progress Component
const AnimatedCircularProgress = memo(({ value, max, size = 100, strokeWidth = 10, label, icon: Icon, color = "#8b5cf6" }) => {
  const isUnlimited = max === -1 || max >= 9999 || max === Infinity;
  const displayMax = isUnlimited ? '∞' : max;
  const percentage = !isUnlimited && max > 0 ? Math.min((value / max) * 100, 100) : (isUnlimited ? Math.min(value * 2, 50) : 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const { count, ref } = useAnimatedCounter(value);
  
  const getColor = () => {
    if (isUnlimited) return color;
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return color;
  };
  
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative" style={{ width: size, height: size }} ref={ref}>
        {/* Background glow */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-20"
          style={{ background: getColor() }}
        />
        
        <svg width={size} height={size} className="rotate-[-90deg] relative z-10">
          {/* Background circle */}
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {Icon && (
            <Icon className="w-5 h-5 mb-1" style={{ color: getColor() }} />
          )}
          <span className="text-xl font-bold text-slate-900 dark:text-white">{count}</span>
          <span className="text-[10px] text-muted-foreground">
            / {displayMax}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
      )}
    </motion.div>
  );
});

// Sparkline Component with gradient
const SparkLine = memo(({ data, color = "#8b5cf6", height = 50, showDots = false }) => {
  if (!data || data.length < 2) return null;
  
  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((v - minVal) / range) * 100
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L 100 100 L 0 100 Z`;
  
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <motion.path
        d={areaD}
        fill="url(#sparklineGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* End dot */}
      {showDots && (
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="3"
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        />
      )}
    </svg>
  );
});

// Enhanced Usage Card with animation
// Enhanced Usage Card with animation - Fixed height
const UsageCard = memo(({ icon: Icon, title, used, limit, description, gradient = "from-violet-500 to-violet-600" }) => {
  const isUnlimited = limit === -1 || limit >= 9999 || limit === Infinity;
  const percentage = !isUnlimited && limit > 0 ? Math.round((used / limit) * 100) : 0;
  const displayLimit = isUnlimited ? '∞' : limit;
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !isUnlimited && percentage >= 100;
  const { count, ref } = useAnimatedCounter(used);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className={`relative overflow-hidden border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full min-h-[200px] ${
        isAtLimit ? 'ring-2 ring-red-500/50' : ''
      }`}>
        {/* Top accent line */}
        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${
          isAtLimit ? 'from-red-500 to-orange-500' : isNearLimit ? 'from-amber-500 to-orange-500' : gradient
        }`} />
        
        {/* Background glow */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} opacity-5 blur-3xl rounded-full`} />
        
        <CardContent className="p-5 relative h-full flex flex-col" ref={ref}>
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
            {isAtLimit && (
              <Badge variant="destructive" className="text-[10px] animate-pulse">
                Limit reached
              </Badge>
            )}
            {isUnlimited && (
              <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                Unlimited
              </Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1 line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1 min-h-[16px]">{description || '\u00A0'}</p>
          
          <div className="flex items-baseline gap-1 mb-3 mt-auto">
            <motion.span 
              className="text-3xl font-bold text-slate-900 dark:text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {count}
            </motion.span>
            <span className="text-sm text-muted-foreground">
              / {displayLimit}
            </span>
          </div>
          
          <div className="min-h-[36px]">
            {!isUnlimited && (
              <>
                <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      isAtLimit 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                        : isNearLimit 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : `bg-gradient-to-r ${gradient}`
                    }`}
                  />
                </div>
                <p className={`text-xs mt-2 ${
                  isAtLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-muted-foreground'
                }`}>
                  {percentage}% used
                </p>
              </>
            )}
            {isUnlimited && (
              <p className="text-xs mt-2 text-emerald-600 dark:text-emerald-400">
                No limits on this feature
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Premium Stats Card
const StatsCard = memo(({ icon: Icon, title, value, subtitle, trend, trendValue, color, delay = 0, sparklineData }) => {
  const { count, ref } = useAnimatedCounter(value);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Decorative elements */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.03]`} />
        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${color} opacity-10 blur-3xl rounded-full`} />
        
        <CardContent className="p-5 relative" ref={ref}>
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
            
            {trend && (
              <Badge 
                variant={trend === 'up' ? 'default' : 'secondary'} 
                className={`text-[10px] ${
                  trend === 'up' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' 
                    : trend === 'down'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                      : ''
                }`}
              >
                {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {trendValue}
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-1">{title}</p>
          <motion.p 
            className="text-3xl font-bold text-slate-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: delay + 0.1 }}
          >
            {count}
          </motion.p>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          
          {sparklineData && sparklineData.length > 1 && (
            <div className="mt-3 h-10">
              <SparkLine data={sparklineData} showDots />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Space Card Component
const SpaceCard = memo(({ space, index, onNavigate, onCopyLink, onOpenEmbed, onDelete }) => {
  const testimonialCount = space.testimonials?.[0]?.count || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card 
        className="group h-full relative overflow-hidden border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={() => onNavigate(space.id)}
      >
        {/* Gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Decorative blob */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="pb-3 relative">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25"
                >
                  <Folder className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {space.space_name}
                  </CardTitle>
                  <CardDescription className="text-xs truncate">
                    /{space.slug}
                  </CardDescription>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopyLink(space.slug); }}>
                  <Copy className="w-4 h-4 mr-2" /> Copy submit link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(`/submit/${space.slug}`, '_blank'); }}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Open form
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpenEmbed(space.id); }}>
                  <Code className="w-4 h-4 mr-2" /> Embed Widget
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(space.id); }}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 relative">
          {/* Stats row */}
          <div className="flex items-center gap-4 py-3 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 text-sm">
              <MessageSquare className="w-4 h-4 text-violet-500" />
              <span className="font-semibold">{testimonialCount}</span>
              <span className="text-muted-foreground text-xs">testimonials</span>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="flex gap-2 mt-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 h-9 text-xs bg-slate-100/80 dark:bg-slate-700/50 hover:bg-violet-100 dark:hover:bg-violet-900/30 border-0"
              onClick={(e) => { e.stopPropagation(); onCopyLink(space.slug); }}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 px-3 bg-slate-100/80 dark:bg-slate-700/50 hover:bg-violet-100 dark:hover:bg-violet-900/30 border-0"
              onClick={(e) => { e.stopPropagation(); window.open(`/submit/${space.slug}`, '_blank'); }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
        
        {/* Hover arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-violet-600" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

// Create Space Card
const CreateSpaceCard = memo(({ onClick, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="h-full"
  >
    <Card 
      className="h-full min-h-[200px] border-2 border-dashed border-violet-200 dark:border-violet-800/50 hover:border-violet-400 dark:hover:border-violet-600 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group"
      onClick={onClick}
    >
      <CardContent className="text-center py-8">
        <motion.div 
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Plus className="w-8 h-8 text-white" />
        </motion.div>
        <p className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          Create New Space
        </p>
        <p className="text-xs text-muted-foreground mt-1">Start collecting testimonials</p>
      </CardContent>
    </Card>
  </motion.div>
));

// Testimonial Filter Component
const TestimonialFilter = memo(({ filter, onFilterChange, counts }) => (
  <div className="flex flex-wrap gap-2">
    {[
      { id: 'all', label: 'All', count: counts.all, icon: LayoutGrid },
      { id: 'video', label: 'Videos', count: counts.video, icon: Video },
      { id: 'text', label: 'Text', count: counts.text, icon: Type },
      { id: 'pending', label: 'Pending', count: counts.pending, icon: Clock },
      { id: 'approved', label: 'Approved', count: counts.approved, icon: CheckCircle2 },
    ].map((item) => (
      <motion.button
        key={item.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onFilterChange(item.id)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          filter === item.id
            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 shadow-sm'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
      >
        <item.icon className="w-4 h-4" />
        {item.label}
        <Badge variant="secondary" className={`text-[10px] ${
          filter === item.id ? 'bg-violet-200 dark:bg-violet-800' : ''
        }`}>
          {item.count}
        </Badge>
      </motion.button>
    ))}
  </div>
));

// Activity Timeline Item
const ActivityItem = memo(({ activity, isLast }) => {
  const getActivityStyle = (type) => {
    switch (type) {
      case 'testimonial_approved':
        return { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 };
      case 'testimonial_received':
        return { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400', icon: MessageSquare };
      case 'video_received':
        return { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400', icon: Video };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', icon: Activity };
    }
  };

  const style = getActivityStyle(activity.type);
  const Icon = style.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3"
    >
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${style.bg}`}>
          <Icon className={`w-4 h-4 ${style.text}`} />
        </div>
        {!isLast && <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-2" />}
      </div>
      <div className="flex-1 pb-4">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.description}</p>
        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
      </div>
    </motion.div>
  );
});

const Dashboard = () => {
  const { user, profile, signOut, loading: authLoading, refreshProfile } = useAuth();
  const { 
    subscription, 
    loading: subLoading, 
    quotas, 
    planHierarchy, 
    effectivePlan,
    allPlans,
    refreshSubscription 
  } = useSubscription() || {};
  
  const [spaces, setSpaces] = useState([]);
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('7d');
  const [testimonialFilter, setTestimonialFilter] = useState('all');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [billingPortalLoading, setBillingPortalLoading] = useState(false);
  
  // Embed Modal State
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState('');
  const [embedTheme, setEmbedTheme] = useState('light');
  const [embedLayout, setEmbedLayout] = useState('grid');
  
  // Chart Type State
  const [chartType, setChartType] = useState('bar');
  
  // Testimonial Details View State
  const [selectedTestimonialSpace, setSelectedTestimonialSpace] = useState(null);
  const [detailsFilter, setDetailsFilter] = useState('all');
  
  // Last fetch timestamp for data freshness
  const lastFetchRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: spacesData, error: spacesError } = await supabase
        .from('spaces')
        .select('*, testimonials(count)')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (spacesError) throw spacesError;
      setSpaces(spacesData || []);

      // Only fetch testimonials if we have spaces
      const spaceIds = (spacesData || []).map(s => s.id);
      if (spaceIds.length === 0) {
        setAllTestimonials([]);
        return;
      }

      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('id, type, video_url, is_liked, created_at, space_id, respondent_name, respondent_email, respondent_photo_url, rating, content')
        .in('space_id', spaceIds)
        .order('created_at', { ascending: false })
        .limit(500);

      if (!testimonialsError) {
        setAllTestimonials(testimonialsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data', { description: 'Please try refreshing the page.' });
    } finally {
      setLoading(false);
      lastFetchRef.current = Date.now();
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchAllData();
  }, [user, fetchAllData]);

  // IMPORTANT: Refetch data when switching to overview tab to prevent stale data
  useEffect(() => {
    if (activeTab === 'overview' && user && !loading) {
      const now = Date.now();
      // Only refetch if data is stale (more than 30 seconds old) or never fetched
      if (!lastFetchRef.current || (now - lastFetchRef.current) > 30000) {
        fetchAllData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  // IMPORTANT: Refresh subscription when user returns to dashboard (e.g., from customer portal)
  // This ensures plan changes made in Lemon Squeezy portal are reflected immediately
  // NOTE: Using debounce to prevent refresh during file picker operations
  useEffect(() => {
    let refreshTimeout = null;
    let lastRefreshTime = 0;
    const DEBOUNCE_MS = 2000; // Minimum 2 seconds between refreshes
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        const now = Date.now();
        // Only refresh if enough time has passed since last refresh
        if (now - lastRefreshTime > DEBOUNCE_MS) {
          lastRefreshTime = now;
          // Delay refresh to avoid triggering during file picker close
          refreshTimeout = setTimeout(() => {
            refreshSubscription?.();
          }, 500);
        }
      }
    };

    // Removed focus listener - visibilitychange is sufficient and more reliable
    // Focus events fire too frequently (e.g., during file picker operations)

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [user, refreshSubscription]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllData();
      await refreshSubscription?.();
      toast.success('Dashboard refreshed!');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  // Enhanced stats with time filtering
  const stats = useMemo(() => {
    const now = new Date();
    let filterDate = new Date();
    switch (timeFilter) {
      case '24h': filterDate.setDate(filterDate.getDate() - 1); break;
      case '7d': filterDate.setDate(filterDate.getDate() - 7); break;
      case '30d': filterDate.setDate(filterDate.getDate() - 30); break;
      case '90d': filterDate.setDate(filterDate.getDate() - 90); break;
      default: filterDate.setDate(filterDate.getDate() - 7);
    }
    
    const filteredTestimonials = allTestimonials.filter(t => new Date(t.created_at) >= filterDate);
    const totalTestimonials = allTestimonials.length;
    // is_liked = true means approved, false or null means pending
    const approvedTestimonials = allTestimonials.filter(t => t.is_liked === true).length;
    const pendingTestimonials = allTestimonials.filter(t => t.is_liked !== true).length;
    const videoTestimonials = allTestimonials.filter(t => t.video_url || t.type === 'video').length;
    const textTestimonials = allTestimonials.filter(t => !t.video_url && t.type !== 'video').length;
    const recentTestimonials = filteredTestimonials.length;
    
    // Average rating
    const ratingsSum = allTestimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
    const avgRating = totalTestimonials > 0 ? (ratingsSum / totalTestimonials).toFixed(1) : 0;
    
    // Growth rate
    const prevFilterDate = new Date(filterDate);
    const periodLength = now - filterDate;
    prevFilterDate.setTime(prevFilterDate.getTime() - periodLength);
    const prevTestimonials = allTestimonials.filter(
      t => new Date(t.created_at) >= prevFilterDate && new Date(t.created_at) < filterDate
    ).length;
    const growthRate = prevTestimonials > 0 
      ? Math.round(((recentTestimonials - prevTestimonials) / prevTestimonials) * 100) 
      : recentTestimonials > 0 ? 100 : 0;
    
    return {
      totalSpaces: spaces.length,
      totalTestimonials,
      approvedTestimonials,
      pendingTestimonials,
      videoTestimonials,
      textTestimonials,
      recentTestimonials,
      growthRate,
      avgRating,
      approvalRate: totalTestimonials > 0 ? Math.round((approvedTestimonials / totalTestimonials) * 100) : 0
    };
  }, [spaces, allTestimonials, timeFilter]);

  // Filter counts for testimonial filter
  const filterCounts = useMemo(() => ({
    all: allTestimonials.length,
    video: allTestimonials.filter(t => t.video_url || t.type === 'video').length,
    text: allTestimonials.filter(t => !t.video_url && t.type !== 'video').length,
    pending: allTestimonials.filter(t => t.is_liked !== true).length,
    approved: allTestimonials.filter(t => t.is_liked === true).length,
  }), [allTestimonials]);

  // Chart data for testimonials over time
  const chartData = useMemo(() => {
    const days = timeFilter === '24h' ? 24 : timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : 12;
    const isHourly = timeFilter === '24h';
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      if (isHourly) {
        date.setHours(date.getHours() - i);
        const count = allTestimonials.filter(t => {
          const tDate = new Date(t.created_at);
          return tDate.getHours() === date.getHours() && tDate.getDate() === date.getDate();
        }).length;
        data.push({ 
          label: date.getHours() + 'h', 
          fullLabel: `${date.getHours()}:00`,
          value: count 
        });
      } else {
        date.setDate(date.getDate() - i);
        const count = allTestimonials.filter(t => new Date(t.created_at).toDateString() === date.toDateString()).length;
        const label = timeFilter === '7d' 
          ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()] 
          : date.getDate().toString();
        data.push({ 
          label, 
          fullLabel: date.toLocaleDateString(),
          value: count 
        });
      }
    }
    return data;
  }, [allTestimonials, timeFilter]);

  const sparklineData = useMemo(() => chartData.map(d => d.value), [chartData]);

  // Recent activity
  const recentActivity = useMemo(() => {
    return allTestimonials.slice(0, 8).map(t => {
      const isVideo = t.video_url || t.type === 'video';
      const isApproved = t.is_liked === true;
      return {
        id: t.id,
        type: isVideo ? 'video_received' : isApproved ? 'testimonial_approved' : 'testimonial_received',
        title: isVideo ? 'Video Testimonial' : isApproved ? 'Testimonial Approved' : 'New Testimonial',
        description: `From ${t.respondent_name || 'Anonymous'}`,
        time: getTimeAgo(new Date(t.created_at)),
        date: new Date(t.created_at)
      };
    });
  }, [allTestimonials]);

  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  // Filter spaces
  const filteredSpaces = useMemo(() => {
    if (!searchQuery.trim()) return spaces;
    const query = searchQuery.toLowerCase();
    return spaces.filter(space => 
      space.space_name.toLowerCase().includes(query) ||
      space.slug.toLowerCase().includes(query)
    );
  }, [spaces, searchQuery]);

  const generateSlug = useCallback((name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + uuidv4().slice(0, 6);
  }, []);

  const createSpace = async (e) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    
    const maxSpaces = quotas?.maxSpaces || 1;
    const isUnlimitedSpaces = maxSpaces === -1 || maxSpaces >= 9999;
    if (!isUnlimitedSpaces && spaces.length >= maxSpaces) {
      toast.error('Space limit reached', { description: 'Upgrade your plan to create more spaces.' });
      return;
    }

    setCreating(true);
    try {
      const slug = generateSlug(newSpaceName);
      const { data, error } = await supabase
        .from('spaces')
        .insert({
          id: uuidv4(),
          owner_id: user.id,
          space_name: newSpaceName,
          slug: slug,
          header_title: `Share your experience with ${newSpaceName}`,
          custom_message: 'We appreciate your feedback! Please take a moment to share your experience.',
          collect_star_rating: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setSpaces([data, ...spaces]);
      setCreateDialogOpen(false);
      setNewSpaceName('');
      toast.success('Space created successfully! 🎉');
      navigate(`/dashboard/${data.id}`);
    } catch (error) {
      console.error('Error creating space:', error);
      toast.error('Failed to create space');
    } finally {
      setCreating(false);
    }
  };

  const deleteSpace = async (spaceId) => {
    if (!window.confirm('Are you sure you want to delete this space? All testimonials will be lost.')) return;

    try {
      const { error } = await supabase.from('spaces').delete().eq('id', spaceId);
      if (error) throw error;
      setSpaces(spaces.filter(s => s.id !== spaceId));
      toast.success('Space deleted');
    } catch (error) {
      console.error('Error deleting space:', error);
      toast.error('Failed to delete space');
    }
  };

  const copySubmitLink = useCallback((slug) => {
    const link = `${window.location.origin}/submit/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied! 📋');
  }, []);

  const openEmbedModal = useCallback((spaceId) => {
    setSelectedSpaceId(spaceId);
    setEmbedTheme('light');
    setEmbedLayout('grid');
    setEmbedDialogOpen(true);
  }, []);

  const getPreviewUrl = useCallback(() => {
    const origin = window.location.origin;
    const queryParams = [];
    if (embedTheme !== 'light') queryParams.push(`theme=${embedTheme}`);
    if (embedLayout !== 'grid') queryParams.push(`layout=${embedLayout}`);
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    return `${origin}/embed/${selectedSpaceId}${queryString}`;
  }, [selectedSpaceId, embedTheme, embedLayout]);

  const getEmbedCode = useCallback(() => {
    const origin = window.location.origin;
    return `<script src="${origin}/embed.js" data-space-id="${selectedSpaceId}" data-theme="${embedTheme}" data-layout="${embedLayout}"></script>`;
  }, [selectedSpaceId, embedTheme, embedLayout]);

  const copyEmbedCode = useCallback(() => {
    navigator.clipboard.writeText(getEmbedCode());
    toast.success('Embed code copied! 🚀');
  }, [getEmbedCode]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      toast.info('Cancellation request submitted');
      setCancelDialogOpen(false);
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  // Handle Manage Subscription - Redirect to Lemon Squeezy Customer Portal
  const handleManageSubscription = async () => {
    // Security check: User must be logged in
    if (!user?.id) {
      toast.error('Please log in to manage your subscription');
      return;
    }
    
    setBillingPortalLoading(true);
    try {
      // Get the current session token for secure API call
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.access_token) {
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const accessToken = sessionData.session.access_token;
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://trust-flow-app.vercel.app';
      
      const response = await fetch(`${BACKEND_URL}/api/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific security errors
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          return;
        }
        if (response.status === 403) {
          toast.error('Access denied. You can only manage your own subscription.');
          return;
        }
        throw new Error(data.detail || 'Failed to open billing portal');
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      toast.error('Failed to redirect to billing portal', {
        description: error.message || 'Please try again later.'
      });
    } finally {
      setBillingPortalLoading(false);
    }
  };

  // Loading state
  if (authLoading || subLoading) {
    return (
      <BrandedLoader 
        fullScreen={true} 
        isLoading={true} 
        size="large"
      />
    );
  }

  if (!user) return null;

  // Get plan info
  const currentPlanId = subscription?.plan_id?.toLowerCase() || effectivePlan?.toLowerCase() || 'free';
  const isProPlan = currentPlanId === 'pro';
  const isStarterPlan = currentPlanId === 'starter';
  const isFreePlan = !isProPlan && !isStarterPlan;
  const showUpgradeOption = !isProPlan; // Only show upgrade for free and starter plans
  
  // Handle upgrade button click - Free users go to pricing, Paid users go to portal
  const handleUpgradeClick = () => {
    if (isFreePlan) {
      navigate('/pricing');
    } else {
      // Paid users (Starter) go to customer portal
      handleManageSubscription();
    }
  };
  
  const getPlanGradient = () => {
    if (isProPlan) return 'from-amber-500 to-orange-500';
    if (isStarterPlan) return 'from-violet-500 to-indigo-500';
    return 'from-slate-500 to-slate-600';
  };

  const PlanIcon = isProPlan ? Crown : isStarterPlan ? Rocket : Zap;
  
  // Helper to format limit display (show ∞ for unlimited)
  const formatLimit = (limit) => {
    if (limit === -1 || limit >= 9999 || limit === Infinity) return '∞';
    return limit;
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - TrustWall</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-200/40 via-purple-200/30 to-indigo-200/40 dark:from-violet-900/20 dark:via-purple-900/15 dark:to-indigo-900/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 3,
          }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-indigo-200/30 via-violet-200/20 to-purple-200/30 dark:from-indigo-900/15 dark:via-violet-900/10 dark:to-purple-900/15 blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25"
              >
                <Star className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
                TrustWall
              </span>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="w-9 h-9 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh Dashboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Profile Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfilePanelOpen(true)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors"
              >
                <UserProfileImage 
                  src={profile?.avatar_url} 
                  alt={profile?.full_name || "User"} 
                  className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-700 shadow-sm"
                  iconClassName="w-4 h-4"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block max-w-[120px] truncate">
                  {profile?.full_name?.split(' ')[0] || 'User'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {/* Welcome Section */}
        <motion.div {...fadeInUp} className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Here's your testimonial performance overview
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-28 h-9 text-xs bg-white dark:bg-slate-800">
                  <Calendar className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                disabled={!quotas || (quotas.maxSpaces !== -1 && quotas.maxSpaces < 9999 && stats.totalSpaces >= quotas.maxSpaces)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
              >
                <Plus className="w-4 h-4 mr-1.5" /> New Space
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-1.5 rounded-xl shadow-sm">
            <TabsTrigger value="overview" className="rounded-lg text-xs sm:text-sm gap-1.5 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/50 dark:data-[state=active]:text-violet-300">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="rounded-lg text-xs sm:text-sm gap-1.5 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/50 dark:data-[state=active]:text-violet-300">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Testimonials</span>
            </TabsTrigger>
            <TabsTrigger value="spaces" className="rounded-lg text-xs sm:text-sm gap-1.5 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/50 dark:data-[state=active]:text-violet-300">
              <Folder className="w-4 h-4" />
              <span className="hidden sm:inline">Spaces</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg text-xs sm:text-sm gap-1.5 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/50 dark:data-[state=active]:text-violet-300">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                icon={MessageSquare}
                title="Total Testimonials"
                value={stats.totalTestimonials}
                trend={stats.growthRate !== 0 ? (stats.growthRate > 0 ? 'up' : 'down') : null}
                trendValue={stats.growthRate !== 0 ? `${stats.growthRate > 0 ? '+' : ''}${stats.growthRate}%` : null}
                color="from-violet-500 to-indigo-500"
                delay={0.1}
                sparklineData={sparklineData}
              />
              <StatsCard
                icon={CheckCircle2}
                title="Approved"
                value={stats.approvedTestimonials}
                subtitle={`${stats.approvalRate}% approval rate`}
                color="from-emerald-500 to-emerald-600"
                delay={0.15}
              />
              <StatsCard
                icon={Clock}
                title="Pending Review"
                value={stats.pendingTestimonials}
                subtitle={stats.pendingTestimonials > 0 ? "Action needed" : "All caught up!"}
                color="from-amber-500 to-orange-500"
                delay={0.2}
              />
              <StatsCard
                icon={Video}
                title="Video Testimonials"
                value={stats.videoTestimonials}
                subtitle="Collected"
                color="from-purple-500 to-pink-500"
                delay={0.25}
              />
            </div>

            {/* Charts & Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="lg:col-span-2">
                <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg h-full">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-violet-500" />
                          Testimonials Over Time
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {timeFilter === '24h' ? 'Hourly' : 'Daily'} breakdown
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <ChartTypeSelector chartType={chartType} onChartTypeChange={setChartType} />
                        </TooltipProvider>
                        <Badge variant="outline" className="text-xs bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hidden sm:flex">
                          {stats.recentTestimonials} in period
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-56">
                      {chartType === 'bar' && <EnhancedBarChart data={chartData} height={200} />}
                      {chartType === 'line' && <LineChartComponent data={chartData} height={200} />}
                      {chartType === 'area' && <AreaChartComponent data={chartData} height={200} />}
                      {chartType === 'pie' && <PieChartComponent stats={stats} />}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Feed */}
              <motion.div {...fadeInUp} transition={{ delay: 0.35 }}>
                <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="w-4 h-4 text-violet-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500">
                    {recentActivity.length > 0 ? (
                      recentActivity.slice(0, 5).map((activity, i) => (
                        <ActivityItem 
                          key={activity.id} 
                          activity={activity} 
                          isLast={i === Math.min(recentActivity.length - 1, 4)} 
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Inbox className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Usage Overview */}
            <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
              <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-violet-500" />
                        Plan Usage
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Track your resource consumption
                      </CardDescription>
                    </div>
                    {showUpgradeOption && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs gap-1.5" 
                        onClick={handleUpgradeClick}
                      >
                        <Zap className="w-3 h-3" /> Upgrade
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <UsageCard 
                      icon={Folder} 
                      title="Spaces" 
                      used={stats.totalSpaces} 
                      limit={quotas?.maxSpaces || 1}
                      description="Active spaces"
                      gradient="from-violet-500 to-indigo-500"
                    />
                    <UsageCard 
                      icon={MessageSquare} 
                      title="Text Testimonials" 
                      used={stats.textTestimonials} 
                      limit={quotas?.maxTextTestimonials || 10}
                      description="Written feedback"
                      gradient="from-blue-500 to-cyan-500"
                    />
                    <UsageCard 
                      icon={Video} 
                      title="Videos" 
                      used={stats.videoTestimonials} 
                      limit={quotas?.maxVideos || 0}
                      description="Video testimonials"
                      gradient="from-purple-500 to-pink-500"
                    />
                    <UsageCard 
                      icon={Star} 
                      title="Avg Rating" 
                      used={stats.avgRating} 
                      limit={5}
                      description="Customer satisfaction"
                      gradient="from-amber-500 to-orange-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div {...fadeInUp} transition={{ delay: 0.45 }}>
              <div className={`grid gap-3 ${showUpgradeOption ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 w-full flex-col gap-2 bg-white/90 dark:bg-slate-800/90" 
                    onClick={() => setCreateDialogOpen(true)}
                    disabled={!quotas || (quotas.maxSpaces !== -1 && quotas.maxSpaces < 9999 && stats.totalSpaces >= quotas.maxSpaces)}
                  >
                    <Plus className="w-5 h-5 text-violet-500" />
                    <span className="text-xs">New Space</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 w-full flex-col gap-2 bg-white/90 dark:bg-slate-800/90" 
                    onClick={() => spaces[0] && navigate(`/dashboard/${spaces[0].id}`)}
                  >
                    <Inbox className="w-5 h-5 text-blue-500" />
                    <span className="text-xs">View Inbox</span>
                  </Button>
                </motion.div>
                {showUpgradeOption && (
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 w-full flex-col gap-2 bg-white/90 dark:bg-slate-800/90" 
                      onClick={handleUpgradeClick}
                    >
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span className="text-xs">Upgrade</span>
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 w-full flex-col gap-2 bg-white/90 dark:bg-slate-800/90" 
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`w-5 h-5 text-emerald-500 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="text-xs">Refresh</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* TESTIMONIALS TAB */}
          <TabsContent value="testimonials" className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedTestimonialSpace ? (
                // Testimonial Details View
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Back Header */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedTestimonialSpace(null)}
                        className="h-10 w-10 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Folder className="w-5 h-5 text-violet-500" />
                          {selectedTestimonialSpace.space_name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {allTestimonials.filter(t => t.space_id === selectedTestimonialSpace.id).length} testimonials
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Filters for details view */}
                      <Select value={detailsFilter} onValueChange={setDetailsFilter}>
                        <SelectTrigger className="w-32 h-9 text-xs bg-white dark:bg-slate-800">
                          <Filter className="w-3 h-3 mr-1" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="video">Videos</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dashboard/${selectedTestimonialSpace.id}`)}
                        className="h-9"
                      >
                        <ExternalLink className="w-4 h-4 mr-1.5" />
                        <span className="hidden sm:inline">Manage Space</span>
                      </Button>
                    </div>
                  </div>

                  {/* Testimonials Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allTestimonials
                      .filter(t => t.space_id === selectedTestimonialSpace.id)
                      .filter(t => {
                        if (detailsFilter === 'all') return true;
                        if (detailsFilter === 'approved') return t.is_liked === true;
                        if (detailsFilter === 'pending') return t.is_liked !== true;
                        if (detailsFilter === 'video') return t.video_url || t.type === 'video';
                        if (detailsFilter === 'text') return !t.video_url && t.type !== 'video';
                        return true;
                      })
                      .map((testimonial, idx) => (
                        <motion.div
                          key={testimonial.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Card className="h-full border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-4">
                              {/* Header with avatar and name */}
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden">
                                  {testimonial.respondent_photo_url ? (
                                    <img src={testimonial.respondent_photo_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    (testimonial.respondent_name || 'A').charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                                    {testimonial.respondent_name || 'Anonymous'}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {testimonial.respondent_email || 'No email'}
                                  </p>
                                </div>
                                <Badge 
                                  variant={testimonial.is_liked ? 'default' : 'secondary'} 
                                  className={`text-[10px] shrink-0 ${
                                    testimonial.is_liked 
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' 
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                                  }`}
                                >
                                  {testimonial.is_liked ? 'Approved' : 'Pending'}
                                </Badge>
                              </div>
                              
                              {/* Rating */}
                              {testimonial.rating > 0 && (
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3 h-3 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} 
                                    />
                                  ))}
                                </div>
                              )}
                              
                              {/* Content */}
                              {testimonial.video_url || testimonial.type === 'video' ? (
                                <div className="relative aspect-video rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden mb-3">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-violet-600/90 flex items-center justify-center">
                                      <PlayCircle className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <Badge className="absolute top-2 right-2 text-[10px] bg-purple-600">Video</Badge>
                                </div>
                              ) : (
                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 mb-3">
                                  "{testimonial.content || 'No content'}"
                                </p>
                              )}
                              
                              {/* Footer */}
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(testimonial.created_at).toLocaleDateString()}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-xs hover:text-violet-600"
                                  onClick={() => navigate(`/dashboard/${selectedTestimonialSpace.id}`)}
                                >
                                  View <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    }
                  </div>
                  
                  {/* Empty State */}
                  {allTestimonials.filter(t => t.space_id === selectedTestimonialSpace.id).length === 0 && (
                    <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                      <CardContent className="py-16 text-center">
                        <Inbox className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No testimonials yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Share your submission link to start collecting</p>
                        <Button 
                          onClick={() => copySubmitLink(selectedTestimonialSpace.slug)}
                          className="bg-gradient-to-r from-violet-600 to-indigo-600"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Submit Link
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ) : (
                // Space Cards Grid View
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Testimonials</h2>
                      <p className="text-sm text-muted-foreground">{stats.totalTestimonials} testimonials across {spaces.length} spaces</p>
                    </div>
                  </div>

                  {/* Space Cards Grid - Click to view testimonials */}
                  {spaces.length === 0 ? (
                    <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                      <CardContent className="py-16 text-center">
                        <motion.div 
                          initial={{ scale: 0.8 }} 
                          animate={{ scale: 1 }}
                          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl"
                        >
                          <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold mb-2">Create your first space</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                          Start collecting testimonials by creating a space
                        </p>
                        <Button 
                          onClick={() => setCreateDialogOpen(true)} 
                          className="bg-gradient-to-r from-violet-600 to-indigo-600"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Create Space
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {spaces.map((space, index) => {
                        const spaceTestimonials = allTestimonials.filter(t => t.space_id === space.id);
                        const approvedCount = spaceTestimonials.filter(t => t.is_liked === true).length;
                        const pendingCount = spaceTestimonials.filter(t => t.is_liked !== true).length;
                        const videoCount = spaceTestimonials.filter(t => t.video_url || t.type === 'video').length;
                        
                        return (
                          <motion.div
                            key={space.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            className="cursor-pointer"
                            onClick={() => setSelectedTestimonialSpace(space)}
                          >
                            <Card className="h-full border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                              {/* Top gradient accent */}
                              <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
                              
                              <CardContent className="p-5">
                                {/* Space header */}
                                <div className="flex items-start gap-3 mb-4">
                                  <motion.div 
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25"
                                  >
                                    <Folder className="w-6 h-6 text-white" />
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                      {space.space_name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate">/{space.slug}</p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                                </div>
                                
                                {/* Stats grid */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                  <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{spaceTestimonials.length}</p>
                                    <p className="text-[10px] text-muted-foreground">Total</p>
                                  </div>
                                  <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{approvedCount}</p>
                                    <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Approved</p>
                                  </div>
                                  <div className="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
                                    <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70">Pending</p>
                                  </div>
                                </div>
                                
                                {/* Footer info */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    {videoCount > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Video className="w-3 h-3 text-purple-500" />
                                        {videoCount}
                                      </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                      <Type className="w-3 h-3 text-blue-500" />
                                      {spaceTestimonials.length - videoCount}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View all →
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* SPACES TAB */}
          <TabsContent value="spaces" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Spaces</h2>
                <p className="text-sm text-muted-foreground">
                  {stats.totalSpaces} / {formatLimit(quotas?.maxSpaces || 1)} spaces used
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search spaces..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="pl-9 w-full sm:w-56 h-9 text-sm bg-white dark:bg-slate-800" 
                  />
                </div>
                <Button 
                  onClick={() => setCreateDialogOpen(true)} 
                  disabled={!quotas || (quotas.maxSpaces !== -1 && quotas.maxSpaces < 9999 && stats.totalSpaces >= quotas.maxSpaces)} 
                  className="bg-gradient-to-r from-violet-600 to-indigo-600"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> New
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                  <Card key={i} className="border-0 bg-white/90 dark:bg-slate-800/90">
                    <CardHeader>
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-4 w-32 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredSpaces.length === 0 ? (
              <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                <CardContent className="py-16 text-center">
                  <motion.div 
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">
                    {searchQuery ? 'No spaces found' : 'Create your first space'}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {searchQuery ? 'Try a different search term' : 'Spaces help you organize testimonials by project or client'}
                  </p>
                  {!searchQuery && (
                    <Button 
                      onClick={() => setCreateDialogOpen(true)} 
                      className="bg-gradient-to-r from-violet-600 to-indigo-600"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Create Space
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSpaces.map((space, index) => (
                  <SpaceCard 
                    key={space.id} 
                    space={space} 
                    index={index} 
                    onNavigate={(id) => navigate(`/dashboard/${id}`)} 
                    onCopyLink={copySubmitLink} 
                    onOpenEmbed={openEmbedModal} 
                    onDelete={deleteSpace} 
                  />
                ))}
                {(quotas?.maxSpaces === -1 || quotas?.maxSpaces >= 9999 || stats.totalSpaces < (quotas?.maxSpaces || 1)) && (
                  <CreateSpaceCard onClick={() => setCreateDialogOpen(true)} delay={filteredSpaces.length * 0.05} />
                )}
              </div>
            )}
          </TabsContent>

          {/* BILLING TAB */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Current Plan Card */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${getPlanGradient()}`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          className={`p-3 rounded-xl bg-gradient-to-br ${getPlanGradient()} shadow-lg`}
                        >
                          <PlanIcon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg">
                            {subscription?.plans?.name || 'Free Tier'}
                          </CardTitle>
                          <CardDescription>
                            {isFreePlan ? 'Basic features' : 'Full access'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant={subscription?.status === 'active' ? 'default' : 'secondary'} 
                        className={`capitalize ${subscription?.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : ''}`}
                      >
                        {subscription?.status || 'active'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isFreePlan && subscription?.current_period_end && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-3">
                        {/* Show cancellation/change notice if applicable */}
                        {subscription?.cancel_at_period_end && (
                          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-3">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                              ⚠️ Plan changes at period end
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                              Your current plan will remain active until {new Date(subscription.current_period_end).toLocaleDateString()}. Any changes will take effect after this date.
                            </p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="w-4 h-4" />
                            <span>{subscription?.cancel_at_period_end ? 'Plan active until' : 'Next billing'}</span>
                          </div>
                          <span className="font-medium">
                            {new Date(subscription.current_period_end).toLocaleDateString()}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CreditCard className="w-4 h-4" />
                            <span>Amount</span>
                          </div>
                          <span className="font-semibold text-lg">
                            ${subscription?.plans?.amount_usd || 0}
                            <span className="text-sm text-muted-foreground">/mo</span>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      {isFreePlan ? (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600" 
                          onClick={() => navigate('/pricing')}
                        >
                          <Rocket className="w-4 h-4 mr-2" /> Upgrade Plan
                        </Button>
                      ) : !isFreePlan ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={handleManageSubscription}
                            disabled={billingPortalLoading}
                          >
                            {billingPortalLoading ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...</>
                            ) : (
                              <><Receipt className="w-4 h-4 mr-2" /> Manage Subscription & Billing</>
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                            onClick={() => setCancelDialogOpen(true)}
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Cancel
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Usage Summary */}
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-violet-500" />
                      Usage Summary
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Your current resource usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-around gap-4 py-4">
                      <AnimatedCircularProgress 
                        value={stats.totalSpaces} 
                        max={quotas?.maxSpaces || 1} 
                        label="Spaces" 
                        icon={Folder}
                      />
                      <AnimatedCircularProgress 
                        value={stats.textTestimonials} 
                        max={quotas?.maxTextTestimonials || 10} 
                        label="Testimonials"
                        icon={MessageSquare}
                        color="#3b82f6"
                      />
                      <AnimatedCircularProgress 
                        value={stats.videoTestimonials} 
                        max={quotas?.maxVideos || 1} 
                        label="Videos"
                        icon={Video}
                        color="#a855f7"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Plan Comparison */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Compare Plans</CardTitle>
                  <CardDescription className="text-xs">See what you get with each plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Feature</th>
                          <th className="text-center py-3 px-2 font-medium">Free</th>
                          <th className="text-center py-3 px-2 font-medium">
                            <Badge className="bg-violet-600 text-white">Starter</Badge>
                          </th>
                          <th className="text-center py-3 px-2 font-medium">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">Pro</Badge>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-2">Spaces</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'free')?.max_spaces || 1)}</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'starter')?.max_spaces || 3)}</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'pro')?.max_spaces || 10)}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2">Text Testimonials</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'free')?.max_text_testimonials || 10)}</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'starter')?.max_text_testimonials || 500)}</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'pro')?.max_text_testimonials || 9999)}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2">Video Testimonials</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'free')?.max_videos || 0) === 0 ? <X className="w-4 h-4 mx-auto text-red-500" /> : formatLimit(allPlans?.find(p => p.id === 'free')?.max_videos)}</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'starter')?.max_videos || 20)}</td>
                          <td className="text-center py-3 px-2">{formatLimit(allPlans?.find(p => p.id === 'pro')?.max_videos || 100)}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2">Remove Branding</td>
                          <td className="text-center py-3 px-2"><X className="w-4 h-4 mx-auto text-red-500" /></td>
                          <td className="text-center py-3 px-2"><Check className="w-4 h-4 mx-auto text-emerald-500" /></td>
                          <td className="text-center py-3 px-2"><Check className="w-4 h-4 mx-auto text-emerald-500" /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2">Custom Themes</td>
                          <td className="text-center py-3 px-2"><X className="w-4 h-4 mx-auto text-red-500" /></td>
                          <td className="text-center py-3 px-2"><Check className="w-4 h-4 mx-auto text-emerald-500" /></td>
                          <td className="text-center py-3 px-2"><Check className="w-4 h-4 mx-auto text-emerald-500" /></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2">Priority Support</td>
                          <td className="text-center py-3 px-2"><X className="w-4 h-4 mx-auto text-red-500" /></td>
                          <td className="text-center py-3 px-2"><X className="w-4 h-4 mx-auto text-red-500" /></td>
                          <td className="text-center py-3 px-2"><Check className="w-4 h-4 mx-auto text-emerald-500" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {showUpgradeOption && (
                    <div className="mt-4 text-center">
                      <Button 
                        onClick={handleUpgradeClick} 
                        className="bg-gradient-to-r from-violet-600 to-indigo-600"
                      >
                        {isFreePlan ? 'View Full Comparison' : 'Manage Subscription'} 
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>


          </TabsContent>
        </Tabs>
      </main>

      {/* Create Space Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Plus className="w-5 h-5 text-violet-500" />
              Create New Space
            </DialogTitle>
            <DialogDescription>
              A space is a dedicated collection point for testimonials
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createSpace} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spaceName">Space Name</Label>
              <Input 
                id="spaceName" 
                placeholder="e.g., My Awesome Product" 
                value={newSpaceName} 
                onChange={(e) => setNewSpaceName(e.target.value)} 
                className="h-11" 
                required 
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={creating} className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600">
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Space
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? You'll lose access to premium features at the end of your billing period.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>What you'll lose</AlertTitle>
            <AlertDescription className="text-xs mt-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Video testimonials</li>
                <li>Remove branding option</li>
                <li>Premium themes</li>
                <li>Priority support</li>
              </ul>
            </AlertDescription>
          </Alert>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={cancelling}>
              {cancelling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embed Code Dialog */}
      <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] sm:h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <div className="p-4 sm:p-6 border-b bg-white dark:bg-slate-900">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Code className="w-5 h-5 text-violet-600" />
                Embed Wall of Love
              </DialogTitle>
              <DialogDescription className="text-sm">
                Customize your widget and copy the code to your website.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            {/* Settings */}
            <div className="w-full lg:w-[400px] border-b lg:border-b-0 lg:border-r p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Layout
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['grid', 'masonry', 'carousel'].map((l) => (
                      <motion.button 
                        key={l}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEmbedLayout(l)}
                        className={`px-3 py-2.5 text-sm rounded-xl border transition-all ${
                          embedLayout === l 
                            ? 'bg-violet-100 border-violet-500 text-violet-700 font-medium dark:bg-violet-900/40 dark:text-violet-300' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700'
                        }`}
                      >
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Theme
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['light', 'dark'].map((t) => (
                      <motion.button 
                        key={t}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEmbedTheme(t)}
                        className={`px-3 py-2.5 text-sm rounded-xl border transition-all ${
                          embedTheme === t
                            ? 'bg-violet-100 border-violet-500 text-violet-700 font-medium dark:bg-violet-900/40 dark:text-violet-300' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700'
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Code */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Code className="w-3 h-3" /> Embed Code
                </Label>
                <div className="relative group">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-2 top-2 z-10">
                    <Button size="sm" onClick={copyEmbedCode} className="h-8 shadow-lg bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1.5">
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </Button>
                  </motion.div>
                  <pre className="bg-slate-950 text-slate-50 p-4 pt-12 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 min-h-[100px] whitespace-pre-wrap break-all">
                    {getEmbedCode()}
                  </pre>
                </div>
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 p-3 rounded-xl border border-violet-200/50 dark:border-violet-800/50">
                  <p className="text-xs text-violet-700 dark:text-violet-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Paste this code anywhere in your HTML. Works with any website builder!</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col overflow-hidden relative min-h-[300px] lg:min-h-0">
              <div className="p-3 border-b flex justify-between items-center bg-white dark:bg-slate-900">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Eye className="w-3 h-3" /> Live Preview
                </div>
                <Badge variant="secondary" className="text-xs">
                  Approved testimonials only
                </Badge>
              </div>
              <div className="flex-1 p-3 sm:p-4 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border overflow-hidden">
                  <iframe 
                    key={`${selectedSpaceId}-${embedTheme}-${embedLayout}`} 
                    src={getPreviewUrl()}
                    width="100%" 
                    height="100%" 
                    className="w-full h-full"
                    title="Widget Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Slide Panel */}
      <ProfileSlidePanel 
        isOpen={isProfilePanelOpen} 
        onClose={() => setIsProfilePanelOpen(false)}
        user={user} 
        profile={profile}
        subscription={subscription}
        onProfileUpdate={refreshProfile}
        onNavigateToPricing={() => navigate('/pricing')}
        onSignOut={handleSignOut}
      />
    </div>
    </>
  );
};

export default Dashboard;
