import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, TrendingUp, Zap, Crown, Palette, MousePointer, Share2, 
  Briefcase, Video, Check, Eye, ChevronRight, Star, Grid3X3,
  LayoutGrid, Rows3, Play, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { 
  WIDGET_PRESETS, 
  PRESET_CATEGORIES, 
  PRESET_THUMBNAILS,
  getPresetsByCategory 
} from './widgetPresets';

// Icon mapping for categories
const CATEGORY_ICONS = {
  Sparkles, TrendingUp, Zap, Crown, Palette, MousePointer, Share2, Briefcase, Video
};

// Mini Preview Component for Preset Cards
const MiniPreview = ({ preset }) => {
  const theme = PRESET_THUMBNAILS[preset.thumbnail] || PRESET_THUMBNAILS['minimalist'];
  const { layout } = preset.settings;
  
  return (
    <div className={`w-full h-32 rounded-lg ${theme.bg} p-3 relative overflow-hidden`}>
      {/* Layout-specific preview */}
      {layout === 'grid' && (
        <div className="grid grid-cols-3 gap-1.5 h-full">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`${theme.cardBg} rounded-md shadow-sm flex flex-col p-1.5`}
              style={{ opacity: 0.9 - (i * 0.1) }}
            >
              <div className={`w-full h-1 ${theme.accent} rounded-full mb-1`} />
              <div className={`flex-1 ${theme.accent} opacity-30 rounded`} />
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-3 h-3 ${theme.accent} rounded-full`} />
                <div className={`flex-1 h-1 ${theme.accent} rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {layout === 'carousel' && (
        <div className="flex items-center justify-center h-full gap-2 px-4">
          {[0.6, 1, 0.6].map((scale, i) => (
            <motion.div 
              key={i}
              className={`${theme.cardBg} rounded-lg shadow-lg flex flex-col p-2`}
              style={{ 
                width: i === 1 ? '45%' : '30%', 
                height: i === 1 ? '85%' : '70%',
                opacity: scale
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`flex-1 ${theme.accent} opacity-30 rounded mb-1`} />
              <div className="flex items-center gap-1">
                <div className={`w-3 h-3 ${theme.accent} rounded-full`} />
                <div className={`flex-1 h-1 ${theme.accent} rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {layout === 'masonry' && (
        <div className="flex gap-1.5 h-full">
          {[0, 1, 2].map(col => (
            <div key={col} className="flex-1 flex flex-col gap-1.5">
              {[...Array(col === 1 ? 3 : 2)].map((_, i) => (
                <div 
                  key={i}
                  className={`${theme.cardBg} rounded-md shadow-sm flex-1 p-1.5`}
                  style={{ minHeight: col === 1 ? '25%' : '35%' }}
                >
                  <div className={`w-full h-1 ${theme.accent} rounded-full mb-1`} />
                  <div className={`h-2/3 ${theme.accent} opacity-30 rounded`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {layout === 'list' && (
        <div className="flex flex-col gap-1.5 h-full justify-center">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className={`${theme.cardBg} rounded-md shadow-sm flex items-center gap-2 p-2`}
              style={{ opacity: 0.95 - (i * 0.15) }}
            >
              <div className={`w-6 h-6 ${theme.accent} rounded-full flex-shrink-0`} />
              <div className="flex-1">
                <div className={`w-2/3 h-1.5 ${theme.accent} rounded-full mb-1`} />
                <div className={`w-full h-1 ${theme.accent} opacity-50 rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Popular Badge */}
      {preset.popular && (
        <div className="absolute top-1.5 right-1.5">
          <Badge className="bg-amber-500 text-white text-[8px] px-1.5 py-0 font-medium">
            <Star className="w-2 h-2 mr-0.5 fill-white" />
            Popular
          </Badge>
        </div>
      )}
    </div>
  );
};

// Preset Card Component
const PresetCard = ({ preset, isSelected, onSelect, isApplying }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
          isSelected 
            ? 'ring-2 ring-violet-500 ring-offset-2 shadow-lg shadow-violet-500/20' 
            : 'hover:shadow-xl border-slate-200'
        }`}
        onClick={() => !isApplying && onSelect(preset)}
      >
        {/* Selection Indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-3 left-3 z-10 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="p-0">
          {/* Mini Preview */}
          <div className="relative">
            <MiniPreview preset={preset} />
            
            {/* Hover Overlay */}
            <AnimatePresence>
              {isHovered && !isApplying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <Button 
                    size="sm" 
                    className="bg-white text-slate-900 hover:bg-slate-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(preset);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 mr-1" />
                        Apply
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Preset Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm text-slate-900">{preset.name}</h3>
              <Badge variant="secondary" className="text-[10px] capitalize bg-slate-100">
                {preset.settings.layout}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">{preset.description}</p>
            
            {/* Quick Info Tags */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {preset.settings.autoScroll && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                  Auto-scroll
                </span>
              )}
              {preset.settings.popupsEnabled && (
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                  Popups
                </span>
              )}
              {preset.settings.theme === 'dark' && (
                <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded-full">
                  Dark
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Loading Skeleton
const PresetSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <Skeleton className="h-32 rounded-none" />
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </CardContent>
  </Card>
);

// Main GalleryTab Component
const GalleryTab = ({ 
  spaceId, 
  widgetSettings, 
  setWidgetSettings, 
  saveWidgetSettings,
  setActiveTab 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Detect current preset from settings
  const currentPresetId = useMemo(() => {
    if (!widgetSettings) return null;
    return widgetSettings.presetId || null;
  }, [widgetSettings]);

  // Filter presets by category
  const filteredPresets = useMemo(() => {
    return getPresetsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Handle Preset Selection & Apply
  const handleApplyPreset = async (preset) => {
    if (isApplying) return;
    
    setIsApplying(true);
    setSelectedPreset(preset.id);

    try {
      // Merge preset settings with presetId tracking
      const newSettings = {
        ...preset.settings,
        presetId: preset.id // Track which preset was applied
      };

      // Update local state immediately for instant preview
      setWidgetSettings(newSettings);

      // Save to database
      await saveWidgetSettings(newSettings);

      // Success feedback
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#8b5cf6', '#a78bfa', '#c4b5fd']
      });

      toast.success(`"${preset.name}" applied!`, {
        description: 'Your widget style has been updated. Go to Widget tab to preview or customize.',
        action: {
          label: 'View Widget',
          onClick: () => setActiveTab('widget')
        }
      });

    } catch (error) {
      console.error('Failed to apply preset:', error);
      toast.error('Failed to apply preset', {
        description: 'Please try again or check your connection.'
      });
      setSelectedPreset(currentPresetId);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            Widget Gallery
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Choose a preset style and apply it instantly. Customize further in the Widget tab.
          </p>
        </div>
        
        {currentPresetId && (
          <div className="flex items-center gap-2 bg-violet-50 px-3 py-2 rounded-lg">
            <Check className="w-4 h-4 text-violet-600" />
            <span className="text-sm text-violet-700 font-medium">
              Active: {WIDGET_PRESETS.find(p => p.id === currentPresetId)?.name || 'Custom'}
            </span>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {PRESET_CATEGORIES.map((category) => {
          const IconComponent = CATEGORY_ICONS[category.icon];
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`transition-all ${
                isActive 
                  ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md' 
                  : 'hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {IconComponent && <IconComponent className="w-3.5 h-3.5 mr-1.5" />}
              {category.name}
              {category.id === 'popular' && (
                <Badge className="ml-1.5 bg-amber-500 text-white text-[9px] px-1 py-0">
                  HOT
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Presets Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            [...Array(8)].map((_, i) => <PresetSkeleton key={i} />)
          ) : (
            filteredPresets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isSelected={selectedPreset === preset.id || currentPresetId === preset.id}
                onSelect={handleApplyPreset}
                isApplying={isApplying && selectedPreset === preset.id}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {!isLoading && filteredPresets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No presets found</h3>
          <p className="text-slate-500 text-sm">Try selecting a different category</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSelectedCategory('all')}
          >
            View all presets
          </Button>
        </div>
      )}

      {/* Pro Tip */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h4 className="font-medium text-slate-900 text-sm">Pro Tip</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              After applying a preset, head to the <strong>Widget</strong> tab to fine-tune colors, 
              fonts, and animations. Your customizations will be saved separately from the base preset.
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-violet-600 hover:text-violet-700 ml-auto flex-shrink-0"
            onClick={() => setActiveTab('widget')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryTab;
