import React, { useState, useEffect } from 'react';
import {
  Printer,
  ShieldCheck,
  CheckCircle2,
  X,
  FileCheck2,
  Wrench,
  User,
  Calendar,
  Award,
  Download,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
} from 'lucide-react';
import { RepairTicket } from '../types';
import {
  downloadServiceVoucherHtml,
  getServiceVoucherDetails,
  prepareServiceVoucherPrintRoot,
  triggerServiceVoucherPrint,
} from '../utils/repairStore';
import { StatusIndicator } from './StatusIndicator';

interface ServiceVoucherModalProps {
  ticket: RepairTicket | null;
  onClose: () => void;
}

export const ServiceVoucherModal: React.FC<ServiceVoucherModalProps> = ({
  ticket,
  onClose,
}) => {
  const [printerDestination, setPrinterDestination] = useState<string>(
    'HP LaserJet Pro MFP M428fdw (Лаборатория СЦ)'
  );
  const [copies, setCopies] = useState<number>(1);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );
  const [colorMode, setColorMode] = useState<'color' | 'bw'>('color');
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [showStampAndSignatures, setShowStampAndSignatures] =
    useState<boolean>(true);
  const [showBackgroundGraphics, setShowBackgroundGraphics] =
    useState<boolean>(true);
  const [printConfirm, setPrintConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (ticket) {
      prepareServiceVoucherPrintRoot(ticket);
      setPrintConfirm(false);
    }
  }, [ticket]);

  if (!ticket) return null;

  const details = getServiceVoucherDetails(ticket);
  const isPdfDestination = printerDestination.startsWith('Сохранить как PDF');

  const handlePrint = () => {
    setPrintConfirm(true);
    triggerServiceVoucherPrint(ticket);
    if (isPdfDestination) {
      downloadServiceVoucherHtml(ticket);
    }
  };

  const handleDownloadFile = () => {
    downloadServiceVoucherHtml(ticket);
    setPrintConfirm(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-2 sm:p-4 overflow-hidden print:p-0 print:bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-voucher-title"
      onClick={onClose}
    >
      <div
        className="bg-[#525659] border border-slate-700 rounded-xl max-w-6xl w-full h-[92vh] flex flex-col lg:flex-row shadow-2xl overflow-hidden print:border-0 print:shadow-none print:max-w-none print:h-auto print:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT / CENTER: Realistic System Print Preview Stage (#525659) with A4 Paper Sheet */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#525659] print:bg-white print:overflow-visible">
          {/* Print Preview Top Toolbar */}
          <div className="bg-[#323639] text-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-black/40 shrink-0 print:hidden">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span
                id="service-voucher-title"
                className="text-xs sm:text-sm font-mono font-bold text-white truncate"
              >
                Окно печати документа: Сервисный_талон_{details.voucherNumber}_{ticket.id}.pdf
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-slate-700 text-[11px] font-mono text-slate-200">
                Стр. 1 из 1 · A4
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setScalePercent((prev) => Math.max(85, prev - 5))}
                aria-label="Уменьшить масштаб"
                className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-200 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-bold px-2 text-white tabular-nums">
                {scalePercent}%
              </span>
              <button
                type="button"
                onClick={() => setScalePercent((prev) => Math.min(110, prev + 5))}
                aria-label="Увеличить масштаб"
                className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-200 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable A4 Paper Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start print:p-0 print:overflow-visible">
            <div
              style={{
                transform: `scale(${scalePercent / 100})`,
                transformOrigin: 'top center',
              }}
              className={`bg-white text-slate-900 shadow-[0_12px_42px_rgba(0,0,0,0.55)] border border-slate-300 transition-all duration-150 ${
                orientation === 'landscape' ? 'max-w-4xl w-full' : 'max-w-[794px] w-full'
              } ${colorMode === 'bw' ? 'grayscale contrast-125' : ''} p-6 sm:p-8 space-y-4 print:shadow-none print:border-0 print:p-0`}
            >
              {/* Document Header with Brand & Requisites */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-slate-900">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 text-white flex items-center justify-center shadow-xs border border-blue-500/40 shrink-0">
                    <svg
                      viewBox="0 0 36 36"
                      fill="none"
                      className="w-7 h-7"
                      aria-hidden="true"
                    >
                      <rect
                        x="7"
                        y="7"
                        width="22"
                        height="22"
                        rx="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M14 13V23M14 18L21 13M16.5 16.5L22 23"
                        stroke="#60A5FA"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                        КВАНТ Сервис
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800">
                        ОТК СЕРТИФИЦИРОВАН
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Лаборатория компонентного ремонта электроники · ООО «КВАНТ Сервис»
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      ИНН 7704891205 · КПП 770401001 · г. Москва, ул. Инженерная, д. 14, стр. 2 · Тел.: +7 (495) 128-44-00
                    </p>
                  </div>
                </div>

                <div
                  className={`sm:text-right border border-slate-400 rounded-lg px-4 py-2.5 shrink-0 ${
                    showBackgroundGraphics ? 'bg-[#F8FAFC]' : 'bg-white'
                  }`}
                >
                  <div className="text-[11px] font-mono uppercase text-slate-600 font-semibold">
                    Сервисный и гарантийный талон
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                    № {details.voucherNumber}
                  </div>
                  <div className="text-xs font-mono text-blue-700 font-bold">
                    Заказ-наряд: {ticket.id}
                  </div>
                  <div className="mt-1 flex sm:justify-end">
                    <StatusIndicator status={ticket.status} />
                  </div>
                </div>
              </div>

              {/* 1. Client & Device Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-3.5 rounded-xl border border-slate-300 space-y-1.5 ${
                    showBackgroundGraphics ? 'bg-[#F8FAFC]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 pb-1.5 border-b border-slate-200">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    <span>1. Сведения о заказчике (Клиент)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <span className="text-slate-500">ФИО клиента:</span>
                    <span className="col-span-2 font-bold text-slate-900">
                      {ticket.clientName}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <span className="text-slate-500">Телефон:</span>
                    <span className="col-span-2 font-mono font-semibold text-slate-900">
                      {ticket.clientPhone}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <span className="text-slate-500">ID клиента:</span>
                    <span className="col-span-2 font-mono text-slate-700">
                      {ticket.userId}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <span className="text-slate-500">Дата приема:</span>
                    <span className="col-span-2 font-mono text-slate-800">
                      {ticket.createdAt}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border border-slate-300 space-y-1.5 ${
                    showBackgroundGraphics ? 'bg-[#F8FAFC]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 pb-1.5 border-b border-slate-200">
                    <Wrench className="w-3.5 h-3.5 text-blue-700" />
                    <span>2. Оборудование и исполнитель</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <span className="text-slate-500">Категория:</span>
                    <span className="col-span-2 font-semibold text-slate-900">
                      {ticket.deviceType}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <span className="text-slate-500">Устройство:</span>
                    <span className="col-span-2 font-bold text-slate-900">
                      {ticket.brandModel}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <span className="text-slate-500">Инженер СЦ:</span>
                    <span className="col-span-2 font-bold text-blue-800">
                      {details.masterName}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <span className="text-slate-500">Дата готовности:</span>
                    <span className="col-span-2 font-mono font-semibold text-emerald-800">
                      {details.issueDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Performed Repair Work & Cost Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div
                  className={`px-4 py-2 border-b border-slate-300 flex items-center justify-between ${
                    showBackgroundGraphics ? 'bg-slate-100' : 'bg-white'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    3. Выполненные работы и техническое заключение
                  </span>
                  <span className="text-[11px] font-mono text-slate-600">
                    Протокол стендового контроля #{ticket.id}
                  </span>
                </div>
                <div className="p-3.5 space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">
                      Заявленная неисправность и предмет ремонта:
                    </span>
                    <p
                      className={`p-2 rounded-lg border border-slate-200 text-slate-900 leading-relaxed ${
                        showBackgroundGraphics ? 'bg-slate-50' : 'bg-white'
                      }`}
                    >
                      {ticket.issueDescription}
                    </p>
                  </div>

                  <table className="w-full text-left border-collapse border-t border-slate-200 pt-2">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] text-slate-500 font-semibold">
                        <th className="py-1.5 pr-2">Этап работ</th>
                        <th className="py-1.5 px-2">Результат ОТК</th>
                        <th className="py-1.5 pl-2 text-right">Стоимость</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-slate-900">
                          1. Полная аппаратная диагностика на лабораторном стенде
                        </td>
                        <td className="py-1.5 px-2 font-mono text-emerald-700 font-semibold">
                          Выполнено
                        </td>
                        <td className="py-1.5 pl-2 text-right font-mono font-bold text-emerald-700">
                          0 ₽ (Бесплатно)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-slate-900">
                          2. Компонентный ремонт и восстановление ({ticket.brandModel})
                        </td>
                        <td className="py-1.5 px-2 font-mono text-emerald-700 font-semibold">
                          Норма / Проверено
                        </td>
                        <td className="py-1.5 pl-2 text-right font-mono font-bold text-slate-900">
                          {details.finalPriceFormatted}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-slate-900">
                          3. Выходной стресс-тест и калибровка узлов под нагрузкой
                        </td>
                        <td className="py-1.5 px-2 font-mono text-emerald-700 font-semibold">
                          Допущено к выдаче
                        </td>
                        <td className="py-1.5 pl-2 text-right font-mono text-slate-600">
                          Включено
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr
                        className={`border-t-2 border-slate-300 font-bold text-sm ${
                          showBackgroundGraphics ? 'bg-slate-50' : 'bg-white'
                        }`}
                      >
                        <td colSpan={2} className="py-2 px-2 text-slate-900">
                          ИТОГОВАЯ СУММА ПО ЗАКАЗ-НАРЯДУ {ticket.id}:
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-blue-800">
                          {details.finalPriceFormatted}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* 3. Official Warranty Certificate Block */}
              <div
                className={`rounded-xl border-2 border-emerald-600 p-4 space-y-2.5 ${
                  showBackgroundGraphics ? 'bg-emerald-50/60' : 'bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
                        Сертификат гарантии: {details.warrantyCode}
                      </span>
                      <h3 className="text-sm font-bold font-display text-slate-900">
                        Официальная гарантия «КВАНТ Сервис» — {details.warrantyPeriodLabel}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-emerald-300 text-xs font-mono font-bold text-emerald-900 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Действует до: {details.warrantyUntilDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Что покрывает гарантия (12 месяцев):</span>
                    </p>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {details.coveredItems.map((item, idx) => (
                        <li key={idx} className="leading-snug">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 mb-1">
                      Условия гарантийного обслуживания:
                    </p>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {details.warrantyConditions.map((cond, idx) => (
                        <li key={idx} className="leading-snug">
                          {cond}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. Signatures & Official Service Center Stamp */}
              {showStampAndSignatures && (
                <div className="pt-2.5 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 block">Ответственный инженер СЦ:</span>
                    <div className="font-bold text-slate-900">{details.masterName}</div>
                    <div className="pt-2 border-b border-dashed border-slate-400 text-[11px] font-mono text-slate-500">
                      Подпись: / {details.masterName.split(' ')[0]} /
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 block">Заказчик (Клиент):</span>
                    <div className="font-bold text-slate-900">{ticket.clientName}</div>
                    <div className="pt-2 border-b border-dashed border-slate-400 text-[11px] font-mono text-slate-500">
                      Устройство проверил, претензий нет
                    </div>
                  </div>

                  <div className="flex sm:justify-end">
                    <div className="border-2 border-blue-700/80 rounded-lg px-3 py-1.5 text-center bg-blue-50/40 rotate-[-2deg]">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-900">
                        ООО «КВАНТ СЕРВИС»
                      </div>
                      <div className="text-xs font-mono font-extrabold text-blue-700 my-0.5">
                        ОТК ПРОЙДЕН · М.П.
                      </div>
                      <div className="text-[10px] font-mono text-blue-800">
                        ГАРАНТИЯ 12 МЕС. · {details.issueDate}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: System Print Settings Panel (Hidden when printing) */}
        <div className="w-full lg:w-88 bg-slate-900 text-white border-t lg:border-t-0 lg:border-l border-slate-700 flex flex-col justify-between shrink-0 print:hidden">
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold font-display text-white">
                    Печать документа
                  </h3>
                </div>
                <p className="text-xs font-mono text-emerald-400 mt-0.5">
                  Всего: 1 лист бумаги (A4) · Копий: {copies}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть окно печати"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {printConfirm && (
              <div
                role="status"
                className="p-3 rounded-lg bg-emerald-950/90 border border-emerald-500/60 text-xs text-emerald-200 space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Документ отправлен на печать!</span>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  Талон <strong>{details.voucherNumber}</strong> (Заказ {ticket.id}) передан на устройство:{' '}
                  <span className="font-mono underline">{printerDestination}</span> (копий: {copies}).
                </p>
              </div>
            )}

            {/* Print Controls */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label
                  htmlFor="print-destination"
                  className="block text-slate-300 font-semibold mb-1.5"
                >
                  Принтер / Назначение
                </label>
                <select
                  id="print-destination"
                  value={printerDestination}
                  onChange={(e) => setPrinterDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="HP LaserJet Pro MFP M428fdw (Лаборатория СЦ)">
                    🖨️ HP LaserJet Pro MFP M428fdw (Лаборатория СЦ)
                  </option>
                  <option value="Сохранить как PDF (Документ A4)">
                    📄 Сохранить как PDF / Выгрузить файл
                  </option>
                  <option value="Canon i-SENSYS LBP223dw (Зона выдачи)">
                    🖨️ Canon i-SENSYS LBP223dw (Зона выдачи)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="print-pages"
                    className="block text-slate-300 font-semibold mb-1.5"
                  >
                    Страницы
                  </label>
                  <select
                    id="print-pages"
                    defaultValue="all"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">Все (1 стр.)</option>
                    <option value="current">Только стр. 1</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="print-copies"
                    className="block text-slate-300 font-semibold mb-1.5"
                  >
                    Копии
                  </label>
                  <input
                    id="print-copies"
                    type="number"
                    min={1}
                    max={10}
                    value={copies}
                    onChange={(e) =>
                      setCopies(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="print-orientation"
                    className="block text-slate-300 font-semibold mb-1.5"
                  >
                    Ориентация
                  </label>
                  <select
                    id="print-orientation"
                    value={orientation}
                    onChange={(e) =>
                      setOrientation(e.target.value as 'portrait' | 'landscape')
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="portrait">Книжная (A4)</option>
                    <option value="landscape">Альбомная</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="print-color"
                    className="block text-slate-300 font-semibold mb-1.5"
                  >
                    Режим цвета
                  </label>
                  <select
                    id="print-color"
                    value={colorMode}
                    onChange={(e) => setColorMode(e.target.value as 'color' | 'bw')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="color">Цветная печать</option>
                    <option value="bw">Черно-белая (Ч/Б)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Параметры документа</span>
                </div>

                <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showStampAndSignatures}
                    onChange={(e) => setShowStampAndSignatures(e.target.checked)}
                    className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Печатать штамп ОТК и подписи сторон</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showBackgroundGraphics}
                    onChange={(e) => setShowBackgroundGraphics(e.target.checked)}
                    className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Фоновая графика и цветные плашки</span>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Print Action Buttons */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>{isPdfDestination ? 'Сохранить и распечатать' : 'Печать талона'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Отмена
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadFile}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Скачать печатный документ (.html / A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
