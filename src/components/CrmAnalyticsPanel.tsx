import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Wrench,
  CheckCircle2,
  Wallet,
  Laptop,
  Award,
} from 'lucide-react';
import { RepairTicket } from '../types';
import { computeCrmAnalytics } from '../utils/repairStore';
import { StatusIndicator } from './StatusIndicator';

interface CrmAnalyticsPanelProps {
  tickets: RepairTicket[];
  isMaster?: boolean;
  masterName?: string;
}

export const CrmAnalyticsPanel: React.FC<CrmAnalyticsPanelProps> = ({
  tickets,
  isMaster = false,
  masterName,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'ALL' | '2026-09' | '2026-10'>(
    'ALL'
  );

  const analytics = computeCrmAnalytics(tickets, periodFilter);
  const sepData = analytics.monthlyComparison[0];
  const octData = analytics.monthlyComparison[1];

  const maxMonthRevenue = Math.max(
    sepData?.totalRevenue || 1,
    octData?.totalRevenue || 1,
    1
  );
  const maxDeviceRevenue = Math.max(
    ...analytics.byDevice.map((d) => d.revenue),
    1
  );
  const maxMasterRevenue = Math.max(
    ...analytics.byMaster.map((m) => m.revenue),
    1
  );

  const avgCheckDeltaPercent =
    sepData && sepData.averageCheck > 0 && octData
      ? Math.round(
          ((octData.averageCheck - sepData.averageCheck) /
            sepData.averageCheck) *
            100
        )
      : 0;

  return (
    <div data-testid="crm-analytics-panel" className="space-y-6">
      {/* Top Filter Bar: Period Selection */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
            <span>Финансовая и операционная аналитика СЦ</span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900">
            {isMaster && masterName
              ? `Аналитика выработки мастера: ${masterName}`
              : 'Сводная аналитика по заявкам, выручке и мастерам (09–10 мес.)'}
          </h2>
        </div>

        {/* Period Segmented Control */}
        <div
          role="group"
          aria-label="Фильтр периода аналитики"
          className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-[#E8EEF5] border border-slate-300 rounded-xl"
        >
          <button
            type="button"
            onClick={() => setPeriodFilter('ALL')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              periodFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Все месяцы ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setPeriodFilter('2026-09')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              periodFilter === '2026-09'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Сентябрь (09 мес. · {sepData?.ticketsCount || 0})
          </button>
          <button
            type="button"
            onClick={() => setPeriodFilter('2026-10')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              periodFilter === '2026-10'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Октябрь (10 мес. · {octData?.ticketsCount || 0})
          </button>
        </div>
      </div>

      {/* 1. Primary KPI Cards for Selected Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white border-2 border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-300">
              Общая сумма по сметам
            </span>
            <Wallet className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <p
            data-testid="analytics-total-revenue"
            className="text-3xl font-bold font-mono tabular-nums text-emerald-400"
          >
            {analytics.totalRevenue.toLocaleString('ru-RU')} ₽
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Заявок за период:{' '}
            <strong className="font-mono text-white">
              {analytics.periodTicketsCount}
            </strong>
          </p>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-600">
              Средний чек ремонта
            </span>
            <TrendingUp className="w-4 h-4 text-blue-700" aria-hidden="true" />
          </div>
          <p
            data-testid="analytics-avg-check"
            className="text-3xl font-bold font-mono tabular-nums text-slate-900"
          >
            {analytics.averageCheck.toLocaleString('ru-RU')} ₽
          </p>
          <p className="text-xs text-slate-600 mt-1">
            По заказам с согласованной сметой
          </p>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-600">
              Выручка готовых / выданных
            </span>
            <CheckCircle2
              className="w-4 h-4 text-emerald-600"
              aria-hidden="true"
            />
          </div>
          <p className="text-3xl font-bold font-mono tabular-nums text-emerald-700">
            {analytics.completedRevenue.toLocaleString('ru-RU')} ₽
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Завершено заявок:{' '}
            <strong className="font-mono text-slate-900">
              {analytics.completedCount}
            </strong>{' '}
            ({analytics.completionRate}%)
          </p>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-600">
              Активно в работе сейчас
            </span>
            <Wrench className="w-4 h-4 text-amber-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold font-mono tabular-nums text-amber-600">
            {analytics.inWorkCount}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Отменено за период:{' '}
            <strong className="font-mono text-rose-700">
              {analytics.cancelledCount}
            </strong>
          </p>
        </div>
      </div>

      {/* 2. Month-over-Month Comparison: September (09) vs October (10) */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" aria-hidden="true" />
              <span>
                Сравнение показателей по месяцам: Сентябрь (09) и Октябрь (10)
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Динамика поступлений заявок, общей суммы смет и среднего чека между 9-м и 10-м месяцем
            </p>
          </div>
          {avgCheckDeltaPercent !== 0 && (
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg">
              Динамика среднего чека в 10 мес.:{' '}
              {avgCheckDeltaPercent > 0
                ? `+${avgCheckDeltaPercent}%`
                : `${avgCheckDeltaPercent}%`}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {analytics.monthlyComparison.map((m) => {
            const barWidth = Math.max(
              10,
              Math.round((m.totalRevenue / maxMonthRevenue) * 100)
            );
            const isSelected = periodFilter === m.monthKey;

            return (
              <div
                key={m.monthKey}
                className={`p-5 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-600'
                    : 'bg-[#F8FAFC] border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-700">
                      Месяц {m.monthKey.slice(5)}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {m.label}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPeriodFilter(
                        isSelected
                          ? 'ALL'
                          : (m.monthKey as '2026-09' | '2026-10')
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-slate-800 border-slate-300 hover:border-blue-500'
                    }`}
                  >
                    {isSelected ? 'Выбран фильтр ✓' : 'Фильтр по месяцу'}
                  </button>
                </div>

                {/* Revenue progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">
                      Сумма по сметам за месяц:
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {m.totalRevenue.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <p className="text-slate-500">Всего заявок</p>
                    <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                      {m.ticketsCount} шт.
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Средний чек</p>
                    <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                      {m.averageCheck.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Готова / Выдана</p>
                    <p className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
                      {m.completedCount} шт. ({m.completedRevenue.toLocaleString('ru-RU')} ₽)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Two-Column Breakdown: By Device Type & By Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Device Categories Breakdown */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-700" aria-hidden="true" />
                <span>Аналитика спроса и выручки по типам техники</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Какие категории устройств приносят больше всего заказов и выручки
              </p>
            </div>
          </div>

          {analytics.byDevice.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Нет данных за выбранный период.
            </p>
          ) : (
            <div className="space-y-3.5">
              {analytics.byDevice.map((item) => {
                const widthPct = Math.max(
                  8,
                  Math.round((item.revenue / maxDeviceRevenue) * 100)
                );
                return (
                  <div
                    key={item.deviceType}
                    className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.deviceType}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono font-semibold text-blue-700">
                          {item.count} заяв. ({item.sharePercent}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono tabular-nums">
                        <span className="text-slate-500">
                          Ср. чек: {item.avgPrice.toLocaleString('ru-RU')} ₽
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {item.revenue.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Funnel Breakdown */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-bold font-display text-slate-900 mb-1">
            Распределение заявок по статусам
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Текущая воронка прохождения заказов за выбранный период
          </p>

          <div className="space-y-2.5">
            {analytics.byStatus.map((s) => (
              <div
                key={s.status}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200"
              >
                <StatusIndicator status={s.status} />
                <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                  <span className="font-bold text-slate-900">
                    {s.count} заяв.
                  </span>
                  <span className="text-slate-500 w-10 text-right">
                    {s.sharePercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Masters Performance & Revenue Table */}
      {!isMaster && (
        <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-700" aria-hidden="true" />
                <span>Эффективность и выработка мастеров СЦ</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Количество назначенных и выполненных ремонтов, средний чек и сумма по сметам каждого инженера
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Инженер / Специализация</th>
                  <th className="py-3 px-4">Всего заявок</th>
                  <th className="py-3 px-4">В работе сейчас</th>
                  <th className="py-3 px-4">Завершено</th>
                  <th className="py-3 px-4">Средний чек</th>
                  <th className="py-3 px-4">Сумма по сметам</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {analytics.byMaster.map((m) => {
                  const revWidth = Math.max(
                    6,
                    Math.round((m.revenue / maxMasterRevenue) * 100)
                  );
                  return (
                    <tr key={m.name} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">
                          {m.specialization}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                        {m.totalAssigned}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-amber-700 tabular-nums">
                        {m.inWorkCount}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-700 tabular-nums">
                        {m.completedCount}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-800 tabular-nums">
                        {m.avgCheck > 0
                          ? `${m.avgCheck.toLocaleString('ru-RU')} ₽`
                          : '—'}
                      </td>
                      <td className="py-3.5 px-4 min-w-[180px]">
                        <div className="flex items-center justify-between gap-2 font-mono font-bold text-slate-900 tabular-nums mb-1">
                          <span>{m.revenue.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${revWidth}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
