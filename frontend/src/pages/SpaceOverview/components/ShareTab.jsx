import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCodeStyling from 'qr-code-styling';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Share2, QrCode, Copy, CheckCircle, AlertCircle, Settings } from 'lucide-react';

// --- SHARED COMPONENT: PREMIUM NOTIFICATION TOAST ---
const NotificationToast = ({ message, type, isVisible }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-10 left-1/2 z-[99999] flex items-center justify-center gap-3 px-6 py-3.5 rounded-full shadow-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 w-auto max-w-[90vw] whitespace-nowrap"
          style={{ 
            left: '50%', 
            transform: 'translateX(-50%)', 
            pointerEvents: 'none' 
          }} 
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
    </AnimatePresence>,
    document.body
  );
};

// Default configuration for QR Code
const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10
  }
});

const ShareTab = ({ space }) => {
  const qrRef = useRef(null);
  const [url, setUrl] = useState('');
  
  // Customization State
  const [color, setColor] = useState('#8b5cf6'); // Default Violet
  const [dotType, setDotType] = useState('rounded'); // rounded, dots, classy, square
  const [cornerType, setCornerType] = useState('extra-rounded'); // square, extra-rounded
  const [useLogo, setUseLogo] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');

  // Notification State
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 3000);
  };

  useEffect(() => {
    // Generate the submit URL dynamically
    if (space?.slug) {
      const link = `${window.location.origin}/submit/${space.slug}`;
      setUrl(link);
      
      // Setup Logo
      if (space.logo_url) {
        setLogoUrl(space.logo_url);
      }
    }
  }, [space]);

  // --- LIVE UPDATE LOGIC ---
  useEffect(() => {
    if (!url) return;

    try {
      qrCode.update({
        data: url,
        image: useLogo ? logoUrl : null,
        dotsOptions: {
          color: color,
          type: dotType
        },
        cornersSquareOptions: {
          color: color,
          type: cornerType
        },
        cornersDotOptions: {
          color: color,
          type: dotType === 'rounded' || dotType === 'extra-rounded' ? 'dot' : 'square'
        },
        backgroundOptions: {
          color: "#ffffff",
        }
      });

      // Append only once
      if (qrRef.current && qrRef.current.innerHTML === '') {
        qrCode.append(qrRef.current);
      }
    } catch (error) {
      console.error("Error updating QR:", error);
    }
  }, [url, color, dotType, cornerType, useLogo, logoUrl]);

  // --- DOWNLOAD HANDLERS (With Error Handling) ---
  const handleDownload = async (ext) => {
    try {
      if (!url) throw new Error("URL not ready");
      
      await qrCode.download({
        extension: ext,
        name: `${space.slug}_qr`
      });
      showToast(`QR Code downloaded as ${ext.toUpperCase()}`, 'success');
    } catch (error) {
      console.error("Download failed:", error);
      showToast("Failed to download QR. Please try again.", "error");
    }
  };

  const copyLink = async () => {
    try {
      if (!url) throw new Error("URL missing");
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard', 'success');
    } catch (error) {
      console.error("Copy failed:", error);
      showToast("Failed to copy link.", "error");
    }
  };

  return (
    <div className="relative min-h-screen lg:min-h-0">
      <NotificationToast 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
      />

      {/* Grid Layout: Stacks on mobile (flex-col-reverse), Side-by-side on desktop */}
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:h-[calc(100vh-200px)]">
        
        {/* --- LEFT: CONTROLS (Scrollable on desktop) --- */}
        <div className="lg:col-span-4 space-y-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar pb-10 lg:pb-0">
          
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-600" />
                QR Customization
              </CardTitle>
              <CardDescription>Design your QR for offline stores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* 1. Color Picker */}
              <div className="space-y-3">
                <Label>Primary Color</Label>
                <div className="flex gap-3 flex-wrap">
                  {['#8b5cf6', '#000000', '#2563eb', '#16a34a', '#dc2626', '#ea580c'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                    <Input 
                      type="color" 
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shape Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dot Style</Label>
                  <Select value={dotType} onValueChange={setDotType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                      <SelectItem value="classy">Classy</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Corner Style</Label>
                  <Select value={cornerType} onValueChange={setCornerType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="extra-rounded">Round</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 3. Logo Toggle */}
              <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Use Space Logo</Label>
                  <p className="text-xs text-muted-foreground">Display your logo in the center</p>
                </div>
                <Switch 
                  checked={useLogo} 
                  onCheckedChange={setUseLogo} 
                  disabled={!logoUrl} 
                />
              </div>
              {!logoUrl && (
                <p className="text-xs text-red-500 mt-[-10px]">
                  *Upload a logo in "Edit Form" tab to use this feature.
                </p>
              )}

            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={() => handleDownload('png')}>
                <Download className="w-4 h-4 mr-2" /> Download PNG
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleDownload('svg')}>
                <Download className="w-4 h-4 mr-2" /> Download SVG (Vector)
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* --- RIGHT: LIVE PREVIEW (Sticky on Desktop, Top on Mobile) --- */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[400px] bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800 p-8 items-center justify-center relative overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500 w-full max-w-md">
            
            {/* The QR Card */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-white transform transition-transform hover:scale-105 duration-300">
              <div ref={qrRef} className="overflow-hidden rounded-xl bg-white" />
              <div className="text-center mt-4 space-y-1">
                <p className="font-bold text-lg text-gray-900 line-clamp-1">{space.header_title || "Share your feedback"}</p>
                <p className="text-xs text-gray-500">Scan to submit a testimonial</p>
              </div>
            </div>

            {/* Quick Copy Link Bar */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 pl-4 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 w-full">
              <span className="text-xs text-muted-foreground truncate flex-1">{url}</span>
              <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 shrink-0" onClick={copyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ShareTab;