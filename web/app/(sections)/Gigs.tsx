'use client';

import { useState, useEffect } from 'react';
import { listGigs, initiatePayout, getPayoutStatus } from '@/lib/api';
import { Gig } from '@/lib/types';
import { GigCard } from '@/components/GigCard';

interface GigsProps {
  user?: any;
}

interface PayoutState {
  gigId: string;
  payoutId: string;
  status: 'initiated' | 'settled' | 'failed';
}

export function GigsSection({ user }: GigsProps) {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [payouts, setPayouts] = useState<Map<string, PayoutState>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGigs();
  }, []);

  // Poll payout status for active payouts
  useEffect(() => {
    const activePayouts = Array.from(payouts.values()).filter(p => p.status === 'initiated');
    
    if (activePayouts.length === 0) {
      console.log('No active payouts to poll');
      return;
    }

    console.log('Starting polling for payouts:', activePayouts.map(p => p.payoutId));

    const interval = setInterval(async () => {
      try {
        // Get fresh active payouts from current state
        const currentActivePayouts = Array.from(payouts.values()).filter(p => p.status === 'initiated');
        
        for (const activePayout of currentActivePayouts) {
          const status = await getPayoutStatus(activePayout.payoutId);
          console.log(`Polling payout ${activePayout.payoutId}:`, status);
          
          if (status.status !== 'initiated') {
            console.log(`Payout ${activePayout.payoutId} status changed to ${status.status}`);
            
            setPayouts(prev => {
              const updated = new Map(prev);
              updated.set(activePayout.gigId, {
                ...activePayout,
                status: status.status as 'settled' | 'failed'
              });
              return updated;
            });

            if (status.status === 'settled') {
              showToast('Payment completed via National Payments Gateway');
            }
          }
        }
      } catch (err) {
        console.error('Error polling payout status:', err);
      }
    }, 1000);

    return () => {
      console.log('Clearing polling interval');
      clearInterval(interval);
    };
  }, [payouts]);

  const loadGigs = async () => {
    try {
      const data = await listGigs();
      setGigs(data.gigs);
    } catch (err: any) {
      setError(err.message || 'Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptGig = async (gig: Gig) => {
    if (!user) return;

    try {
      console.log('Initiating payout for gig:', gig.id);
      const response = await initiatePayout(gig.id, gig.payoutLKR);
      console.log('Payout initiated:', response);
      
      setPayouts(prev => {
        const updated = new Map(prev);
        updated.set(gig.id, {
          gigId: gig.id,
          payoutId: response.payoutId,
          status: 'initiated'
        });
        return updated;
      });
      
      showToast(`Payment initiated: ${response.payoutId}`);
    } catch (err: any) {
      console.error('Error initiating payout:', err);
      setError(err.message || 'Failed to initiate payment');
    }
  };

  const showToast = (message: string) => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-accent-emerald text-white px-4 py-2 rounded-xl shadow-soft z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-lg font-medium text-foreground mb-4">Gigs & Payment</h2>
        <div className="text-foreground-secondary">Loading gigs...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-medium text-foreground mb-4">Gigs & Payment</h2>
      
      {error && (
        <div className="text-sm text-error bg-error/10 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!user && (
        <div className="text-sm text-foreground-secondary bg-border/20 p-3 rounded-lg mb-4">
          Please sign in to view and accept gigs.
        </div>
      )}

      <div className="space-y-4">
        {gigs.map((gig) => {
          const payout = payouts.get(gig.id);
          return (
            <GigCard
              key={gig.id}
              gig={gig}
              onAccept={handleAcceptGig}
              paymentStatus={payout?.status || 'idle'}
              disabled={!user}
            />
          );
        })}
      </div>
    </div>
  );
}