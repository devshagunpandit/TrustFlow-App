import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmail, signInWithGoogle, signInWithGithub, supabase } from '@/lib/supabase';
import { Heart, Mail, Github, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Login = () => {
  // Modes: 'password' (default), 'otp-email' (enter email for code), 'otp-verify' (enter code)
  const [authMode, setAuthMode] = useState('password'); 
  
  // Data State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Error State
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '', otp: '' });

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  // --- HELPERS ---
  const clearFieldError = (field) => {
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
    setError('');
  };

  const handleEmailBlur = () => {
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
    }
  };

  // --- 1. STANDARD PASSWORD LOGIN ---
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) { newErrors.email = "Email is required."; isValid = false; }
    if (!password) { newErrors.password = "Password is required."; isValid = false; }

    if (!isValid) {
      setFieldErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    if (fieldErrors.email) return;

    setLoading(true);

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      // Success is handled by useEffect redirect
    } catch (error) {
      let msg = error.message;
      if (msg.includes("Invalid login credentials")) msg = "Incorrect email or password.";
      else if (msg.includes("Email not confirmed")) msg = "Please verify your email first.";
      setError(msg); 
    } finally {
      setLoading(false);
    }
  };

  // --- 2. OTP: SEND CODE ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

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
      // Pre-check: Does user exist?
      const { data: emailExists, error: rpcError } = await supabase.rpc('check_email_exists', { 
        email_to_check: email 
      });

      if (rpcError) throw rpcError;

      if (!emailExists) {
        setFieldErrors(prev => ({ ...prev, email: "This email is not registered." }));
        setLoading(false);
        return;
      }

      // Send OTP (using signInWithOtp which sends Magic Link/Code)
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: false } 
      });

      if (error) throw error;

      setAuthMode('otp-verify');
      toast({ title: 'Login code sent', description: `Check ${email} for your code.` });

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. OTP: VERIFY CODE ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length < 6) {
      setFieldErrors(prev => ({ ...prev, otp: "Please enter the 6-digit code." }));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email', // 'email' type works for Magic Link tokens used as OTP
      });

      if (error) throw error;

      toast({ title: 'Welcome back!', description: 'Logged in successfully.' });
      navigate('/dashboard');

    } catch (error) {
      setFieldErrors(prev => ({ ...prev, otp: "Invalid code." }));
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- SOCIAL LOGINS ---
  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await signInWithGithub();
      if (error) throw error;
    } catch (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    }
  };
  
  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-background to-indigo-50 dark:from-violet-950/20 dark:via-background dark:to-indigo-950/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            TrustFlow
          </span>
        </Link>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 shadow-xl border-violet-100 dark:border-violet-900/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {authMode === 'otp-verify' ? 'Verify Login' : 'Welcome back'}
            </CardTitle>
            <CardDescription>
              {authMode === 'otp-verify' 
                ? `Enter the code sent to ${email}`
                : 'Sign in to your account to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* ================= MODE 1: PASSWORD LOGIN (DEFAULT) ================= */}
            {authMode === 'password' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Social Buttons */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full h-11" onClick={handleGoogleLogin}>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full h-11" onClick={handleGithubLogin}>
                    <Github className="w-5 h-5 mr-2" />
                    Continue with GitHub
                  </Button>
                </div>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 px-2 text-xs text-muted-foreground">OR</span>
                </div>

                <form onSubmit={handlePasswordLogin} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="email" className={fieldErrors.email ? "text-red-500" : ""}>Email</Label>
                    <Input
                      id="email" type="email" placeholder="you@example.com" value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      onBlur={handleEmailBlur}
                      onFocus={() => clearFieldError('email')}
                      required
                      className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {fieldErrors.email && <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1">{fieldErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className={fieldErrors.password ? "text-red-500" : ""}>Password</Label>
                    <Input
                      id="password" type="password" placeholder="••••••••" value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      onFocus={() => clearFieldError('password')}
                      className={fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {fieldErrors.password && <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1">{fieldErrors.password}</p>}
                  </div>
                  
                  {/* <div className="flex items-right justify-between">
                     <Link to="/forgot-password" className="text-sm font-medium text-violet-600 hover:text-violet-500 hover:underline">
                        Forgot password?
                     </Link>
                   </div> */}

                  {error && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="h-4 w-4" />{error}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Sign In
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('otp-email')} 
                    className="text-sm text-violet-600 hover:underline font-medium inline-flex items-center"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Log in with OTP instead
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= MODE 2: OTP - ENTER EMAIL ================= */}
            {authMode === 'otp-email' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-email" className={fieldErrors.email ? "text-red-500" : ""}>Email</Label>
                    <Input 
                      id="otp-email" type="email" placeholder="Enter your email" value={email} 
                      onChange={(e) => { setEmail(e.target.value); setError(''); }} 
                      onFocus={() => clearFieldError('email')} 
                      className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""} 
                    />
                    {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                  </div>

                  {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                  <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 h-11" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Send Login Code
                  </Button>
                </form>

                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('password')} 
                    className="text-sm text-muted-foreground hover:text-violet-500 hover:text-foreground hover:underline  inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back to Password Login
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= MODE 3: OTP - VERIFY CODE ================= */}
            {authMode === 'otp-verify' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-center py-2">
                   <div className="bg-violet-100 dark:bg-violet-900/30 p-4 rounded-full">
                      <Mail className="w-8 h-8 text-violet-600" />
                   </div>
                </div>

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
                  {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

                  <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 h-11" disabled={loading || otp.length < 6}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Verify & Login
                  </Button>
                </form>

                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Didn't receive code?{' '}
                    <button type="button" onClick={handleSendOtp} className="text-violet-600 hover:underline">Resend</button>
                  </div>
                  <div>
                    <button type="button" onClick={() => { setAuthMode('otp-email'); setOtp(''); }} className="text-xs text-muted-foreground hover:text-violet-500 hover:underline hover:text-foreground">
                      Change email
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer Link */}
            <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-violet-600 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;