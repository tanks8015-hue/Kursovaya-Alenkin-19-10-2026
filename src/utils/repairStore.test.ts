import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_TICKETS,
  INITIAL_USERS,
  MASTER_ACCOUNTS,
  TICKET_STATUSES,
  formatPhoneMask,
  validateAdminCredentials,
  authenticateUser,
  registerNewUser,
  validatePhoneStrict,
  validateNewTicketInput,
  generateNextTicketId,
  createTicketRecord,
  getUserTickets,
  getMasterTickets,
  computeMastersWorkload,
  validateClientReviewInput,
  createClientReviewRecord,
  applyAdminUpdate,
  getUnreadStatusChangedTickets,
  markTicketNotificationRead,
  markAllUserTicketNotificationsRead,
  deleteTicketRecord,
  computeDashboardMetrics,
  filterTickets,
  isServiceVoucherUnlocked,
  getServiceVoucherDetails,
  buildServiceVoucherPrintHtml,
  stripPriceFromIssue,
  toggleCategoryIssueSelection,
} from './repairStore.ts';

test('formatPhoneMask automatically formats raw digits into +7 (XXX) XXX-XX-XX without manual brackets or dashes', () => {
  assert.equal(formatPhoneMask(''), '');
  assert.equal(formatPhoneMask('916'), '+7 (916');
  assert.equal(formatPhoneMask('916482'), '+7 (916) 482');
  assert.equal(formatPhoneMask('9164821904'), '+7 (916) 482-19-04');
  assert.equal(formatPhoneMask('89164821904'), '+7 (916) 482-19-04');
  assert.equal(formatPhoneMask('79164821904'), '+7 (916) 482-19-04');
});

test('INITIAL_TICKETS contains 10 test records and TICKET_STATUSES includes "Ожидает Мастера" and "На диагностике" after "Новая"', () => {
  assert.equal(INITIAL_TICKETS.length, 10);
  assert.equal(TICKET_STATUSES[0], 'Новая');
  assert.equal(TICKET_STATUSES[1], 'Ожидает Мастера');
  assert.equal(TICKET_STATUSES[2], 'На диагностике');
  assert.equal(TICKET_STATUSES.includes('Отменен'), true);
});

test('MASTER_ACCOUNTS defines all 4 masters and getMasterTickets isolates each master own tickets', () => {
  assert.equal(MASTER_ACCOUNTS.length, 4);

  const sokolovAuth = authenticateUser(INITIAL_USERS, 'sokolov', '123');
  assert.equal(sokolovAuth.success, true);
  assert.equal(sokolovAuth.user?.role, 'master');
  assert.equal(sokolovAuth.user?.name, 'Алексей Соколов');

  const sokolovTickets = getMasterTickets(INITIAL_TICKETS, 'Алексей Соколов');
  assert.equal(sokolovTickets.length, 4);
  assert.equal(
    sokolovTickets.every((t) => t.master === 'Алексей Соколов'),
    true
  );

  const volkovTickets = getMasterTickets(INITIAL_TICKETS, 'Михаил Волков');
  assert.equal(volkovTickets.length, 2);
  assert.equal(
    volkovTickets.every((t) => t.master === 'Михаил Волков'),
    true
  );

  const kovalevTickets = getMasterTickets(INITIAL_TICKETS, 'Сергей Ковалёв');
  assert.equal(kovalevTickets.length, 1);

  const morozovTickets = getMasterTickets(INITIAL_TICKETS, 'Дмитрий Морозов');
  assert.equal(morozovTickets.length, 1);
});

test('validatePhoneStrict enforces strictly 11 digits starting with 7 or 8', () => {
  const tooShort = validatePhoneStrict('+7 (999) 123-45');
  assert.equal(tooShort.valid, false);
  assert.match(tooShort.error!, /слишком мало цифр/);

  const tooLong = validatePhoneStrict('+7 (999) 123-45-6789');
  assert.equal(tooLong.valid, false);
  assert.match(tooLong.error!, /слишком много цифр/);

  const withLetters = validatePhoneStrict('+7 (999) 123-45-ab');
  assert.equal(withLetters.valid, false);

  const validPhone = validatePhoneStrict('+7 (916) 482-19-04');
  assert.equal(validPhone.valid, true);
  assert.equal(validPhone.digitsCount, 11);
});

test('computeMastersWorkload calculates active load and identifies overloaded masters', () => {
  const workload = computeMastersWorkload(INITIAL_TICKETS);
  assert.equal(workload.length, 4);

  const alexey = workload.find((m) => m.name === 'Алексей Соколов')!;
  // KV-2040 (В работе), KV-2037 (На диагностике), KV-2033 (Принята) -> 3 active orders (KV-2035 is Выдана so not active)
  assert.equal(alexey.activeCount, 3);
  assert.equal(alexey.statusLabel, 'Перегружен (Занято всё)');

  const mikhail = workload.find((m) => m.name === 'Михаил Волков')!;
  // KV-2036 (В работе), KV-2034 (Принята) -> 2 active orders
  assert.equal(mikhail.activeCount, 2);
  assert.equal(mikhail.statusLabel, 'Высокая загрузка');
});

test('validateClientReviewInput and createClientReviewRecord create verified review for "Выдана" ticket', () => {
  const invalidReview = validateClientReviewInput({
    ticketId: 'KV-2035',
    authorName: 'Александр Воронов',
    authorRole: 'Клиент',
    rating: 5,
    comment: 'Коротко',
  });
  assert.equal(invalidReview.valid, false);

  const validReview = validateClientReviewInput({
    ticketId: 'KV-2035',
    authorName: 'Александр Воронов',
    authorRole: 'Инженер-проектировщик',
    rating: 5,
    comment: 'Отличный сервис! Динамик и камеру починили в день обращения.',
  });
  assert.equal(validReview.valid, true);

  const issuedTicket = INITIAL_TICKETS.find((t) => t.id === 'KV-2035')!;
  const reviewRecord = createClientReviewRecord(issuedTicket, {
    ticketId: 'KV-2035',
    authorName: 'Александр Воронов',
    authorRole: 'Инженер-проектировщик',
    rating: 5,
    comment: 'Отличный сервис! Динамик и камеру починили в день обращения.',
  });
  assert.equal(reviewRecord.ticketRef, 'KV-2035');
  assert.equal(reviewRecord.rating, 5);
});

test('deleteTicketRecord removes the specified ticket by ID', () => {
  const remaining = deleteTicketRecord(INITIAL_TICKETS, 'KV-2041');
  assert.equal(remaining.length, INITIAL_TICKETS.length - 1);
  assert.equal(remaining.some((t) => t.id === 'KV-2041'), false);
});

test('validateAdminCredentials and authenticateUser handle Admin ("1"/"1") and Clients', () => {
  assert.equal(validateAdminCredentials('1', '1'), true);

  const adminAuth = authenticateUser(INITIAL_USERS, '1', '1');
  assert.equal(adminAuth.success, true);
  assert.equal(adminAuth.user?.role, 'admin');

  const clientAuth = authenticateUser(INITIAL_USERS, 'alex', '123');
  assert.equal(clientAuth.success, true);
  assert.equal(clientAuth.user?.role, 'client');
  assert.equal(clientAuth.user?.id, 'usr-101');
});

test('registerNewUser registers a new client and rejects duplicate logins or invalid phones', () => {
  const badPhone = registerNewUser(INITIAL_USERS, {
    name: 'Николай Соболев',
    phone: '+7 (999) 111',
    login: 'nikolay',
    password: 'password123',
  });
  assert.equal(badPhone.success, false);

  const regResult = registerNewUser(INITIAL_USERS, {
    name: 'Николай Соболев',
    phone: '+7 (999) 111-22-33',
    login: 'nikolay',
    password: 'password123',
  });
  assert.equal(regResult.success, true);
  assert.equal(regResult.user?.role, 'client');
  assert.equal(regResult.user?.id, 'usr-106');
});

test('getUserTickets returns strictly the tickets belonging to a specific user', () => {
  const alexTickets = getUserTickets(INITIAL_TICKETS, 'usr-101');
  assert.equal(alexTickets.length, 3);
  assert.equal(alexTickets.every((t) => t.userId === 'usr-101'), true);

  const kateTickets = getUserTickets(INITIAL_TICKETS, 'usr-102');
  assert.equal(kateTickets.length, 2);
});

test('createTicketRecord links new ticket to userId and applyAdminUpdate supports "На диагностике"', () => {
  const nextId = generateNextTicketId(INITIAL_TICKETS);
  assert.equal(nextId, 'KV-2042');

  const created = createTicketRecord(
    INITIAL_TICKETS,
    {
      userId: 'usr-104',
      clientName: 'Павел Орлов',
      clientPhone: '+7 (916) 555-44-33',
      deviceType: 'Планшет',
      brandModel: 'iPad Pro 13 M4',
      issueDescription: 'Разбит дисплей после падения на плитку',
      preferredDate: '2026-10-22',
    },
    new Date('2026-10-19T15:30:00')
  );

  assert.equal(created.id, 'KV-2042');
  assert.equal(created.status, 'Новая');

  const updatedList = applyAdminUpdate([created, ...INITIAL_TICKETS], 'KV-2042', {
    status: 'На диагностике',
    master: 'Дмитрий Морозов',
    expectedReadyDate: '2026-10-23',
    finalPrice: 0,
  });

  const updated = updatedList.find((t) => t.id === 'KV-2042');
  assert.equal(updated?.status, 'На диагностике');

  const metrics = computeDashboardMetrics(updatedList);
  assert.equal(metrics.inProgressCount >= 7, true);
});

test('filterTickets searches across all CRM columns (ID, dates, client, userId, phone, device, description, price, master, status)', () => {
  // By issueDescription
  const byDesc = filterTickets(INITIAL_TICKETS, 'MagSafe 3', 'ALL');
  assert.equal(byDesc.length, 1);
  assert.equal(byDesc[0].id, 'KV-2041');

  // By createdAt
  const byCreatedDate = filterTickets(INITIAL_TICKETS, '2026-10-14 12:15', 'ALL');
  assert.equal(byCreatedDate.length, 1);
  assert.equal(byCreatedDate[0].id, 'KV-2032');

  // By userId
  const byUserId = filterTickets(INITIAL_TICKETS, 'usr-103', 'ALL');
  assert.equal(byUserId.length, 1);
  assert.equal(byUserId[0].id, 'KV-2039');

  // By finalPrice
  const byPrice = filterTickets(INITIAL_TICKETS, '14900', 'ALL');
  assert.equal(byPrice.length, 1);
  assert.equal(byPrice[0].id, 'KV-2040');

  // By status text
  const byStatus = filterTickets(INITIAL_TICKETS, 'на диагностике', 'ALL');
  assert.equal(byStatus.length, 1);
  assert.equal(byStatus[0].id, 'KV-2037');
});

test('isServiceVoucherUnlocked unlocks only from status "Готова" ("Готова" and "Выдана") and getServiceVoucherDetails computes 12-month warranty', () => {
  assert.equal(isServiceVoucherUnlocked('Новая'), false);
  assert.equal(isServiceVoucherUnlocked('Ожидает Мастера'), false);
  assert.equal(isServiceVoucherUnlocked('На диагностике'), false);
  assert.equal(isServiceVoucherUnlocked('Принята'), false);
  assert.equal(isServiceVoucherUnlocked('В работе'), false);
  assert.equal(isServiceVoucherUnlocked('Ожидает запчастей'), false);
  assert.equal(isServiceVoucherUnlocked('Отменен'), false);
  assert.equal(isServiceVoucherUnlocked('Готова'), true);
  assert.equal(isServiceVoucherUnlocked('Выдана'), true);

  const readyTicket = INITIAL_TICKETS.find((t) => t.id === 'KV-2038')!;
  const details = getServiceVoucherDetails(readyTicket);
  assert.equal(details.voucherNumber, 'СТ-2038');
  assert.equal(details.warrantyMonths, 12);
  assert.equal(details.warrantyUntilDate, '2027-10-19');

  const printHtml = buildServiceVoucherPrintHtml(readyTicket);
  assert.ok(printHtml.includes('СТ-2038'));
  assert.ok(printHtml.includes('GAR-KV-2038-12M'));
  assert.ok(printHtml.includes('Официальная гарантия «КВАНТ Сервис»'));
  assert.ok(printHtml.includes(readyTicket.clientName));
});

test('applyAdminUpdate with status "Ожидает Мастера" always saves master as "Не назначен" and updates waitingMasterCount', () => {
  const updatedList = applyAdminUpdate(INITIAL_TICKETS, 'KV-2041', {
    status: 'Ожидает Мастера',
    master: 'Алексей Соколов',
    expectedReadyDate: '2026-10-22',
    finalPrice: null,
  });

  const updatedTicket = updatedList.find((t) => t.id === 'KV-2041')!;
  assert.equal(updatedTicket.status, 'Ожидает Мастера');
  assert.equal(updatedTicket.master, 'Не назначен');

  const metrics = computeDashboardMetrics(updatedList);
  assert.equal(metrics.waitingMasterCount, 1);
});

test('status change notification triggers when master changes status, does not repeat after reading, and pops up again when status changes again', () => {
  // Initially no unread notifications for kate (usr-102, owns KV-2040 in status "В работе")
  assert.equal(getUnreadStatusChangedTickets(INITIAL_TICKETS, 'usr-102').length, 0);

  // Changing price without changing status does NOT trigger status notification
  const sameStatusList = applyAdminUpdate(INITIAL_TICKETS, 'KV-2040', {
    status: 'В работе',
    master: 'Алексей Соколов',
    expectedReadyDate: '2026-10-21',
    finalPrice: 15500,
  });
  assert.equal(getUnreadStatusChangedTickets(sameStatusList, 'usr-102').length, 0);

  // Master changes status of KV-2040 from "В работе" to "Готова" -> notification triggers
  const afterFirstStatusChange = applyAdminUpdate(sameStatusList, 'KV-2040', {
    status: 'Готова',
    master: 'Алексей Соколов',
    expectedReadyDate: '2026-10-20',
    finalPrice: 15500,
  });
  const unread1 = getUnreadStatusChangedTickets(afterFirstStatusChange, 'usr-102');
  assert.equal(unread1.length, 1);
  assert.equal(unread1[0].id, 'KV-2040');
  assert.equal(unread1[0].previousStatus, 'В работе');
  assert.equal(unread1[0].status, 'Готова');

  // Client marks notification as read -> notification does not repeat
  const afterRead = markTicketNotificationRead(afterFirstStatusChange, 'KV-2040');
  assert.equal(getUnreadStatusChangedTickets(afterRead, 'usr-102').length, 0);

  // Master changes status of KV-2040 AGAIN from "Готова" to "Выдана" -> notification pops up again
  const afterSecondStatusChange = applyAdminUpdate(afterRead, 'KV-2040', {
    status: 'Выдана',
    master: 'Алексей Соколов',
    expectedReadyDate: '2026-10-20',
    finalPrice: 15500,
  });
  const unread2 = getUnreadStatusChangedTickets(afterSecondStatusChange, 'usr-102');
  assert.equal(unread2.length, 1);
  assert.equal(unread2[0].id, 'KV-2040');
  assert.equal(unread2[0].previousStatus, 'Готова');
  assert.equal(unread2[0].status, 'Выдана');

  // markAllUserTicketNotificationsRead clears all notifications for that user
  const afterClearAll = markAllUserTicketNotificationsRead(
    afterSecondStatusChange,
    'usr-102'
  );
  assert.equal(getUnreadStatusChangedTickets(afterClearAll, 'usr-102').length, 0);
});

test('stripPriceFromIssue removes price suffix and toggleCategoryIssueSelection supports multi-select in 1 category while blocking cross-category mixing', () => {
  assert.equal(
    stripPriceFromIssue('Замена экрана (дисплейного модуля) или стекла — от 3 900 руб.'),
    'Замена экрана (дисплейного модуля) или стекла'
  );
  assert.equal(
    stripPriceFromIssue('Замена аккумулятора (ёмкость 100%, без ошибок) — от 2 400 руб.'),
    'Замена аккумулятора (ёмкость 100%, без ошибок)'
  );

  // Select 1st issue in Смартфон
  const step1 = toggleCategoryIssueSelection(
    { deviceType: null, issues: [] },
    'Смартфон',
    'Замена экрана (дисплейного модуля) или стекла — от 3 900 руб.'
  );
  assert.equal(step1.deviceType, 'Смартфон');
  assert.deepEqual(step1.issues, ['Замена экрана (дисплейного модуля) или стекла']);
  assert.equal(
    step1.formattedDescription,
    'Замена экрана (дисплейного модуля) или стекла'
  );

  // Select 2nd issue in the SAME category (Смартфон) -> combines without prices
  const step2 = toggleCategoryIssueSelection(
    step1,
    'Смартфон',
    'Замена аккумулятора (ёмкость 100%, без ошибок) — от 2 400 руб.'
  );
  assert.equal(step2.deviceType, 'Смартфон');
  assert.equal(step2.issues.length, 2);
  assert.equal(
    step2.formattedDescription,
    'Замена экрана (дисплейного модуля) или стекла; Замена аккумулятора (ёмкость 100%, без ошибок)'
  );

  // Clicking an issue from a DIFFERENT category (Ноутбук) resets Смартфон issues and selects only the Ноутбук issue
  const step3 = toggleCategoryIssueSelection(
    step2,
    'Ноутбук',
    'Чистка от пыли и замена термопасты (не шумит и не греется) — 3 200 руб.'
  );
  assert.equal(step3.deviceType, 'Ноутбук');
  assert.deepEqual(step3.issues, [
    'Чистка от пыли и замена термопасты (не шумит и не греется)',
  ]);
  assert.equal(
    step3.formattedDescription,
    'Чистка от пыли и замена термопасты (не шумит и не греется)'
  );
});
