'use client';

import { cn } from '@/lib/utils';
import { Badge } from './Badge';

interface StatusChipProps {
  status: 'idle' | 'initiated' | 'settled' | 'failed' | 'loading' | 'success' | 'error';
  'data-test'?: string;
}

const statusConfig = {
  idle: { label: 'Idle', variant: 'secondary' as const },
  loading: { label: 'Loading...', variant: 'secondary' as const },
  initiated: { label: 'Payment Initiated', variant: 'warning' as const },
  settled: { label: 'Paid', variant: 'success' as const },
  failed: { label: 'Failed', variant: 'error' as const },
  success: { label: 'Success', variant: 'success' as const },
  error: { label: 'Error', variant: 'error' as const },
};

export function StatusChip({ status, 'data-test': dataTest }: StatusChipProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} data-test={dataTest}>
      {config.label}
    </Badge>
  );
}