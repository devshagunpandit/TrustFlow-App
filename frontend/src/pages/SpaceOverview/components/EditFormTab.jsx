import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Star, Video, FileText, Loader2, Smartphone, Tablet, Laptop, 
  Palette, Type, Layout, ArrowLeft, User, Briefcase, CheckCircle, Camera, Upload, RotateCcw,
  Image as ImageIcon, Link as LinkIcon, Plus
} from 'lucide-react';
import { PremiumToggle, SectionHeader } from './SharedComponents';

const EditFormTab = ({ 
  formSettings, 
  setFormSettings, 
  saveFormSettings, 
  saving 
}) => {
  // --- Constants ---
  const INITIAL_DESIGNER_STATE = {
    theme: 'light', // light, dark
    accentColor: 'violet', 
    customColor: '#8b5cf6',
    pageBackground: 'gradient-violet', 
    viewMode: 'mobile' 
  };

  const accentColors = {
    violet: 'from-violet-600 to-indigo-600',
    blue: 'from-blue-600 to-cyan-600',
    rose: 'from-rose-600 to-pink-600',
    emerald: 'from-emerald-600 to-teal-600',
    custom: 'custom' 
  };

  const pageBackgrounds = {
    white: 'bg-white',
    dark: 'bg-slate-950',
    'gradient-violet': 'bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-violet-950/20 dark:via-background dark:to-indigo-950/20',
    'gradient-blue': 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/20',
  };

  // --- State ---
  const [designerState, setDesignerState] = useState(INITIAL_DESIGNER_STATE);
  const [logoMode, setLogoMode] = useState('upload'); 
  const [logoPreview, setLogoPreview] = useState(formSettings.logo_url || null);
  const [logoFile, setLogoFile] = useState(null);

  // Mock Interaction State
  const [previewStep, setPreviewStep] = useState('welcome'); 
  const [mockRating, setMockRating] = useState(5);
  const [mockText, setMockText] = useState('');

  // --- Helpers ---

  // 1. Theme Logic (Ensures text visibility)
  const getThemeClasses = () => {
    const isDark = designerState.theme === 'dark';
    return {
      card: isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-white text-slate-900',
      input: isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-500',
      textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
      textHeader: isDark ? 'text-white' : 'text-slate-900',
      iconBg: isDark ? 'bg-slate-800' : 'bg-slate-100',
    };
  };

  // 2. Button Styles
  const getButtonStyle = () => {
    if (designerState.accentColor === 'custom') return { background: designerState.customColor, color: '#fff' };
    return {}; 
  };
  const getButtonClass = () => {
    if (designerState.accentColor === 'custom') return `w-full shadow-md hover:opacity-90 transition-opacity text-white`;
    return `w-full shadow-md bg-gradient-to-r ${accentColors[designerState.accentColor]} hover:opacity-90 transition-opacity text-white`;
  };

  // 3. Reset
  const handleReset = () => {
    setDesignerState(INITIAL_DESIGNER_STATE);
    setPreviewStep('welcome');
    setMockText('');
    setMockRating(5);
    // Optional: Reset form settings text if needed, but usually users want to keep content
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-200px)] min-h-[800px]">
      
      {/* LEFT: Designer Controls */}
      <Card className="w-full xl:w-[400px] flex flex-col border-violet-100 dark:border-violet-900/20 shadow-xl shadow-violet-500/5 bg-white/80 backdrop-blur-sm overflow-hidden flex-shrink-0">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5 text-violet-600 fill-violet-100" />
            Form Designer
          </CardTitle>
          <CardDescription>Customize the collection experience</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
           {/* Logo Section */}
           <div>
            <SectionHeader icon={ImageIcon} title="Logo & Branding" />
            <Tabs defaultValue="upload" value={logoMode} onValueChange={setLogoMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upload" className="text-xs"><Upload className="w-3 h-3 mr-2" /> Upload</TabsTrigger>
                <TabsTrigger value="url" className="text-xs"><LinkIcon className="w-3 h-3 mr-2" /> URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-0">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden shrink-0">
                    {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" /> : <ImageIcon className="w-6 h-6 text-slate-300" />}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center w-full px-4 py-2 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 text-xs font-medium transition-colors">Choose File</div>
                      <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </Label>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-tight">Rec: <span className="font-medium text-slate-700">400x400px PNG</span> (Transparent).</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="url" className="mt-0">
                <Input placeholder="https://..." value={logoPreview && !logoFile ? logoPreview : ''} onChange={(e) => { setLogoPreview(e.target.value); setFormSettings({...formSettings, logo_url: e.target.value}) }} className="text-xs" />
              </TabsContent>
            </Tabs>
          </div>
          <Separator />
          
          {/* Visual Theme */}
          <div>
            <SectionHeader icon={Palette} title="Visual Theme" />
            <div className="space-y-5">
               <div>
                  <Label className="text-xs text-slate-500 mb-2 block">Accent Color</Label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(accentColors).filter(k => k !== 'custom').map(color => (
                      <button key={color} onClick={() => setDesignerState({ ...designerState, accentColor: color })} className={`w-8 h-8 rounded-full bg-gradient-to-br ${accentColors[color]} transition-all shadow-sm ${designerState.accentColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105 hover:shadow-md'}`} />
                    ))}
                    <button onClick={() => setDesignerState({ ...designerState, accentColor: 'custom' })} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm border border-slate-200 ${designerState.accentColor === 'custom' ? 'ring-2 ring-offset-2 ring-slate-400 scale-110 bg-white' : 'bg-slate-50 hover:bg-slate-100'}`} style={designerState.accentColor === 'custom' ? { background: designerState.customColor } : {}}>
                      {designerState.accentColor !== 'custom' && <Plus className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {designerState.accentColor === 'custom' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                         <div className="flex items-center gap-3">
                            <input type="color" value={designerState.customColor} onChange={(e) => setDesignerState({ ...designerState, customColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0" />
                            <Input value={designerState.customColor} onChange={(e) => setDesignerState({ ...designerState, customColor: e.target.value })} className="h-8 text-xs font-mono uppercase" />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               <div>
                  <Label className="text-xs text-slate-500 mb-2 block">Card Theme</Label>
                  <PremiumToggle id="theme-mode" current={designerState.theme} onChange={(val) => setDesignerState({ ...designerState, theme: val })} options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]} />
               </div>
               <div>
                  <Label className="text-xs text-slate-500 mb-2 block">Page Background</Label>
                   <PremiumToggle id="bg-mode" current={designerState.pageBackground} onChange={(val) => setDesignerState({ ...designerState, pageBackground: val })} options={[{ label: 'Gradient', value: 'gradient-violet' }, { label: 'Blue', value: 'gradient-blue' }, { label: 'Clean', value: 'white' }, { label: 'Dark', value: 'dark' }]} />
               </div>
            </div>
          </div>
          <Separator />
          
          {/* Text Content */}
          <div>
            <SectionHeader icon={Type} title="Text Content" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="header_title" className="text-xs">Header Title</Label>
                <Input id="header_title" value={formSettings.header_title} onChange={(e) => setFormSettings({ ...formSettings, header_title: e.target.value })} placeholder="Share your experience..." className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom_message" className="text-xs">Custom Message</Label>
                <Textarea id="custom_message" value={formSettings.custom_message} onChange={(e) => setFormSettings({ ...formSettings, custom_message: e.target.value })} placeholder="We appreciate your feedback..." rows={3} className="bg-slate-50 resize-none" />
              </div>
            </div>
          </div>
          <Separator />
          
          {/* Features */}
          <div>
            <SectionHeader icon={Layout} title="Form Features" />
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-sm">Star Rating</Label>
                <p className="text-[10px] text-muted-foreground">Collect 1-5 star ratings</p>
              </div>
              <Switch checked={formSettings.collect_star_rating} onCheckedChange={(checked) => setFormSettings({ ...formSettings, collect_star_rating: checked })} />
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={saveFormSettings} disabled={saving} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT: Live Interactive Preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner relative">
        
        {/* Device Toggle Bar */}
        <div className="h-14 border-b bg-white dark:bg-slate-950 flex items-center justify-between px-6 z-20 shadow-sm shrink-0">
           <div className="flex items-center gap-2">
              <Badge variant="outline" className="animate-pulse border-violet-200 text-violet-700 bg-violet-50">Live Preview</Badge>
           </div>
           <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {[ { id: 'mobile', icon: Smartphone }, { id: 'tablet', icon: Tablet }, { id: 'desktop', icon: Laptop } ].map((device) => (
                <button key={device.id} onClick={() => setDesignerState({ ...designerState, viewMode: device.id })} className={`p-2 rounded-md transition-all ${designerState.viewMode === device.id ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  <device.icon className="w-4 h-4" />
                </button>
              ))}
           </div>
           <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-muted-foreground hover:text-red-500">
             <RotateCcw className="w-3 h-3 mr-1.5" /> Reset Default
           </Button>
        </div>

        {/* Canvas Area - DEVICE FRAMES */}
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] p-8">
           <motion.div 
             layout
             initial={false}
             animate={{ 
               width: designerState.viewMode === 'desktop' ? '800px' : (designerState.viewMode === 'tablet' ? '600px' : '340px'),
               height: designerState.viewMode === 'desktop' ? '500px' : (designerState.viewMode === 'tablet' ? '800px' : '650px'),
               borderRadius: designerState.viewMode === 'mobile' ? '40px' : (designerState.viewMode === 'tablet' ? '24px' : '12px'),
             }}
             transition={{ type: "spring", stiffness: 200, damping: 25 }}
             className={`relative shadow-2xl transition-all duration-500 origin-center
               ${designerState.viewMode === 'desktop' ? 'bg-slate-800 border-b-[20px] border-slate-700' : 'bg-slate-900 border-[8px] border-slate-900'}
             `}
             style={{ 
               // Scale down if device is too big for the preview container
               transform: designerState.viewMode === 'tablet' ? 'scale(0.75)' : (designerState.viewMode === 'desktop' ? 'scale(0.85)' : 'scale(0.9)'),
             }}
           >
              {/* Screen Content */}
              <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative ${pageBackgrounds[designerState.pageBackground]}
                  ${designerState.viewMode === 'mobile' ? 'rounded-[32px]' : (designerState.viewMode === 'tablet' ? 'rounded-[16px]' : 'rounded-t-[8px]')}
              `}>
                {/* --- MOCK FORM START (Exact Replica of SubmitTestimonial) --- */}
                 <div className="min-h-full w-full flex flex-col items-center justify-center p-6">
                    <AnimatePresence mode="wait">
                       
                       {/* 1. WELCOME STEP */}
                       {previewStep === 'welcome' && (
                          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-sm">
                            <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                              <CardContent className="p-8">
                                <div className="text-center mb-8">
                                  {/* Dynamic Logo */}
                                  {logoPreview ? (
                                     <img src={logoPreview} alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
                                  ) : (
                                     <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg text-white`} 
                                          style={designerState.accentColor === 'custom' ? { background: designerState.customColor } : {}}
                                          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg text-white ${designerState.accentColor !== 'custom' ? `bg-gradient-to-br ${accentColors[designerState.accentColor]}` : ''}`}>
                                        <Star className="w-8 h-8" />
                                     </div>
                                  )}
                                  <h1 className={`text-2xl font-bold mb-2 ${themeClasses.textHeader}`}>{formSettings.header_title || 'Header Title'}</h1>
                                  <p className={`${themeClasses.textMuted}`}>{formSettings.custom_message || 'Your message here...'}</p>
                                </div>
                                <div className="space-y-3">
                                  <Button onClick={() => setPreviewStep('video')} className={`h-14 text-lg ${getButtonClass()}`} style={getButtonStyle()}>
                                    <Video className="w-5 h-5 mr-2" /> Record a Video
                                  </Button>
                                  <Button onClick={() => setPreviewStep('text')} variant="outline" className={`w-full h-14 text-lg ${themeClasses.input} hover:bg-slate-100 dark:hover:bg-slate-800`}>
                                    <FileText className="w-5 h-5 mr-2" /> Write Text
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                       )}

                       {/* 2. VIDEO STEP */}
                       {previewStep === 'video' && (
                          <motion.div key="video" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-sm">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-6">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="icon" onClick={() => setPreviewStep('welcome')} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Record Your Video</h2>
                                  </div>
                                  <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                                     <div className="text-white text-center p-4">
                                        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Camera Preview</p>
                                     </div>
                                     <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> 0:00 / 1:00
                                     </div>
                                  </div>
                                  <div className="flex justify-center gap-3">
                                    <Button variant="destructive" size="lg" className="rounded-full w-16 h-16" onClick={() => setPreviewStep('details')}>
                                       <span className="w-6 h-6 bg-white rounded-sm" />
                                    </Button>
                                  </div>
                                  <p className={`text-center text-sm mt-4 ${themeClasses.textMuted}`}>Maximum 60 seconds</p>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                       {/* 3. TEXT STEP */}
                       {previewStep === 'text' && (
                          <motion.div key="text" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-sm">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-6">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="icon" onClick={() => setPreviewStep('welcome')} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Write Testimonial</h2>
                                  </div>
                                  {formSettings.collect_star_rating && (
                                    <div className="mb-6">
                                       <Label className={`mb-2 block ${themeClasses.textHeader}`}>Your Rating</Label>
                                       <div className="flex gap-1">
                                          {[1,2,3,4,5].map(s => (
                                             <Star key={s} className={`w-8 h-8 ${s <= mockRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} onClick={() => setMockRating(s)} />
                                          ))}
                                       </div>
                                    </div>
                                  )}
                                  <div className="space-y-4">
                                     <div>
                                        <Label className={themeClasses.textHeader}>Your Testimonial</Label>
                                        <Textarea value={mockText} onChange={e => setMockText(e.target.value)} placeholder="Share your experience..." rows={5} className={`mt-2 ${themeClasses.input}`} />
                                     </div>
                                     <Button onClick={() => setPreviewStep('details')} className={getButtonClass()} style={getButtonStyle()}>Continue</Button>
                                  </div>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                       {/* 4. DETAILS STEP */}
                       {previewStep === 'details' && (
                          <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-sm">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-6">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="icon" onClick={() => setPreviewStep('welcome')} className={themeClasses.textHeader}><ArrowLeft className="w-5 h-5" /></Button>
                                    <h2 className={`text-lg font-semibold ${themeClasses.textHeader}`}>Your Details</h2>
                                  </div>
                                  <div className="space-y-4">
                                     <div>
                                        <Label className={themeClasses.textHeader}>Your Name *</Label>
                                        <div className="relative mt-2">
                                           <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                           <Input placeholder="John Doe" className={`pl-9 ${themeClasses.input}`} />
                                        </div>
                                     </div>
                                     <div>
                                        <Label className={themeClasses.textHeader}>Your Email *</Label>
                                        <Input placeholder="john@example.com" className={`mt-2 ${themeClasses.input}`} />
                                     </div>
                                     <div>
                                        <Label className={themeClasses.textHeader}>Role (Optional)</Label>
                                        <Input placeholder="CEO at Company" className={`mt-2 ${themeClasses.input}`} />
                                     </div>
                                     <Button onClick={() => setPreviewStep('success')} className={`mt-4 ${getButtonClass()}`} style={getButtonStyle()}>Submit Testimonial</Button>
                                  </div>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                       {/* 5. SUCCESS STEP */}
                       {previewStep === 'success' && (
                          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
                             <Card className={`overflow-hidden shadow-xl border-0 ${themeClasses.card}`}>
                               <CardContent className="p-8 text-center">
                                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                     <CheckCircle className="w-8 h-8 text-green-600" />
                                  </div>
                                  <h2 className={`text-2xl font-bold mb-2 ${themeClasses.textHeader}`}>Thank You!</h2>
                                  <p className={`mb-6 ${themeClasses.textMuted}`}>Your testimonial has been submitted.</p>
                                  <Button variant="outline" onClick={handleReset} className={themeClasses.input}>Submit Another</Button>
                               </CardContent>
                             </Card>
                          </motion.div>
                       )}

                    </AnimatePresence>
                    
                    {/* FOOTER */}
                    <div className="text-center mt-6">
                      <p className={`text-sm ${themeClasses.textMuted}`}>Powered by <span className="font-medium text-violet-600">TrustFlow</span></p>
                    </div>

                 </div>
                 {/* --- MOCK FORM END --- */}
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditFormTab;