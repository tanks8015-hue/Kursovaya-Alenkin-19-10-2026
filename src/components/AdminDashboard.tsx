import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Users,
  AlertTriangle,
  Printer,
  Lock,
} from 'lucide-react';
import {
  AdminUpdateTicketInput,
  RepairTicket,
  TicketStatus,
  UserAccount,
} from '../types';
import {
  computeDashboardMetrics,
  computeMastersWorkload,
  filterTickets,
  getMasterTickets,
  isServiceVoucherUnlocked,
  TICKET_STATUSES,
  triggerServiceVoucherPrint,
} from '../utils/repairStore';
import { StatusIndicator } from './StatusIndicator';
import { TicketEditModal } from './TicketEditModal';
import { ServiceVoucherModal } from './ServiceVoucherModal';

interface AdminDashboardProps {
  tickets: RepairTicket[];
  currentUser: UserAccount | null;
  onUpdateTicket: (ticketId: string, update: AdminUpdateTicketInput) => void;
  onDeleteTicket: (ticketId: string) => void;
  onResetDemoData: () => void;
  onSwitchToClient: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tickets,
  currentUser,
  onUpdateTicket,
  onDeleteTicket,
  onResetDemoData,
  onSwitchToClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [voucherTicketId, setVoucherTicketId] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const isMaster = currentUser?.role === 'master';
  const canDelete = currentUser?.role === 'admin';

  // Strictly show only the master's own assigned tickets when logged in as a master
  const visibleTickets =
    isMaster && currentUser
      ? getMasterTickets(tickets, currentUser.name)
      : tickets;

  const metrics = computeDashboardMetrics(visibleTickets);
  const allMastersWorkload = computeMastersWorkload(tickets);
  const displayedWorkload =
    isMaster && currentUser
      ? allMastersWorkload.filter((m) => m.name === currentUser.name)
      : allMastersWorkload;
  const filteredTickets = filterTickets(
    visibleTickets,
    searchQuery,
    statusFilter
  );

  const selectedTicket =
    visibleTickets.find((t) => t.id === selectedTicketId) || null;
  const voucherTicket =
    visibleTickets.find((t) => t.id === voucherTicketId) || null;

  const handleSaveTicket = (ticketId: string, update: AdminUpdateTicketInput) => {
    const existingTicket = tickets.find((t) => t.id === ticketId);
    const didStatusChange =
      existingTicket && existingTicket.status !== update.status;
    const safeUpdate: AdminUpdateTicketInput =
      update.status === 'Ожидает Мастера'
        ? { ...update, master: 'Не назначен' }
        : isMaster && currentUser
        ? { ...update, master: currentUser.name }
        : update;
    onUpdateTicket(ticketId, safeUpdate);
    setStatusBanner(
      didStatusChange
        ? `Статус заявки ${ticketId} изменен на «${safeUpdate.status}». Клиенту (${existingTicket.clientName}) отправлено уведомление об изменении статуса.`
        : `Изменения по заявке ${ticketId} сохранены и синхронизированы с личным кабинетом клиента.`
    );
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (!canDelete) return;
    onDeleteTicket(ticketId);
    if (selectedTicketId === ticketId) {
      setSelectedTicketId(null);
    }
    setStatusBanner(`Заявка ${ticketId} удалена из базы сервисного центра.`);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#E2E8F0] py-8">
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Top Workspace Header & Breadcrumb */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>КВАНТ Сервис</span>
              <span>/</span>
              <span>
                {isMaster
                  ? `Рабочий кабинет мастера (${currentUser?.name})`
                  : 'CRM-панель администратора'}
              </span>
              <span>/</span>
              <span className="text-slate-900 font-semibold">
                {isMaster
                  ? `Мои заявки в работе (${visibleTickets.length})`
                  : `Все заявки клиентов (${visibleTickets.length})`}
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {isMaster
                ? `Кабинет мастера: ${currentUser?.name} — Мои назначенные заявки`
                : 'Управление заказами и контроль загруженности мастеров'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onSwitchToClient}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-[#F1F5F9] border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Перейти на витрину клиента</span>
            </button>
            {canDelete && (
              <button
                type="button"
                onClick={onResetDemoData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-[#F1F5F9] border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Сбросить демо-данные (10 заявок)</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Dashboard Statistics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-slate-300 shadow-xs rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-600 mb-1">
              Всего заявок в базе
            </p>
            <p
              data-testid="metric-total"
              className="text-3xl font-bold font-mono tabular-nums text-slate-900"
            >
              {metrics.total}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Новых:{' '}
              <span className="font-mono font-bold text-red-600 tabular-nums">
                {metrics.newCount}
              </span>
              {' · '}Ожидает мастера:{' '}
              <span className="font-mono font-bold text-indigo-700 tabular-nums">
                {metrics.waitingMasterCount}
              </span>
              {' · '}Отменено:{' '}
              <span className="font-mono font-bold text-rose-700 tabular-nums">
                {metrics.cancelledCount}
              </span>
            </p>
          </div>

          <div className="bg-white border-2 border-slate-300 shadow-xs rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-600 mb-1">
              В работе и на диагностике
            </p>
            <p
              data-testid="metric-in-progress"
              className="text-3xl font-bold font-mono tabular-nums text-amber-600"
            >
              {metrics.inProgressCount}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              На диагностике · Принята · В работе · Запчасти
            </p>
          </div>

          <div className="bg-white border-2 border-slate-300 shadow-xs rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-600 mb-1">
              Завершено (Готова / Выдана)
            </p>
            <p
              data-testid="metric-completed"
              className="text-3xl font-bold font-mono tabular-nums text-emerald-600"
            >
              {metrics.completedCount}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Прошли финальный выходной контроль ОТК
            </p>
          </div>

          <div className="bg-slate-900 text-white border-2 border-slate-800 shadow-xs rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-300 mb-1">
              Сумма согласованных смет
            </p>
            <p
              data-testid="metric-revenue"
              className="text-3xl font-bold font-mono tabular-nums text-white"
            >
              {metrics.totalRevenue.toLocaleString('ru-RU')} ₽
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Активные и завершенные заказы (без отмененных)
            </p>
          </div>
        </div>

        {/* 2. Master Workload & Bench Capacity System */}
        <div className="bg-white border-2 border-slate-300 shadow-xs rounded-xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-700" aria-hidden="true" />
              <div>
                <h2 className="text-base font-bold font-display text-slate-900">
                  Система контроля загруженности мастеров (Свободные слоты в смене)
                </h2>
                <p className="text-xs text-slate-600">
                  Лимит на одного инженера: 3 активных устройства одновременно (статусы: На диагностике, Принята, В работе, Ожидает запчастей).
                </p>
              </div>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-blue-700 hover:underline self-start sm:self-auto cursor-pointer"
              >
                Сбросить фильтр по мастеру
              </button>
            )}
          </div>

          <div
            className={`grid grid-cols-1 gap-4 ${
              isMaster ? 'sm:grid-cols-1 max-w-md' : 'sm:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {displayedWorkload.map((master) => {
              const isOverloaded = master.activeCount >= master.maxCapacity;
              const isHigh = master.activeCount === master.maxCapacity - 1;
              return (
                <div
                  key={master.name}
                  onClick={() => {
                    if (!isMaster) {
                      setSearchQuery(
                        searchQuery === master.name ? '' : master.name
                      );
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-colors flex flex-col justify-between ${
                    !isMaster ? 'cursor-pointer' : ''
                  } ${
                    searchQuery === master.name
                      ? 'border-blue-600 bg-blue-50/40'
                      : isOverloaded
                      ? 'border-red-300 bg-red-50/30 hover:border-red-400'
                      : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-900">
                        {master.name}
                      </h3>
                      <span
                        className={`font-mono text-xs font-bold tabular-nums ${
                          isOverloaded
                            ? 'text-red-600'
                            : isHigh
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {master.activeCount} / {master.maxCapacity} слотов
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-3">
                      {master.specialization}
                    </p>

                    {/* Capacity bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverloaded
                            ? 'bg-red-600'
                            : isHigh
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${master.loadPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isOverloaded
                            ? 'text-red-700'
                            : isHigh
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {isOverloaded && (
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                        )}
                        <span>{master.statusLabel}</span>
                      </span>
                      <span className="text-slate-500 font-mono">
                        Завершено: {master.completedCount}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-mono truncate">
                      {master.activeTicketIds.length > 0
                        ? `В работе: ${master.activeTicketIds.join(', ')}`
                        : 'Нет активных заказов — готов принять'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {statusBanner && (
          <div
            role="status"
            className="mb-6 p-3.5 rounded-lg bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between gap-4 text-xs sm:text-sm text-emerald-950"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="w-4 h-4 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
              <span>{statusBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              Скрыть
            </button>
          </div>
        )}

        {/* Search & Status Filter Toolbar */}
        <div className="bg-white border-2 border-slate-300 rounded-t-xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b-0">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Поиск в CRM по всем колонкам таблицы"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по всем колонкам: ID, дата, клиент, телефон, устройство, описание, цена, мастер, статус..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div
            role="group"
            aria-label="Фильтр статуса в CRM"
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-200 rounded-lg"
          >
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Все ({visibleTickets.length})
            </button>
            {TICKET_STATUSES.map((st: TicketStatus) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Full Admin CRM Table of All Tickets */}
        <div className="bg-white border-2 border-slate-300 shadow-sm rounded-b-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-100 text-xs font-bold text-slate-700">
                  <th className="py-3 px-2.5 whitespace-nowrap">ID</th>
                  <th className="py-3 px-2.5 whitespace-nowrap">Дата создания</th>
                  <th className="py-3 px-2.5 whitespace-nowrap">Клиент</th>
                  <th className="py-3 px-2.5 whitespace-nowrap">Контакты</th>
                  <th className="py-3 px-2.5 whitespace-nowrap">Устройство</th>
                  <th className="py-3 px-2.5">Описание</th>
                  <th className="py-3 px-2.5 whitespace-nowrap">Мастер</th>
                  <th className="py-3 px-2.5 whitespace-nowrap">Статус</th>
                  <th className="py-3 px-2.5 text-right whitespace-nowrap">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-10 px-4 text-center text-sm text-slate-600"
                    >
                      {isMaster
                        ? 'По вашему фильтру назначенные заявки не найдены.'
                        : 'Заявки не найдены. Сбросьте фильтр или нажмите «Сбросить демо-данные».'}
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    const masterInfo = allMastersWorkload.find(
                      (m) => m.name === ticket.master
                    );
                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-2.5 font-mono font-bold text-blue-700 tabular-nums whitespace-nowrap">
                          {ticket.id}
                        </td>
                        <td className="py-3 px-2.5 font-mono text-[11px] text-slate-600 tabular-nums whitespace-nowrap">
                          <div>{ticket.createdAt}</div>
                          <div className="text-slate-400">
                            Сдача: {ticket.preferredDate}
                          </div>
                        </td>
                        <td className="py-3 px-2.5 font-medium text-slate-900 whitespace-nowrap">
                          <div>{ticket.clientName}</div>
                          <div className="text-[11px] font-mono text-slate-500">
                            ID: {ticket.userId}
                          </div>
                        </td>
                        <td className="py-3 px-2.5 font-mono text-[11px] text-slate-700 tabular-nums whitespace-nowrap">
                          {ticket.clientPhone}
                        </td>
                        <td className="py-3 px-2.5 max-w-[145px]">
                          <div className="font-semibold text-slate-900 truncate">
                            {ticket.brandModel}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {ticket.deviceType}
                          </div>
                        </td>
                        <td className="py-3 px-2.5 text-xs text-slate-600 max-w-[180px]">
                          <p className="line-clamp-2 leading-snug">
                            {ticket.issueDescription}
                          </p>
                          {(ticket.expectedReadyDate ||
                            ticket.finalPrice !== null) && (
                            <p className="mt-1 font-mono text-[11px] text-slate-500 tabular-nums">
                              {ticket.expectedReadyDate &&
                                `Срок: ${ticket.expectedReadyDate}`}
                              {ticket.expectedReadyDate &&
                                ticket.finalPrice !== null &&
                                ' · '}
                              {ticket.finalPrice !== null &&
                                `${ticket.finalPrice.toLocaleString('ru-RU')} ₽`}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-2.5 whitespace-nowrap">
                          {ticket.master === 'Не назначен' ? (
                            <div>
                              <span className="text-red-600 font-semibold text-xs">
                                Не назначен
                              </span>
                              {ticket.status === 'Ожидает Мастера' && (
                                <div className="text-[10px] font-medium text-indigo-700">
                                  В очереди к мастеру
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium text-slate-900 text-xs">
                                {ticket.master}
                              </div>
                              {masterInfo && (
                                <div className="text-[10px] font-mono text-slate-500">
                                  Слоты: {masterInfo.activeCount}/
                                  {masterInfo.maxCapacity}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-2.5 whitespace-nowrap">
                          <StatusIndicator status={ticket.status} />
                        </td>
                        <td
                          className="py-3 px-2.5 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col items-end gap-1.5">
                            <div className="inline-flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedTicketId(ticket.id)}
                                aria-label={`Управлять заявкой ${ticket.id}`}
                                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                <SlidersHorizontal
                                  className="w-3.5 h-3.5"
                                  aria-hidden="true"
                                />
                                <span>Управлять</span>
                              </button>
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTicket(ticket.id)}
                                  aria-label={`Удалить заявку ${ticket.id}`}
                                  title="Удалить заявку"
                                  className="inline-flex items-center justify-center p-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                              )}
                            </div>

                            {isServiceVoucherUnlocked(ticket.status) ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setVoucherTicketId(ticket.id);
                                  triggerServiceVoucherPrint(ticket);
                                }}
                                aria-label={`Распечатать сервисный талон ${ticket.id}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-400 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                              >
                                <Printer
                                  className="w-3.5 h-3.5 text-emerald-700"
                                  aria-hidden="true"
                                />
                                <span>Распечатать сервисный талон</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                title="Сервисный талон открывается после статуса заказа «Готова»"
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg whitespace-nowrap shrink-0 cursor-not-allowed"
                              >
                                <Lock
                                  className="w-3 h-3 text-slate-400"
                                  aria-hidden="true"
                                />
                                <span>Сервисный талон (после «Готова»)</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Ticket Management Modal */}
      <TicketEditModal
        ticket={selectedTicket}
        mastersWorkload={allMastersWorkload}
        canDelete={canDelete}
        isMaster={isMaster}
        onClose={() => setSelectedTicketId(null)}
        onSave={handleSaveTicket}
        onDelete={handleDeleteTicket}
        onOpenVoucher={(ticketId) => {
          const targetTicket = visibleTickets.find((t) => t.id === ticketId);
          setSelectedTicketId(null);
          setVoucherTicketId(ticketId);
          if (targetTicket) {
            triggerServiceVoucherPrint(targetTicket);
          }
        }}
      />

      {/* 5. Printable Service & Warranty Voucher Modal */}
      <ServiceVoucherModal
        ticket={voucherTicket}
        onClose={() => setVoucherTicketId(null)}
      />
    </div>
  );
};
