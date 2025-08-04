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
          <h1 className="text-xl font-bold text-foreground">SkillSprint</h1>
          <Badge variant={env.USE_MOCK ? 'secondary' : 'primary'}>
            Demo Mode: {env.USE_MOCK ? 'Mock' : 'Sandbox'}
          </Badge>
        </div>
        
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-foreground-secondary">{user.email}</div>
            </div>
            <div className="w-8 h-8 bg-accent-emerald rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}