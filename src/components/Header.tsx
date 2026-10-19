import React from 'react';
import { BellRing, Check, X, ArrowDownRight } from 'lucide-react';
import { RepairTicket, UserAccount } from '../types';

interface HeaderProps {
  mode: 'client' | 'admin';
  currentUser: UserAccount | null;
  myTicketsCount: number;
  staffTicketsCount?: number;
  unreadStatusTickets?: RepairTicket[];
  onMarkNotificationRead?: (ticketId: string) => void;
  onMarkAllNotificationsRead?: () => void;
  onOpenAuthModal: (initialTab?: 'login' | 'register') => void;
  onSwitchToClient: () => void;
  onSwitchToAdmin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  currentUser,
  myTicketsCount,
  staffTicketsCount = 0,
  unreadStatusTickets = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onOpenAuthModal,
  onSwitchToClient,
  onSwitchToAdmin,
  onLogout,
}) => {
  const isStaff =
    currentUser?.role === 'admin' || currentUser?.role === 'master';
  const isMaster = currentUser?.role === 'master';
  const showClientNotifications =
    mode === 'client' &&
    currentUser?.role === 'client' &&
    unreadStatusTickets.length > 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Logo + Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            if (mode === 'admin') {
              onSwitchToClient();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-3 group whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-0.5 shadow-md shadow-blue-950/50 group-hover:from-blue-400 group-hover:to-indigo-600 transition-all">
            <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center">
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                aria-hidden="true"
              >
                {/* Microchip pins */}
                <path
                  d="M13 4V8M18 4V8M23 4V8M13 28V32M18 28V32M23 28V32M4 13H8M4 18H8M4 23H8M28 13H32M28 18H32M28 23H32"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Outer chip frame */}
                <rect
                  x="8"
                  y="8"
                  width="20"
                  height="20"
                  rx="4"
                  fill="#1E3A8A"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                {/* Quantum K / Pulse core */}
                <path
                  d="M13 13V23M13 18L20 13M15.5 16.5L21 23"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="22" cy="14" r="1.5" fill="#34D399" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white font-display leading-none">
              КВАНТ Сервис
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mt-1">
              Инженерный центр
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation links */}
        {mode === 'client' ? (
          <nav
            aria-label="Основная навигация"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          >
            <a
              href="#services"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Услуги и цены
            </a>
            <a
              href="#booking-form"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Оформить заявку
            </a>
            <a
              href="#client-cabinet"
              className="text-blue-300 hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 font-semibold"
            >
              {isStaff
                ? `Заявки на ремонт (${staffTicketsCount})`
                : currentUser?.role === 'client'
                ? `Мои заявки (${myTicketsCount})`
                : 'Мои заявки'}
            </a>
            <a
              href="#reviews"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Кейсы и отзывы
            </a>
            {isStaff && (
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="text-amber-300 hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold"
              >
                {isMaster ? 'Кабинет мастера' : 'CRM-панель'}
              </button>
            )}
          </nav>
        ) : (
          <nav
            aria-label="Навигация CRM"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          >
            <span className="text-white font-semibold whitespace-nowrap shrink-0">
              {isMaster
                ? `Кабинет мастера: ${currentUser?.name}`
                : 'CRM-панель администратора'}
            </span>
            <button
              type="button"
              onClick={onSwitchToClient}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Витрина сайта
            </button>
          </nav>
        )}

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {!currentUser ? (
            <button
              type="button"
              onClick={() => onOpenAuthModal('login')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Войти / Регистрация
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 text-xs font-semibold text-slate-100 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Выйти ({currentUser.name.split(' ')[0]})
            </button>
          )}
        </div>
      </div>

      {/* Top Client Notification Bar when a ticket status was changed by a master/admin */}
      {showClientNotifications && (
        <div
          role="region"
          aria-label="Уведомления об изменении статуса заявки"
          data-testid="client-status-notifications-bar"
          className="bg-amber-50 text-slate-900 border-t border-amber-300 border-b-2 border-b-amber-400 shadow-md"
        >
          <div className="max-w-[1360px] mx-auto px-6 py-2.5 space-y-2">
            {unreadStatusTickets.map((ticket) => (
              <div
                key={ticket.id}
                data-testid={`status-notification-${ticket.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-1"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
                    <BellRing className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="text-xs sm:text-sm leading-snug">
                    <span className="font-bold text-slate-950">
                      Ваш статус заявки &quot;{ticket.id}&quot; изменился
                    </span>
                    <span className="text-slate-700 ml-2">
                      — устройство{' '}
                      <strong className="font-semibold text-slate-900">
                        {ticket.brandModel}
                      </strong>
                      :{' '}
                      {ticket.previousStatus ? (
                        <>
                          было{' '}
                          <span className="font-semibold text-slate-700">
                            «{ticket.previousStatus}»
                          </span>{' '}
                          → стало{' '}
                        </>
                      ) : (
                        'новый статус: '
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-bold bg-amber-200/80 text-amber-950 border border-amber-400">
                        «{ticket.status}»
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <a
                    href="#client-cabinet"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('client-cabinet');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>К заявке</span>
                    <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    data-testid={`mark-read-btn-${ticket.id}`}
                    onClick={() => onMarkNotificationRead?.(ticket.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Прочитано</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Закрыть уведомление по заявке ${ticket.id}`}
                    onClick={() => onMarkNotificationRead?.(ticket.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-amber-200/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {unreadStatusTickets.length > 1 && (
              <div className="pt-1 border-t border-amber-200/80 flex justify-end">
                <button
                  type="button"
                  onClick={() => onMarkAllNotificationsRead?.()}
                  className="text-xs font-bold text-amber-950 hover:underline cursor-pointer"
                >
                  Отметить все уведомления как прочитанные ({unreadStatusTickets.length})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
