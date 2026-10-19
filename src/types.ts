export type TicketStatus =
  | 'Новая'
  | 'Ожидает Мастера'
  | 'На диагностике'
  | 'Принята'
  | 'В работе'
  | 'Ожидает запчастей'
  | 'Готова'
  | 'Выдана'
  | 'Отменен';

export type DeviceType =
  | 'Смартфон'
  | 'Ноутбук'
  | 'Телевизор / Монитор'
  | 'Планшет'
  | 'Игровая консоль'
  | 'Компьютер / Моноблок'
  | 'Аудиотехника';

export interface UserAccount {
  id: string;
  login: string;
  password: string;
  name: string;
  phone: string;
  role: 'client' | 'master' | 'admin';
  createdAt: string;
}

export interface RepairTicket {
  id: string;
  userId: string;
  createdAt: string; // YYYY-MM-DD HH:mm
  clientName: string;
  clientPhone: string;
  deviceType: DeviceType;
  brandModel: string;
  issueDescription: string;
  preferredDate: string; // YYYY-MM-DD
  status: TicketStatus;
  master: string;
  expectedReadyDate: string; // YYYY-MM-DD or ''
  finalPrice: number | null;
  hasUnreadStatusChange?: boolean;
  previousStatus?: TicketStatus;
  statusChangedAt?: string;
}

export interface NewTicketInput {
  userId: string;
  clientName: string;
  clientPhone: string;
  deviceType: DeviceType;
  brandModel: string;
  issueDescription: string;
  preferredDate: string;
}

export interface RegisterUserInput {
  name: string;
  phone: string;
  login: string;
  password: string;
}

export interface AdminUpdateTicketInput {
  status: TicketStatus;
  master: string;
  expectedReadyDate: string;
  finalPrice: number | null;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  deviceType: DeviceType;
  turnaround: string;
  warranty: string;
  priceFrom: number;
  description: string;
  commonIssues: string[];
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorRole: string;
  companyOrDevice: string;
  ticketRef: string;
  beforeState: string;
  actionTaken: string;
  outcome: string;
  turnaroundHours: number;
  pricePaid: number;
  rating: number;
  createdAt?: string;
}

export interface NewClientReviewInput {
  ticketId: string;
  authorName: string;
  authorRole: string;
  rating: number;
  comment: string;
}

export interface MasterProfile {
  name: string;
  specialization: string;
  maxCapacity: number;
}

export interface MasterWorkloadItem extends MasterProfile {
  activeCount: number;
  completedCount: number;
  activeTicketIds: string[];
  loadPercentage: number;
  statusLabel: 'Свободен' | 'Оптимальная нагрузка' | 'Высокая загрузка' | 'Перегружен (Занято всё)';
}
