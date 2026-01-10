import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, Trash2, Globe, Mail, Download, AlertTriangle, 
  CheckCircle, AlertCircle, Save, Loader2, Lock, ShieldAlert,
  X, Check, Bell
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

// --- SHARED COMPONENTS ---

// 1. Premium Notification Toast (FIXED CENTER POSITION)
const NotificationToast = ({ message, type, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }} // Start slightly down, centered horizontally
          animate={{ opacity: 1, y: 0, x: "-50%" }}  // Animate to normal height, keep centered
          exit={{ opacity: 0, y: 20, x: "-50%" }}    // Exit slightly down, keep centered
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-10 left-1/2 z-[10000] flex items-center justify-center gap-3 px-6 py-3.5 rounded-full shadow-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 w-auto max-w-[90vw] whitespace-nowrap"
        >
          {type === 'success' ? (
            <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="bg-red-100 dark:bg-red-900/30 p-1 rounded-full shrink-0">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          )}
          <span className={`text-sm font-medium truncate ${type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}`}>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 2. Password Verification Modal
const PasswordModal = ({ isOpen, onClose, onVerify, isVerifying, actionType }) => {
  const [password, setPassword] = useState('');
  
  const getMessage = () => {
    if (actionType === 'delete_space') {
      return "Permanently delete this space and all data.";
    } else if (actionType === 'update_settings') {
      return "Update sensitive settings (Slug). Existing links will break.";
    }
    return "Please enter your password to continue.";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-sm bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-[9991]"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Verify it's you</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {getMessage()}
              </p>
              
              <div className="space-y-4">
                <Input 
                  type="password" 
                  placeholder="Enter Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-900"
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                  <Button 
                    onClick={() => onVerify(password)} 
                    disabled={isVerifying || !password}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 3. Final Delete Confirmation Modal
const FinalDeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-sm bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-[9991]"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-red-600 dark:text-red-500 mb-2">
                Permanently Delete Space?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                This will wipe <strong>all testimonials, forms, and settings</strong> associated with this space. This action is irreversible.
              </p>
              
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={onClose} disabled={isDeleting} className="flex-1">
                  Wait, Keep it
                </Button>
                <Button 
                  onClick={onConfirm} 
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none"
                >
                  {isDeleting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </div>
                  ) : "Delete Forever"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SettingsTab = ({ space, spaceId, navigate, deleteSpace, updateSpaceState, userEmail }) => {
  // State for editable fields
  const [spaceName, setSpaceName] = useState(space.space_name || '');
  
  // --- SLUG VALIDATION LOGIC ---
  const [spaceSlug, setSpaceSlug] = useState(space.slug || '');
  const [slugStatus, setSlugStatus] = useState('idle');
  const [slugError, setSlugError] = useState('');
  
  // State for toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });
  
  // Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState(null); // 'delete_space' or 'update_settings'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 3000);
  };

  // --- LIVE SLUG CHECKER ---
  useEffect(() => {
    const originalSlug = space.slug;
    
    if (spaceSlug === originalSlug) {
      setSlugStatus('idle');
      setSlugError('');
      return;
    }

    if (!spaceSlug || spaceSlug.length < 3) {
      setSlugStatus('error');
      setSlugError('Slug must be at least 3 characters.');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(spaceSlug)) {
        setSlugStatus('error');
        setSlugError('Only lowercase letters, numbers, and dashes allowed.');
        return;
    }

    setSlugStatus('checking');
    setSlugError('');

    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('id')
          .eq('slug', spaceSlug)
          .neq('id', spaceId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSlugStatus('taken');
          setSlugError('Slug not available. Please choose another one.');
        } else {
          setSlugStatus('available');
          setSlugError('');
        }
      } catch (err) {
        console.error("Slug check failed", err);
        setSlugStatus('error');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [spaceSlug, space.slug, spaceId]);


  // --- HANDLER: INITIATE GENERAL SAVE ---
  const initiateGeneralSave = () => {
    if (slugStatus === 'taken' || slugStatus === 'checking' || slugStatus === 'error') return;
    
    // If slug is changing, require password
    if (spaceSlug !== space.slug) {
      setPasswordAction('update_settings');
      setShowPasswordModal(true);
    } else {
      // Just name change, save directly
      handleGeneralSave();
    }
  };

  // --- 1. CORE SAVE LOGIC ---
  const handleGeneralSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('spaces')
        .update({ space_name: spaceName, slug: spaceSlug })
        .eq('id', spaceId);

      if (error) throw error;
      
      // Update Parent State
      updateSpaceState({ space_name: spaceName, slug: spaceSlug });

      // Success UI
      setSaveSuccess(true);
      const scalar = 2;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#10b981', '#3b82f6'],
        disableForReducedMotion: true
      });

      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (error) {
      console.error(error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 2. EXPORT DATA (Fixed: Removed Permission Column) ---
  const handleExportData = async (format = 'csv') => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('space_id', spaceId);
        
      if (error) throw error;

      if (!data || data.length === 0) {
        showToast("No data to export", "error");
        return;
      }

      // Filter & Rename Columns for User Friendliness
      const cleanedData = data.map(item => ({
        Date: new Date(item.created_at).toLocaleDateString(),
        Name: item.respondent_name || 'Anonymous',
        Email: item.respondent_email || '-',
        Rating: item.rating || '-',
        Message: item.content || '-',
        Type: item.type
        // REMOVED PERMISSION COLUMN
      }));

      // Generate Content
      const headers = Object.keys(cleanedData[0]).join(",");
      const csvContent = "data:text/csv;charset=utf-8," 
        + headers + "\n"
        + cleanedData.map(row => Object.values(row).map(val => `"${val}"`).join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      
      // Extension based on format selection
      const extension = format === 'excel' ? 'xls' : 'csv'; 
      link.setAttribute("download", `${spaceSlug}_testimonials.${extension}`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast(`Exported as ${format.toUpperCase()} successfully`, "success");
    } catch (error) {
      showToast("Export failed. Try again.", "error");
    }
  };

  // --- 3. SECURE FLOW HANDLERS ---
  
  const verifyPassword = async (passwordInput) => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: passwordInput,
      });

      if (error) throw error;

      // Password Correct -> Proceed based on action
      setShowPasswordModal(false);
      
      if (passwordAction === 'delete_space') {
        setShowDeleteConfirm(true);
      } else if (passwordAction === 'update_settings') {
        handleGeneralSave(); // Proceed to save slug
      }

    } catch (error) {
      showToast("Incorrect password. Please try again.", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinalDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSpace(); 
      navigate('/dashboard'); 
    } catch (error) {
      setShowDeleteConfirm(false);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSlugInputClass = () => {
    if (slugStatus === 'checking') return 'border-blue-300 focus-visible:ring-blue-300';
    if (slugStatus === 'available') return 'border-green-500 focus-visible:ring-green-500';
    if (slugStatus === 'taken' || slugStatus === 'error') return 'border-red-500 focus-visible:ring-red-500';
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 px-2 sm:px-0">
      
      {/* --- NOTIFICATIONS & MODALS --- */}
      <NotificationToast 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
      />

      <PasswordModal 
        isOpen={showPasswordModal}
        actionType={passwordAction}
        isVerifying={isVerifying}
        onClose={() => setShowPasswordModal(false)}
        onVerify={verifyPassword}
      />

      <FinalDeleteModal 
        isOpen={showDeleteConfirm}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleFinalDelete}
      />

      {/* --- HEADER --- */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Space Settings</h2>
        <p className="text-muted-foreground">Manage your space preferences and advanced configurations.</p>
      </div>

      <div className="grid gap-6">
        
        {/* 1. GENERAL SETTINGS */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                <Globe className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-lg">General Settings</CardTitle>
                <CardDescription>Update your space's public identity.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="spaceName">Space Name</Label>
              <Input 
                id="spaceName" 
                value={spaceName} 
                onChange={(e) => setSpaceName(e.target.value)}
                className="max-w-md bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="spaceSlug">Space URL (Slug)</Label>
              <div className="relative max-w-sm">
                <div className="flex items-center">
                  <Badge variant="outline" className="text-muted-foreground font-normal bg-gray-100 dark:bg-gray-800 h-10 px-3 rounded-r-none border-r-0 border-gray-200 dark:border-gray-700 hidden sm:flex">
                    trustflow.app/submit/
                  </Badge>
                  <div className="relative flex-1">
                    <Input 
                        id="spaceSlug" 
                        value={spaceSlug} 
                        onChange={(e) => setSpaceSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className={`sm:rounded-l-none pr-10 bg-white dark:bg-gray-950 transition-colors duration-200 ${getSlugInputClass()}`}
                        placeholder="my-space-name"
                    />
                    
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {slugStatus === 'checking' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                        {slugStatus === 'available' && <CheckCircle className="w-4 h-4 text-green-500 animate-in zoom-in" />}
                        {(slugStatus === 'taken' || slugStatus === 'error') && <X className="w-4 h-4 text-red-500 animate-in zoom-in" />}
                    </div>
                  </div>
                </div>
                
                <div className="mt-1.5 h-4 text-[11px] font-medium">
                    {slugStatus === 'checking' && <span className="text-muted-foreground flex items-center gap-1">Checking availability...</span>}
                    {slugStatus === 'available' && <span className="text-green-600 dark:text-green-400 flex items-center gap-1">Slug is available</span>}
                    {slugStatus === 'taken' && <span className="text-red-600 dark:text-red-400 flex items-center gap-1">Slug not available. Please choose another one.</span>}
                    {slugStatus === 'error' && <span className="text-red-600 dark:text-red-400 flex items-center gap-1">{slugError}</span>}
                </div>
              </div>
              <p className="text-[12px] text-muted-foreground mt-1">Warning: Changing this will break existing links to your collection page.</p>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-3">
            <Button 
                onClick={initiateGeneralSave} 
                disabled={isSaving || slugStatus === 'taken' || slugStatus === 'checking' || slugStatus === 'error'} 
                className={`ml-auto transition-all duration-300 ${saveSuccess ? 'bg-green-600 hover:bg-green-700 w-32' : 'bg-violet-600 hover:bg-violet-700 w-36'}`}
            >
              {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved!
                  </>
              ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* 2. NOTIFICATIONS & EXPORT */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Notifications */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notif" className="flex flex-col space-y-1">
                  <span>Email Alerts</span>
                  <span className="font-normal text-xs text-muted-foreground">Get notified via email for new testimonials.</span>
                </Label>
                <Switch 
                  id="email-notif" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="browser-notif" className="flex flex-col space-y-1">
                  <span>Browser Notifications</span>
                  <span className="font-normal text-xs text-muted-foreground">Receive push notifications on your device.</span>
                </Label>
                <Switch 
                  id="browser-notif" 
                  checked={browserNotifications} 
                  onCheckedChange={setBrowserNotifications} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Export Data */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Download className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Export Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                Download a clean report of your testimonials.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleExportData('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleExportData('excel')}>
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. DANGER ZONE */}
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-red-700 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for this space.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-lg border border-red-100 dark:border-red-900/30 gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-medium text-red-900 dark:text-red-300">Delete this Space</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently remove this space and all of its data.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setPasswordAction('delete_space');
                  setShowPasswordModal(true);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Space
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SettingsTab;