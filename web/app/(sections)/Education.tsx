'use client';

import { useState } from 'react';
import { fetchEducation } from '@/lib/api';
import { AuthClaims, EducationRecord } from '@/lib/types';
import { StatusChip } from '@/components/StatusChip';
import { ConsentPanel } from '@/components/ConsentPanel';
import { Badge } from '@/components/Badge';

interface EducationProps {
  user?: AuthClaims | null;
}

export function EducationSection({ user }: EducationProps) {
  const [consented, setConsented] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [educationRecord, setEducationRecord] = useState<EducationRecord | null>(null);
  const [error, setError] = useState('');

  const handleFetchEducation = async () => {
    if (!user || !consented) return;

    setStatus('loading');
    setError('');

    try {
      const record = await fetchEducation(user.sub);
      setEducationRecord(record);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch education record');
      setStatus('error');
    }
  };

  const firstSkill = educationRecord?.qualifications[0]?.skills[0];

  return (
    <div className="card">
      <h2 className="text-lg font-medium text-foreground mb-4">National Data Exchange</h2>
      
      <StatusChip status={status} data-test="education-status" />

      <div className="mt-4 space-y-4">
        <ConsentPanel 
          onConsentChange={setConsented} 
          disabled={!user || status === 'loading'}
        />

        <button
          onClick={handleFetchEducation}
          disabled={!user || !consented || status === 'loading'}
          data-test="btn-fetch-education"
          className="btn-primary w-full"
        >
          {status === 'loading' ? 'Fetching...' : 'Fetch my education record'}
        </button>

        {error && (
          <div className="text-sm text-error bg-error/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {educationRecord && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-foreground-secondary">Full Name: </span>
                <span className="text-foreground">{educationRecord.fullName}</span>
              </div>
              
              {educationRecord.qualifications.map((qual, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-sm">
                    <span className="text-foreground-secondary">Institution: </span>
                    <span className="text-foreground">{qual.institution}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-foreground-secondary">Program: </span>
                    <span className="text-foreground">{qual.program}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-foreground-secondary">Year: </span>
                    <span className="text-foreground">{qual.year}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {qual.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {firstSkill && (
              <div className="text-sm text-accent-emerald">
                ✓ Verified Skill: {firstSkill}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}