'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AuthClaimsSection } from './(sections)/AuthClaims';
import { EducationSection } from './(sections)/Education';
import { GigsSection } from './(sections)/Gigs';
import { AuthClaims } from '@/lib/types';
import { getClaims } from '@/lib/api';

export default function HomePage() {
  const [user, setUser] = useState<AuthClaims | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore session from localStorage
    const savedSessionId = localStorage.getItem('skillsprint_session');
    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadUserClaims(savedSessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserClaims = async (sessionId: string) => {
    try {
      const response = await getClaims(sessionId);
      if (response && response.response && response.response.claims) {
        setUser(response.response.claims);
      } else {
        // Session expired, clear localStorage
        localStorage.removeItem('skillsprint_session');
      }
    } catch (error) {
      console.error('Error loading user claims:', error);
      localStorage.removeItem('skillsprint_session');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (claims: AuthClaims, newSessionId: string) => {
    setUser(claims);
    setSessionId(newSessionId);
    localStorage.setItem('skillsprint_session', newSessionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent-emerald to-accent-cyan rounded-2xl mb-4">
              <span className="text-2xl font-bold text-black">⚡</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-accent-emerald to-accent-cyan bg-clip-text text-transparent">
              SkillSprint
            </h1>
            <p className="text-foreground-secondary text-lg">
              Government-verified skills platform for freelance opportunities
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <span className="px-3 py-1 bg-accent-emerald/10 text-accent-emerald text-sm rounded-full border border-accent-emerald/20">
                MOSIP 1.2.0
              </span>
              <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-sm rounded-full border border-accent-cyan/20">
                WSO2 Choreo
              </span>
              <span className="px-3 py-1 bg-warning/10 text-warning text-sm rounded-full border border-warning/20">
                PayDPI Ready
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AuthClaimsSection 
                onAuthSuccess={handleAuthSuccess} 
                user={user} 
              />
            </div>
            
            <div className="lg:col-span-1">
              <EducationSection user={user} />
            </div>
            
            <div className="lg:col-span-3">
              <GigsSection user={user} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}