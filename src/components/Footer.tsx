import React from 'react';
import { UserAccount } from '../types';

interface FooterProps {
  currentUser: UserAccount | null;
  onOpenAuthModal: (initialTab?: 'login' | 'register') => void;
  onOpenMainSection?: (sectionId?: string) => void;
  onOpenReviewsPage?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenMainSection,
  onOpenReviewsPage,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10">
      <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 p-0.5 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  d="M13 4V8M18 4V8M23 4V8M13 28V32M18 28V32M23 28V32M4 13H8M4 18H8M4 23H8M28 13H32M28 18H32M28 23H32"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
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
          <div>
            <p className="text-sm font-bold font-display text-white mb-0.5">
              КВАНТ Сервис — Инженерный центр ремонта электроники
            </p>
            <p>
              © 2026 ООО «Квант Лаб». Москва, ул. Малая Бронная, д. 24 · Ежедневно с 09:00
              до 21:00 · +7 (495) 128-44-00
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => onOpenMainSection?.('services')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Услуги и прайс
          </button>
          <button
            type="button"
            onClick={() => onOpenMainSection?.('booking-form')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Создать заявку
          </button>
          <button
            type="button"
            onClick={() => onOpenMainSection?.('client-cabinet')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {currentUser?.role === 'admin' || currentUser?.role === 'master'
              ? 'Заявки на ремонт'
              : 'Мои заявки'}
          </button>
          <button
            type="button"
            onClick={() => onOpenReviewsPage?.()}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Отзывы
          </button>
          {!currentUser && (
            <button
              type="button"
              onClick={() => onOpenAuthModal('login')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Вход в аккаунт / Регистрация
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
