import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SettingsTab = ({ space, spaceId, navigate, copySubmitLink }) => {
  
  const handleDeleteSpace = () => {
    if (window.confirm('Are you sure? This will delete all testimonials.')) {
      supabase.from('spaces').delete().eq('id', spaceId).then(() => navigate('/dashboard'));
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Space Settings</CardTitle>
        <CardDescription>Manage your space configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Space Name</Label>
          <Input value={space.space_name} disabled />
        </div>
        <div className="space-y-2">
          <Label>Collection URL</Label>
          <div className="flex gap-2">
            <Input value={`${window.location.origin}/submit/${space.slug}`} readOnly />
            <Button variant="outline" onClick={copySubmitLink}><Copy className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="pt-4 border-t">
          <Button variant="destructive" onClick={handleDeleteSpace}>
            <Trash2 className="w-4 h-4 mr-2" />Delete Space
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;