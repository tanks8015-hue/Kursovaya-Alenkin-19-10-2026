import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  PackageCheck,
  Wrench,
  ClipboardCheck,
  XCircle,
  Microscope,
  Hourglass,
} from 'lucide-react';
import { TicketStatus } from '../types';

interface StatusIndicatorProps {
  status: TicketStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  switch (status) {
    case 'Новая':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Новая</span>
        </span>
      );
    case 'Ожидает Мастера':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 whitespace-nowrap">
          <Hourglass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Ожидает Мастера</span>
        </span>
      );
    case 'На диагностике':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 whitespace-nowrap">
          <Microscope className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>На диагностике</span>
        </span>
      );
    case 'Принята':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 whitespace-nowrap">
          <ClipboardCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Принята</span>
        </span>
      );
    case 'В работе':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 whitespace-nowrap">
          <Wrench className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>В работе</span>
        </span>
      );
    case 'Ожидает запчастей':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Ожидает запчастей</span>
        </span>
      );
    case 'Готова':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Готова</span>
        </span>
      );
    case 'Выдана':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
          <PackageCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Выдана</span>
        </span>
      );
    case 'Отменен':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 whitespace-nowrap">
          <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Отменен</span>
        </span>
      );
    default:
      return <span className="text-xs font-medium text-slate-700">{status}</span>;
  }
};
