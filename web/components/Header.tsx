'use client';

import { AuthClaims } from '@/lib/types';
import { env } from '@/lib/env';
import { Badge } from './Badge';

interface HeaderProps {
  user?: AuthClaims | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-emerald to-accent-cyan rounded-lg flex items-center justify-center">
              <span className="text-black text-sm font-bold">⚡</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-accent-emerald to-accent-cyan bg-clip-text text-transparent">
              SkillSprint
            </h1>
          </div>
          <Badge variant={env.USE_MOCK ? 'secondary' : 'primary'}>
            {env.USE_MOCK ? 'Mock Mode' : 'Sandbox Mode'}
          </Badge>
        </div>
        
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-foreground-secondary">{user.email}</div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-accent-emerald to-accent-cyan rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">
                {user.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}