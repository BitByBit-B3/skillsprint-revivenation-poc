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
      const claims = await getClaims(sessionId);
      if (claims) {
        setUser(claims);
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
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              SkillSprint
            </h1>
            <p className="text-foreground-secondary">
              Government-verified skills platform for freelance opportunities
            </p>
          </div>

          <div className="space-y-6">
            <AuthClaimsSection 
              onAuthSuccess={handleAuthSuccess} 
              user={user} 
            />
            
            <EducationSection user={user} />
            
            <GigsSection user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}