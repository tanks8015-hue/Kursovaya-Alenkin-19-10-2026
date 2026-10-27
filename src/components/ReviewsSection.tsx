import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  Trash2,
} from 'lucide-react';
import { ReviewItem } from '../types';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  isAdmin?: boolean;
  onDeleteReview?: (reviewId: string) => void;
  onBackToMain?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  isAdmin = false,
  onDeleteReview,
  onBackToMain,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const visibleCount = 3;

  const maxStartIndex = Math.max(0, reviews.length - visibleCount);
  const safeStartIndex = Math.min(startIndex, maxStartIndex);

  const handlePrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxStartIndex : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
  };

  const visibleReviews = reviews.slice(
    safeStartIndex,
    safeStartIndex + visibleCount
  );

  return (
    <section
      id="reviews"
      data-testid="reviews-tab-section"
      className="py-12 md:py-16 bg-white border-b-2 border-slate-300 min-h-[calc(100vh-140px)]"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {onBackToMain && (
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-800 bg-[#E8EEF5] border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Вернуться на главную (Услуги и заявка)</span>
            </button>
          )}

          {isAdmin && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-300 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
              <span>Режим администратора: доступно удаление отзывов</span>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-blue-700 mb-2">
              Отдельная вкладка отзывов · Подтвержденные кейсы ремонта ({reviews.length})
            </p>
            <h1
              className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Отзывы клиентов и результаты ремонта
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Каждый отзыв привязан к выданному заказ-наряду. После получения статуса
              «Выдана» клиент может опубликовать свой отзыв из личного кабинета.
            </p>
          </div>

          {/* Left / Right Carousel Controls */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                Показаны {safeStartIndex + 1}–
                {Math.min(safeStartIndex + visibleCount, reviews.length)} из{' '}
                {reviews.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Предыдущий отзыв"
                  className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-[#E8EEF5] border-2 border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Влево</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Следующий отзыв"
                  className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 border-2 border-slate-900 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors cursor-pointer"
                >
                  <span>Вправо</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="p-10 rounded-xl bg-[#E8EEF5] border-2 border-slate-300 text-center text-sm text-slate-600">
            На данный момент опубликованных отзывов нет.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                data-testid={`review-card-${review.id}`}
                className="bg-[#E8EEF5] border-2 border-slate-300 shadow-xs rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Header with Order ID, Device, and Star Rating */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-600 pb-4 mb-4 border-b border-slate-300">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-blue-700 tabular-nums shrink-0">
                        Заказ {review.ticketRef}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-slate-800 truncate">
                        {review.companyOrDevice}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-0.5 text-amber-500 shrink-0"
                      aria-label={`Оценка ${review.rating || 5} из 5`}
                    >
                      {Array.from({ length: review.rating || 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-500"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm mb-6">
                    <div className="bg-white border border-slate-300 rounded-lg p-3">
                      <p className="font-bold text-slate-900 mb-0.5">
                        Исходная проблема:
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        {review.beforeState}
                      </p>
                    </div>
                    <div className="bg-white border border-slate-300 rounded-lg p-3">
                      <p className="font-bold text-slate-900 mb-0.5">
                        Решение инженера:
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        {review.actionTaken}
                      </p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3">
                      <p className="font-bold text-emerald-900 mb-0.5">
                        Отзыв клиента и результат:
                      </p>
                      <p className="text-emerald-950 font-medium leading-relaxed">
                        {review.outcome}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-300">
                  <div className="flex items-center justify-between text-xs text-slate-700 mb-2 font-mono tabular-nums">
                    <span>Срок ремонта: {review.turnaroundHours} ч.</span>
                    <span className="font-bold text-slate-900">
                      Итого: {review.pricePaid.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {review.authorName}
                      </p>
                      <p className="text-xs text-slate-600">{review.authorRole}</p>
                    </div>
                    {review.createdAt && (
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {review.createdAt}
                      </span>
                    )}
                  </div>

                  {isAdmin && onDeleteReview && (
                    <div className="mt-3 pt-3 border-t border-slate-300 flex items-center justify-end">
                      {confirmDeleteId === review.id ? (
                        <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-300 rounded-lg px-2.5 py-1.5 text-xs">
                          <span className="font-bold text-red-900">
                            Удалить отзыв?
                          </span>
                          <button
                            type="button"
                            data-testid={`confirm-delete-review-${review.id}`}
                            onClick={() => {
                              onDeleteReview(review.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                          >
                            Да
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            Нет
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          data-testid={`delete-review-btn-${review.id}`}
                          onClick={() => setConfirmDeleteId(review.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Удалить отзыв</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Dots */}
        {reviews.length > visibleCount && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: maxStartIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStartIndex(idx)}
                aria-label={`Перейти к слайду отзывов ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  safeStartIndex === idx
                    ? 'w-8 bg-blue-700'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
