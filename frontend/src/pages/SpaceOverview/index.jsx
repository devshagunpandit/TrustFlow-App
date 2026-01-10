import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Copy, ExternalLink, Inbox, Edit, Code, Settings, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { v4 as uuidv4 } from 'uuid'; 

// Import Sub-components
import InboxTab from './components/InboxTab';
import EditFormTab from './components/EditFormTab';
import WidgetTab from './components/WidgetTab';
import SettingsTab from './components/SettingsTab';

const SpaceOverview = () => {
  const { spaceId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [space, setSpace] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const navigate = useNavigate();

  // --- DEFAULTS ---
  const DEFAULT_THEME_CONFIG = {
    theme: 'light',
    accentColor: 'violet',
    customColor: '#8b5cf6',
    pageBackground: 'gradient-violet',
    viewMode: 'mobile'
  };

  const DEFAULT_WIDGET_SETTINGS = {
    layout: 'grid', theme: 'light', cardTheme: 'light', corners: 'smooth', shadow: 'medium', border: true, hoverEffect: 'lift',
    nameSize: 'medium', testimonialStyle: 'clean', animation: 'fade', speed: 'normal',
    cardSize: 'medium', placement: 'section', maxCount: 12, shuffle: false, gridRows: 2,
    autoScroll: false, scrollSpeed: 3, wallPadding: 'medium',
    showHeading: false, headingText: 'Wall of Love', headingFont: 'Inter', headingColor: '#000000', headingBold: true,
    showSubheading: false, subheadingText: 'What our happy customers say', subheadingFont: 'Inter', subheadingColor: '#64748b',
    carouselFocusZoom: false, carouselSameSize: true, 
  };

  // --- STATE ---
  const [formSettings, setFormSettings] = useState({
    header_title: '',
    custom_message: '',
    collect_star_rating: true,
    collect_video: true,
    collect_photo: false,
    thank_you_title: 'Thank you!',
    thank_you_message: 'Your testimonial has been submitted.',
    theme_config: DEFAULT_THEME_CONFIG,
    logo_url: null
  });

  const [widgetSettings, setWidgetSettings] = useState(DEFAULT_WIDGET_SETTINGS);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && spaceId) {
      fetchSpaceData();
    }
  }, [user, spaceId]);

  const fetchSpaceData = async () => {
    try {
      // 1. Fetch Space Data including BOTH settings tables
      const { data: spaceData, error: spaceError } = await supabase
        .from('spaces')
        .select(`
          *,
          space_form_settings (*),
          widget_configurations (*)
        `)
        .eq('id', spaceId)
        .eq('owner_id', user.id)
        .single();

      if (spaceError) throw spaceError;

      setSpace(spaceData);

      // 2. Handle Form Settings
      let fetchedFormSettings = {};
      if (Array.isArray(spaceData.space_form_settings) && spaceData.space_form_settings.length > 0) {
        fetchedFormSettings = spaceData.space_form_settings[0];
      } else if (spaceData.space_form_settings) {
        fetchedFormSettings = spaceData.space_form_settings;
      }

      setFormSettings({
        header_title: fetchedFormSettings.header_title || spaceData.header_title || '',
        custom_message: fetchedFormSettings.custom_message || spaceData.custom_message || '',
        collect_star_rating: fetchedFormSettings.collect_star_rating ?? true,
        collect_video: fetchedFormSettings.collect_video ?? true,
        collect_photo: fetchedFormSettings.collect_photo ?? false,
        thank_you_title: fetchedFormSettings.thank_you_title || 'Thank you!',
        thank_you_message: fetchedFormSettings.thank_you_message || 'Your testimonial has been submitted.',
        theme_config: { ...DEFAULT_THEME_CONFIG, ...(fetchedFormSettings.theme_config || {}) },
        logo_url: spaceData.logo_url 
      });

      // 3. Handle Widget Settings
      let fetchedWidgetSettings = {};
      if (Array.isArray(spaceData.widget_configurations) && spaceData.widget_configurations.length > 0) {
        fetchedWidgetSettings = spaceData.widget_configurations[0].settings || {};
      } else if (spaceData.widget_configurations) {
        fetchedWidgetSettings = spaceData.widget_configurations.settings || {};
      }

      setWidgetSettings({
        ...DEFAULT_WIDGET_SETTINGS,
        ...fetchedWidgetSettings
      });

      // 4. Fetch Testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });

      if (testimonialsError) throw testimonialsError;
      setTestimonials(testimonialsData || []);

    } catch (error) {
      console.error('Error fetching space:', error);
      toast.error('Unable to load space', {
        description: 'There was a problem loading your space data. Please refresh.',
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (testimonialId, currentValue) => {
    setTestimonials(testimonials.map(t => 
      t.id === testimonialId ? { ...t, is_liked: !currentValue } : t
    ));

    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_liked: !currentValue })
        .eq('id', testimonialId);

      if (error) throw error;
    } catch (error) {
      setTestimonials(testimonials.map(t => 
        t.id === testimonialId ? { ...t, is_liked: currentValue } : t
      ));
      toast.error('Action Failed', { description: 'Could not update the testimonial status.' });
    }
  };

  // --- MODIFIED DELETE FUNCTION (Removes Toasts, Throws Error) ---
  const deleteTestimonial = async (testimonialId) => {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', testimonialId);
      if (error) throw error;
      
      // Update UI only after DB success
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
      
      // NOTE: Removed toast.success here as per request. Child component handles success UI.
    } catch (error) {
      // NOTE: Removed toast.error here. We re-throw so Child component knows it failed.
      console.error("Delete failed in parent:", error);
      throw error; 
    }
  };

  // --- SAVE LOGIC: EDIT FORM ---
  const saveFormSettings = async (settingsToSave = formSettings, logoFile = null) => {
    setSaving(true);
    try {
      let finalLogoUrl = settingsToSave.logo_url;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${spaceId}/${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('space_logos').upload(fileName, logoFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('space_logos').getPublicUrl(fileName);
        finalLogoUrl = publicUrl;
      }

      const { logo_url, ...formSpecificSettings } = settingsToSave;

      await supabase.from('spaces').update({ logo_url: finalLogoUrl }).eq('id', spaceId);
      
      const { error: settingsError } = await supabase
        .from('space_form_settings')
        .upsert({ space_id: spaceId, ...formSpecificSettings }, { onConflict: 'space_id' });

      if (settingsError) throw settingsError;

      setSpace({ ...space, logo_url: finalLogoUrl });
      setFormSettings({ ...settingsToSave, logo_url: finalLogoUrl });

    } catch (error) {
      console.error(error);
      toast.error('Save Failed', { description: 'We could not save your changes.' });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // --- SAVE LOGIC: WIDGET ---
  const saveWidgetSettings = async (settingsToSave) => {
    // This function mimics the behavior of saveFormSettings but for the widget
    try {
      const { error } = await supabase
        .from('widget_configurations')
        .upsert({ 
          space_id: spaceId,
          settings: settingsToSave
        }, { onConflict: 'space_id' });

      if (error) throw error;
      
      // Update local state is handled by the WidgetTab calling setWidgetSettings,
      // but we ensure it's synced here if needed.
      setWidgetSettings(settingsToSave);
      
    } catch (error) {
      console.error('Error saving widget settings:', error);
      throw error; // Throw so the child component can show the error state
    }
  };

  const copySubmitLink = () => {
    const link = `${window.location.origin}/submit/${space.slug}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  if (loading || !space) return <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20"><div className="container mx-auto px-4 py-8"><div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8" /></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Toaster richColors position="bottom-right" />

      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{space.space_name}</h1>
              <p className="text-sm text-muted-foreground">/{space.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copySubmitLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" onClick={() => window.open(`/submit/${space.slug}`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur p-1">
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Inbox <Badge variant="secondary" className="ml-1 bg-violet-100 text-violet-700">{testimonials.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="edit-form" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Form
            </TabsTrigger>
            <TabsTrigger value="widget" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Widget
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox">
            <InboxTab testimonials={testimonials} toggleLike={toggleLike} deleteTestimonial={deleteTestimonial} setSelectedVideo={setSelectedVideo} copySubmitLink={copySubmitLink} />
          </TabsContent>

          <TabsContent value="edit-form">
            <EditFormTab 
              formSettings={formSettings}
              setFormSettings={setFormSettings}
              saveFormSettings={saveFormSettings}
              saving={saving}
            />
          </TabsContent>

          {/* PASSING PROPS TO WIDGET TAB */}
          <TabsContent value="widget" className="mt-0">
            <WidgetTab 
              testimonials={testimonials} 
              spaceId={spaceId} 
              activeTab={activeTab}
              widgetSettings={widgetSettings}
              setWidgetSettings={setWidgetSettings}
              saveWidgetSettings={saveWidgetSettings}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab space={space} spaceId={spaceId} navigate={navigate} copySubmitLink={copySubmitLink} />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-none">
          <div className="aspect-video w-full">
            {selectedVideo && <video src={selectedVideo} controls autoPlay className="w-full h-full" />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpaceOverview;