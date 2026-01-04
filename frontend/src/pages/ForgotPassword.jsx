import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase'; // Direct import for manual OTP handling
import { ArrowLeft, KeyRound, Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ForgotPassword = () => {
  // --- STATE ---
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error State
  const [error, setError] = useState(''); // General error text
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // --- HELPERS ---
  const clearFieldError = (field) => {
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
    setError('');
  };

  // --- STEP 1: SEND OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate Email
    if (!email.trim()) {
      setFieldErrors(prev => ({ ...prev, email: "Email is required." }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email." }));
      return;
    }

    setLoading(true);

    try {
      // 1. Pre-check: Does email exist?
      const { data: emailExists, error: rpcError } = await supabase.rpc('check_email_exists', { 
        email_to_check: email 
      });

      if (rpcError) throw rpcError;

      if (!emailExists) {
        // Stop here if email not found (Security decision: Explicit error vs Silent fail)
        // User requested: "stays on that interface"
        setFieldErrors(prev => ({ ...prev, email: "This email is not registered." }));
        setLoading(false);
        return;
      }

      // 2. Send Password Reset OTP
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      setStep(2); // Move to OTP
      toast({ title: 'OTP Sent', description: `We sent a code to ${email}` });

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length < 6) {
      setFieldErrors(prev => ({ ...prev, otp: "Please enter the 6-digit code." }));
      return;
    }

    setLoading(true);

    try {
      // Verify OTP (Type: recovery)
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });

      if (error) throw error;

      // OTP Correct -> Move to New Password
      setStep(3); 

    } catch (error) {
      // Handle Invalid OTP specific error
      setFieldErrors(prev => ({ ...prev, otp: "Invalid or expired OTP." }));
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: UPDATE PASSWORD ---
  // --- STEP 3: UPDATE PASSWORD ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    let isValid = true;
    const newErrors = { password: '', confirmPassword: '' };

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    setLoading(true);

    try {
      // 1. Update the password (requires the current temporary session)
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;

      // --- THE FIX: KILL THE SESSION IMMEDIATELY ---
      // This ensures they are NOT logged in when they hit the Login page.
      await supabase.auth.signOut();
      localStorage.clear(); // Wipe any lingering tokens

      // 2. Show Success UI
      setStep(4);
      
      // 3. Redirect to Login (User is now anonymous again)
      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-background to-indigo-50 dark:from-violet-950/20 dark:via-background dark:to-indigo-950/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 shadow-xl border-violet-100 dark:border-violet-900/50">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 4 ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <KeyRound className="w-6 h-6 text-violet-600" />}
            </div>
            <CardTitle className="text-2xl">
              {step === 1 && "Forgot password?"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Reset Password"}
              {step === 4 && "Password Updated"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "No worries, we'll send you reset instructions."}
              {step === 2 && `Enter the code sent to ${email}`}
              {step === 3 && "Create a new strong password."}
              {step === 4 && "Redirecting to login in 5 seconds..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* STEP 1: EMAIL INPUT */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email" className={fieldErrors.email ? "text-red-500" : ""}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    onFocus={() => clearFieldError('email')}
                    className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                </div>
                
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send Reset Code
                </Button>
              </form>
            )}

            {/* STEP 2: OTP INPUT */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(val) => { setOtp(val); setError(''); clearFieldError('otp'); }}
                  >
                    <InputOTPGroup className={fieldErrors.otp ? "border-red-500" : ""}>
                      <InputOTPSlot index={0} className={fieldErrors.otp ? "border-red-500 text-red-500" : ""} />
                      <InputOTPSlot index={1} className={fieldErrors.otp ? "border-red-500 text-red-500" : ""} />
                      <InputOTPSlot index={2} className={fieldErrors.otp ? "border-red-500 text-red-500" : ""} />
                      <InputOTPSlot index={3} className={fieldErrors.otp ? "border-red-500 text-red-500" : ""} />
                      <InputOTPSlot index={4} className={fieldErrors.otp ? "border-red-500 text-red-500" : ""} />
                      <InputOTPSlot index={5} className={fieldErrors.otp ? "border-red-500 text-red-500" : ""} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {fieldErrors.otp && <p className="text-xs text-red-500 text-center font-medium">{fieldErrors.otp}</p>}

                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading || otp.length < 6}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Verify Code
                </Button>
              </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className={fieldErrors.password ? "text-red-500" : ""}>New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    onFocus={() => clearFieldError('password')}
                    className={fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={fieldErrors.confirmPassword ? "text-red-500" : ""}>Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    onFocus={() => clearFieldError('confirmPassword')}
                    className={fieldErrors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {fieldErrors.confirmPassword && <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Reset Password
                </Button>
              </form>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Your password has been successfully reset. You can now log in with your new credentials.
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                  Return to Login
                </Button>
              </div>
            )}

            {/* BACK TO LOGIN LINK (Only for steps 1-3) */}
            {step < 4 && (
              <div className="mt-6 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-violet-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to log in
                </Link>
              </div>
            )}

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;