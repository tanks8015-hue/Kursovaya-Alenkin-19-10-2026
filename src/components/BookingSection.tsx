import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Send,
  AlertTriangle,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { DeviceType, NewTicketInput, RepairTicket, UserAccount } from '../types';
import {
  DEVICE_TYPES,
  formatPhoneMask,
  validateNewTicketInput,
  validatePhoneStrict,
  validateNameStrict,
} from '../utils/repairStore';

interface BookingSectionProps {
  currentUser: UserAccount | null;
  preselectedDevice: DeviceType | null;
  onCreateTicket: (
    input: Omit<NewTicketInput, 'userId'>
  ) => { ticket?: RepairTicket; error?: string };
  onOpenAuthModal: (initialTab?: 'login' | 'register') => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  currentUser,
  preselectedDevice,
  onCreateTicket,
  onOpenAuthModal,
}) => {
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(
    currentUser?.phone ? formatPhoneMask(currentUser.phone) : ''
  );
  const [deviceType, setDeviceType] = useState<DeviceType>('Смартфон');
  const [brandModel, setBrandModel] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return today >= '2026-01-01' && today <= '2027-12-31' ? today : '2026-10-25';
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [createdTicket, setCreatedTicket] = useState<RepairTicket | null>(null);

  useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.name);
      setClientPhone(formatPhoneMask(currentUser.phone));
      setFieldErrors({});
    }
  }, [currentUser]);

  useEffect(() => {
    if (preselectedDevice) {
      setDeviceType(preselectedDevice);
    }
  }, [preselectedDevice]);

  const phoneDigitsCount = clientPhone.replace(/\D/g, '').length;

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = { ...fieldErrors };

    if (field === 'clientName') {
      const check = validateNameStrict(clientName);
      if (!check.valid) nextErrors.clientName = check.error!;
      else delete nextErrors.clientName;
    }
    if (field === 'clientPhone') {
      const check = validatePhoneStrict(clientPhone);
      if (!check.valid) nextErrors.clientPhone = check.error!;
      else delete nextErrors.clientPhone;
    }
    if (field === 'brandModel') {
      const trimmed = brandModel.trim();
      if (trimmed.length < 3) {
        nextErrors.brandModel =
          'Некорректная модель: укажите бренд и модель (минимум 3 символа).';
      } else if (/^\d+$/.test(trimmed)) {
        nextErrors.brandModel =
          'Некорректная модель: название не может состоять только из цифр.';
      } else {
        delete nextErrors.brandModel;
      }
    }
    if (field === 'issueDescription') {
      const trimmed = issueDescription.trim();
      if (trimmed.length < 10) {
        nextErrors.issueDescription = `Опишите поломку подробнее: минимум 10 символов (сейчас: ${trimmed.length}).`;
      } else {
        delete nextErrors.issueDescription;
      }
    }

    setFieldErrors(nextErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setCreatedTicket(null);

    const validation = validateNewTicketInput({
      userId: currentUser?.id || 'auto-guest',
      clientName,
      clientPhone,
      deviceType,
      brandModel,
      issueDescription,
      preferredDate,
    });

    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors || {});
      setTouched({
        clientName: true,
        clientPhone: true,
        brandModel: true,
        issueDescription: true,
        preferredDate: true,
      });
      setErrorMessage(
        validation.error || 'Исправьте ошибки в выделенных полях формы.'
      );
      return;
    }

    const result = onCreateTicket({
      clientName,
      clientPhone,
      deviceType,
      brandModel,
      issueDescription,
      preferredDate,
    });

    if (result.error || !result.ticket) {
      setErrorMessage(result.error || 'Ошибка регистрации заявки.');
      return;
    }

    setCreatedTicket(result.ticket);
    setBrandModel('');
    setIssueDescription('');
    setFieldErrors({});
    setTouched({});
  };

  return (
    <section
      id="booking-form"
      className="py-16 md:py-20 bg-white border-b-2 border-slate-300"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Explanation Column */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              Онлайн-регистрация устройства
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight mb-4"
              style={{ textWrap: 'balance' }}
            >
              Оформить заявку на диагностику и ремонт
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-8">
              Каждая созданная заявка проходит автоматическую проверку корректности
              контактных данных, получает уникальный номер (например,{' '}
              <span className="font-mono font-semibold text-slate-900">KV-2042</span>) и
              сразу отображается в вашей персональной вкладке «Мои заявки».
            </p>

            <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-6 space-y-4 shadow-md">
              <h3 className="text-sm font-bold font-display text-white">
                Правила оформления и контроль качества:
              </h3>
              <ol className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li>
                  <strong className="text-white">1. Проверка данных:</strong> Телефон
                  проверяется на формат РФ (ровно 11 цифр, начинается с +7 или 8), имя — на
                  отсутствие цифр.
                </li>
                <li>
                  <strong className="text-white">2. Распределение нагрузки:</strong>{' '}
                  Администратор в CRM видит загруженность каждого мастера и назначает
                  свободного профильного инженера.
                </li>
                <li>
                  <strong className="text-white">3. Отзыв после выдачи:</strong> Как только
                  заявка получает статус «Выдана», вы можете опубликовать реальный отзыв о
                  ремонте прямо из личного кабинета.
                </li>
              </ol>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-[#E8EEF5] border-2 border-slate-300 shadow-sm rounded-xl p-6 sm:p-8"
            >
              {/* Current User Account Status Bar inside Form */}
              <div className="mb-6 p-4 rounded-lg bg-white border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {currentUser ? (
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800">
                    <UserCheck
                      className="w-4 h-4 text-emerald-600 shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      Вы авторизованы как <strong>{currentUser.name}</strong> (логин:{' '}
                      <span className="font-mono font-semibold">{currentUser.login}</span>).
                      Заявка добавится в ваши «Мои заявки».
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-slate-700">
                      <strong className="text-slate-900">Вы не авторизованы.</strong> Вы
                      можете войти/зарегистрироваться сейчас или заполнить форму ниже —
                      аккаунт создастся автоматически.
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenAuthModal('register')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Регистрация / Вход</span>
                    </button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label
                    htmlFor="client-name"
                    className="block text-xs font-bold text-slate-900 mb-1.5"
                  >
                    Имя клиента (только буквы) *
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    required
                    value={clientName}
                    onBlur={() => handleFieldBlur('clientName')}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (fieldErrors.clientName) {
                        setFieldErrors((prev) => ({ ...prev, clientName: '' }));
                      }
                    }}
                    placeholder="Например: Иван Сергеевич"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      fieldErrors.clientName
                        ? 'border-red-500 focus:ring-red-600'
                        : 'border-slate-300 focus:ring-blue-600'
                    }`}
                  />
                  {fieldErrors.clientName && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {fieldErrors.clientName}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="client-phone"
                      className="block text-xs font-bold text-slate-900"
                    >
                      Номер телефона (11 цифр) *
                    </label>
                    <span
                      className={`text-[11px] font-mono tabular-nums font-semibold ${
                        phoneDigitsCount === 11
                          ? 'text-emerald-700'
                          : phoneDigitsCount > 11 ||
                            (touched.clientPhone && phoneDigitsCount !== 11)
                          ? 'text-red-600'
                          : 'text-slate-500'
                      }`}
                    >
                      Цифр: {phoneDigitsCount}/11
                    </span>
                  </div>
                  <input
                    id="client-phone"
                    type="tel"
                    inputMode="tel"
                    maxLength={18}
                    required
                    value={clientPhone}
                    onBlur={() => handleFieldBlur('clientPhone')}
                    onChange={(e) => {
                      const masked = formatPhoneMask(e.target.value);
                      setClientPhone(masked);
                      if (fieldErrors.clientPhone) {
                        setFieldErrors((prev) => ({ ...prev, clientPhone: '' }));
                      }
                    }}
                    placeholder="+7 (___) ___-__-__"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 font-mono tabular-nums ${
                      fieldErrors.clientPhone
                        ? 'border-red-500 focus:ring-red-600'
                        : 'border-slate-300 focus:ring-blue-600'
                    }`}
                  />
                  {fieldErrors.clientPhone && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {fieldErrors.clientPhone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label
                    htmlFor="device-type"
                    className="block text-xs font-bold text-slate-900 mb-1.5"
                  >
                    Тип техники *
                  </label>
                  <select
                    id="device-type"
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    {DEVICE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="preferred-date"
                    className="block text-xs font-bold text-slate-900 mb-1.5"
                  >
                    Желаемая дата сдачи в ремонт *
                  </label>
                  <input
                    id="preferred-date"
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (fieldErrors.preferredDate) {
                        setFieldErrors((prev) => ({ ...prev, preferredDate: '' }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 font-mono tabular-nums ${
                      fieldErrors.preferredDate
                        ? 'border-red-500 focus:ring-red-600'
                        : 'border-slate-300 focus:ring-blue-600'
                    }`}
                  />
                  {fieldErrors.preferredDate && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {fieldErrors.preferredDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="brand-model"
                  className="block text-xs font-bold text-slate-900 mb-1.5"
                >
                  Бренд и модель устройства (минимум 3 символа) *
                </label>
                <input
                  id="brand-model"
                  type="text"
                  required
                  value={brandModel}
                  onBlur={() => handleFieldBlur('brandModel')}
                  onChange={(e) => {
                    setBrandModel(e.target.value);
                    if (fieldErrors.brandModel) {
                      setFieldErrors((prev) => ({ ...prev, brandModel: '' }));
                    }
                  }}
                  placeholder="Например: iPhone 15 Pro / ASUS ROG Zephyrus G16 / Samsung QE55S90C"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    fieldErrors.brandModel
                      ? 'border-red-500 focus:ring-red-600'
                      : 'border-slate-300 focus:ring-blue-600'
                  }`}
                />
                {fieldErrors.brandModel && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {fieldErrors.brandModel}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="issue-description"
                    className="block text-xs font-bold text-slate-900"
                  >
                    Описание поломки (минимум 10 символов) *
                  </label>
                  <span className="text-[11px] font-mono tabular-nums text-slate-500">
                    Символов: {issueDescription.trim().length}/500
                  </span>
                </div>
                <textarea
                  id="issue-description"
                  rows={3}
                  required
                  value={issueDescription}
                  onBlur={() => handleFieldBlur('issueDescription')}
                  onChange={(e) => {
                    setIssueDescription(e.target.value);
                    if (fieldErrors.issueDescription) {
                      setFieldErrors((prev) => ({ ...prev, issueDescription: '' }));
                    }
                  }}
                  placeholder="Опишите симптомы: не заряжается, разбит экран, полосы на матрице, выключается при нагрузке..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    fieldErrors.issueDescription
                      ? 'border-red-500 focus:ring-red-600'
                      : 'border-slate-300 focus:ring-blue-600'
                  }`}
                />
                {fieldErrors.issueDescription && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {fieldErrors.issueDescription}
                  </p>
                )}
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="mb-5 p-3.5 rounded-lg bg-red-50 border-2 border-red-300 flex items-center gap-2.5 text-xs sm:text-sm text-red-900 font-medium"
                >
                  <AlertTriangle
                    className="w-4 h-4 shrink-0 text-red-600"
                    aria-hidden="true"
                  />
                  <span>{errorMessage}</span>
                </div>
              )}

              {createdTicket && (
                <div
                  role="status"
                  className="mb-5 p-4 rounded-lg bg-emerald-50 border-2 border-emerald-300 text-xs sm:text-sm text-emerald-950"
                >
                  <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                    <span>
                      Заявка {createdTicket.id} успешно зарегистрирована в вашем кабинете!
                    </span>
                  </div>
                  <p className="text-emerald-800">
                    Устройство: <strong>{createdTicket.brandModel}</strong> (
                    {createdTicket.deviceType}). Перейдите во вкладку{' '}
                    <a
                      href="#client-cabinet"
                      className="underline font-bold hover:text-emerald-950"
                    >
                      «Мои заявки» ниже
                    </a>
                    , чтобы отслеживать статус ремонта.
                  </p>
                  {currentUser && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 text-xs text-emerald-900 font-medium">
                      Данные для входа в ваш личный кабинет: логин{' '}
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-emerald-300">
                        {currentUser.login}
                      </span>{' '}
                      (или телефон{' '}
                      <span className="font-mono font-bold">{currentUser.phone}</span>),
                      пароль:{' '}
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-emerald-300">
                        {currentUser.password}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-600">
                  Все поля проходят проверку формата перед сохранением в базу.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Отправить заявку</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
