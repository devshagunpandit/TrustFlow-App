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
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Form edit state (Kept here as it syncs with space data)
  const [formSettings, setFormSettings] = useState({
    header_title: '',
    custom_message: '',
    collect_star_rating: true,
  });

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
      const { data: spaceData, error: spaceError } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', spaceId)
        .eq('owner_id', user.id)
        .single();

      if (spaceError) throw spaceError;
      setSpace(spaceData);
      setFormSettings({
        header_title: spaceData.header_title || '',
        custom_message: spaceData.custom_message || '',
        collect_star_rating: spaceData.collect_star_rating ?? true,
      });

      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });

      if (testimonialsError) throw testimonialsError;
      setTestimonials(testimonialsData || []);
    } catch (error) {
      console.error('Error fetching space:', error);
      toast({
        title: 'Error',
        description: 'Failed to load space data.',
        variant: 'destructive',
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
      toast({
        title: 'Error',
        description: 'Failed to update testimonial.',
        variant: 'destructive',
      });
    }
  };

  const deleteTestimonial = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;
      setTestimonials(testimonials.filter(t => t.id !== testimonialId));
      toast({ title: 'Testimonial deleted' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial.',
        variant: 'destructive',
      });
    }
  };

  const saveFormSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('spaces')
        .update(formSettings)
        .eq('id', spaceId);

      if (error) throw error;
      setSpace({ ...space, ...formSettings });
      toast({ title: 'Settings saved!' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const copySubmitLink = () => {
    const link = `${window.location.origin}/submit/${space.slug}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Link copied!' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (loading || !space) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
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
              <Button 
                variant="outline"
                onClick={() => window.open(`/submit/${space.slug}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur p-1">
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Inbox
              <Badge variant="secondary" className="ml-1 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                {testimonials.length}
              </Badge>
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
            <InboxTab 
              testimonials={testimonials}
              toggleLike={toggleLike}
              deleteTestimonial={deleteTestimonial}
              setSelectedVideo={setSelectedVideo}
              copySubmitLink={copySubmitLink}
            />
          </TabsContent>

          <TabsContent value="edit-form">
            <EditFormTab 
              formSettings={formSettings}
              setFormSettings={setFormSettings}
              saveFormSettings={saveFormSettings}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="widget" className="mt-0">
            <WidgetTab 
              testimonials={testimonials}
              spaceId={spaceId}
              activeTab={activeTab}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab 
              space={space}
              spaceId={spaceId}
              navigate={navigate}
              copySubmitLink={copySubmitLink}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Video Modal */}
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