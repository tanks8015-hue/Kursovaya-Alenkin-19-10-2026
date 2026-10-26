import React from 'react';
import {
  ArrowRight,
  Search,
  CheckCircle2,
  ClipboardList,
  LogIn,
  UserPlus,
  Wrench,
  Microscope,
  PackageCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { RepairTicket, TicketStatus, UserAccount } from '../types';
import { StatusIndicator } from './StatusIndicator';

interface HeroSectionProps {
  myTickets: RepairTicket[];
  staffTickets?: RepairTicket[];
  currentUser: UserAccount | null;
  onQuickTrackClick: () => void;
  onOpenAuthModal: (initialTab?: 'login' | 'register') => void;
  onSwitchToAdmin?: () => void;
}

const getProgressByStatus = (status: TicketStatus): number => {
  switch (status) {
    case 'Новая':
      return 15;
    case 'Ожидает Мастера':
      return 25;
    case 'На диагностике':
      return 35;
    case 'Принята':
      return 50;
    case 'В работе':
      return 70;
    case 'Ожидает запчастей':
      return 60;
    case 'Готова':
      return 90;
    case 'Выдана':
      return 100;
    case 'Отменен':
      return 0;
    default:
      return 20;
  }
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  myTickets,
  staffTickets = [],
  currentUser,
  onQuickTrackClick,
  onOpenAuthModal,
  onSwitchToAdmin,
}) => {
  const isClientLoggedIn = currentUser?.role === 'client';
  const isStaff =
    currentUser?.role === 'admin' || currentUser?.role === 'master';
  const isMaster = currentUser?.role === 'master';

  const userShowcaseTickets = isClientLoggedIn ? myTickets.slice(0, 3) : [];
  const staffShowcaseTickets = isStaff ? staffTickets.slice(0, 3) : [];

  return (
    <section
      id="top"
      className="border-b-2 border-slate-300 bg-white pt-10 pb-14 md:pt-14 md:pb-16"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Core Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-4">
                Инженерный сервисный центр · Москва, ул. Малая Бронная, 24 · Бесплатная диагностика (0 руб.)
              </p>
              <h1
                className="font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-5xl leading-[1.12] mb-6 max-w-2xl"
                style={{ textWrap: 'balance' }}
              >
                Компонентный ремонт электроники с онлайн-трекингом каждого этапа
              </h1>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl mb-8">
                Восстанавливаем материнские платы ноутбуков, смартфоны, OLED-телевизоры и
                консоли на уровне микрокомпонентов BGA. Первичная аппаратная диагностика
                проводится бесплатно. Отслеживайте статус вашей заявки в личном кабинете.
              </p>

              {/* Primary CTA & Secondary Link */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a
                  href="#booking-form"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 shadow-xs transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Оформить заявку на ремонт</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={onQuickTrackClick}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-900 bg-[#E8EEF5] border-2 border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-blue-700" aria-hidden="true" />
                  <span>
                    {isStaff ? 'Открыть заявки на ремонт' : 'Отследить статус заявки'}
                  </span>
                </button>
              </div>
            </div>

            {/* Process summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-lg p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-bold text-slate-900">
                    01. Бесплатная диагностика
                  </p>
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-emerald-600 text-white rounded whitespace-nowrap shrink-0">
                    0 ₽
                  </span>
                </div>
                <p className="text-slate-800">
                  Диагностика бесплатная: аппаратный тест цепей питания и термографии за 30–45 минут при вас.
                </p>
              </div>
              <div className="bg-[#F1F5F9] border border-slate-300 rounded-lg p-4">
                <p className="font-bold text-slate-900 mb-1">
                  02. Точная смета до ремонта
                </p>
                <p>Согласуем итоговую стоимость до начала пайки. Без скрытых доплат.</p>
              </div>
              <div className="bg-[#F1F5F9] border border-slate-300 rounded-lg p-4">
                <p className="font-bold text-slate-900 mb-1">
                  03. Прозрачный трекинг 24/7
                </p>
                <p>Живые статусы ремонта, назначенный мастер и смета в вашем кабинете.</p>
              </div>
            </div>
          </div>

          {/* Right Column: For Staff -> "Заявки на ремонт", For Users/Guests -> "Онлайн-трекинг заявок на ремонт" */}
          <div className="lg:col-span-5 flex">
            {isStaff ? (
              <div className="w-full bg-[#F8FAFC] rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Staff Header Banner: Заявки на ремонт */}
                  <div className="bg-slate-900 text-white px-6 py-5 border-b border-slate-800">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                        <ClipboardList className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {isMaster
                            ? 'Рабочий журнал инженера'
                            : 'Диспетчерская панель СЦ'}
                        </span>
                      </span>
                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        ● ЗАЯВКИ СЦ ({staffTickets.length})
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-display text-white">
                      {isMaster
                        ? `Заявки на ремонт: ${currentUser?.name}`
                        : 'Заявки на ремонт (Все заказы)'}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      {isMaster
                        ? 'Назначенные вам устройства для проведения диагностики и ремонта'
                        : 'Поступившие заявки клиентов, распределение мастеров и контроль смет'}
                    </p>
                  </div>

                  {/* Staff Tickets List */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>
                        {isMaster
                          ? 'Мои назначенные заявки на ремонт:'
                          : 'Последние заявки на ремонт в базе:'}
                      </span>
                      <span className="font-mono text-blue-700 tabular-nums">
                        Показано: {staffShowcaseTickets.length} из {staffTickets.length}
                      </span>
                    </div>

                    {staffShowcaseTickets.length === 0 ? (
                      <div className="p-5 rounded-xl bg-white border border-slate-300 text-xs text-slate-600 text-center">
                        Назначенных заявок на ремонт пока нет.
                      </div>
                    ) : (
                      staffShowcaseTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono font-bold text-xs text-blue-700 tabular-nums whitespace-nowrap shrink-0">
                                {ticket.id}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {ticket.brandModel}
                              </span>
                            </div>
                            <StatusIndicator status={ticket.status} />
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-1">
                            {ticket.issueDescription}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                            <span>
                              Клиент: <strong className="text-slate-800">{ticket.clientName}</strong> ({ticket.clientPhone})
                            </span>
                            <span className="font-mono font-semibold text-slate-800 tabular-nums">
                              {ticket.finalPrice !== null
                                ? `${ticket.finalPrice.toLocaleString('ru-RU')} ₽`
                                : 'Без сметы'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}

                    {onSwitchToAdmin && (
                      <button
                        type="button"
                        onClick={onSwitchToAdmin}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {isMaster
                            ? 'Перейти в кабинет мастера к заявкам на ремонт'
                            : 'Перейти в CRM-панель управления заявками'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    {isMaster ? `Инженер: ${currentUser?.name}` : 'Режим администратора СЦ'}
                  </span>
                  <a
                    href="#client-cabinet"
                    className="text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Все заявки на ремонт ({staffTickets.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="w-full bg-[#F8FAFC] rounded-2xl border-2 border-blue-600 shadow-xl overflow-hidden flex flex-col justify-between">
                {/* High-visibility Blue Header Banner for Clients & Guests */}
                <div>
                  <div className="bg-blue-700 text-white px-6 py-5 border-b border-blue-800">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-100">
                        <ClipboardList className="w-4 h-4" aria-hidden="true" />
                        <span>Система отслеживания заказов</span>
                      </span>
                      <span className="text-xs font-mono font-semibold text-emerald-300">
                        ● LIVE ТРЕКЕР
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-display text-white">
                      Онлайн-трекинг заявок на ремонт
                    </h2>
                    <p className="text-xs text-blue-100 mt-1">
                      Контролируйте этапы работ, назначенного мастера и готовность устройства
                    </p>
                  </div>

                  {/* Visual 4-Stage Repair Pipeline Stepper */}
                  <div className="px-6 py-4 bg-white border-b border-slate-200">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Этапы прохождения заявки в сервисном центре:
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                        <Microscope className="w-4 h-4 text-purple-700 mx-auto mb-1" />
                        <p className="text-[11px] font-bold text-slate-900">1. Диагностика</p>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                        <Wrench className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                        <p className="text-[11px] font-bold text-slate-900">2. В работе</p>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                        <p className="text-[11px] font-bold text-slate-900">3. Готова</p>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                        <PackageCheck className="w-4 h-4 text-blue-700 mx-auto mb-1" />
                        <p className="text-[11px] font-bold text-slate-900">4. Выдана</p>
                      </div>
                    </div>
                  </div>

                  {/* Body: Unauthenticated vs Logged-In Client Personal Tracker */}
                  <div className="p-6">
                    {!isClientLoggedIn ? (
                      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs">
                        <div className="flex items-start gap-3.5 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
                            <Search className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold font-display text-slate-900">
                              Проверьте статус вашей заявки
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              В целях конфиденциальности список заказов отображается только
                              владельцу аккаунта. Войдите в личный кабинет, чтобы увидеть свои
                              устройства в ремонте.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => onOpenAuthModal('login')}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <LogIn className="w-4 h-4" aria-hidden="true" />
                            <span>Войти для трекинга</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenAuthModal('register')}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4" aria-hidden="true" />
                            <span>Регистрация клиента</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <span>Активные заявки: {currentUser.name}</span>
                          <span className="font-mono text-blue-700 tabular-nums">
                            Всего заказов: {myTickets.length}
                          </span>
                        </div>

                        {userShowcaseTickets.length === 0 ? (
                          <div className="p-5 rounded-xl bg-white border border-slate-300 text-xs text-slate-600 text-center">
                            У вас пока нет активных заявок на ремонт. Оформите заявку в форме
                            ниже, чтобы отслеживать её статус.
                          </div>
                        ) : (
                          userShowcaseTickets.map((ticket) => {
                            const progress = getProgressByStatus(ticket.status);
                            return (
                              <div
                                key={ticket.id}
                                className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-2"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="font-mono font-bold text-xs text-blue-700 tabular-nums whitespace-nowrap shrink-0">
                                      {ticket.id}
                                    </span>
                                    <span className="text-slate-400">·</span>
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                      {ticket.brandModel}
                                    </span>
                                  </div>
                                  <StatusIndicator status={ticket.status} />
                                </div>

                                {/* Progress bar */}
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      ticket.status === 'Отменен'
                                        ? 'bg-rose-500'
                                        : ticket.status === 'Готова' ||
                                          ticket.status === 'Выдана'
                                        ? 'bg-emerald-600'
                                        : 'bg-blue-600'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-600">
                                  <span>Инженер: {ticket.master}</span>
                                  <span className="font-mono tabular-nums">
                                    {ticket.finalPrice !== null
                                      ? `${ticket.finalPrice.toLocaleString('ru-RU')} ₽`
                                      : 'Смета уточняется'}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer bar inside tracker widget */}
                <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    Мгновенная синхронизация с CRM
                  </span>
                  <a
                    href="#client-cabinet"
                    className="text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Открыть «Мои заявки»</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full-Width 4-Column Proof & Metrics Strip Below Hero Split */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F1F5F9] border border-slate-300 rounded-xl p-5">
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
              14 820+
            </p>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              выполненных ремонтов за 2021–2026 гг.
            </p>
          </div>
          <div className="bg-[#F1F5F9] border border-slate-300 rounded-xl p-5">
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-700">
              0 ₽ · 45 мин
            </p>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              бесплатная экспресс-диагностика при вас
            </p>
          </div>
          <div className="bg-[#F1F5F9] border border-slate-300 rounded-xl p-5">
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
              98,4%
            </p>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              успешных BGA-паек без замены всей платы
            </p>
          </div>
          <div className="bg-[#F1F5F9] border border-slate-300 rounded-xl p-5">
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
              12 мес.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              официальная гарантия по серийному номеру
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
