'use client';

import { AuthClaims } from '@/lib/types';
import { env } from '@/lib/env';
import { Badge } from './Badge';

interface HeaderProps {
  user?: AuthClaims | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-light text-foreground">
            SkillSprint
          </h1>
          <Badge variant={env.USE_MOCK ? 'secondary' : 'primary'}>
            {env.USE_MOCK ? 'Mock' : 'Sandbox'}
          </Badge>
        </div>
        
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-foreground">{user.name}</div>
              <div className="text-xs text-foreground-secondary">{user.email}</div>
            </div>
            <div className="w-6 h-6 bg-accent-emerald rounded-full flex items-center justify-center">
              <span className="text-background text-xs font-medium">
                {user.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}