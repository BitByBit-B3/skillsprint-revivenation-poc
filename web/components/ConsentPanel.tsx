'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ConsentPanelProps {
  onConsentChange: (consented: boolean) => void;
  disabled?: boolean;
}

export function ConsentPanel({ onConsentChange, disabled = false }: ConsentPanelProps) {
  const [consented, setConsented] = useState(false);
  
  const handleChange = (checked: boolean) => {
    setConsented(checked);
    onConsentChange(checked);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="consent-checkbox"
          checked={consented}
          onChange={(e) => handleChange(e.target.checked)}
          disabled={disabled}
          data-test="btn-consent"
          className={cn(
            'mt-1 h-4 w-4 rounded border-border bg-background text-accent-emerald',
            'focus:ring-2 focus:ring-accent-emerald focus:ring-offset-2 focus:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
        <label 
          htmlFor="consent-checkbox" 
          className={cn(
            'text-sm text-foreground-secondary leading-relaxed cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          I consent to fetch my education record from the National Data Exchange. 
          This will allow SkillSprint to verify my qualifications and skills for 
          better gig matching.
        </label>
      </div>
      
      {consented && (
        <div className="text-xs text-accent-emerald bg-accent-emerald/10 p-3 rounded-xl">
          ✓ Consent granted. Your data will be securely retrieved and used only for skill verification.
        </div>
      )}
    </div>
  );
}