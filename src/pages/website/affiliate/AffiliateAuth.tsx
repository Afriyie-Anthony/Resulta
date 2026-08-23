import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiBriefcase, FiPhone, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { ForgotPasswordModal } from '../../../components/auth/ForgotPasswordModal';

type AuthView = 'login' | 'register';
type RegisterStep = 1 | 2;

interface AffiliateAuthProps {
  defaultView?: AuthView;
}

const AffiliateAuth: React.FC<AffiliateAuthProps> = ({ defaultView = 'login' }) => {
  const [view, setView] = useState<AuthView>(defaultView);
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated: isAdminAuthenticated } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: 'superadmin@rms.com', password: 'password123' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') {
      setView('register');
    } else if (mode === 'login') {
      setView('login');
    }
  }, [location.search]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    setError('');
  };

  const { affiliateLogin, register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/affiliate/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    const result = await affiliateLogin(loginForm.email, loginForm.password);
    setIsLoading(false);
    if (result.success) {
      navigate('/affiliate/dashboard', { replace: true });
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerStep === 1) {
      if (!registerForm.fullName || !registerForm.phone || !registerForm.email || !registerForm.location || !registerForm.password || !registerForm.confirmPassword) {
        setError('Please fill in all required fields.');
        return;
      }
      if (registerForm.password !== registerForm.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (registerForm.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setRegisterStep(2);
      setError('');
      return;
    }

    setIsLoading(true);
    const result = await register({
      name: registerForm.fullName,
      email: registerForm.email,
      password: registerForm.password,
    });
    setIsLoading(false);
    if (result.success) {
      setSuccess('Registration successful! Welcome to the Resulta affiliate program.');
      setTimeout(() => {
        navigate('/affiliate/dashboard', { replace: true });
      }, 1500);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const switchToLogin = () => {
    setView('login');
    setRegisterStep(1);
    setError('');
    setSuccess('');
  };

  const switchToRegister = () => {
    setView('register');
    setRegisterStep(1);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-tl-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Decorative */}
            <div className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary/80 p-8 lg:p-12 flex items-center justify-center min-h-[300px] lg:min-h-[600px] overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-10 w-40 h-40 bg-secondary/30 rounded-full blur-2xl" />

              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 border border-white/20">
                  <span className="text-3xl font-black text-white tracking-tight">R</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                  {view === 'login' ? 'Welcome Back!' : 'Join Resulta'}
                </h2>
                <p className="text-sm text-white/70 max-w-xs mx-auto leading-relaxed">
                  {view === 'login'
                    ? 'Access your affiliate dashboard and track your commissions.'
                    : 'Start earning commissions by referring customers to Resulta.'}
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary mb-4 transition-colors"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  Back to Website
                </button>

                <div className="mb-8">
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight">
                    {view === 'login' ? 'Affiliate Login' : 'Become an Affiliate'}
                  </h1>
                  <p className="mt-2 text-sm text-text-secondary">
                    {view === 'login' ? 'Access your affiliate platform' : 'Join our affiliate program and start earning'}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium">
                    {success}
                  </div>
                )}

                {view === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiMail className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={loginForm.email}
                          onChange={handleLoginChange}
                          required
                          className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiLock className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          required
                          className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-xs font-semibold text-secondary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>

                    <p className="text-center text-sm text-text-secondary">
                      Don't have an account?{' '}
                      <button type="button" onClick={switchToRegister} className="text-secondary font-semibold hover:underline">
                        Apply now
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    {/* Progress Stepper */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${registerStep === 1 ? 'bg-accent text-primary' : 'bg-emerald-500 text-white'}`}>
                          {registerStep === 1 ? '1' : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-xs font-bold ${registerStep === 1 ? 'text-text-primary' : 'text-emerald-600'}`}>Personal Info</span>
                      </div>
                      <div className="flex-1 h-0.5 bg-border mx-3">
                        <div className={`h-full bg-emerald-500 transition-all duration-300 ${registerStep >= 2 ? 'w-full' : 'w-0'}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${registerStep === 2 ? 'bg-accent text-primary' : 'bg-slate-200 text-slate-500'}`}>
                          2
                        </div>
                        <span className={`text-xs font-bold ${registerStep === 2 ? 'text-text-primary' : 'text-slate-400'}`}>Payment Details</span>
                      </div>
                    </div>

                    {registerStep === 1 && (
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Full Name *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <FiUser className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={registerForm.fullName}
                              onChange={handleRegisterChange}
                              required
                              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="businessName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Business Name (Optional)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <FiBriefcase className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              id="businessName"
                              name="businessName"
                              value={registerForm.businessName}
                              onChange={handleRegisterChange}
                              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                              placeholder="Enter your business name"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <FiPhone className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={registerForm.phone}
                              onChange={handleRegisterChange}
                              required
                              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                              placeholder="024 XXX XXX"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="regEmail" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Email Address *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <FiMail className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              type="email"
                              id="regEmail"
                              name="email"
                              value={registerForm.email}
                              onChange={handleRegisterChange}
                              required
                              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="location" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Location / Region *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <FiMapPin className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              id="location"
                              name="location"
                              value={registerForm.location}
                              onChange={handleRegisterChange}
                              required
                              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                              placeholder="Enter your city or region"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="regPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <FiLock className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="regPassword"
                              name="password"
                              value={registerForm.password}
                              onChange={handleRegisterChange}
                              required
                              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                              placeholder="Create a password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                            >
                              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <FiLock className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={registerForm.confirmPassword}
                              onChange={handleRegisterChange}
                              required
                              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                            >
                              {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          fullWidth
                          isLoading={isLoading}
                        >
                          {isLoading ? 'Submitting...' : 'Continue'}
                        </Button>
                      </div>
                    )}

                    {registerStep === 2 && (
                      <div className="space-y-5 animate-fade-in">
                        <div className="p-6 rounded-2xl bg-warm border border-border">
                          <h3 className="text-base font-bold text-text-primary mb-4">Payment Details</h3>
                          <p className="text-sm text-text-secondary mb-6">
                            Provide your payment information to receive commissions.
                          </p>

                          <div className="space-y-4">
                            <div>
                              <label htmlFor="paymentMethod" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                Payment Method
                              </label>
                              <select
                                id="paymentMethod"
                                className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                              >
                                <option value="">Select payment method</option>
                                <option value="momo">Mobile Money</option>
                                <option value="bank">Bank Transfer</option>
                              </select>
                            </div>

                            <div>
                              <label htmlFor="accountNumber" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                Account Number / Phone
                              </label>
                              <input
                                type="text"
                                id="accountNumber"
                                className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                placeholder="e.g. 024 XXX XXX or bank account"
                              />
                            </div>

                            <div>
                              <label htmlFor="accountName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                Account Name
                              </label>
                              <input
                                type="text"
                                id="accountName"
                                className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                placeholder="Name on account"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" size="lg" fullWidth onClick={() => setRegisterStep(1)}>
                            Back
                          </Button>
                          <Button variant="accent" size="lg" fullWidth isLoading={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit Application'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {view === 'register' && (
                      <p className="text-center text-sm text-text-secondary mt-4">
                        Already have an account?{' '}
                        <button type="button" onClick={switchToLogin} className="text-secondary font-semibold hover:underline">
                          Login here
                        </button>
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Forgot Password OTP Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        isLight={false}
        initialEmail={loginForm.email}
      />
    </div>
  );
};

export default AffiliateAuth;
