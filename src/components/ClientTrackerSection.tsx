import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  UserCheck,
  UserPlus,
  LogIn,
  MessageSquarePlus,
  CheckCircle2,
  Star,
  X,
  AlertCircle,
  Printer,
  Lock,
  BellRing,
} from 'lucide-react';
import {
  NewClientReviewInput,
  RepairTicket,
  ReviewItem,
  UserAccount,
} from '../types';
import {
  filterTickets,
  isServiceVoucherUnlocked,
  triggerServiceVoucherPrint,
  validateClientReviewInput,
} from '../utils/repairStore';
import { StatusIndicator } from './StatusIndicator';
import { ServiceVoucherModal } from './ServiceVoucherModal';

interface ClientTrackerSectionProps {
  myTickets: RepairTicket[];
  staffTickets?: RepairTicket[];
  reviews: ReviewItem[];
  currentUser: UserAccount | null;
  onOpenAuthModal: (initialTab?: 'login' | 'register') => void;
  onSwitchToAdmin?: () => void;
  onMarkNotificationRead?: (ticketId: string) => void;
  onCancelTicket?: (ticketId: string) => void;
  onAddReview: (
    ticket: RepairTicket,
    input: NewClientReviewInput
  ) => { review?: ReviewItem; error?: string };
}

export const ClientTrackerSection: React.FC<ClientTrackerSectionProps> = ({
  myTickets,
  staffTickets = [],
  reviews,
  currentUser,
  onOpenAuthModal,
  onSwitchToAdmin,
  onMarkNotificationRead,
  onCancelTicket,
  onAddReview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusGroup, setStatusGroup] = useState<string>('ALL');
  const [voucherTicket, setVoucherTicket] = useState<RepairTicket | null>(null);

  // Review Modal State for a "Выдана" ticket
  const [reviewingTicket, setReviewingTicket] = useState<RepairTicket | null>(
    null
  );
  const [rating, setRating] = useState<number>(5);
  const [authorRole, setAuthorRole] = useState<string>(
    'Клиент сервисного центра'
  );
  const [comment, setComment] = useState<string>('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccessBanner, setReviewSuccessBanner] = useState<string | null>(
    null
  );

  const isClientLoggedIn = currentUser?.role === 'client';
  const isStaff =
    currentUser?.role === 'admin' || currentUser?.role === 'master';
  const isMaster = currentUser?.role === 'master';

  const activeSourceTickets = isStaff
    ? staffTickets
    : isClientLoggedIn
    ? myTickets
    : [];
  const filteredTickets = filterTickets(
    activeSourceTickets,
    searchQuery,
    statusGroup
  );

  const hasReviewForTicket = (ticketId: string): boolean => {
    return reviews.some((r) => r.ticketRef === ticketId);
  };

  const handleOpenReviewModal = (ticket: RepairTicket) => {
    setReviewingTicket(ticket);
    setRating(5);
    setAuthorRole('Клиент сервисного центра');
    setComment('');
    setReviewError(null);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingTicket || !currentUser) return;

    const payload: NewClientReviewInput = {
      ticketId: reviewingTicket.id,
      authorName: currentUser.name,
      authorRole,
      rating,
      comment,
    };

    const validation = validateClientReviewInput(payload);
    if (!validation.valid) {
      setReviewError(validation.error || 'Проверьте текст отзыва.');
      return;
    }

    const res = onAddReview(reviewingTicket, payload);
    if (res.error || !res.review) {
      setReviewError(res.error || 'Не удалось опубликовать отзыв.');
      return;
    }

    const finishedId = reviewingTicket.id;
    setReviewingTicket(null);
    setReviewSuccessBanner(
      `Спасибо! Ваш отзыв по заказу ${finishedId} успешно опубликован в разделе «Отзывы клиентов».`
    );
  };

  return (
    <section
      id="client-cabinet"
      className="py-16 md:py-20 bg-[#E2E8F0] border-b-2 border-slate-300"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold text-blue-800 mb-2">
            {isStaff
              ? isMaster
                ? `Рабочий журнал мастера (${currentUser?.name})`
                : 'Диспетчерский журнал сервисного центра'
              : 'Личный кабинет клиента'}
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {isStaff
              ? isMaster
                ? `Заявки на ремонт (назначены мастеру: ${currentUser?.name})`
                : 'Заявки на ремонт (все заказы сервисного центра)'
              : 'Онлайн-трекинг и мои заявки на ремонт'}
          </h2>
        </div>

        {reviewSuccessBanner && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-emerald-950 shadow-xs"
          >
            <div className="flex items-center gap-2.5 font-medium">
              <CheckCircle2
                className="w-5 h-5 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
              <span>{reviewSuccessBanner}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#reviews"
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                Посмотреть мой отзыв
              </a>
              <button
                type="button"
                onClick={() => setReviewSuccessBanner(null)}
                className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                Скрыть
              </button>
            </div>
          </div>
        )}

        {/* If neither client nor staff is logged in, show zero tickets and prompt to login or register */}
        {!isClientLoggedIn && !isStaff ? (
          <div className="bg-white border-2 border-slate-300 shadow-sm rounded-xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
              Войдите или зарегистрируйтесь для просмотра своих заявок
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Список заявок доступен только авторизованным пользователям. Войдите в
              свой аккаунт или зарегистрируйтесь, чтобы отслеживать статус ремонта своих
              устройств и оставлять отзывы по завершенным заказам.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Войти в аккаунт</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                <span>Регистрация нового клиента</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-300 shadow-sm rounded-xl overflow-hidden">
            {/* Active Client or Staff Profile Banner */}
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <UserCheck
                  className="w-5 h-5 text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-bold font-display">
                    {isStaff
                      ? isMaster
                        ? `Заявки на ремонт мастера: ${currentUser?.name}`
                        : `Все заявки на ремонт (${currentUser?.name})`
                      : `Кабинет клиента: ${currentUser?.name}`}
                  </p>
                  <p className="text-xs text-slate-300 font-mono tabular-nums">
                    Логин: {currentUser?.login} · Телефон: {currentUser?.phone} · Заявок:{' '}
                    {activeSourceTickets.length}
                  </p>
                </div>
              </div>

              {isStaff && onSwitchToAdmin ? (
                <button
                  type="button"
                  onClick={onSwitchToAdmin}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <span>
                    {isMaster
                      ? 'Перейти в кабинет мастера для редактирования'
                      : 'Перейти в CRM-панель управления'}
                  </span>
                </button>
              ) : (
                <a
                  href="#booking-form"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
                >
                  <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Добавить устройство в ремонт</span>
                </a>
              )}
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-4 sm:p-6 bg-[#F8FAFC] border-b border-slate-300 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  aria-label="Поиск по моим заявкам"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по номеру (KV-...), модели или описанию..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div
                role="group"
                aria-label="Фильтр моих заявок по статусу"
                className="flex flex-wrap items-center gap-1 p-1 bg-slate-200 rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => setStatusGroup('ALL')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusGroup === 'ALL'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Все ({activeSourceTickets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusGroup('Новая')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusGroup === 'Новая'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Новые
                </button>
                <button
                  type="button"
                  onClick={() => setStatusGroup('Ожидает Мастера')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusGroup === 'Ожидает Мастера'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Ожидает Мастера
                </button>
                <button
                  type="button"
                  onClick={() => setStatusGroup('ACTIVE')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusGroup === 'ACTIVE'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  На диагностике / В работе
                </button>
                <button
                  type="button"
                  onClick={() => setStatusGroup('COMPLETED')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusGroup === 'COMPLETED'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Готово / Выдано
                </button>
                <button
                  type="button"
                  onClick={() => setStatusGroup('Отменен')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusGroup === 'Отменен'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Отмененные
                </button>
              </div>
            </div>

            {/* Table or Empty State */}
            {filteredTickets.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-base font-bold text-slate-900 mb-1">
                  {activeSourceTickets.length === 0
                    ? 'Нет активных заявок на ремонт'
                    : 'Заявки по выбранному фильтру не найдены'}
                </p>
                <p className="text-sm text-slate-600 mb-5">
                  {activeSourceTickets.length === 0
                    ? 'Заполните форму выше, чтобы зарегистрировать устройство.'
                    : 'Попробуйте сбросить поисковый запрос или переключить вкладку статуса.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {activeSourceTickets.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusGroup('ALL');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Показать все заявки
                    </button>
                  )}
                  <a
                    href="#booking-form"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Оформить заявку</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 text-xs font-bold text-slate-700">
                      <th className="py-3.5 px-4 whitespace-nowrap">ID заявки</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Устройство</th>
                      <th className="py-3.5 px-4">Описание неисправности</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Дата сдачи</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Назначенный мастер</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">
                        Ожидаемая готовность
                      </th>
                      <th className="py-3.5 px-4 text-right whitespace-nowrap">
                        Итоговая цена
                      </th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Статус и действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {filteredTickets.map((ticket) => {
                      const alreadyReviewed = hasReviewForTicket(ticket.id);
                      const voucherUnlocked = isServiceVoucherUnlocked(
                        ticket.status
                      );
                      return (
                        <tr
                          key={ticket.id}
                          className={`transition-colors ${
                            isClientLoggedIn && ticket.hasUnreadStatusChange
                              ? 'bg-amber-50/70 hover:bg-amber-50'
                              : 'hover:bg-blue-50/40'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-700 tabular-nums whitespace-nowrap">
                            <div>{ticket.id}</div>
                            {isClientLoggedIn && ticket.hasUnreadStatusChange && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-amber-200 text-amber-950 border border-amber-400">
                                  <BellRing className="w-2.5 h-2.5" />
                                  <span>Статус изменился</span>
                                </span>
                                {onMarkNotificationRead && (
                                  <button
                                    type="button"
                                    onClick={() => onMarkNotificationRead(ticket.id)}
                                    className="text-[10px] font-sans font-semibold text-blue-700 hover:underline cursor-pointer"
                                  >
                                    Прочитано
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">
                              {ticket.brandModel}
                            </div>
                            <div className="text-xs text-slate-600">
                              {ticket.deviceType}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-700 max-w-xs">
                            {ticket.issueDescription}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                            {ticket.preferredDate}
                          </td>
                          <td className="py-3.5 px-4 text-xs sm:text-sm font-medium text-slate-900 whitespace-nowrap">
                            {ticket.master}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                            {ticket.expectedReadyDate ? (
                              ticket.expectedReadyDate
                            ) : (
                              <span className="text-slate-400">Уточняется</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {ticket.finalPrice !== null ? (
                              `${ticket.finalPrice.toLocaleString('ru-RU')} ₽`
                            ) : (
                              <span className="text-xs font-normal text-slate-400">
                                На согласовании
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex flex-col items-start gap-2">
                              <StatusIndicator status={ticket.status} />

                              {voucherUnlocked ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVoucherTicket(ticket);
                                    triggerServiceVoucherPrint(ticket);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-400 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer shadow-2xs"
                                >
                                  <Printer className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Распечатать сервисный талон</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title="Сервисный талон открывается после статуса заказа «Готова»"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-md cursor-not-allowed"
                                >
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  <span>Сервисный талон (после «Готова»)</span>
                                </button>
                              )}

                              {ticket.status === 'Выдана' && (
                                <>
                                  {alreadyReviewed ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Отзыв опубликован</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenReviewModal(ticket)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer shadow-2xs"
                                    >
                                      <MessageSquarePlus className="w-3.5 h-3.5" />
                                      <span>Оставить отзыв</span>
                                    </button>
                                  )}
                                </>
                              )}

                              {isClientLoggedIn &&
                                onCancelTicket &&
                                (ticket.status === 'Новая' ||
                                  ticket.status === 'Ожидает Мастера') && (
                                  <button
                                    type="button"
                                    onClick={() => onCancelTicket(ticket.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-300 hover:bg-rose-100 rounded-md transition-colors cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>Отменить заявку</span>
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for submitting a real client review when ticket status is 'Выдана' */}
      {reviewingTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div className="bg-white border-2 border-slate-300 rounded-xl max-w-lg w-full p-6 sm:p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
              <div>
                <p className="text-xs font-mono font-bold text-emerald-700 mb-1">
                  Заказ {reviewingTicket.id} · Статус: Выдана
                </p>
                <h3
                  id="review-modal-title"
                  className="text-lg font-bold font-display text-slate-900"
                >
                  Оставить отзыв о ремонте устройства
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingTicket(null)}
                aria-label="Закрыть окно отзыва"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5 p-3.5 rounded-lg bg-[#F1F5F9] border border-slate-300 text-xs space-y-1">
              <div>
                <span className="text-slate-600">Устройство: </span>
                <strong className="text-slate-900">
                  {reviewingTicket.brandModel} ({reviewingTicket.deviceType})
                </strong>
              </div>
              <div>
                <span className="text-slate-600">Выполнил мастер: </span>
                <strong className="text-slate-900">{reviewingTicket.master}</strong>
              </div>
              {reviewingTicket.finalPrice !== null && (
                <div>
                  <span className="text-slate-600">Итоговая сумма: </span>
                  <strong className="font-mono text-slate-900">
                    {reviewingTicket.finalPrice.toLocaleString('ru-RU')} ₽
                  </strong>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitReview} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Оценка качества ремонта *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Оценка ${star} из 5`}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
                        rating >= star
                          ? 'bg-amber-50 border-amber-400 text-amber-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          rating >= star ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-author-role"
                  className="block text-xs font-bold text-slate-900 mb-1.5"
                >
                  Ваша профессия или подпись
                </label>
                <input
                  id="review-author-role"
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="Например: Дизайнер / Клиент сервисного центра"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="review-comment"
                    className="block text-xs font-bold text-slate-900"
                  >
                    Ваш отзыв о результате ремонта (мин. 10 символов) *
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {comment.trim().length}/500
                  </span>
                </div>
                <textarea
                  id="review-comment"
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (reviewError) setReviewError(null);
                  }}
                  placeholder="Поделитесь впечатлениями: как быстро провели диагностику, как работает устройство после выдачи..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {reviewError && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-300 flex items-center gap-2 text-xs text-red-800"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{reviewError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReviewingTicket(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                >
                  Опубликовать отзыв
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Service & Warranty Voucher Modal */}
      <ServiceVoucherModal
        ticket={voucherTicket}
        onClose={() => setVoucherTicket(null)}
      />
    </section>
  );
};
