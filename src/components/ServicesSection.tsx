import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { DeviceType } from '../types';
import { SERVICES_CATALOG } from '../utils/repairStore';

interface ServicesSectionProps {
  onSelectServiceDevice: (deviceType: DeviceType) => void;
}

const SERVICE_HEADER_IMAGES: Record<string, { src: string; alt: string }> = {
  'srv-smartphones': {
    alt: 'Ремонт смартфонов и планшетов — OLED-матрицы и микропайка плат',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" fill="none">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="800" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="55%" stop-color="#1E3A8A"/>
            <stop offset="100%" stop-color="#0284C7"/>
          </linearGradient>
          <linearGradient id="scr1" x1="250" y1="40" x2="550" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#38BDF8"/>
            <stop offset="50%" stop-color="#2563EB"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
        </defs>
        <rect width="800" height="360" fill="url(#bg1)"/>
        <!-- Subtle tech grid -->
        <g stroke="#38BDF8" stroke-opacity="0.14" stroke-width="1">
          <line x1="0" y1="60" x2="800" y2="60"/>
          <line x1="0" y1="120" x2="800" y2="120"/>
          <line x1="0" y1="180" x2="800" y2="180"/>
          <line x1="0" y1="240" x2="800" y2="240"/>
          <line x1="0" y1="300" x2="800" y2="300"/>
          <line x1="160" y1="0" x2="160" y2="360"/>
          <line x1="320" y1="0" x2="320" y2="360"/>
          <line x1="480" y1="0" x2="480" y2="360"/>
          <line x1="640" y1="0" x2="640" y2="360"/>
        </g>
        <!-- Circuit traces -->
        <path d="M70 280 H190 L230 240 H310" stroke="#38BDF8" stroke-width="2.5" stroke-opacity="0.5" fill="none"/>
        <circle cx="70" cy="280" r="5" fill="#38BDF8"/>
        <path d="M730 95 H610 L570 135 H510" stroke="#34D399" stroke-width="2.5" stroke-opacity="0.6" fill="none"/>
        <circle cx="730" cy="95" r="5" fill="#34D399"/>
        <!-- Tablet / PCB diagnostic frame on left -->
        <rect x="120" y="75" width="230" height="210" rx="18" fill="#0F172A" stroke="#60A5FA" stroke-width="3"/>
        <rect x="136" y="92" width="198" height="176" rx="10" fill="#1E293B"/>
        <!-- Microchip on PCB -->
        <rect x="190" y="135" width="90" height="90" rx="10" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
        <path d="M210 120V135M235 120V135M260 120V135M210 225V240M235 225V240M260 225V240M175 155H190M175 180H190M175 205H190M280 155H295M280 180H295M280 205H295" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
        <text x="235" y="185" text-anchor="middle" fill="#E0F2FE" font-family="monospace" font-size="15" font-weight="bold">OLED IC</text>
        <!-- Flagship Smartphone on right -->
        <rect x="420" y="38" width="165" height="284" rx="26" fill="#0F172A" stroke="#93C5FD" stroke-width="4"/>
        <rect x="431" y="50" width="143" height="260" rx="18" fill="url(#scr1)"/>
        <!-- Dynamic island -->
        <rect x="478" y="60" width="50" height="12" rx="6" fill="#0F172A"/>
        <!-- Diagnostic waveform on screen -->
        <path d="M445 185 L470 185 L482 152 L498 215 L514 165 L528 195 L542 185 L560 185" stroke="#34D399" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="503" cy="118" r="22" fill="#0F172A" fill-opacity="0.35" stroke="#E0F2FE" stroke-width="2"/>
        <path d="M495 118 L501 124 L513 112" stroke="#34D399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="452" y="245" width="102" height="8" rx="4" fill="#E0F2FE" fill-opacity="0.7"/>
        <rect x="468" y="262" width="70" height="6" rx="3" fill="#E0F2FE" fill-opacity="0.45"/>
      </svg>
    `)}`,
  },
  'srv-laptops': {
    alt: 'Компонентный ремонт ноутбуков и MacBook — BGA-пайка материнских плат',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" fill="none">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="800" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#090D16"/>
            <stop offset="50%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
          <linearGradient id="lapScr" x1="220" y1="50" x2="580" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#1E3A8A"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
        </defs>
        <rect width="800" height="360" fill="url(#bg2)"/>
        <g stroke="#60A5FA" stroke-opacity="0.12" stroke-width="1">
          <line x1="0" y1="72" x2="800" y2="72"/>
          <line x1="0" y1="144" x2="800" y2="144"/>
          <line x1="0" y1="216" x2="800" y2="216"/>
          <line x1="0" y1="288" x2="800" y2="288"/>
          <line x1="200" y1="0" x2="200" y2="360"/>
          <line x1="400" y1="0" x2="400" y2="360"/>
          <line x1="600" y1="0" x2="600" y2="360"/>
        </g>
        <!-- Laptop Top Lid & Screen -->
        <rect x="210" y="46" width="380" height="224" rx="16" fill="#0F172A" stroke="#94A3B8" stroke-width="3.5"/>
        <rect x="226" y="62" width="348" height="192" rx="8" fill="url(#lapScr)" stroke="#38BDF8" stroke-width="1.5"/>
        <!-- Motherboard BGA schematic on screen -->
        <rect x="260" y="92" width="125" height="130" rx="10" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
        <rect x="288" y="120" width="70" height="70" rx="6" fill="#1E3A8A" stroke="#60A5FA" stroke-width="2"/>
        <text x="323" y="160" text-anchor="middle" fill="#FFFFFF" font-family="monospace" font-size="14" font-weight="bold">M3 MAX</text>
        <!-- BGA solder balls grid -->
        <g fill="#34D399">
          <circle cx="430" cy="110" r="4"/><circle cx="450" cy="110" r="4"/><circle cx="470" cy="110" r="4"/><circle cx="490" cy="110" r="4"/>
          <circle cx="430" cy="130" r="4"/><circle cx="450" cy="130" r="4"/><circle cx="470" cy="130" r="4"/><circle cx="490" cy="130" r="4"/>
          <circle cx="430" cy="150" r="4"/><circle cx="450" cy="150" r="4"/><circle cx="470" cy="150" r="4"/><circle cx="490" cy="150" r="4"/>
        </g>
        <!-- Voltage rail bars -->
        <rect x="426" y="178" width="115" height="10" rx="5" fill="#38BDF8"/>
        <rect x="426" y="198" width="90" height="10" rx="5" fill="#34D399"/>
        <rect x="426" y="218" width="102" height="10" rx="5" fill="#F59E0B"/>
        <!-- Laptop Unibody Base -->
        <path d="M150 270 H650 L625 296 H175 L150 270Z" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
        <rect x="360" y="270" width="80" height="6" rx="3" fill="#475569"/>
      </svg>
    `)}`,
  },
  'srv-tv-monitors': {
    alt: 'Ремонт телевизоров OLED/QLED и профессиональных мониторов',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" fill="none">
        <defs>
          <linearGradient id="bg3" x1="0" y1="0" x2="800" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="50%" stop-color="#1E1B4B"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
          <linearGradient id="tvPanel" x1="170" y1="45" x2="630" y2="265" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#2563EB"/>
            <stop offset="45%" stop-color="#4F46E5"/>
            <stop offset="100%" stop-color="#06B6D4"/>
          </linearGradient>
        </defs>
        <rect width="800" height="360" fill="url(#bg3)"/>
        <!-- Ultra-wide 4K OLED Display Frame -->
        <rect x="155" y="42" width="490" height="236" rx="12" fill="#090D16" stroke="#93C5FD" stroke-width="3.5"/>
        <rect x="169" y="56" width="462" height="208" rx="6" fill="url(#tvPanel)"/>
        <!-- Calibration color bars & LED backlight array -->
        <rect x="195" y="80" width="185" height="160" rx="8" fill="#0F172A" fill-opacity="0.82" stroke="#38BDF8" stroke-width="2"/>
        <text x="287" y="110" text-anchor="middle" fill="#38BDF8" font-family="monospace" font-size="13" font-weight="bold">LED BACKLIGHT</text>
        <g stroke="#E0F2FE" stroke-width="3" stroke-linecap="round">
          <line x1="220" y1="132" x2="355" y2="132"/>
          <line x1="220" y1="156" x2="355" y2="156"/>
          <line x1="220" y1="180" x2="355" y2="180"/>
          <line x1="220" y1="204" x2="355" y2="204"/>
        </g>
        <g fill="#34D399">
          <circle cx="240" cy="132" r="5"/><circle cx="288" cy="132" r="5"/><circle cx="335" cy="132" r="5"/>
          <circle cx="240" cy="156" r="5"/><circle cx="288" cy="156" r="5"/><circle cx="335" cy="156" r="5"/>
          <circle cx="240" cy="180" r="5"/><circle cx="288" cy="180" r="5"/><circle cx="335" cy="180" r="5"/>
          <circle cx="240" cy="204" r="5"/><circle cx="288" cy="204" r="5"/><circle cx="335" cy="204" r="5"/>
        </g>
        <!-- T-Con & Oscilloscope wave on right half of screen -->
        <rect x="405" y="80" width="200" height="160" rx="8" fill="#0F172A" fill-opacity="0.82" stroke="#34D399" stroke-width="2"/>
        <text x="505" y="110" text-anchor="middle" fill="#34D399" font-family="monospace" font-size="13" font-weight="bold">4K OLED T-CON</text>
        <path d="M425 175 Q445 125 465 175 T505 175 T545 175 T585 175" stroke="#38BDF8" stroke-width="3.5" fill="none"/>
        <!-- Monitor Stand -->
        <rect x="372" y="278" width="56" height="28" fill="#64748B"/>
        <path d="M310 306 H490 L505 318 H295 L310 306Z" fill="#94A3B8"/>
      </svg>
    `)}`,
  },
  'srv-consoles': {
    alt: 'Ремонт игровых консолей PlayStation 5, Xbox и видеокарт',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" fill="none">
        <defs>
          <linearGradient id="bg4" x1="0" y1="0" x2="800" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#090D16"/>
            <stop offset="50%" stop-color="#172554"/>
            <stop offset="100%" stop-color="#1E40AF"/>
          </linearGradient>
        </defs>
        <rect width="800" height="360" fill="url(#bg4)"/>
        <g stroke="#38BDF8" stroke-opacity="0.12" stroke-width="1">
          <line x1="0" y1="90" x2="800" y2="90"/>
          <line x1="0" y1="180" x2="800" y2="180"/>
          <line x1="0" y1="270" x2="800" y2="270"/>
          <line x1="260" y1="0" x2="260" y2="360"/>
          <line x1="540" y1="0" x2="540" y2="360"/>
        </g>
        <!-- GPU / Console Cooling Turbine & HDMI 2.1 Module on Left -->
        <rect x="135" y="70" width="250" height="220" rx="18" fill="#0F172A" stroke="#60A5FA" stroke-width="3"/>
        <circle cx="260" cy="162" r="64" fill="#1E293B" stroke="#38BDF8" stroke-width="3"/>
        <circle cx="260" cy="162" r="22" fill="#0F172A" stroke="#34D399" stroke-width="2.5"/>
        <path d="M260 98 L275 140 M260 226 L245 184 M196 162 L238 147 M324 162 L282 177" stroke="#60A5FA" stroke-width="3" stroke-linecap="round"/>
        <rect x="175" y="246" width="170" height="24" rx="6" fill="#1E3A8A" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="260" y="262" text-anchor="middle" fill="#E0F2FE" font-family="monospace" font-size="12" font-weight="bold">HDMI 2.1 · 4K 120Hz</text>
        <!-- Gamepad / DualSense Controller Silhouette on Right -->
        <rect x="430" y="70" width="240" height="220" rx="22" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
        <!-- D-pad -->
        <path d="M485 145 H515 M500 130 V160" stroke="#60A5FA" stroke-width="8" stroke-linecap="round"/>
        <!-- Action buttons -->
        <circle cx="600" cy="130" r="7" fill="#34D399"/>
        <circle cx="618" cy="148" r="7" fill="#F87171"/>
        <circle cx="582" cy="148" r="7" fill="#60A5FA"/>
        <circle cx="600" cy="166" r="7" fill="#FBBF24"/>
        <!-- Hall Effect Analog Sticks -->
        <circle cx="525" cy="205" r="20" fill="#1E293B" stroke="#34D399" stroke-width="3"/>
        <circle cx="525" cy="205" r="7" fill="#34D399"/>
        <circle cx="575" cy="205" r="20" fill="#1E293B" stroke="#34D399" stroke-width="3"/>
        <circle cx="575" cy="205" r="7" fill="#34D399"/>
        <text x="550" y="262" text-anchor="middle" fill="#34D399" font-family="monospace" font-size="12" font-weight="bold">HALL EFFECT + LIQUID METAL</text>
      </svg>
    `)}`,
  },
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceDevice,
}) => {
  return (
    <section
      id="services"
      className="py-16 md:py-20 border-b-2 border-slate-300 bg-[#E2E8F0]"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-blue-800 mb-2">
              Прайс-лист и регламент работ · Бесплатная диагностика (0 руб.)
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Услуги сервисного центра и базовые расценки
            </h2>
          </div>
          <p className="text-sm text-slate-700 max-w-md">
            Указана ориентировочная стоимость услуги вместе с комплектующими класса
            Original / OEM. Первичная диагностика бесплатная (0 руб.).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES_CATALOG.map((service) => {
            const headerVisual = SERVICE_HEADER_IMAGES[service.id];
            return (
              <article
                key={service.id}
                className="bg-white border-2 border-slate-300 shadow-sm rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-600 transition-colors"
              >
                <div>
                  {/* Service Card Header Photo Banner */}
                  {headerVisual && (
                    <div className="relative h-48 sm:h-52 w-full bg-slate-900 border-b border-slate-200 overflow-hidden">
                      <img
                        src={headerVisual.src}
                        alt={headerVisual.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-950/85 text-blue-300 border border-blue-400/30 backdrop-blur-xs">
                          Услуга {service.index} · {service.deviceType}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-600 text-white shadow-xs">
                          Диагностика 0 ₽
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-4">
                        <span className="px-3 py-1 rounded-lg text-sm font-mono font-bold bg-white/95 text-slate-900 shadow-sm tabular-nums">
                          от {service.priceFrom.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 pb-0 sm:pb-0">
                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pb-3 mb-4 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700">
                          Услуга {service.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-slate-800">
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

                    <h3 className="text-xl font-bold font-display text-slate-900 mb-3">
                      {service.index}. {service.title}
                    </h3>

                    <p className="text-sm text-slate-700 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="bg-[#F1F5F9] border border-slate-200 rounded-lg p-4 mb-6">
                      <p className="text-xs font-bold text-slate-900 mb-2.5">
                        Перечень услуг и базовые расценки:
                      </p>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                        {service.commonIssues.map((item) => (
                          <li
                            key={item}
                            className="flex items-baseline justify-between gap-2"
                          >
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 py-4 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Бесплатная диагностика (0 руб.)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectServiceDevice(service.deviceType)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Записаться на услугу</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
