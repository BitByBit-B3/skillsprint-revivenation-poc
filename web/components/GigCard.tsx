'use client';

import { Gig } from '@/lib/types';
import { Badge } from './Badge';
import { StatusChip } from './StatusChip';

interface GigCardProps {
  gig: Gig;
  onAccept: (gig: Gig) => void;
  paymentStatus?: 'idle' | 'initiated' | 'settled' | 'failed';
  disabled?: boolean;
}

export function GigCard({ gig, onAccept, paymentStatus = 'idle', disabled = false }: GigCardProps) {
  const isProcessing = paymentStatus === 'initiated';
  const isCompleted = paymentStatus === 'settled';
  
  return (
    <div className="card-hover">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{gig.title}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {gig.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent-emerald">
            LKR {gig.payoutLKR.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => onAccept(gig)}
          disabled={disabled || isProcessing || isCompleted}
          data-test="btn-accept-gig"
          className="btn-primary"
        >
          {isCompleted ? 'Completed' : isProcessing ? 'Processing...' : `Accept Gig (LKR ${gig.payoutLKR.toLocaleString()})`}
        </button>
        
        {paymentStatus !== 'idle' && (
          <StatusChip status={paymentStatus} data-test="payment-status" />
        )}
      </div>
    </div>
  );
}