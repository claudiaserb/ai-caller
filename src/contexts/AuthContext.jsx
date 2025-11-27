import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== AuthContext: Initializing auth ===');
    
    // Handle OAuth callback - check for tokens in URL hash on page load
    const handleOAuthCallback = async () => {
      // Check if we have hash fragments (OAuth callback)
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log('=== OAuth callback detected in URL hash ===');
        console.log('Hash:', window.location.hash.substring(0, 50) + '...');
        
        // Supabase automatically processes hash fragments when getSession() is called
        // But we explicitly call it to ensure the session is established
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('=== Error getting session from OAuth callback ===', error);
          setLoading(false);
        } else if (session) {
          console.log('=== OAuth session established ===');
          console.log('User:', session.user.email);
          setUser(session.user);
          setLoading(false);
          
          // Clear hash from URL for security, but preserve query parameters
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else {
          console.log('=== No session found in OAuth callback ===');
          setLoading(false);
        }
      } else {
        // No OAuth callback, just check for existing session
        console.log('=== No OAuth callback, checking existing session ===');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('=== Error getting session ===', error);
        } else if (session) {
          console.log('=== Existing session found ===');
          console.log('User:', session.user.email);
        } else {
          console.log('=== No existing session ===');
        }
        
        setUser(session?.user ?? null);
        setLoading(false);
      }
    };

    // Initial session check and OAuth callback handling
    handleOAuthCallback();

    // Listen for auth changes (including OAuth callbacks)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('=== Auth state changed ===');
      console.log('Event:', event);
      console.log('Session:', session ? `User: ${session.user?.email}` : 'No session');
      
      if (session) {
        setUser(session.user);
        setLoading(false);
        
        // Redirect to dashboard if on login/register page
        if (window.location.pathname === '/login' || window.location.pathname === '/register') {
          console.log('=== Redirecting authenticated user to dashboard ===');
          window.location.href = '/dashboard';
        }
      } else {
        console.log('=== User signed out ===');
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('=== AuthContext: Cleaning up ===');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, name, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
        },
      },
    });

    if (error) throw error;

    // Trigger-ul din database creează automat profile și settings

    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    console.log('Redirect URL:', `${window.location.origin}/dashboard`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      },
    });
    
    if (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
    
    return data;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};