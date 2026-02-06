import { cn } from '@/lib/utils';
import { FileText, Clock, Loader2, CheckCircle2, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  variant: 'total' | 'pending' | 'progress' | 'solved';
}

export function StatsCard({ label, value, variant }: StatsCardProps) {
  const variants: Record<string, { bg: string; icon: LucideIcon; iconBg: string }> = {
    total: {
      bg: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
      icon: FileText,
      iconBg: 'bg-primary/20 text-primary',
    },
    pending: {
      bg: 'bg-gradient-to-br from-status-pending-bg to-amber-50 border-status-pending/20',
      icon: Clock,
      iconBg: 'bg-amber-100 text-status-pending',
    },
    progress: {
      bg: 'bg-gradient-to-br from-status-progress-bg to-blue-50 border-status-progress/20',
      icon: Loader2,
      iconBg: 'bg-blue-100 text-status-progress',
    },
    solved: {
      bg: 'bg-gradient-to-br from-status-solved-bg to-green-50 border-status-solved/20',
      icon: CheckCircle2,
      iconBg: 'bg-green-100 text-status-solved',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-2xl p-4 border animate-fade-in hover:shadow-md transition-all duration-300 hover:-translate-y-0.5',
        config.bg
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <p className="text-sm mt-1 text-muted-foreground font-medium">{label}</p>
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.iconBg)}>
          <Icon className={cn('w-5 h-5', variant === 'progress' && value > 0 && 'animate-spin')} />
        </div>
      </div>
    </div>
  );
}
