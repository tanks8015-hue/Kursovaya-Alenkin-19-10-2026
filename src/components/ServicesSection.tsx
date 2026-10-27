import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Search,
  Wrench,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronDown,
  Check,
} from 'lucide-react';
import { DeviceType, UserAccount } from '../types';
import { SERVICES_CATALOG, stripPriceFromIssue } from '../utils/repairStore';

interface ServicesSectionProps {
  selectedDevice: DeviceType | null;
  selectedIssues: string[];
  onToggleServiceIssue: (deviceType: DeviceType, rawIssue: string) => void;
  onSelectServiceDevice: (deviceType: DeviceType) => void;
  onQuickTrackClick?: () => void;
  currentUser?: UserAccount | null;
  myTicketsCount?: number;
  staffTicketsCount?: number;
  onSwitchToAdmin?: () => void;
}

const CATEGORY_SHOWCASE_ILLUSTRATIONS: Record<
  string,
  { src: string; alt: string; shortTitle: string }
> = {
  'srv-tv-monitors': {
    shortTitle: 'РЕМОНТ ТЕЛЕВИЗОРОВ И МОНИТОРОВ',
    alt: 'Ремонт телевизоров и мониторов',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" fill="none">
        <defs>
          <linearGradient id="tvScreen" x1="60" y1="20" x2="300" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="50%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#090D16"/>
          </linearGradient>
          <linearGradient id="tvGlow" x1="60" y1="20" x2="220" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="#0F172A" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect x="64" y="20" width="232" height="134" rx="8" fill="#06B6D4" fill-opacity="0.18"/>
        <rect x="68" y="24" width="224" height="126" rx="6" fill="#090D16" stroke="#0891B2" stroke-width="2.5"/>
        <rect x="74" y="30" width="212" height="114" rx="3" fill="url(#tvScreen)"/>
        <polygon points="74,30 195,30 135,144 74,144" fill="url(#tvGlow)"/>
        <circle cx="180" cy="147" r="2" fill="#22D3EE"/>
        <path d="M115 150 L92 172 M115 150 L125 166" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        <path d="M245 150 L268 172 M245 150 L235 166" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="180" cy="176" rx="110" ry="5" fill="#CBD5E1" fill-opacity="0.55"/>
      </svg>
    `)}`,
  },
  'srv-laptops': {
    shortTitle: 'РЕМОНТ НОУТБУКОВ И КОМПЬЮТЕРОВ',
    alt: 'Ремонт ноутбуков и компьютеров',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" fill="none">
        <defs>
          <linearGradient id="monScr" x1="145" y1="35" x2="295" y2="145" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#090D16"/>
          </linearGradient>
          <linearGradient id="towerGrad" x1="68" y1="30" x2="132" y2="168" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="50%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
        </defs>
        <ellipse cx="185" cy="175" rx="118" ry="6" fill="#CBD5E1" fill-opacity="0.6"/>
        <rect x="70" y="30" width="62" height="138" rx="6" fill="url(#towerGrad)" stroke="#0891B2" stroke-width="2"/>
        <rect x="77" y="40" width="48" height="10" rx="2" fill="#0F172A" stroke="#64748B" stroke-width="1"/>
        <rect x="77" y="55" width="48" height="10" rx="2" fill="#0F172A" stroke="#64748B" stroke-width="1"/>
        <circle cx="101" cy="85" r="7" fill="#0F172A" stroke="#22D3EE" stroke-width="2"/>
        <circle cx="101" cy="85" r="2.5" fill="#22D3EE"/>
        <rect x="80" y="108" width="42" height="48" rx="4" fill="#090D16" stroke="#334155" stroke-width="1"/>
        <rect x="144" y="38" width="154" height="102" rx="6" fill="#090D16" stroke="#0891B2" stroke-width="2.5"/>
        <rect x="150" y="44" width="142" height="90" rx="3" fill="url(#monScr)"/>
        <polygon points="150,44 235,44 195,134 150,134" fill="#38BDF8" fill-opacity="0.16"/>
        <rect x="210" y="140" width="22" height="18" fill="#475569"/>
        <path d="M182 158 H260 L268 166 H174 L182 158Z" fill="#64748B"/>
      </svg>
    `)}`,
  },
  'srv-smartphones': {
    shortTitle: 'РЕМОНТ СМАРТФОНОВ И ПЛАНШЕТОВ',
    alt: 'Ремонт смартфонов и планшетов',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" fill="none">
        <defs>
          <linearGradient id="padScr" x1="85" y1="30" x2="215" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="50%" stop-color="#1E3A8A"/>
            <stop offset="100%" stop-color="#0284C7"/>
          </linearGradient>
          <linearGradient id="phScr" x1="200" y1="45" x2="275" y2="168" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#38BDF8"/>
            <stop offset="50%" stop-color="#2563EB"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
        </defs>
        <ellipse cx="180" cy="176" rx="105" ry="6" fill="#CBD5E1" fill-opacity="0.6"/>
        <rect x="88" y="28" width="124" height="140" rx="12" fill="#0F172A" stroke="#0891B2" stroke-width="2.5"/>
        <rect x="95" y="36" width="110" height="124" rx="6" fill="url(#padScr)"/>
        <polygon points="95,36 165,36 135,160 95,160" fill="#FFFFFF" fill-opacity="0.1"/>
        <rect x="196" y="44" width="74" height="126" rx="14" fill="#090D16" stroke="#22D3EE" stroke-width="2.5"/>
        <rect x="202" y="51" width="62" height="112" rx="10" fill="url(#phScr)"/>
        <rect x="221" y="56" width="24" height="5" rx="2.5" fill="#090D16"/>
        <circle cx="233" cy="110" r="16" fill="#0F172A" fill-opacity="0.45" stroke="#34D399" stroke-width="2"/>
        <path d="M227 110 L231 115 L240 105" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `)}`,
  },
  'srv-consoles': {
    shortTitle: 'РЕМОНТ КОНСОЛЕЙ И ТЕХНИКИ',
    alt: 'Ремонт игровых консолей и домашней электроники',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" fill="none">
        <ellipse cx="180" cy="176" rx="112" ry="6" fill="#CBD5E1" fill-opacity="0.6"/>
        <path d="M96 26 L146 22 L142 166 L98 166 Z" fill="#F8FAFC" stroke="#0891B2" stroke-width="2.5"/>
        <rect x="108" y="26" width="24" height="140" rx="4" fill="#090D16"/>
        <line x1="108" y1="35" x2="108" y2="120" stroke="#22D3EE" stroke-width="2"/>
        <line x1="132" y1="35" x2="132" y2="120" stroke="#22D3EE" stroke-width="2"/>
        <rect x="152" y="76" width="132" height="86" rx="28" fill="#0F172A" stroke="#0891B2" stroke-width="2.5"/>
        <path d="M176 112 H196 M186 102 V122" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
        <circle cx="250" cy="102" r="4.5" fill="#34D399"/>
        <circle cx="260" cy="112" r="4.5" fill="#F87171"/>
        <circle cx="240" cy="112" r="4.5" fill="#60A5FA"/>
        <circle cx="250" cy="122" r="4.5" fill="#FBBF24"/>
        <circle cx="204" cy="134" r="11" fill="#1E293B" stroke="#22D3EE" stroke-width="2"/>
        <circle cx="232" cy="134" r="11" fill="#1E293B" stroke="#22D3EE" stroke-width="2"/>
      </svg>
    `)}`,
  },
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  selectedDevice,
  selectedIssues,
  onToggleServiceIssue,
  onSelectServiceDevice,
  onQuickTrackClick,
  currentUser,
  myTicketsCount = 0,
  staffTicketsCount = 0,
  onSwitchToAdmin,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const isStaff =
    currentUser?.role === 'admin' || currentUser?.role === 'master';
  const isClient = currentUser?.role === 'client';

  const handleCardDetailsClick = (serviceId: string) => {
    setSelectedCategoryId(serviceId);
    const detailEl = document.getElementById(`service-detail-${serviceId}`);
    if (detailEl) {
      detailEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="services" className="border-b-2 border-slate-300">
      {/* PART 1: First-Screen Visual Showcase */}
      <div
        id="top"
        className="relative overflow-hidden bg-[#06132E] text-white pt-8 pb-14 md:pt-11 md:pb-16 border-b-2 border-slate-800"
        style={{
          backgroundImage: `radial-gradient(circle at 18% 20%, rgba(14, 165, 233, 0.18), transparent 45%), radial-gradient(circle at 85% 75%, rgba(6, 182, 212, 0.16), transparent 50%), linear-gradient(180deg, #06132E 0%, #0A1D42 100%)`,
        }}
      >
        {/* Subtle Circuit Trace SVG Backdrop */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="circuit-pattern"
              width="160"
              height="160"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 40 H 50 L 75 65 V 120 M 160 80 H 110 L 85 55 V 10 M 40 160 V 115 L 65 90 H 130"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="1.5"
              />
              <circle cx="75" cy="120" r="3.5" fill="#22D3EE" />
              <circle cx="85" cy="10" r="3.5" fill="#22D3EE" />
              <circle cx="130" cy="90" r="3.5" fill="#22D3EE" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>

        <div className="relative max-w-[1360px] mx-auto px-6">
          {/* Top Hero Title & Quick Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-9">
            <div className="max-w-3xl">
              <div className="inline-flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2.5">
                <span>Бесплатная диагностика 0 ₽ за 30–45 минут</span>
                <span aria-hidden="true">·</span>
                <span>Гарантия 12 месяцев</span>
                <span aria-hidden="true">·</span>
                <span>ул. Малая Бронная, 24</span>
              </div>
              <h1
                className="font-display font-extrabold tracking-tight text-white text-2xl sm:text-4xl lg:text-[40px] leading-[1.15] uppercase mb-2.5"
                style={{ textWrap: 'balance' }}
              >
                Профессиональный ремонт цифровой и бытовой техники
              </h1>
              <p className="text-sm sm:text-base font-bold uppercase tracking-wide text-cyan-200">
                Мы обслуживаем не просто технику — мы помогаем людям! Выберите ваше устройство ниже:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="#booking-form"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md transition-colors whitespace-nowrap"
              >
                <Wrench className="w-4 h-4" aria-hidden="true" />
                <span>Записаться на ремонт</span>
              </a>

              {isStaff && onSwitchToAdmin ? (
                <button
                  type="button"
                  onClick={onSwitchToAdmin}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold text-amber-200 bg-slate-900/90 border border-amber-400/50 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Рабочая панель ({staffTicketsCount})</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onQuickTrackClick}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-slate-900/80 border border-cyan-400/40 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Search className="w-4 h-4 text-cyan-300" aria-hidden="true" />
                  <span>
                    {isClient
                      ? `Мои заявки (${myTicketsCount})`
                      : 'Проверить статус ремонта'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Visual Category Cards on the First Screen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES_CATALOG.map((service) => {
              const visual = CATEGORY_SHOWCASE_ILLUSTRATIONS[service.id];
              const isCategoryActive = selectedDevice === service.deviceType;
              const activeCountInCard = isCategoryActive
                ? selectedIssues.length
                : 0;
              const isSelected =
                selectedCategoryId === service.id || activeCountInCard > 0;

              return (
                <div
                  key={service.id}
                  data-testid={`hero-service-card-${service.id}`}
                  className={`bg-white text-slate-900 rounded-2xl p-6 shadow-xl border-2 transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'border-cyan-400 ring-4 ring-cyan-400/25'
                      : 'border-white hover:border-cyan-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs mb-2">
                      <span className="font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-md">
                        от {service.priceFrom.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {service.turnaround}
                      </span>
                    </div>

                    {visual && (
                      <div
                        onClick={() => onSelectServiceDevice(service.deviceType)}
                        className="h-36 w-full flex items-center justify-center my-2 cursor-pointer group-hover:scale-[1.03] transition-transform"
                      >
                        <img
                          src={visual.src}
                          alt={visual.alt}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}

                    <h2 className="text-center font-display font-extrabold text-sm sm:text-base tracking-wide uppercase text-cyan-800 mt-2 mb-3 min-h-[2.5rem] flex items-center justify-center">
                      {visual ? visual.shortTitle : service.title}
                    </h2>
                    <div className="w-3/4 mx-auto h-[2px] bg-cyan-600/60 mb-3.5" />

                    {/* Short 2-row preview of popular services (click to toggle selection without price) */}
                    <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                      {service.commonIssues.slice(0, 2).map((issue) => {
                        const [rawTitle, rawPrice] = issue.split(' — ');
                        const shortLabel = rawTitle.replace(/\s*\(.*?\)/g, '');
                        const cleanIssue = stripPriceFromIssue(issue);
                        const isIssueChecked =
                          isCategoryActive &&
                          selectedIssues.includes(cleanIssue);

                        return (
                          <li
                            key={issue}
                            onClick={() =>
                              onToggleServiceIssue(service.deviceType, issue)
                            }
                            className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                              isIssueChecked
                                ? 'bg-blue-50 border-blue-500 text-blue-950'
                                : 'bg-slate-50 hover:bg-cyan-50 border-slate-200/80 text-slate-800'
                            }`}
                          >
                            <span className="font-medium leading-tight flex items-center gap-1.5">
                              {isIssueChecked && (
                                <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                              )}
                              <span>{shortLabel}</span>
                            </span>
                            {rawPrice && (
                              <span className="font-mono font-bold text-cyan-800 whitespace-nowrap shrink-0 text-[11px]">
                                {rawPrice.replace('руб.', '₽')}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectServiceDevice(service.deviceType)}
                      className={`w-full py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeCountInCard > 0
                          ? 'bg-blue-700 hover:bg-blue-800'
                          : 'bg-slate-900 hover:bg-blue-700'
                      }`}
                    >
                      <span>
                        {activeCountInCard > 0
                          ? `К заявке (выбрано: ${activeCountInCard})`
                          : 'Записаться на ремонт'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCardDetailsClick(service.id)}
                      className="w-full py-1.5 px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Подробнее и прайс-лист</span>
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-cyan-100">
            <div className="flex items-center gap-3 bg-slate-900/75 border border-slate-700/80 rounded-xl px-4 py-3">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-white">Бесплатная диагностика 0 ₽:</strong> называем точную цену до начала ремонта, без скрытых доплат.
              </span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/75 border border-slate-700/80 rounded-xl px-4 py-3">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-white">Быстрый ремонт при вас:</strong> типовые поломки смартфонов, консолей и ноутбуков устраняем за 45–120 минут.
              </span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/75 border border-slate-700/80 rounded-xl px-4 py-3">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-white">Честная гарантия 12 месяцев:</strong> оригинальные запчасти и онлайн-статус заказа на сайте.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: Detailed Price Catalog with Single-Category Multi-Select (Without Price in Form) */}
      <div className="py-12 md:py-16 bg-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-800 mb-1.5">
                Подробный прайс-лист · Можно выбрать сразу несколько поломок внутри одной категории
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Что именно случилось с вашим устройством?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 max-w-md">
              Отметьте одну или несколько поломок в карточке вашего устройства — в
              заявку перенесётся только само название поломки (без ценника).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES_CATALOG.map((service) => {
              const isCategoryActive = selectedDevice === service.deviceType;
              const activeCountInCard = isCategoryActive
                ? selectedIssues.length
                : 0;
              const isHighlighted =
                selectedCategoryId === service.id || activeCountInCard > 0;

              return (
                <article
                  key={service.id}
                  id={`service-detail-${service.id}`}
                  className={`bg-white border-2 shadow-sm rounded-xl overflow-hidden flex flex-col justify-between transition-all ${
                    isHighlighted
                      ? 'border-blue-600 ring-4 ring-blue-600/15'
                      : 'border-slate-300 hover:border-blue-600'
                  }`}
                >
                  <div className="p-6 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pb-3 mb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700">
                          Категория {service.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-800">
                          {service.deviceType}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{service.turnaround}</span>
                        <span aria-hidden="true">·</span>
                        <span>{service.warranty}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                        от {service.priceFrom.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
                      {service.title}
                    </h3>

                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    <div className="bg-[#F1F5F9] border border-slate-200 rounded-lg p-3.5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-xs font-bold text-slate-900">
                          Частые поломки и цены (можно выбрать несколько):
                        </p>
                        {activeCountInCard > 0 && (
                          <span className="text-[11px] font-bold text-blue-700">
                            Выбрано: {activeCountInCard}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {service.commonIssues.map((item) => {
                          const cleanIssue = stripPriceFromIssue(item);
                          const isChecked =
                            isCategoryActive &&
                            selectedIssues.includes(cleanIssue);

                          return (
                            <button
                              key={item}
                              type="button"
                              aria-pressed={isChecked}
                              onClick={() =>
                                onToggleServiceIssue(service.deviceType, item)
                              }
                              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs sm:text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                                isChecked
                                  ? 'bg-blue-50 border-blue-600 text-slate-950 font-semibold shadow-2xs'
                                  : 'bg-white hover:bg-blue-50/60 border-slate-200 hover:border-blue-400 text-slate-800'
                              }`}
                            >
                              <span className="flex items-center gap-2.5">
                                <span
                                  className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                                    isChecked
                                      ? 'bg-blue-600 border-blue-600 text-white'
                                      : 'bg-white border-slate-300 group-hover:border-blue-500'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3" />}
                                </span>
                                <span>{item}</span>
                              </span>
                              <span
                                className={`text-[11px] font-bold whitespace-nowrap shrink-0 ${
                                  isChecked
                                    ? 'text-blue-700'
                                    : 'text-blue-700 opacity-80 group-hover:opacity-100'
                                }`}
                              >
                                {isChecked ? 'Выбрано ✓' : 'Выбрать →'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {activeCountInCard > 0
                          ? `В заявку добавлено поломок: ${activeCountInCard}`
                          : 'Диагностика бесплатно (0 ₽)'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectServiceDevice(service.deviceType)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeCountInCard > 0
                          ? 'bg-blue-700 hover:bg-blue-800'
                          : 'bg-slate-900 hover:bg-blue-700'
                      }`}
                    >
                      <span>
                        {activeCountInCard > 0
                          ? `Записаться на услугу (${activeCountInCard})`
                          : 'Записаться на услугу'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
