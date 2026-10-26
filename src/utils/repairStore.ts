import type {
  AdminUpdateTicketInput,
  DeviceType,
  MasterProfile,
  MasterWorkloadItem,
  NewClientReviewInput,
  NewTicketInput,
  RegisterUserInput,
  RepairTicket,
  ReviewItem,
  ServiceItem,
  TicketStatus,
  UserAccount,
} from '../types.ts';

export const STORAGE_KEY = 'kvant_service_repair_tickets_v3';
export const USERS_STORAGE_KEY = 'kvant_service_users_v3';
export const SESSION_STORAGE_KEY = 'kvant_service_current_user_v3';
export const REVIEWS_STORAGE_KEY = 'kvant_service_reviews_v3';

export const TICKET_STATUSES: TicketStatus[] = [
  'Новая',
  'Ожидает Мастера',
  'На диагностике',
  'Принята',
  'В работе',
  'Ожидает запчастей',
  'Готова',
  'Выдана',
  'Отменен',
];

export const ACTIVE_MASTER_STATUSES: TicketStatus[] = [
  'На диагностике',
  'Принята',
  'В работе',
  'Ожидает запчастей',
];

export const DEVICE_TYPES: DeviceType[] = [
  'Смартфон',
  'Ноутбук',
  'Телевизор / Монитор',
  'Планшет',
  'Игровая консоль',
  'Компьютер / Моноблок',
  'Аудиотехника',
];

export const MASTER_PROFILES: MasterProfile[] = [
  {
    name: 'Алексей Соколов',
    specialization: 'Смартфоны, планшеты и микропайка BGA',
    maxCapacity: 3,
  },
  {
    name: 'Михаил Волков',
    specialization: 'Ноутбуки, MacBook и материнские платы',
    maxCapacity: 3,
  },
  {
    name: 'Сергей Ковалёв',
    specialization: 'Телевизоры OLED/QLED и мониторы',
    maxCapacity: 3,
  },
  {
    name: 'Дмитрий Морозов',
    specialization: 'Игровые консоли, ПК и видеокарты',
    maxCapacity: 3,
  },
];

export const MASTERS_LIST: string[] = [
  'Не назначен',
  ...MASTER_PROFILES.map((m) => m.name),
];

export const ADMIN_ACCOUNT: UserAccount = {
  id: 'admin-root',
  login: '1',
  password: '1',
  name: 'Администратор СЦ',
  phone: '+7 (495) 128-44-00',
  role: 'admin',
  createdAt: '2026-01-01 09:00',
};

export const MASTER_ACCOUNTS: UserAccount[] = [
  {
    id: 'mst-1',
    login: 'sokolov',
    password: '123',
    name: 'Алексей Соколов',
    phone: '+7 (495) 128-44-01',
    role: 'master',
    createdAt: '2026-01-10 09:00',
  },
  {
    id: 'mst-2',
    login: 'volkov',
    password: '123',
    name: 'Михаил Волков',
    phone: '+7 (495) 128-44-02',
    role: 'master',
    createdAt: '2026-01-10 09:00',
  },
  {
    id: 'mst-3',
    login: 'kovalev',
    password: '123',
    name: 'Сергей Ковалёв',
    phone: '+7 (495) 128-44-03',
    role: 'master',
    createdAt: '2026-01-10 09:00',
  },
  {
    id: 'mst-4',
    login: 'morozov',
    password: '123',
    name: 'Дмитрий Морозов',
    phone: '+7 (495) 128-44-04',
    role: 'master',
    createdAt: '2026-01-10 09:00',
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-101',
    login: 'alex',
    password: '123',
    name: 'Александр Воронов',
    phone: '+7 (916) 482-19-04',
    role: 'client',
    createdAt: '2026-10-10 10:00',
  },
  {
    id: 'usr-102',
    login: 'kate',
    password: '123',
    name: 'Екатерина Смирнова',
    phone: '+7 (925) 731-84-22',
    role: 'client',
    createdAt: '2026-10-12 14:30',
  },
  {
    id: 'usr-103',
    login: 'igor',
    password: '123',
    name: 'Игорь Демидов',
    phone: '+7 (903) 519-60-11',
    role: 'client',
    createdAt: '2026-10-14 11:15',
  },
  {
    id: 'usr-104',
    login: 'marina',
    password: '123',
    name: 'Марина Белова',
    phone: '+7 (915) 204-88-19',
    role: 'client',
    createdAt: '2026-10-15 09:20',
  },
  {
    id: 'usr-105',
    login: 'artem',
    password: '123',
    name: 'Артем Захаров',
    phone: '+7 (926) 612-33-90',
    role: 'client',
    createdAt: '2026-10-16 12:10',
  },
];

export const INITIAL_TICKETS: RepairTicket[] = [
  {
    id: 'KV-2041',
    userId: 'usr-101',
    createdAt: '2026-10-19 09:40',
    clientName: 'Александр Воронов',
    clientPhone: '+7 (916) 482-19-04',
    deviceType: 'Ноутбук',
    brandModel: 'Apple MacBook Pro 16 M3 Max',
    issueDescription:
      'После скачка напряжения не включается, отсутствует индикация MagSafe 3, требуется диагностика цепи питания материнской платы.',
    preferredDate: '2026-10-19',
    status: 'Новая',
    master: 'Не назначен',
    expectedReadyDate: '',
    finalPrice: null,
  },
  {
    id: 'KV-2040',
    userId: 'usr-102',
    createdAt: '2026-10-18 16:15',
    clientName: 'Екатерина Смирнова',
    clientPhone: '+7 (925) 731-84-22',
    deviceType: 'Смартфон',
    brandModel: 'iPhone 15 Pro Max 256GB',
    issueDescription:
      'Разбито стекло дисплейного модуля после падения на плитку, матрица OLED и Face ID работают штатно.',
    preferredDate: '2026-10-18',
    status: 'В работе',
    master: 'Алексей Соколов',
    expectedReadyDate: '2026-10-20',
    finalPrice: 14900,
  },
  {
    id: 'KV-2039',
    userId: 'usr-103',
    createdAt: '2026-10-18 14:20',
    clientName: 'Игорь Демидов',
    clientPhone: '+7 (903) 519-60-11',
    deviceType: 'Телевизор / Монитор',
    brandModel: 'LG OLED65C3RLA',
    issueDescription:
      'Отключается через 15 минут работы, мигает индикатор дежурного режима 3 раза. Подозрение на блок питания PSU.',
    preferredDate: '2026-10-18',
    status: 'Ожидает запчастей',
    master: 'Сергей Ковалёв',
    expectedReadyDate: '2026-10-22',
    finalPrice: 11500,
  },
  {
    id: 'KV-2038',
    userId: 'usr-101',
    createdAt: '2026-10-17 17:05',
    clientName: 'Александр Воронов',
    clientPhone: '+7 (916) 482-19-04',
    deviceType: 'Игровая консоль',
    brandModel: 'Sony PlayStation 5 Slim',
    issueDescription:
      'Перегрев в ресурсоемких играх, сильный шум турбины, расшатан разъем HDMI 2.1 на плате.',
    preferredDate: '2026-10-17',
    status: 'Готова',
    master: 'Дмитрий Морозов',
    expectedReadyDate: '2026-10-19',
    finalPrice: 6800,
  },
  {
    id: 'KV-2037',
    userId: 'usr-104',
    createdAt: '2026-10-17 13:50',
    clientName: 'Марина Белова',
    clientPhone: '+7 (915) 204-88-19',
    deviceType: 'Планшет',
    brandModel: 'Apple iPad Pro 12.9 M2',
    issueDescription:
      'Не заряжается через порт Thunderbolt / USB-C, потребление на лабораторном блоке 5V 0.05A.',
    preferredDate: '2026-10-17',
    status: 'На диагностике',
    master: 'Алексей Соколов',
    expectedReadyDate: '2026-10-20',
    finalPrice: null,
  },
  {
    id: 'KV-2036',
    userId: 'usr-105',
    createdAt: '2026-10-17 11:10',
    clientName: 'Артем Захаров',
    clientPhone: '+7 (926) 612-33-90',
    deviceType: 'Ноутбук',
    brandModel: 'ASUS ROG Zephyrus G16 GU605',
    issueDescription:
      'Артефакты изображения при переключении на дискретную видеокарту RTX 4070, перегрев зоны VRM.',
    preferredDate: '2026-10-17',
    status: 'В работе',
    master: 'Михаил Волков',
    expectedReadyDate: '2026-10-21',
    finalPrice: 12400,
  },
  {
    id: 'KV-2035',
    userId: 'usr-101',
    createdAt: '2026-10-16 15:30',
    clientName: 'Александр Воронов',
    clientPhone: '+7 (916) 482-19-04',
    deviceType: 'Смартфон',
    brandModel: 'Samsung Galaxy S24 Ultra 512GB',
    issueDescription:
      'Попадание влаги в разговорный динамик и отказ модуля автофокуса основной камеры 200 МП.',
    preferredDate: '2026-10-16',
    status: 'Выдана',
    master: 'Алексей Соколов',
    expectedReadyDate: '2026-10-18',
    finalPrice: 8900,
  },
  {
    id: 'KV-2034',
    userId: 'usr-102',
    createdAt: '2026-10-16 10:45',
    clientName: 'Екатерина Смирнова',
    clientPhone: '+7 (925) 731-84-22',
    deviceType: 'Ноутбук',
    brandModel: 'Lenovo ThinkPad X1 Carbon Gen 11',
    issueDescription:
      'Залита клавиатура кофе, залипает нижний ряд клавиш, требуется ультразвуковая чистка платы и замена топкейса.',
    preferredDate: '2026-10-16',
    status: 'Принята',
    master: 'Михаил Волков',
    expectedReadyDate: '2026-10-20',
    finalPrice: 9200,
  },
  {
    id: 'KV-2033',
    userId: 'usr-104',
    createdAt: '2026-10-15 18:00',
    clientName: 'Марина Белова',
    clientPhone: '+7 (915) 204-88-19',
    deviceType: 'Смартфон',
    brandModel: 'Xiaomi 14 Ultra 16/512GB',
    issueDescription:
      'Быстрая разрядка аккумулятора за 3 часа, нагрев корпуса в режиме ожидания, диагностика контроллера питания.',
    preferredDate: '2026-10-16',
    status: 'Принята',
    master: 'Алексей Соколов',
    expectedReadyDate: '2026-10-19',
    finalPrice: 5400,
  },
  {
    id: 'KV-2032',
    userId: 'usr-105',
    createdAt: '2026-10-14 12:15',
    clientName: 'Артем Захаров',
    clientPhone: '+7 (926) 612-33-90',
    deviceType: 'Компьютер / Моноблок',
    brandModel: 'Apple iMac 24 M3',
    issueDescription:
      'Клиент оформил заявку на замену стекла, но решил отложить ремонт до следующей недели.',
    preferredDate: '2026-10-15',
    status: 'Отменен',
    master: 'Не назначен',
    expectedReadyDate: '',
    finalPrice: 0,
  },
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'srv-smartphones',
    index: '01',
    title: 'Ремонт смартфонов и планшетов',
    deviceType: 'Смартфон',
    turnaround: 'от 45 минут',
    warranty: 'Гарантия 12 мес.',
    priceFrom: 2400,
    description:
      'Замена оригинальных OLED-матриц, переклейка стекол в беспылевой камере, восстановление цепи питания и контроллеров заряда U2/Tristar.',
    commonIssues: [
      'Замена дисплейного модуля / стекла — от 3 900 руб.',
      'Замена аккумулятора с сохранением емкости 100% — от 2 400 руб.',
      'Восстановление после попадания влаги (УЗ-ванна + пайка) — от 3 500 руб.',
      'Ремонт Face ID / аудиокодека / модема — от 4 800 руб.',
    ],
  },
  {
    id: 'srv-laptops',
    index: '02',
    title: 'Компонентный ремонт ноутбуков и MacBook',
    deviceType: 'Ноутбук',
    turnaround: 'от 2 часов',
    warranty: 'Гарантия 12 мес.',
    priceFrom: 3200,
    description:
      'BGA-пайка видеочипов и хабов на инфракрасной станции, ремонт цепей питания материнских плат, замена матриц и клавиатур.',
    commonIssues: [
      'Ремонт цепи питания материнской платы — от 4 900 руб.',
      'Профилактика системы охлаждения с заменой фазового перехода — 3 200 руб.',
      'Замена матрицы Retina / IPS 120–240 Гц — от 7 500 руб.',
      'BGA-реболлинг видеочипа / замена мультиконтроллера — от 6 500 руб.',
    ],
  },
  {
    id: 'srv-tv-monitors',
    index: '03',
    title: 'Ремонт телевизоров и профессиональных мониторов',
    deviceType: 'Телевизор / Монитор',
    turnaround: 'от 1 дня',
    warranty: 'Гарантия 12 мес.',
    priceFrom: 3800,
    description:
      'Полная замена светодиодной подсветки с доработкой тока драйвера, компонентный ремонт блоков питания и плат T-Con / MainBoard.',
    commonIssues: [
      'Полная замена комплекта LED-подсветки — от 4 200 руб.',
      'Ремонт импульсного блока питания (PSU) — от 3 800 руб.',
      'Восстановление платы управления MainBoard / прошивка NAND — от 4 500 руб.',
      'Ремонт контроллера матрицы T-Con — от 3 900 руб.',
    ],
  },
  {
    id: 'srv-consoles',
    index: '04',
    title: 'Ремонт игровых консолей и рабочих станций',
    deviceType: 'Игровая консоль',
    turnaround: 'от 1 часа',
    warranty: 'Гарантия 12 мес.',
    priceFrom: 2800,
    description:
      'Замена портов HDMI 2.1 под микроскопом, обслуживание жидкого металла в PlayStation 5, установка потенциометров с датчиками Холла.',
    commonIssues: [
      'Замена порта HDMI 2.1 + ретаймера — 4 200 руб.',
      'Чистка и замена жидкого металла Thermal Grizzly — 3 400 руб.',
      'Установка 3D-аналогов с датчиками Холла (DualSense / Xbox) — 2 800 руб.',
      'Ремонт встроенного блока питания консоли — от 4 600 руб.',
    ],
  },
];

export const CLIENT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Андрей Колесников',
    authorRole: 'Главный архитектор, Бюро «Форма»',
    companyOrDevice: 'MacBook Pro 16" M2 Max',
    ticketRef: 'KV-1984',
    beforeState:
      'Ноутбук перестал включаться за сутки до сдачи рабочей документации; в авторизованном сервисе предложили замену всей платы за 84 000 руб. и ожидание 3 недели.',
    actionTaken:
      'Инженер Алексей Соколов под микроскопом выявил пробитый танталовый конденсатор в линии PPBUS_AON и заменил контроллер питания CD3217.',
    outcome:
      'Ноутбук полностью восстановлен за 5 часов со всеми данными на SSD.',
    turnaroundHours: 5,
    pricePaid: 9500,
    rating: 5,
    createdAt: '2026-10-12',
  },
  {
    id: 'rev-2',
    authorName: 'Ольга Ветрова',
    authorRole: 'Коммерческий директор, «ЛогистикПро»',
    companyOrDevice: 'iPhone 15 Pro 512GB',
    ticketRef: 'KV-2012',
    beforeState:
      'После падения на асфальт экран перестал реагировать в нижней трети и появились зеленые полосы.',
    actionTaken:
      'Установлен оригинальный дисплейный модуль с переносом заводской микросхемы IC для сохранения True Tone и автояркости без ошибок в настройках.',
    outcome:
      'Экран откалиброван за 1 час 15 минут, в личном кабинете сразу отобразился статус готовности и финальная смета.',
    turnaroundHours: 1.5,
    pricePaid: 13800,
    rating: 5,
    createdAt: '2026-10-14',
  },
  {
    id: 'rev-3',
    authorName: 'Денис Сафонов',
    authorRole: 'Руководитель видеопродакшна, Studio 4K',
    companyOrDevice: 'Монитор LG UltraFine 32EP950 OLED',
    ticketRef: 'KV-2029',
    beforeState:
      'Референсный монитор цветокоррекции перестал подавать питание по линии USB-C Power Delivery и периодически гас.',
    actionTaken:
      'Выполнен компонентный ремонт силовой части и контроллера портов на главной плате без замены матрицы.',
    outcome:
      'Возвращен в студию на следующий день с протоколом калибровки и гарантией 12 месяцев.',
    turnaroundHours: 18,
    pricePaid: 11200,
    rating: 5,
    createdAt: '2026-10-15',
  },
  {
    id: 'rev-4',
    authorName: 'Виктор Громов',
    authorRole: 'Киберспортсмен и стример',
    companyOrDevice: 'Sony PlayStation 5 Digital Edition',
    ticketRef: 'KV-2021',
    beforeState:
      'Консоль выключалась через 20 минут игры в 4K 120Hz, кулер работал на максимальных оборотах.',
    actionTaken:
      'Инженер Дмитрий Морозов устранил сухое пятно жидкого металла на кристалле APU и заменил термопрокладки памяти.',
    outcome:
      'Консоль работает бесшумно, температура в нагрузке снизилась на 19 градусов.',
    turnaroundHours: 3,
    pricePaid: 4900,
    rating: 5,
    createdAt: '2026-10-16',
  },
  {
    id: 'rev-5',
    authorName: 'Елена Кузьмина',
    authorRole: 'Врач-стоматолог',
    companyOrDevice: 'Samsung Galaxy S23 Ultra',
    ticketRef: 'KV-2025',
    beforeState:
      'После попадания воды перестал работать сенсор стилуса S-Pen и беспроводная зарядка.',
    actionTaken:
      'Проведена уз-чистка платы в изопропаноле, восстановлен шлейф индукционной катушки и разъем дигитайзера.',
    outcome:
      'Все функции смартфона и водозащита корпуса по стандарту IP68 полностью восстановлены.',
    turnaroundHours: 4,
    pricePaid: 6200,
    rating: 5,
    createdAt: '2026-10-17',
  },
];

export const formatTimestamp = (date: Date = new Date()): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

export const formatPhoneMask = (rawValue: string): string => {
  const digits = rawValue.replace(/\D/g, '');
  if (digits.length === 0) {
    return '';
  }

  let normalized = digits;
  if (
    normalized.length === 12 &&
    normalized.startsWith('7') &&
    (normalized[1] === '7' || normalized[1] === '8')
  ) {
    normalized = '7' + normalized.slice(2);
  } else if (normalized[0] === '8') {
    normalized = '7' + normalized.slice(1);
  } else if (normalized[0] !== '7') {
    normalized = '7' + normalized;
  }

  const limited = normalized.slice(0, 11);
  const subscriber = limited.slice(1);

  if (subscriber.length === 0) {
    return '+7';
  }
  if (subscriber.length <= 3) {
    return `+7 (${subscriber}`;
  }
  if (subscriber.length <= 6) {
    return `+7 (${subscriber.slice(0, 3)}) ${subscriber.slice(3)}`;
  }
  if (subscriber.length <= 8) {
    return `+7 (${subscriber.slice(0, 3)}) ${subscriber.slice(3, 6)}-${subscriber.slice(6)}`;
  }
  return `+7 (${subscriber.slice(0, 3)}) ${subscriber.slice(3, 6)}-${subscriber.slice(6, 8)}-${subscriber.slice(8, 10)}`;
};

export const validatePhoneStrict = (
  phone: string
): { valid: boolean; error?: string; digitsCount: number } => {
  const trimmed = phone.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Укажите номер телефона.',
      digitsCount: 0,
    };
  }
  if (/[a-zA-Zа-яА-ЯёЁ]/.test(trimmed)) {
    return {
      valid: false,
      error: 'Некорректный номер: телефон не должен содержать буквы.',
      digitsCount: trimmed.replace(/\D/g, '').length,
    };
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 11) {
    return {
      valid: false,
      error: `Некорректный номер телефона: слишком мало цифр (${digits.length} из 11). Введите полный номер, например: +7 (999) 123-45-67.`,
      digitsCount: digits.length,
    };
  }
  if (digits.length > 11) {
    return {
      valid: false,
      error: `Некорректный номер телефона: слишком много цифр (${digits.length}, должно быть ровно 11). Проверьте правильность ввода.`,
      digitsCount: digits.length,
    };
  }
  if (!digits.startsWith('7') && !digits.startsWith('8')) {
    return {
      valid: false,
      error: 'Некорректный номер телефона: номер РФ должен начинаться с +7 или 8.',
      digitsCount: digits.length,
    };
  }
  return { valid: true, digitsCount: digits.length };
};

export const validateNameStrict = (
  name: string
): { valid: boolean; error?: string } => {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return {
      valid: false,
      error: 'Некорректное имя: введите минимум 2 символа.',
    };
  }
  if (trimmed.length > 60) {
    return {
      valid: false,
      error: 'Некорректное имя: превышена максимальная длина (60 символов).',
    };
  }
  if (/\d/.test(trimmed)) {
    return {
      valid: false,
      error: 'Некорректное имя: в имени не должно быть цифр.',
    };
  }
  if (!/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Некорректное имя: используйте только буквы, пробел или дефис.',
    };
  }
  return { valid: true };
};

export const validateAdminCredentials = (
  login: string,
  password: string
): boolean => {
  return login.trim() === '1' && password.trim() === '1';
};

export const authenticateUser = (
  users: UserAccount[],
  login: string,
  password: string
): { success: boolean; user?: UserAccount; error?: string } => {
  const trimmedLogin = login.trim();
  const trimmedPassword = password.trim();

  if (!trimmedLogin) {
    return { success: false, error: 'Пожалуйста, введите логин.' };
  }
  if (!trimmedPassword) {
    return { success: false, error: 'Пожалуйста, введите пароль.' };
  }

  if (validateAdminCredentials(trimmedLogin, trimmedPassword)) {
    return { success: true, user: ADMIN_ACCOUNT };
  }

  const foundMaster = MASTER_ACCOUNTS.find(
    (m) =>
      m.login.toLowerCase() === trimmedLogin.toLowerCase() &&
      m.password === trimmedPassword
  );
  if (foundMaster) {
    return { success: true, user: foundMaster };
  }

  const rawDigits = trimmedLogin.replace(/\D/g, '');
  const normalizedPhoneDigits =
    rawDigits.length === 11 && rawDigits.startsWith('8')
      ? '7' + rawDigits.slice(1)
      : rawDigits;

  const found = users.find((u) => {
    const userPhoneDigits = u.phone.replace(/\D/g, '');
    const normalizedUserPhone =
      userPhoneDigits.length === 11 && userPhoneDigits.startsWith('8')
        ? '7' + userPhoneDigits.slice(1)
        : userPhoneDigits;
    const isLoginMatch = u.login.toLowerCase() === trimmedLogin.toLowerCase();
    const isPhoneMatch =
      normalizedPhoneDigits.length === 11 &&
      normalizedUserPhone === normalizedPhoneDigits;
    return (isLoginMatch || isPhoneMatch) && u.password === trimmedPassword;
  });

  if (!found) {
    return {
      success: false,
      error:
        'Неверный логин (или телефон) либо пароль. Проверьте введенные данные или зарегистрируйтесь.',
    };
  }

  return { success: true, user: found };
};

export const registerNewUser = (
  existingUsers: UserAccount[],
  input: RegisterUserInput,
  now: Date = new Date()
): {
  success: boolean;
  user?: UserAccount;
  updatedUsers?: UserAccount[];
  error?: string;
  fieldErrors?: Record<string, string>;
} => {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const login = input.login.trim();
  const password = input.password.trim();

  const fieldErrors: Record<string, string> = {};

  const nameCheck = validateNameStrict(name);
  if (!nameCheck.valid) {
    fieldErrors.name = nameCheck.error!;
  }

  const phoneCheck = validatePhoneStrict(phone);
  if (!phoneCheck.valid) {
    fieldErrors.phone = phoneCheck.error!;
  } else {
    const inputPhoneDigits = phone.replace(/\D/g, '');
    const normalizedInputPhone =
      inputPhoneDigits.startsWith('8')
        ? '7' + inputPhoneDigits.slice(1)
        : inputPhoneDigits;
    const existingPhoneUser = existingUsers.find((u) => {
      const d = u.phone.replace(/\D/g, '');
      const norm = d.startsWith('8') ? '7' + d.slice(1) : d;
      return norm === normalizedInputPhone;
    });
    if (existingPhoneUser) {
      fieldErrors.phone = `Этот номер уже зарегистрирован (логин: ${existingPhoneUser.login}). Перейдите на вкладку «Вход».`;
    }
  }

  if (login.length < 3 || login.length > 24) {
    fieldErrors.login =
      'Некорректный логин: длина должна быть от 3 до 24 символов.';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(login)) {
    fieldErrors.login =
      'Некорректный логин: используйте только латинские буквы, цифры, _ или -.';
  } else if (
    login === '1' ||
    MASTER_ACCOUNTS.some((m) => m.login.toLowerCase() === login.toLowerCase())
  ) {
    fieldErrors.login = 'Этот логин зарезервирован системой.';
  } else if (
    existingUsers.some((u) => u.login.toLowerCase() === login.toLowerCase())
  ) {
    fieldErrors.login = 'Пользователь с таким логином уже зарегистрирован.';
  }

  if (password.length < 3 || password.length > 32) {
    fieldErrors.password =
      'Некорректный пароль: длина должна быть от 3 до 32 символов.';
  }

  const firstError = Object.values(fieldErrors)[0];
  if (firstError) {
    return { success: false, error: firstError, fieldErrors };
  }

  const nextIdNum = existingUsers.reduce((max, u) => {
    const match = u.id.match(/usr-(\d+)/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 105);

  const newUser: UserAccount = {
    id: `usr-${nextIdNum + 1}`,
    login,
    password,
    name,
    phone,
    role: 'client',
    createdAt: formatTimestamp(now),
  };

  const updatedUsers = [...existingUsers, newUser];
  return { success: true, user: newUser, updatedUsers };
};

export const validateNewTicketInput = (
  input: NewTicketInput
): {
  valid: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
} => {
  const fieldErrors: Record<string, string> = {};

  if (!input.userId) {
    return {
      valid: false,
      error: 'Для отправки заявки необходимо войти в аккаунт или зарегистрироваться.',
    };
  }

  const nameCheck = validateNameStrict(input.clientName || '');
  if (!nameCheck.valid) {
    fieldErrors.clientName = nameCheck.error!;
  }

  const phoneCheck = validatePhoneStrict(input.clientPhone || '');
  if (!phoneCheck.valid) {
    fieldErrors.clientPhone = phoneCheck.error!;
  }

  const brand = (input.brandModel || '').trim();
  if (brand.length < 3) {
    fieldErrors.brandModel =
      'Некорректная модель: укажите бренд и модель устройства (минимум 3 символа).';
  } else if (brand.length > 80) {
    fieldErrors.brandModel =
      'Некорректная модель: описание модели не должно превышать 80 символов.';
  } else if (/^\d+$/.test(brand)) {
    fieldErrors.brandModel =
      'Некорректная модель: название устройства не может состоять только из цифр.';
  }

  const desc = (input.issueDescription || '').trim();
  if (desc.length < 10) {
    fieldErrors.issueDescription = `Опишите поломку подробнее: минимум 10 символов (сейчас введено: ${desc.length}).`;
  } else if (desc.length > 500) {
    fieldErrors.issueDescription =
      'Описание поломки слишком длинное (максимум 500 символов).';
  }

  if (!input.preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.preferredDate)) {
    fieldErrors.preferredDate = 'Некорректная дата: выберите желаемую дату сдачи в ремонт.';
  } else if (input.preferredDate < '2026-01-01' || input.preferredDate > '2027-12-31') {
    fieldErrors.preferredDate =
      'Некорректная дата: выберите дату в пределах 2026–2027 гг.';
  }

  const firstError = Object.values(fieldErrors)[0];
  if (firstError) {
    return { valid: false, error: firstError, fieldErrors };
  }

  return { valid: true, fieldErrors: {} };
};

export const generateNextTicketId = (existingTickets: RepairTicket[]): string => {
  const maxNum = existingTickets.reduce((max, t) => {
    const match = t.id.match(/KV-(\d+)/);
    if (!match) return max;
    const parsed = parseInt(match[1], 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 2041);
  return `KV-${maxNum + 1}`;
};

export const createTicketRecord = (
  existingTickets: RepairTicket[],
  input: NewTicketInput,
  now: Date = new Date()
): RepairTicket => {
  return {
    id: generateNextTicketId(existingTickets),
    userId: input.userId,
    createdAt: formatTimestamp(now),
    clientName: input.clientName.trim(),
    clientPhone: input.clientPhone.trim(),
    deviceType: input.deviceType,
    brandModel: input.brandModel.trim(),
    issueDescription: input.issueDescription.trim(),
    preferredDate: input.preferredDate,
    status: 'Новая',
    master: 'Не назначен',
    expectedReadyDate: '',
    finalPrice: null,
  };
};

export const getUserTickets = (
  tickets: RepairTicket[],
  userId: string
): RepairTicket[] => {
  return tickets.filter((t) => t.userId === userId);
};

export const getMasterTickets = (
  tickets: RepairTicket[],
  masterName: string
): RepairTicket[] => {
  return tickets.filter((t) => t.master === masterName);
};

export const computeMastersWorkload = (
  tickets: RepairTicket[]
): MasterWorkloadItem[] => {
  return MASTER_PROFILES.map((profile) => {
    const activeTickets = tickets.filter(
      (t) =>
        t.master === profile.name && ACTIVE_MASTER_STATUSES.includes(t.status)
    );
    const completedTickets = tickets.filter(
      (t) =>
        t.master === profile.name &&
        (t.status === 'Готова' || t.status === 'Выдана')
    );

    const activeCount = activeTickets.length;
    const loadPercentage = Math.min(
      100,
      Math.round((activeCount / profile.maxCapacity) * 100)
    );

    let statusLabel: MasterWorkloadItem['statusLabel'] = 'Свободен';
    if (activeCount >= profile.maxCapacity) {
      statusLabel = 'Перегружен (Занято всё)';
    } else if (activeCount === profile.maxCapacity - 1) {
      statusLabel = 'Высокая загрузка';
    } else if (activeCount > 0) {
      statusLabel = 'Оптимальная нагрузка';
    }

    return {
      ...profile,
      activeCount,
      completedCount: completedTickets.length,
      activeTicketIds: activeTickets.map((t) => t.id),
      loadPercentage,
      statusLabel,
    };
  });
};

export const applyAdminUpdate = (
  tickets: RepairTicket[],
  ticketId: string,
  update: AdminUpdateTicketInput,
  now: Date = new Date()
): RepairTicket[] => {
  const effectiveMaster =
    update.status === 'Ожидает Мастера' ? 'Не назначен' : update.master;
  return tickets.map((ticket) => {
    if (ticket.id !== ticketId) return ticket;
    const didStatusChange = ticket.status !== update.status;
    return {
      ...ticket,
      status: update.status,
      master: effectiveMaster,
      expectedReadyDate: update.expectedReadyDate,
      finalPrice: update.finalPrice,
      hasUnreadStatusChange: didStatusChange
        ? true
        : Boolean(ticket.hasUnreadStatusChange),
      previousStatus: didStatusChange ? ticket.status : ticket.previousStatus,
      statusChangedAt: didStatusChange
        ? formatTimestamp(now)
        : ticket.statusChangedAt,
    };
  });
};

export const getUnreadStatusChangedTickets = (
  tickets: RepairTicket[],
  userId: string
): RepairTicket[] => {
  if (!userId) return [];
  return tickets.filter(
    (t) => t.userId === userId && Boolean(t.hasUnreadStatusChange)
  );
};

export const markTicketNotificationRead = (
  tickets: RepairTicket[],
  ticketId: string
): RepairTicket[] => {
  return tickets.map((ticket) =>
    ticket.id === ticketId
      ? {
          ...ticket,
          hasUnreadStatusChange: false,
        }
      : ticket
  );
};

export const markAllUserTicketNotificationsRead = (
  tickets: RepairTicket[],
  userId: string
): RepairTicket[] => {
  if (!userId) return tickets;
  return tickets.map((ticket) =>
    ticket.userId === userId && ticket.hasUnreadStatusChange
      ? {
          ...ticket,
          hasUnreadStatusChange: false,
        }
      : ticket
  );
};

export const deleteTicketRecord = (
  tickets: RepairTicket[],
  ticketId: string
): RepairTicket[] => {
  return tickets.filter((ticket) => ticket.id !== ticketId);
};

export const cancelClientTicket = (
  tickets: RepairTicket[],
  ticketId: string,
  userId: string
): RepairTicket[] => {
  return tickets.map((ticket) => {
    if (
      ticket.id === ticketId &&
      ticket.userId === userId &&
      (ticket.status === 'Новая' || ticket.status === 'Ожидает Мастера')
    ) {
      return {
        ...ticket,
        status: 'Отменен',
        master: 'Не назначен',
        hasUnreadStatusChange: false,
      };
    }
    return ticket;
  });
};

export const validateClientReviewInput = (
  input: NewClientReviewInput
): { valid: boolean; error?: string } => {
  const comment = input.comment.trim();
  if (!input.ticketId) {
    return { valid: false, error: 'Не указан номер завершенной заявки.' };
  }
  if (input.rating < 1 || input.rating > 5) {
    return { valid: false, error: 'Выберите оценку от 1 до 5 звезд.' };
  }
  if (comment.length < 10) {
    return {
      valid: false,
      error: `Текст отзыва слишком короткий (минимум 10 символов, сейчас: ${comment.length}).`,
    };
  }
  if (comment.length > 500) {
    return {
      valid: false,
      error: 'Текст отзыва не должен превышать 500 символов.',
    };
  }
  return { valid: true };
};

export const createClientReviewRecord = (
  ticket: RepairTicket,
  input: NewClientReviewInput,
  now: Date = new Date()
): ReviewItem => {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  return {
    id: `rev-user-${ticket.id}-${now.getTime()}`,
    authorName: input.authorName.trim() || ticket.clientName,
    authorRole: input.authorRole.trim() || 'Клиент сервисного центра (Подтвержденный заказ)',
    companyOrDevice: `${ticket.brandModel} (${ticket.deviceType})`,
    ticketRef: ticket.id,
    beforeState: ticket.issueDescription,
    actionTaken:
      ticket.master !== 'Не назначен'
        ? `Работы и выходной контроль выполнены инженером: ${ticket.master}. Статус заказа: Выдана клиенту.`
        : 'Выполнен полный цикл компонентного ремонта и диагностики в СЦ «КВАНТ Сервис».',
    outcome: input.comment.trim(),
    turnaroundHours: 4,
    pricePaid: ticket.finalPrice ?? 4500,
    rating: input.rating,
    createdAt: `${yyyy}-${mm}-${dd}`,
  };
};

export interface DashboardMetrics {
  total: number;
  newCount: number;
  waitingMasterCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  totalRevenue: number;
}

export const computeDashboardMetrics = (
  tickets: RepairTicket[]
): DashboardMetrics => {
  const total = tickets.length;
  const newCount = tickets.filter((t) => t.status === 'Новая').length;
  const waitingMasterCount = tickets.filter(
    (t) => t.status === 'Ожидает Мастера'
  ).length;
  const inProgressCount = tickets.filter(
    (t) =>
      t.status === 'На диагностике' ||
      t.status === 'Принята' ||
      t.status === 'В работе' ||
      t.status === 'Ожидает запчастей'
  ).length;
  const completedCount = tickets.filter(
    (t) => t.status === 'Готова' || t.status === 'Выдана'
  ).length;
  const cancelledCount = tickets.filter((t) => t.status === 'Отменен').length;
  const totalRevenue = tickets.reduce(
    (sum, t) =>
      sum +
      (t.status !== 'Отменен' &&
      typeof t.finalPrice === 'number' &&
      !Number.isNaN(t.finalPrice)
        ? t.finalPrice
        : 0),
    0
  );

  return {
    total,
    newCount,
    waitingMasterCount,
    inProgressCount,
    completedCount,
    cancelledCount,
    totalRevenue,
  };
};

export const filterTickets = (
  tickets: RepairTicket[],
  query: string,
  statusFilter: string
): RepairTicket[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const queryDigits = normalizedQuery.replace(/\D/g, '');

  return tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' &&
        (ticket.status === 'Ожидает Мастера' ||
          ticket.status === 'На диагностике' ||
          ticket.status === 'Принята' ||
          ticket.status === 'В работе' ||
          ticket.status === 'Ожидает запчастей')) ||
      (statusFilter === 'COMPLETED' &&
        (ticket.status === 'Готова' || ticket.status === 'Выдана')) ||
      ticket.status === statusFilter;

    if (!matchesStatus) return false;
    if (!normalizedQuery) return true;

    const priceRaw = ticket.finalPrice !== null ? String(ticket.finalPrice) : '';
    const priceFormatted =
      ticket.finalPrice !== null
        ? ticket.finalPrice.toLocaleString('ru-RU').toLowerCase()
        : '';
    const phoneDigits = ticket.clientPhone.replace(/\D/g, '');

    return (
      ticket.id.toLowerCase().includes(normalizedQuery) ||
      ticket.createdAt.toLowerCase().includes(normalizedQuery) ||
      ticket.preferredDate.toLowerCase().includes(normalizedQuery) ||
      ticket.clientName.toLowerCase().includes(normalizedQuery) ||
      ticket.userId.toLowerCase().includes(normalizedQuery) ||
      ticket.clientPhone.toLowerCase().includes(normalizedQuery) ||
      (queryDigits.length >= 3 && phoneDigits.includes(queryDigits)) ||
      ticket.brandModel.toLowerCase().includes(normalizedQuery) ||
      ticket.deviceType.toLowerCase().includes(normalizedQuery) ||
      ticket.issueDescription.toLowerCase().includes(normalizedQuery) ||
      ticket.expectedReadyDate.toLowerCase().includes(normalizedQuery) ||
      priceRaw.includes(normalizedQuery) ||
      priceFormatted.includes(normalizedQuery) ||
      ticket.master.toLowerCase().includes(normalizedQuery) ||
      ticket.status.toLowerCase().includes(normalizedQuery)
    );
  });
};

export const loadTicketsFromStorage = (): RepairTicket[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_TICKETS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return parsed as RepairTicket[];
  } catch {
    return INITIAL_TICKETS;
  }
};

export const isServiceVoucherUnlocked = (status: TicketStatus): boolean => {
  return status === 'Готова' || status === 'Выдана';
};

export interface ServiceVoucherDetails {
  voucherNumber: string;
  warrantyCode: string;
  warrantyMonths: number;
  warrantyPeriodLabel: string;
  issueDate: string;
  warrantyUntilDate: string;
  masterName: string;
  finalPriceFormatted: string;
  coveredItems: string[];
  warrantyConditions: string[];
}

export const getServiceVoucherDetails = (
  ticket: RepairTicket
): ServiceVoucherDetails => {
  const numericId = ticket.id.replace(/\D/g, '') || '0000';
  const baseDateStr =
    ticket.expectedReadyDate && /^\d{4}-\d{2}-\d{2}$/.test(ticket.expectedReadyDate)
      ? ticket.expectedReadyDate
      : /^\d{4}-\d{2}-\d{2}$/.test(ticket.preferredDate)
      ? ticket.preferredDate
      : '2026-10-19';

  const [yyyy, mm, dd] = baseDateStr.split('-').map((n) => parseInt(n, 10));
  const nextYear = (yyyy || 2026) + 1;
  const warrantyUntilDate = `${nextYear}-${String(mm || 10).padStart(2, '0')}-${String(
    dd || 19
  ).padStart(2, '0')}`;

  return {
    voucherNumber: `СТ-${numericId}`,
    warrantyCode: `GAR-${ticket.id}-12M`,
    warrantyMonths: 12,
    warrantyPeriodLabel: '12 месяцев (365 календарных дней)',
    issueDate: baseDateStr,
    warrantyUntilDate,
    masterName:
      ticket.master && ticket.master !== 'Не назначен'
        ? ticket.master
        : 'Ведущий инженер ОТК',
    finalPriceFormatted:
      ticket.finalPrice !== null && ticket.finalPrice > 0
        ? `${ticket.finalPrice.toLocaleString('ru-RU')} ₽`
        : '0 ₽ (Бесплатная диагностика)',
    coveredItems: [
      `Все выполненные работы по заказ-наряду #${ticket.id} (${ticket.deviceType}: ${ticket.brandModel})`,
      'Установленные оригинальные запчасти, микросхемы и расходные материалы',
      'Бесплатное приоритетное устранение повторного дефекта того же узла в течение 12 месяцев',
      'Сохранение заводской калибровки и прошедший стендовый контроль ОТК',
    ],
    warrantyConditions: [
      `Гарантийное обслуживание производится по номеру заказа #${ticket.id} или при предъявлении данного сервисного талона.`,
      'Диагностика при обращении по гарантии проводится вне очереди и полностью бесплатно (0 руб.).',
      'Гарантия не распространяется на новые механические повреждения, попадание влаги после выдачи и следы несанкционированного вскрытия.',
    ],
  };
};

const escapeHtml = (value: string): string => {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const buildServiceVoucherPrintHtml = (ticket: RepairTicket): string => {
  const details = getServiceVoucherDetails(ticket);
  const monoFont = `'JetBrains Mono', 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif`;
  const coveredListHtml = details.coveredItems
    .map((item) => `<li style="margin-bottom: 4px;">${escapeHtml(item)}</li>`)
    .join('');
  const conditionsListHtml = details.warrantyConditions
    .map((cond) => `<li style="margin-bottom: 4px;">${escapeHtml(cond)}</li>`)
    .join('');

  return `
    <div style="font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0f172a; background: #ffffff; padding: 4px; max-width: 100%; box-sizing: border-box;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 12px; border-bottom: 2px solid #0f172a; margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a;">КВАНТ Сервис</span>
            <span style="font-size: 10px; font-family: ${monoFont}; font-weight: 700; padding: 2px 6px; border: 1px solid #94a3b8; border-radius: 4px; background: #f1f5f9; color: #1e293b;">ОТК СЕРТИФИЦИРОВАН</span>
          </div>
          <div style="font-size: 11px; color: #334155; margin-top: 3px;">
            Лаборатория компонентного ремонта электроники · ООО «КВАНТ Сервис»
          </div>
          <div style="font-size: 10px; font-family: ${monoFont}; color: #475569; margin-top: 2px;">
            ИНН 7704891205 · КПП 770401001 · г. Москва, ул. Малая Бронная, д. 24 · Тел.: +7 (495) 128-44-00
          </div>
        </div>
        <div style="text-align: right; border: 1.5px solid #64748b; border-radius: 8px; padding: 8px 12px; background: #f8fafc;">
          <div style="font-size: 10px; font-family: ${monoFont}; text-transform: uppercase; color: #475569; font-weight: 700;">
            Сервисный и гарантийный талон
          </div>
          <div style="font-size: 17px; font-family: ${monoFont}; font-weight: 800; color: #0f172a; margin-top: 2px;">
            № ${escapeHtml(details.voucherNumber)}
          </div>
          <div style="font-size: 11px; font-family: ${monoFont}; font-weight: 700; color: #1d4ed8;">
            Заказ-наряд: ${escapeHtml(ticket.id)} · Статус: ${escapeHtml(ticket.status)}
          </div>
        </div>
      </div>

      <!-- 1. Client & Device Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
        <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; background: #f8fafc;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 6px;">
            1. Сведения о заказчике (Клиент)
          </div>
          <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr>
              <td style="padding: 2px 0; color: #64748b; width: 38%;">ФИО клиента:</td>
              <td style="padding: 2px 0; font-weight: 700; color: #0f172a;">${escapeHtml(ticket.clientName)}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b;">Телефон:</td>
              <td style="padding: 2px 0; font-family: ${monoFont}; font-weight: 700; color: #0f172a;">${escapeHtml(ticket.clientPhone)}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b;">ID клиента:</td>
              <td style="padding: 2px 0; font-family: ${monoFont}; color: #334155;">${escapeHtml(ticket.userId)}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b;">Дата приема:</td>
              <td style="padding: 2px 0; font-family: ${monoFont}; color: #0f172a;">${escapeHtml(ticket.createdAt)}</td>
            </tr>
          </table>
        </div>

        <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; background: #f8fafc;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 6px;">
            2. Оборудование и исполнитель
          </div>
          <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr>
              <td style="padding: 2px 0; color: #64748b; width: 38%;">Категория:</td>
              <td style="padding: 2px 0; font-weight: 600; color: #0f172a;">${escapeHtml(ticket.deviceType)}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b;">Устройство:</td>
              <td style="padding: 2px 0; font-weight: 700; color: #0f172a;">${escapeHtml(ticket.brandModel)}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b;">Инженер СЦ:</td>
              <td style="padding: 2px 0; font-weight: 700; color: #1e40af;">${escapeHtml(details.masterName)}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b;">Дата готовности:</td>
              <td style="padding: 2px 0; font-family: ${monoFont}; font-weight: 700; color: #065f46;">${escapeHtml(details.issueDate)}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 2. Performed Work Table -->
      <div style="border: 1px solid #94a3b8; border-radius: 8px; overflow: hidden; margin-bottom: 14px;">
        <div style="background: #f1f5f9; padding: 7px 12px; border-bottom: 1px solid #94a3b8; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0f172a;">
            3. Выполненные работы и техническое заключение
          </span>
          <span style="font-size: 10px; font-family: ${monoFont}; color: #475569;">
            Протокол стендового контроля #${escapeHtml(ticket.id)}
          </span>
        </div>
        <div style="padding: 10px 12px;">
          <div style="font-size: 11px; margin-bottom: 8px;">
            <span style="color: #475569; font-weight: 700;">Заявленная неисправность и предмет ремонта: </span>
            <span style="color: #0f172a;">${escapeHtml(ticket.issueDescription)}</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; color: #475569; text-align: left;">
                <th style="padding: 5px 4px;">Этап работ</th>
                <th style="padding: 5px 4px;">Результат ОТК</th>
                <th style="padding: 5px 4px; text-align: right;">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 4px; font-weight: 600;">1. Полная аппаратная диагностика на лабораторном стенде</td>
                <td style="padding: 6px 4px; font-family: ${monoFont}; color: #047857; font-weight: 700;">Выполнено</td>
                <td style="padding: 6px 4px; text-align: right; font-family: ${monoFont}; font-weight: 700; color: #047857;">0 ₽ (Бесплатно)</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 4px; font-weight: 600;">2. Компонентный ремонт и восстановление (${escapeHtml(ticket.brandModel)})</td>
                <td style="padding: 6px 4px; font-family: ${monoFont}; color: #047857; font-weight: 700;">Норма / Проверено</td>
                <td style="padding: 6px 4px; text-align: right; font-family: ${monoFont}; font-weight: 700;">${escapeHtml(details.finalPriceFormatted)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #cbd5e1;">
                <td style="padding: 6px 4px; font-weight: 600;">3. Выходной стресс-тест и калибровка узлов под нагрузкой</td>
                <td style="padding: 6px 4px; font-family: ${monoFont}; color: #047857; font-weight: 700;">Допущено к выдаче</td>
                <td style="padding: 6px 4px; text-align: right; font-family: ${monoFont}; color: #475569;">Включено</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; font-weight: 800; font-size: 12px;">
                <td colspan="2" style="padding: 7px 4px; color: #0f172a;">ИТОГОВАЯ СУММА ПО ЗАКАЗ-НАРЯДУ ${escapeHtml(ticket.id)}:</td>
                <td style="padding: 7px 4px; text-align: right; font-family: ${monoFont}; color: #1e40af;">${escapeHtml(details.finalPriceFormatted)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- 3. Official Warranty Certificate -->
      <div style="border: 2px solid #059669; border-radius: 8px; background: #ecfdf5; padding: 12px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #a7f3d0; padding-bottom: 8px; margin-bottom: 8px;">
          <div>
            <div style="font-size: 10px; font-family: ${monoFont}; font-weight: 700; text-transform: uppercase; color: #065f46;">
              Сертификат гарантии: ${escapeHtml(details.warrantyCode)}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a;">
              Официальная гарантия «КВАНТ Сервис» — ${escapeHtml(details.warrantyPeriodLabel)}
            </div>
          </div>
          <div style="font-size: 11px; font-family: ${monoFont}; font-weight: 800; color: #065f46; background: #ffffff; border: 1px solid #6ee7b7; border-radius: 6px; padding: 4px 10px;">
            Действует до: ${escapeHtml(details.warrantyUntilDate)}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 11px; color: #1e293b;">
          <div>
            <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">Что покрывает гарантия (12 месяцев):</div>
            <ul style="margin: 0; padding-left: 16px; line-height: 1.35;">
              ${coveredListHtml}
            </ul>
          </div>
          <div>
            <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">Условия гарантийного обслуживания:</div>
            <ul style="margin: 0; padding-left: 16px; line-height: 1.35;">
              ${conditionsListHtml}
            </ul>
          </div>
        </div>
      </div>

      <!-- 4. Signatures & Stamp -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; align-items: center; padding-top: 8px; border-top: 1px solid #94a3b8; font-size: 11px;">
        <div>
          <div style="color: #64748b;">Ответственный инженер СЦ:</div>
          <div style="font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(details.masterName)}</div>
          <div style="margin-top: 14px; border-bottom: 1px dashed #64748b; padding-bottom: 2px; font-family: ${monoFont}; font-size: 10px; color: #475569;">
            Подпись: / ${escapeHtml(details.masterName.split(' ')[0])} /
          </div>
        </div>

        <div>
          <div style="color: #64748b;">Заказчик (Клиент):</div>
          <div style="font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(ticket.clientName)}</div>
          <div style="margin-top: 14px; border-bottom: 1px dashed #64748b; padding-bottom: 2px; font-family: ${monoFont}; font-size: 10px; color: #475569;">
            Устройство проверил, претензий нет
          </div>
        </div>

        <div style="text-align: right;">
          <div style="display: inline-block; border: 2px solid #1d4ed8; border-radius: 8px; padding: 6px 12px; text-align: center; background: #eff6ff;">
            <div style="font-size: 9px; font-family: ${monoFont}; font-weight: 800; color: #1e3a8a; letter-spacing: 0.08em;">
              ООО «КВАНТ СЕРВИС»
            </div>
            <div style="font-size: 11px; font-family: ${monoFont}; font-weight: 800; color: #1d4ed8; margin: 2px 0;">
              ОТК ПРОЙДЕН · М.П.
            </div>
            <div style="font-size: 9px; font-family: ${monoFont}; color: #1e40af;">
              ГАРАНТИЯ 12 МЕС. · ${escapeHtml(details.issueDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export const prepareServiceVoucherPrintRoot = (
  ticket: RepairTicket
): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  let printRoot = document.getElementById('service-voucher-print-root');
  if (!printRoot) {
    printRoot = document.createElement('div');
    printRoot.id = 'service-voucher-print-root';
    document.body.appendChild(printRoot);
  }
  printRoot.innerHTML = buildServiceVoucherPrintHtml(ticket);
  return printRoot;
};

export const triggerServiceVoucherPrint = (ticket: RepairTicket): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  prepareServiceVoucherPrintRoot(ticket);
  const details = getServiceVoucherDetails(ticket);
  const previousTitle = document.title;
  document.title = `Сервисный_талон_${details.voucherNumber}_${ticket.id}`;

  let printed = false;
  if (typeof window.print === 'function') {
    try {
      window.print();
      printed = true;
    } catch {
      printed = false;
    }
  }

  setTimeout(() => {
    document.title = previousTitle;
  }, 500);

  return printed;
};

export const downloadServiceVoucherHtml = (ticket: RepairTicket): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const details = getServiceVoucherDetails(ticket);
  const bodyHtml = buildServiceVoucherPrintHtml(ticket);
  const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Сервисный талон ${escapeHtml(details.voucherNumber)} (${escapeHtml(ticket.id)})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { margin: 0; padding: 20px; background: #ffffff; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body onload="window.print()">
  ${bodyHtml}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Сервисный_талон_${details.voucherNumber}_${ticket.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const saveTicketsToStorage = (tickets: RepairTicket[]): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // Ignore storage errors
  }
};

export const loadUsersFromStorage = (): UserAccount[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_USERS;
  }
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(INITIAL_USERS)
      );
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(INITIAL_USERS)
      );
      return INITIAL_USERS;
    }
    return parsed as UserAccount[];
  } catch {
    return INITIAL_USERS;
  }
};

export const saveUsersToStorage = (users: UserAccount[]): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage errors
  }
};

export const loadReviewsFromStorage = (): ReviewItem[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return CLIENT_REVIEWS;
  }
  try {
    const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        REVIEWS_STORAGE_KEY,
        JSON.stringify(CLIENT_REVIEWS)
      );
      return CLIENT_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.setItem(
        REVIEWS_STORAGE_KEY,
        JSON.stringify(CLIENT_REVIEWS)
      );
      return CLIENT_REVIEWS;
    }
    return parsed as ReviewItem[];
  } catch {
    return CLIENT_REVIEWS;
  }
};

export const saveReviewsToStorage = (reviews: ReviewItem[]): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // Ignore storage errors
  }
};

export const loadSessionUser = (): UserAccount | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserAccount;
  } catch {
    return null;
  }
};

export const saveSessionUser = (user: UserAccount | null): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (!user) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    }
  } catch {
    // Ignore storage errors
  }
};
