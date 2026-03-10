import { cn } from '@/lib/utils';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED';

interface BookingStatusBadgeProps {
  status: BookingStatus | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  },
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-800 border border-green-200',
  },
  DECLINED: {
    label: 'Declined',
    className: 'bg-red-100 text-red-800 border border-red-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-slate-100 text-slate-700 border border-slate-200',
  },
};

export default function BookingStatusBadge({
  status,
  size = 'sm',
}: BookingStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-4 py-1.5 text-sm',
        config.className
      )}
    >
      {/* Status dot */}
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'PENDING' && 'bg-yellow-500',
          status === 'CONFIRMED' && 'bg-green-500',
          status === 'DECLINED' && 'bg-red-500',
          status === 'CANCELLED' && 'bg-slate-400'
        )}
      />
      {config.label}
    </span>
  );
}
