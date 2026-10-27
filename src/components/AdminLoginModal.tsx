import React, { useState, useEffect } from 'react';
import {
  Lock,
  UserPlus,
  X,
  AlertCircle,
  KeyRound,
  ChevronDown,
  Users,
  ShieldCheck,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { RegisterUserInput, UserAccount } from '../types';
import {
  authenticateUser,
  formatPhoneMask,
  MASTER_ACCOUNTS,
  registerNewUser,
  validatePhoneStrict,
  validateNameStrict,
} from '../utils/repairStore';

interface AdminLoginModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  users: UserAccount[];
  onClose: () => void;
  onSuccessAuth: (user: UserAccount, updatedUsers?: UserAccount[]) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  initialTab = 'login',
  users,
  onClose,
  onSuccessAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [expandedRoleTab, setExpandedRoleTab] = useState<
    'clients' | 'admin' | 'masters' | null
  >(null);

  // Login form state
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLogin, setRegLogin] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError(null);
      setFieldErrors({});
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const regPhoneDigits = regPhone.replace(/\D/g, '').length;

  // All client accounts (newly registered clients shown first so they are immediately accessible)
  const clientAccounts = users
    .filter((u) => u.role === 'client')
    .slice()
    .sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
      const isNewA = numA > 105 ? 1 : 0;
      const isNewB = numB > 105 ? 1 : 0;
      if (isNewA !== isNewB) return isNewB - isNewA;
      return numA - numB;
    });

  const handleRegBlur = (field: string) => {
    const next = { ...fieldErrors };
    if (field === 'name') {
      const check = validateNameStrict(regName);
      if (!check.valid) next.name = check.error!;
      else delete next.name;
    }
    if (field === 'phone') {
      const check = validatePhoneStrict(regPhone);
      if (!check.valid) next.phone = check.error!;
      else delete next.phone;
    }
    if (field === 'login') {
      const trimmed = regLogin.trim();
      if (trimmed.length < 3 || trimmed.length > 24) {
        next.login = 'Логин должен содержать от 3 до 24 символов.';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        next.login = 'Используйте только латинские буквы, цифры, _ или -.';
      } else {
        delete next.login;
      }
    }
    if (field === 'password') {
      const trimmed = regPassword.trim();
      if (trimmed.length < 3 || trimmed.length > 32) {
        next.password = 'Пароль должен содержать от 3 до 32 символов.';
      } else {
        delete next.password;
      }
    }
    setFieldErrors(next);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = authenticateUser(users, login, password);
    if (!res.success || !res.user) {
      setError(res.error || 'Ошибка входа.');
      return;
    }
    setError(null);
    setLogin('');
    setPassword('');
    onSuccessAuth(res.user);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: RegisterUserInput = {
      name: regName,
      phone: regPhone,
      login: regLogin,
      password: regPassword,
    };
    const res = registerNewUser(users, payload);
    if (!res.success || !res.user || !res.updatedUsers) {
      setFieldErrors(res.fieldErrors || {});
      setError(res.error || 'Не удалось зарегистрировать пользователя.');
      return;
    }
    setError(null);
    setFieldErrors({});
    setRegName('');
    setRegPhone('');
    setRegLogin('');
    setRegPassword('');
    onSuccessAuth(res.user, res.updatedUsers);
  };

  const fillQuickLogin = (uLogin: string, uPass: string) => {
    setActiveTab('login');
    setLogin(uLogin);
    setPassword(uPass);
    setError(null);
  };

  const toggleRoleSection = (section: 'clients' | 'admin' | 'masters') => {
    setExpandedRoleTab((prev) => (prev === section ? null : section));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white border-2 border-slate-300 rounded-xl max-w-lg w-full p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              {activeTab === 'login' ? (
                <Lock className="w-4 h-4" aria-hidden="true" />
              ) : (
                <UserPlus className="w-4 h-4" aria-hidden="true" />
              )}
            </div>
            <div>
              <h2
                id="auth-modal-title"
                className="text-lg font-bold font-display text-slate-900"
              >
                {activeTab === 'login'
                  ? 'Вход в личный кабинет'
                  : 'Регистрация нового клиента'}
              </h2>
              <p className="text-xs text-slate-600">
                {activeTab === 'login'
                  ? 'Для клиентов и персонала сервисного центра'
                  : 'Создайте аккаунт для отслеживания своих заявок'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно авторизации"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div
          role="tablist"
          aria-label="Выбор режима входа или регистрации"
          className="grid grid-cols-2 gap-1 p-1 bg-slate-200 rounded-lg mb-5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'login'}
            onClick={() => {
              setActiveTab('login');
              setError(null);
              setFieldErrors({});
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Вход в аккаунт
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'register'}
            onClick={() => {
              setActiveTab('register');
              setError(null);
              setFieldErrors({});
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Регистрация клиента
          </button>
        </div>

        {activeTab === 'login' ? (
          <>
            {/* Expandable Demo Accounts Selector (Clients / Admin / Masters) */}
            <div className="mb-5 p-3.5 rounded-xl bg-slate-100 border border-slate-300 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                  <span>Быстрый вход для демо (выберите вкладку):</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Нажмите для автоподстановки
                </span>
              </div>

              {/* 3 Expandable Drawer Trigger Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleRoleSection('clients')}
                  aria-expanded={expandedRoleTab === 'clients'}
                  className={`flex items-center justify-between gap-1 px-2.5 py-2 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    expandedRoleTab === 'clients'
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-blue-500'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Клиенты ({clientAccounts.length})</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      expandedRoleTab === 'clients' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => toggleRoleSection('admin')}
                  aria-expanded={expandedRoleTab === 'admin'}
                  className={`flex items-center justify-between gap-1 px-2.5 py-2 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    expandedRoleTab === 'admin'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Админ</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      expandedRoleTab === 'admin' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => toggleRoleSection('masters')}
                  aria-expanded={expandedRoleTab === 'masters'}
                  className={`flex items-center justify-between gap-1 px-2.5 py-2 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    expandedRoleTab === 'masters'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-amber-500'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <Wrench className="w-3.5 h-3.5 shrink-0" />
                    <span>Мастера ({MASTER_ACCOUNTS.length})</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      expandedRoleTab === 'masters' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Drawer 1: Clients (includes all initial + newly registered users) */}
              {expandedRoleTab === 'clients' && (
                <div className="pt-2 border-t border-slate-200 space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                  <p className="text-[11px] font-medium text-slate-500">
                    Нажмите на клиента, чтобы подставить его логин и пароль (новые аккаунты после регистрации добавляются сюда автоматически):
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {clientAccounts.map((client) => {
                      const numId = parseInt(client.id.replace(/\D/g, ''), 10) || 0;
                      const isNewlyRegistered = numId > 105;
                      const isSelected =
                        login === client.login && password === client.password;
                      return (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() =>
                            fillQuickLogin(client.login, client.password)
                          }
                          className={`w-full px-3 py-2 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-slate-900'
                              : isNewlyRegistered
                              ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100/70 text-slate-900'
                              : 'bg-white border-slate-300 hover:border-blue-500 text-slate-800'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {client.name}
                              </span>
                              {isNewlyRegistered && (
                                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-600 text-white shrink-0">
                                  Новый
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono truncate">
                              {client.phone}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-[11px] text-blue-800">
                              {client.login} / {client.password}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Drawer 2: Administrator */}
              {expandedRoleTab === 'admin' && (
                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <p className="text-[11px] font-medium text-slate-500">
                    Полный доступ ко всем заказам, назначению мастеров и удалению заявок:
                  </p>
                  <button
                    type="button"
                    onClick={() => fillQuickLogin('1', '1')}
                    className={`w-full px-3 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      login === '1' && password === '1'
                        ? 'bg-blue-50 border-blue-600 text-slate-900'
                        : 'bg-white border-slate-300 hover:border-slate-700 text-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        Администратор CRM (Диспетчер СЦ)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Управление всеми заявками и нагрузкой инженеров
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs">
                        1 / 1
                      </span>
                      {login === '1' && password === '1' && (
                        <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                      )}
                    </div>
                  </button>
                </div>
              )}

              {/* Drawer 3: Masters */}
              {expandedRoleTab === 'masters' && (
                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <p className="text-[11px] font-medium text-slate-500">
                    Инженеры СЦ (видят только свои назначенные заявки, меняют статус и смету):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {MASTER_ACCOUNTS.map((masterAcc) => {
                      const isSelected =
                        login === masterAcc.login &&
                        password === masterAcc.password;
                      return (
                        <button
                          key={masterAcc.id}
                          type="button"
                          onClick={() =>
                            fillQuickLogin(masterAcc.login, masterAcc.password)
                          }
                          className={`px-2.5 py-2 text-left text-[11px] font-medium rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-amber-100 border-amber-600 text-slate-950'
                              : 'bg-amber-50/80 border-amber-300 hover:bg-amber-100 text-slate-900'
                          }`}
                        >
                          <span className="font-bold truncate">
                            {masterAcc.name}
                          </span>
                          <span className="font-mono font-bold text-amber-900 bg-white/90 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                            {masterAcc.login} / {masterAcc.password}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="admin-login-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Логин или номер телефона
                </label>
                <input
                  id="admin-login-input"
                  type="text"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Логин, телефон (+7...) или 1 для админа"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Пароль
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-300 flex items-center gap-2 text-xs text-red-800"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  Войти в систему
                </button>
              </div>
            </form>
          </>
        ) : (
          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Ваше имя и фамилия (только буквы) *
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={regName}
                onBlur={() => handleRegBlur('name')}
                onChange={(e) => {
                  setRegName(e.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                placeholder="Например: Павел Морозов"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 ${
                  fieldErrors.name
                    ? 'border-red-500 focus:ring-red-600'
                    : 'border-slate-300 focus:ring-blue-600'
                }`}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="reg-phone"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Номер телефона (11 цифр) *
                </label>
                <span
                  className={`text-[11px] font-mono tabular-nums font-semibold ${
                    regPhoneDigits === 11
                      ? 'text-emerald-700'
                      : regPhoneDigits > 11
                      ? 'text-red-600'
                      : 'text-slate-500'
                  }`}
                >
                  Цифр: {regPhoneDigits}/11
                </span>
              </div>
              <input
                id="reg-phone"
                type="tel"
                inputMode="tel"
                maxLength={18}
                required
                value={regPhone}
                onBlur={() => handleRegBlur('phone')}
                onChange={(e) => {
                  const masked = formatPhoneMask(e.target.value);
                  setRegPhone(masked);
                  if (fieldErrors.phone) {
                    setFieldErrors((prev) => ({ ...prev, phone: '' }));
                  }
                }}
                placeholder="+7 (___) ___-__-__"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 font-mono tabular-nums ${
                  fieldErrors.phone
                    ? 'border-red-500 focus:ring-red-600'
                    : 'border-slate-300 focus:ring-blue-600'
                }`}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="reg-login"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Придумайте логин (лат.) *
                </label>
                <input
                  id="reg-login"
                  type="text"
                  required
                  value={regLogin}
                  onBlur={() => handleRegBlur('login')}
                  onChange={(e) => {
                    setRegLogin(e.target.value);
                    if (fieldErrors.login) {
                      setFieldErrors((prev) => ({ ...prev, login: '' }));
                    }
                  }}
                  placeholder="pavel_m"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 font-mono ${
                    fieldErrors.login
                      ? 'border-red-500 focus:ring-red-600'
                      : 'border-slate-300 focus:ring-blue-600'
                  }`}
                />
                {fieldErrors.login && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">
                    {fieldErrors.login}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Пароль (мин. 3 симв.) *
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  value={regPassword}
                  onBlur={() => handleRegBlur('password')}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  placeholder="••••••"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 font-mono ${
                    fieldErrors.password
                      ? 'border-red-500 focus:ring-red-600'
                      : 'border-slate-300 focus:ring-blue-600'
                  }`}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-300 flex items-center gap-2 text-xs text-red-800"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
