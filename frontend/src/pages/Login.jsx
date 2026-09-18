import React, { useState, useEffect } from 'react';
import {
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

import {
  ArrowLeft,
  ShieldCheck,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  KeyRound,
  Zap,
  Globe
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode determination based on route path
  const isSignupRoute = location.pathname === '/signup';
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI feedback states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [termsError, setTermsError] = useState('');
  
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Sync route changes with mode reset
  useEffect(() => {
    setIsForgotPassword(false);
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAgreeTerms(false);
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setTermsError('');
    setNotification({ type: '', message: '' });
  }, [location.pathname]);

  // Password Requirement Checks
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // Dynamic Password Strength Meter
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'bg-neutral-800' };
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (score <= 2) return { label: 'Weak', color: 'text-rose-400 bg-rose-500' };
    if (score === 3) return { label: 'Medium', color: 'text-amber-400 bg-amber-500' };
    return { label: 'Strong', color: 'text-emerald-400 bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setTermsError('');
    setNotification({ type: '', message: '' });

    if (isSignupRoute && !fullName.trim()) {
      setNameError('Full name is required.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!isForgotPassword) {
      if (!password) {
        setPasswordError('Password is required.');
        isValid = false;
      } else if (password.length < 6) {
        setPasswordError('Password must contain at least 6 characters.');
        isValid = false;
      } else if (isSignupRoute && (!hasUppercase || !hasNumber || !hasSpecial)) {
        setPasswordError('Password does not meet all security requirements.');
        isValid = false;
      }

      if (isSignupRoute) {
        if (password !== confirmPassword) {
          setConfirmError('Passwords do not match.');
          isValid = false;
        }
        if (!agreeTerms) {
          setTermsError('You must agree to the terms and privacy policy.');
          isValid = false;
        }
      }
    }

    if (!isValid) {
      setNotification({ type: 'error', message: 'Please check your input details and correct errors.' });
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setNotification({ type: '', message: '' });

    setTimeout(() => {
      setIsLoading(false);
      if (isForgotPassword) {
        setNotification({ type: 'success', message: 'Reset instructions sent successfully.' });
      } else if (isSignupRoute) {
        setNotification({ type: 'success', message: 'Account created successfully.' });
        setTimeout(() => navigate('/Profile'), 700);
      } else {
        setNotification({ type: 'success', message: 'Signed in successfully.' });
        setTimeout(() => navigate('/Profile'), 700);
      }
    }, 850);
  };

  // Functional Google Firebase Authentication Handler -> Redirects to /Profile
  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setNotification({ 
        type: 'success', 
        message: `Welcome back, ${user.displayName || user.email}!` 
      });

      setTimeout(() => {
        navigate('/Profile');
      }, 1000);
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setNotification({ 
        type: 'error', 
        message: err.message || 'Failed to authenticate with Google.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceholderClick = (msg) => {
    setNotification({ type: 'error', message: msg });
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-6 bg-[#0A0A0F] overflow-x-hidden text-[#FAFAFA]">
      <style>{`
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
      `}</style>

      {/* Background VFX Glow Orbs & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#8B5CF6]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#EC4899]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30" />

      {/* Main Split Layout Container */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto z-10 py-6">
        
        {/* Left Column: Branding & Value Pillars */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8 px-2 sm:px-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13111C] border border-[#8B5CF6]/30 text-[#C4B5FD] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" /> Stay Safe Online
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.1]">
              Welcome <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Back</span>
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Sign in to continue protecting yourself from malicious websites with AI-powered threat detection.
            </p>
          </div>

          {/* Feature Highlight Cards */}
          <div className="space-y-4 max-w-lg">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#13111C]/80 border border-[#231E33] backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-[#1A1528] border border-[#2B2340] text-[#8B5CF6] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FAFAFA]">AI-Powered Detection</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Real-time threat analysis and lexical validation</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#13111C]/80 border border-[#231E33] backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-[#1A1528] border border-[#2B2340] text-[#EC4899] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FAFAFA]">Lightning Fast</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Instant URL scanning and predictive confidence scoring</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#13111C]/80 border border-[#231E33] backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-[#1A1528] border border-[#2B2340] text-[#8B5CF6] shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FAFAFA]">Stay Protected</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Browse with confidence backed by enterprise security logs</p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote Box */}
          <div className="p-4 rounded-2xl bg-[#13111C] border border-[#231E33] max-w-lg italic text-xs text-neutral-400">
            "A safer internet starts with your next click."
            <div className="not-italic font-semibold text-[#C4B5FD] mt-1">— WebShield AI Security Core</div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-md bg-[#13111C]/90 backdrop-blur-2xl border border-[#231E33] hover:border-[#8B5CF6]/50 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-purple-950/40 z-10 transition-all duration-700 overflow-hidden">
            
            {/* Subtle Horizontal Scan Line VFX */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-40 animate-scanline pointer-events-none" />

            {/* Card Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] mb-3 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#FFFFFF] tracking-tight">
                {isForgotPassword ? 'Reset Password' : isSignupRoute ? 'Create Account' : 'WebShield AI'}
              </h2>
              <p className="text-neutral-400 text-xs mt-1">
                {isForgotPassword 
                  ? "Enter your email address and we'll send password reset instructions."
                  : isSignupRoute 
                  ? 'Join to access advanced AI threat protection' 
                  : 'Sign in to your account'}
              </p>
            </div>

            {/* Notification Alert Area */}
            {notification.message && (
              <div className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2 border animate-fade-in ${
                notification.type === 'success' 
                  ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300' 
                  : 'bg-rose-950/60 border-rose-800/60 text-rose-300'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-[#10B981]" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#F43F5E]" />
                )}
                <span>{notification.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Full Name Field (Signup Only) */}
              {isSignupRoute && !isForgotPassword && (
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 group-focus-within:text-[#8B5CF6] transition" />
                    <input
                      id="fullName"
                      name="name"
                      type="text"
                      autoComplete="name"
                      aria-invalid={!!nameError}
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      className={`w-full bg-[#0A0A0F] border ${
                        nameError ? 'border-rose-500' : 'border-[#231E33] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                      } rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {nameError}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 group-focus-within:text-[#8B5CF6] transition" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!emailError}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`w-full bg-[#0A0A0F] border ${
                      emailError ? 'border-rose-500' : 'border-[#231E33] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                    } rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm`}
                  />
                </div>
                {emailError && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              {!isForgotPassword && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Password
                    </label>
                    {!isSignupRoute && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setPasswordError('');
                          setNotification({ type: '', message: '' });
                        }}
                        className="text-xs text-[#C4B5FD] hover:text-white transition cursor-pointer bg-transparent border-none p-0 font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 group-focus-within:text-[#8B5CF6] transition" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isSignupRoute ? 'new-password' : 'current-password'}
                      aria-invalid={!!passwordError}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      className={`w-full bg-[#0A0A0F] border ${
                        passwordError ? 'border-rose-500' : 'border-[#231E33] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                      } rounded-xl pl-10 pr-10 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm`}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-neutral-500 hover:text-white transition focus:outline-none cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {passwordError}
                    </p>
                  )}

                  {/* Password Requirements Checklist (Signup Only) */}
                  {isSignupRoute && (
                    <div className="mt-2.5 p-3 bg-[#0A0A0F] border border-[#231E33] rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-neutral-400">Requirements</span>
                        <span className={`font-semibold ${strength.color.split(' ')[0]}`}>{strength.label}</span>
                      </div>
                      <div className="w-full bg-[#13111C] h-1.5 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full transition-all duration-300 ${hasMinLength ? 'w-1/4 bg-[#8B5CF6]' : 'w-0'}`} />
                        <div className={`h-full transition-all duration-300 ${hasUppercase ? 'w-1/4 bg-[#8B5CF6]' : 'w-0'}`} />
                        <div className={`h-full transition-all duration-300 ${hasNumber ? 'w-1/4 bg-[#EC4899]' : 'w-0'}`} />
                        <div className={`h-full transition-all duration-300 ${hasSpecial ? 'w-1/4 bg-[#10B981]' : 'w-0'}`} />
                      </div>
                      <ul className="grid grid-cols-2 gap-1 text-[10px]">
                        <li className={hasMinLength ? 'text-[#10B981]' : 'text-neutral-600'}>✓ 6+ chars</li>
                        <li className={hasUppercase ? 'text-[#10B981]' : 'text-neutral-600'}>✓ 1 uppercase</li>
                        <li className={hasNumber ? 'text-[#10B981]' : 'text-neutral-600'}>✓ 1 number</li>
                        <li className={hasSpecial ? 'text-[#10B981]' : 'text-neutral-600'}>✓ 1 special</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password Field (Signup Only) */}
              {isSignupRoute && !isForgotPassword && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 group-focus-within:text-[#8B5CF6] transition" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      aria-invalid={!!confirmError}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (confirmError) setConfirmError('');
                      }}
                      className={`w-full bg-[#0A0A0F] border ${
                        confirmError ? 'border-rose-500' : 'border-[#231E33] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                      } rounded-xl pl-10 pr-10 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm`}
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-neutral-500 hover:text-white transition focus:outline-none cursor-pointer p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmError && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {confirmError}
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me (Signin Only) */}
              {!isSignupRoute && !isForgotPassword && (
                <div className="flex items-center pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#0A0A0F] border-[#231E33] text-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-offset-[#13111C] cursor-pointer"
                    />
                    <span className="text-xs text-neutral-400 font-medium">Remember me</span>
                  </label>
                </div>
              )}

              {/* Terms Checkbox (Signup Only) */}
              {isSignupRoute && !isForgotPassword && (
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (termsError) setTermsError('');
                      }}
                      className="mt-0.5 w-4 h-4 rounded bg-[#0A0A0F] border-[#231E33] text-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-offset-[#13111C] cursor-pointer"
                    />
                    <span className="text-xs text-neutral-400 font-medium leading-tight">
                      I agree to the{' '}
                      <button type="button" onClick={() => handlePlaceholderClick('Terms of Service will be available soon.')} className="text-[#C4B5FD] hover:underline bg-transparent border-none p-0 cursor-pointer font-medium">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" onClick={() => handlePlaceholderClick('Privacy Policy will be available soon.')} className="text-[#C4B5FD] hover:underline bg-transparent border-none p-0 cursor-pointer font-medium">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {termsError && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {termsError}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : isForgotPassword ? (
                  <>
                    <KeyRound className="w-4 h-4" /> Send Reset Link
                  </>
                ) : isSignupRoute ? (
                  <>
                    <UserPlus className="w-4 h-4" /> Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            {!isForgotPassword && (
              <>
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-[#231E33]" />
                  <span className="flex-shrink mx-3 text-neutral-600 text-[10px] uppercase tracking-wider font-medium">Or continue with</span>
                  <div className="flex-grow border-t border-[#231E33]" />
                </div>

                {/* Google OAuth Functional Button */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleAuth}
                  className="w-full bg-[#0A0A0F] hover:bg-[#13111C] border border-[#231E33] text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-3 text-sm shadow-sm cursor-pointer disabled:opacity-70"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.6C3.5 19.4 7.4 22 12 22z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            {/* Mode Toggle Switch / Back to Sign In */}
            <div className="text-center mt-5">
              {isForgotPassword ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setNotification({ type: '', message: '' });
                  }}
                  className="text-[#C4B5FD] hover:text-white font-medium text-xs transition cursor-pointer bg-transparent border-none"
                >
                  Back to Sign In
                </button>
              ) : (
                <p className="text-neutral-400 text-xs">
                  {isSignupRoute ? 'Already have an account? ' : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => navigate(isSignupRoute ? '/signin' : '/signup')}
                    className="text-[#C4B5FD] hover:underline font-medium transition cursor-pointer bg-transparent border-none p-0"
                  >
                    {isSignupRoute ? 'Sign In' : 'Create an account'}
                  </button>
                </p>
              )}
            </div>

            {/* Security Indicator Footer */}
            <div className="mt-6 pt-3 border-t border-[#231E33] flex items-center justify-center gap-2 text-neutral-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Protected Connection • Secure Credentials</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}