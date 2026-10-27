import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  AlertTriangle,
  Users,
  CheckCircle2,
  Printer,
  Lock,
  Hourglass,
} from 'lucide-react';
import {
  AdminUpdateTicketInput,
  MasterWorkloadItem,
  RepairTicket,
  TicketStatus,
} from '../types';
import {
  isServiceVoucherUnlocked,
  TICKET_STATUSES,
} from '../utils/repairStore';

interface TicketEditModalProps {
  ticket: RepairTicket | null;
  mastersWorkload: MasterWorkloadItem[];
  canDelete?: boolean;
  isMaster?: boolean;
  onClose: () => void;
  onSave: (ticketId: string, update: AdminUpdateTicketInput) => void;
  onDelete: (ticketId: string) => void;
  onOpenVoucher?: (ticketId: string) => void;
}

export const TicketEditModal: React.FC<TicketEditModalProps> = ({
  ticket,
  mastersWorkload,
  canDelete = true,
  isMaster = false,
  onClose,
  onSave,
  onDelete,
  onOpenVoucher,
}) => {
  const [status, setStatus] = useState<TicketStatus>('Новая');
  const [master, setMaster] = useState<string>('Не назначен');
  const [expectedReadyDate, setExpectedReadyDate] = useState<string>('');
  const [finalPriceStr, setFinalPriceStr] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setMaster(
        ticket.status === 'Ожидает Мастера' || ticket.status === 'Новая'
          ? 'Не назначен'
          : ticket.master
      );
      setExpectedReadyDate(ticket.expectedReadyDate || '');
      setFinalPriceStr(
        ticket.finalPrice !== null ? String(ticket.finalPrice) : ''
      );
      setValidationError(null);
      setConfirmDelete(false);
    }
  }, [ticket]);

  if (!ticket) return null;

  const isWaitingForMaster = status === 'Ожидает Мастера';
  const effectiveMaster =
    isWaitingForMaster || status === 'Новая'
      ? 'Не назначен'
      : isMaster
      ? ticket.master
      : master;
  const selectedMasterInfo = mastersWorkload.find(
    (m) => m.name === effectiveMaster
  );
  const recommendedMaster = [...mastersWorkload].sort(
    (a, b) => a.activeCount - b.activeCount
  )[0];
  const minReadyDate = /^\d{4}-\d{2}-\d{2}/.test(ticket.createdAt)
    ? ticket.createdAt.slice(0, 10)
    : '2026-01-01';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validate Master requirement for active/completed statuses
    if (
      (status === 'На диагностике' ||
        status === 'Принята' ||
        status === 'В работе' ||
        status === 'Ожидает запчастей' ||
        status === 'Готова' ||
        status === 'Выдана') &&
      effectiveMaster === 'Не назначен'
    ) {
      setValidationError(
        `Ошибка: для перевода заявки в статус «${status}» необходимо назначить мастера.`
      );
      return;
    }

    // 1.5. Block assigning a new ticket to an overloaded master (3/3 slots)
    if (
      !isMaster &&
      selectedMasterInfo &&
      selectedMasterInfo.activeCount >= selectedMasterInfo.maxCapacity &&
      ticket.master !== selectedMasterInfo.name &&
      (status === 'На диагностике' ||
        status === 'Принята' ||
        status === 'В работе' ||
        status === 'Ожидает запчастей')
    ) {
      setValidationError(
        `Ошибка: у мастера ${selectedMasterInfo.name} заняты все слоты (${selectedMasterInfo.activeCount}/${selectedMasterInfo.maxCapacity}). Выберите свободного мастера или поставьте статус «Ожидает Мастера».`
      );
      return;
    }

    // 2. Validate expectedReadyDate against ticket creation date
    if (expectedReadyDate && expectedReadyDate < minReadyDate) {
      setValidationError(
        `Ошибка: ожидаемая дата готовности (${expectedReadyDate}) не может быть раньше даты создания заявки (${minReadyDate}).`
      );
      return;
    }

    // 3. Validate price format and bounds
    let parsedPrice: number | null = null;
    if (finalPriceStr.trim() !== '') {
      const num = Number(finalPriceStr);
      if (Number.isNaN(num) || num < 0 || num > 1000000) {
        setValidationError(
          'Некорректная цена ремонта: укажите сумму от 0 до 1 000 000 руб..'
        );
        return;
      }
      parsedPrice = num;
    }

    if (
      (status === 'Готова' || status === 'Выдана') &&
      (parsedPrice === null || parsedPrice <= 0)
    ) {
      setValidationError(
        `Ошибка: для статуса «${status}» необходимо указать итоговую цену ремонта больше 0 руб..`
      );
      return;
    }

    const finalReadyDate =
      (status === 'Готова' || status === 'Выдана') && !expectedReadyDate
        ? ticket.preferredDate >= minReadyDate
          ? ticket.preferredDate
          : minReadyDate
        : expectedReadyDate;

    onSave(ticket.id, {
      status,
      master: effectiveMaster,
      expectedReadyDate: finalReadyDate,
      finalPrice: parsedPrice,
    });
    onClose();
  };

  const handleDeleteClick = () => {
    onDelete(ticket.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-ticket-title"
    >
      <div className="bg-white border-2 border-slate-300 rounded-xl max-w-xl w-full p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono font-semibold text-blue-700">
                {ticket.id}
              </span>
              <span>·</span>
              <span>Создана: {ticket.createdAt}</span>
            </div>
            <h2
              id="edit-ticket-title"
              className="text-lg font-bold font-display text-slate-900"
            >
              Управление заявкой {ticket.id}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно редактирования заявки"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary of client & device */}
        <div className="mb-5 p-4 rounded-lg bg-[#F1F5F9] border border-slate-300 text-xs space-y-1.5">
          <div className="flex justify-between gap-2">
            <span className="text-slate-600">Клиент:</span>
            <span className="font-semibold text-slate-900">
              {ticket.clientName} ({ticket.clientPhone})
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-600">Устройство:</span>
            <span className="font-semibold text-slate-900">
              {ticket.deviceType} · {ticket.brandModel}
            </span>
          </div>
          <div className="pt-1 border-t border-slate-300 text-slate-800">
            <span className="text-slate-600">Неисправность: </span>
            {ticket.issueDescription}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="edit-status"
              className="block text-xs font-bold text-slate-900 mb-1.5"
            >
              Статус заявки (Новая → Ожидает Мастера → На диагностике → Принята → В работе → Ожидает запчастей → Готова → Выдана / Отменен)
            </label>
            <select
              id="edit-status"
              value={status}
              disabled={isMaster && ticket.status === 'Выдана'}
              onChange={(e) => {
                const nextStatus = e.target.value as TicketStatus;
                setStatus(nextStatus);
                if (
                  nextStatus === 'Ожидает Мастера' ||
                  nextStatus === 'Новая'
                ) {
                  setMaster('Не назначен');
                }
                setValidationError(null);
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
            >
              {TICKET_STATUSES.filter((st) => {
                if (!isMaster) return true;
                if (st === ticket.status) return true;
                return (
                  st !== 'Новая' &&
                  st !== 'Ожидает Мастера' &&
                  st !== 'Отменен'
                );
              }).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {isMaster ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="block text-xs font-bold text-slate-900">
                  Ответственный мастер (назначен администратором)
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Смена мастера доступна только администратору
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-blue-50/60 border-2 border-blue-600 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {effectiveMaster}
                  </div>
                  {selectedMasterInfo && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      {selectedMasterInfo.specialization}
                    </div>
                  )}
                </div>
                {selectedMasterInfo && (
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono text-xs font-bold tabular-nums px-2.5 py-1 rounded-md border ${
                        selectedMasterInfo.activeCount >=
                        selectedMasterInfo.maxCapacity
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : selectedMasterInfo.activeCount ===
                            selectedMasterInfo.maxCapacity - 1
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      В работе: {selectedMasterInfo.activeCount}/
                      {selectedMasterInfo.maxCapacity}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label
                  htmlFor="edit-master"
                  className="block text-xs font-bold text-slate-900"
                >
                  Назначенный мастер (с учетом текущей загруженности)
                </label>
                {isWaitingForMaster ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                    <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>Выбор мастера недоступен</span>
                  </span>
                ) : (
                  recommendedMaster && (
                    <button
                      type="button"
                      onClick={() => {
                        setMaster(recommendedMaster.name);
                        if (status === 'Новая') {
                          setStatus('На диагностике');
                        }
                        setValidationError(null);
                      }}
                      className="text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
                    >
                      Выбрать свободного: {recommendedMaster.name} (
                      {recommendedMaster.activeCount}/
                      {recommendedMaster.maxCapacity})
                    </button>
                  )
                )}
              </div>
              <select
                id="edit-master"
                value={
                  isWaitingForMaster || status === 'Новая'
                    ? 'Не назначен'
                    : master
                }
                disabled={isWaitingForMaster}
                onChange={(e) => {
                  const chosen = e.target.value;
                  setMaster(chosen);
                  if (chosen !== 'Не назначен' && status === 'Новая') {
                    setStatus('На диагностике');
                  }
                  setValidationError(null);
                }}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                  isWaitingForMaster
                    ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed font-semibold'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="Не назначен">Не назначен</option>
                {mastersWorkload.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} — В работе: {m.activeCount}/{m.maxCapacity} (
                    {m.statusLabel})
                  </option>
                ))}
              </select>

              {isWaitingForMaster && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-indigo-50 border border-indigo-300 flex items-center gap-2 text-xs text-indigo-950">
                  <Hourglass
                    className="w-4 h-4 text-indigo-700 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Выбран статус <strong>«Ожидает Мастера»</strong>: так как
                    профильный мастер занят, заявка сохраняется со значением{' '}
                    <strong>«Не назначен»</strong> (выбрать мастера нельзя).
                  </span>
                </div>
              )}

              {/* Live Master Workload Indicator inside Modal */}
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {mastersWorkload.map((m) => {
                  const isSelected = !isWaitingForMaster && master === m.name;
                  const isOverloaded = m.activeCount >= m.maxCapacity;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      disabled={isWaitingForMaster}
                      onClick={() => {
                        if (isWaitingForMaster) return;
                        setMaster(m.name);
                        if (status === 'Новая') {
                          setStatus('На диагностике');
                        }
                        setValidationError(null);
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-colors ${
                        isWaitingForMaster
                          ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-50 border-blue-600 cursor-pointer'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span className="truncate">{m.name}</span>
                        <span
                          className={`font-mono tabular-nums ${
                            isOverloaded
                              ? 'text-red-600'
                              : m.activeCount === m.maxCapacity - 1
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {m.activeCount}/{m.maxCapacity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {m.specialization}
                      </p>
                    </button>
                  );
                })}
              </div>

              {!isWaitingForMaster &&
                selectedMasterInfo &&
                selectedMasterInfo.activeCount >=
                  selectedMasterInfo.maxCapacity &&
                ticket.master !== selectedMasterInfo.name && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-300 flex flex-col gap-2 text-xs text-amber-900">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Внимание: у мастера{' '}
                        <strong>{selectedMasterInfo.name}</strong> уже заняты все
                        слоты ({selectedMasterInfo.activeCount}/
                        {selectedMasterInfo.maxCapacity}). Рекомендуем назначить{' '}
                        <strong>{recommendedMaster?.name}</strong> или поставить в
                        очередь.
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setStatus('Ожидает Мастера');
                          setMaster('Не назначен');
                          setValidationError(null);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-800 bg-indigo-100 border border-indigo-300 rounded-md hover:bg-indigo-200 transition-colors cursor-pointer"
                      >
                        <Hourglass className="w-3 h-3" aria-hidden="true" />
                        <span>Поставить статус «Ожидает Мастера» (Не назначен)</span>
                      </button>
                    </div>
                  </div>
                )}

              {!isWaitingForMaster &&
                selectedMasterInfo &&
                selectedMasterInfo.activeCount <
                  selectedMasterInfo.maxCapacity && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      У мастера <strong>{selectedMasterInfo.name}</strong> есть
                      свободные слоты ({selectedMasterInfo.activeCount}/
                      {selectedMasterInfo.maxCapacity} активных заказов).
                    </span>
                  </div>
                )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-ready-date"
                className="block text-xs font-bold text-slate-900 mb-1.5"
              >
                Ожидаемая дата готовности
              </label>
              <input
                id="edit-ready-date"
                type="date"
                min={minReadyDate}
                value={expectedReadyDate}
                onChange={(e) => {
                  setExpectedReadyDate(e.target.value);
                  setValidationError(null);
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="edit-final-price"
                className="block text-xs font-bold text-slate-900 mb-1.5"
              >
                Итоговая цена ремонта (руб.)
              </label>
              <input
                id="edit-final-price"
                type="number"
                min="0"
                step="100"
                value={finalPriceStr}
                onChange={(e) => {
                  setFinalPriceStr(e.target.value);
                  setValidationError(null);
                }}
                placeholder="Например: 8500"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono tabular-nums"
              />
            </div>
          </div>

          {validationError && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 border border-red-300 flex items-center gap-2 text-xs text-red-800 font-medium"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {canDelete ? (
                confirmDelete ? (
                  <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-300 rounded-lg px-2.5 py-1.5">
                    <span className="text-xs font-bold text-red-800">
                      Точно удалить?
                    </span>
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="px-2 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                    >
                      Да
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      Нет
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Удалить заявку</span>
                  </button>
                )
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  Режим мастера: редактирование заказа
                </span>
              )}

              {onOpenVoucher && isServiceVoucherUnlocked(ticket.status) && (
                <button
                  type="button"
                  onClick={() => onOpenVoucher(ticket.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  <span>Распечатать сервисный талон</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Сохранить изменения</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
