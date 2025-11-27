import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'warning' | 'danger' | 'success';
}

export function StatsCard({ title, value, icon: Icon, variant = 'default' }: StatsCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    warning: 'bg-warning/10 border-warning/30',
    danger: 'bg-destructive/10 border-destructive/30',
    success: 'bg-success/10 border-success/30',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-destructive/20 text-destructive',
    success: 'bg-success/20 text-success',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-6 shadow-card transition-all duration-300 hover:shadow-lg animate-fade-in',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn('rounded-full p-3', iconStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
