'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import styles from './login.module.css';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, loginAsDemo } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoModeClick = () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('Connexion au mode démo...');
    loginAsDemo();
    setTimeout(() => {
      router.replace('/');
    }, 1000);
  };

  const isLoginMode = mode === 'login';

  const toggleMode = () => {
    setMode(isLoginMode ? 'register' : 'login');
    setError('');
    setConfirmPassword('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation for registration
    if (!isLoginMode && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        await login(username, password);
        setSuccess('Successfully signed in! Redirecting...');
      } else {
        await register(username, password, confirmPassword, email || undefined);
        setSuccess('Account created successfully! Redirecting...');
      }
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (err: any) {
      console.error('[LoginPage] Auth error:', err);
      
      if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        setError(err.response.data.errors[0]);
      } else if (err?.response?.data?.msg) {
        setError(err.response.data.msg);
      } else if (err?.message) {
        // Show technical message if it's a network error (e.g. "Network Error", "timeout")
        setError(`Erreur: ${err.message}`);
      } else {
        const fallbackMessage = isLoginMode
          ? 'Invalid credentials. Please try again.'
          : 'Registration failed. Please try again.';
        setError(fallbackMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles['login-page']}>
      <form className={styles['login-card']} onSubmit={handleSubmit} noValidate>
        {/* Header */}
        <div className={styles['login-header']}>
          <div className={styles['login-logo']}>
            <Shield size={32} color="white" />
          </div>
          <h1 className={styles['login-title']}>
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className={styles['login-subtitle']}>
            {isLoginMode
              ? 'Sign in to access your Smartovate dashboard'
              : 'Register to start using Smartovate Insights'}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className={styles['error-banner']}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className={styles['success-banner']}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Username */}
        <div className={styles['form-group']}>
          <label htmlFor="username" className={styles['form-label']}>
            Username
          </label>
          <div className={styles['input-wrapper']}>
            <input
              id="username"
              type="text"
              className={styles['form-input']}
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <User size={18} className={styles['input-icon']} />
          </div>
        </div>

        {/* Email — register only */}
        {!isLoginMode && (
          <div className={styles['form-group']}>
            <label htmlFor="email" className={styles['form-label']}>
              Email <span style={{ opacity: 0.5 }}>(optional)</span>
            </label>
            <div className={styles['input-wrapper']}>
              <input
                id="email"
                type="email"
                className={styles['form-input']}
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={18} className={styles['input-icon']} />
            </div>
          </div>
        )}

        {/* Password */}
        <div className={styles['form-group']}>
          <label htmlFor="password" className={styles['form-label']}>
            Password
          </label>
          <div className={styles['input-wrapper']}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={styles['form-input']}
              placeholder="••••••••"
              autoComplete={isLoginMode ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Lock size={18} className={styles['input-icon']} />
            <button
              type="button"
              className={styles['password-toggle']}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password — register only */}
        {!isLoginMode && (
          <div className={styles['form-group']}>
            <label htmlFor="confirmPassword" className={styles['form-label']}>
              Confirm Password
            </label>
            <div className={styles['input-wrapper']}>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className={styles['form-input']}
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <CheckCircle2 size={18} className={styles['input-icon']} />
              <button
                type="button"
                className={styles['password-toggle']}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className={styles['login-btn']}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles['btn-spinner']} />
          ) : isLoginMode ? (
            'Sign In'
          ) : (
            'Create Account'
          )}
        </button>

        {isLoginMode && (
          <button
            type="button"
            className={styles['demo-btn']}
            onClick={handleDemoModeClick}
            disabled={isSubmitting}
          >
            Explorer en Mode Démo
          </button>
        )}

        {/* Toggle mode */}
        <p className={styles['mode-toggle']}>
          {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className={styles['mode-toggle-btn']} onClick={toggleMode}>
            {isLoginMode ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </form>
    </main>

  );
}
