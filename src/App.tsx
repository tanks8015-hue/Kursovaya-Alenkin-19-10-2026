import { useState, useEffect } from 'react';
import {
  AdminUpdateTicketInput,
  DeviceType,
  NewClientReviewInput,
  NewTicketInput,
  RepairTicket,
  ReviewItem,
  UserAccount,
} from './types';
import {
  INITIAL_TICKETS,
  INITIAL_USERS,
  CLIENT_REVIEWS,
  loadTicketsFromStorage,
  saveTicketsToStorage,
  loadUsersFromStorage,
  saveUsersToStorage,
  loadReviewsFromStorage,
  saveReviewsToStorage,
  loadSessionUser,
  saveSessionUser,
  createTicketRecord,
  createClientReviewRecord,
  applyAdminUpdate,
  deleteTicketRecord,
  cancelClientTicket,
  getUserTickets,
  getUnreadStatusChangedTickets,
  markTicketNotificationRead,
  markAllUserTicketNotificationsRead,
  formatTimestamp,
  toggleCategoryIssueSelection,
} from './utils/repairStore';
import { Header } from './components/Header';
import { ServicesSection } from './components/ServicesSection';
import { BookingSection } from './components/BookingSection';
import { ClientTrackerSection } from './components/ClientTrackerSection';
import { ReviewsSection } from './components/ReviewsSection';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export default function App() {
  const [tickets, setTickets] = useState<RepairTicket[]>(() =>
    loadTicketsFromStorage()
  );
  const [users, setUsers] = useState<UserAccount[]>(() =>
    loadUsersFromStorage()
  );
  const [reviews, setReviews] = useState<ReviewItem[]>(() =>
    loadReviewsFromStorage()
  );
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadSessionUser()
  );

  const [mode, setMode] = useState<'client' | 'admin'>(() => {
    const saved = loadSessionUser();
    return saved?.role === 'admin' || saved?.role === 'master'
      ? 'admin'
      : 'client';
  });

  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    initialTab: 'login' | 'register';
  }>({ isOpen: false, initialTab: 'login' });

  const [preselectedDevice, setPreselectedDevice] =
    useState<DeviceType | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [presetIssue, setPresetIssue] = useState<string | null>(null);

  useEffect(() => {
    saveTicketsToStorage(tickets);
  }, [tickets]);

  useEffect(() => {
    saveUsersToStorage(users);
  }, [users]);

  useEffect(() => {
    saveReviewsToStorage(reviews);
  }, [reviews]);

  useEffect(() => {
    saveSessionUser(currentUser);
  }, [currentUser]);

  const handleCreateTicket = (
    input: Omit<NewTicketInput, 'userId'>
  ): { ticket?: RepairTicket; error?: string } => {
    let activeUser = currentUser;

    // If the user is not logged in or is staff, find or auto-create a client profile for them
    if (
      !activeUser ||
      activeUser.role === 'admin' ||
      activeUser.role === 'master'
    ) {
      const normalizedPhone = input.clientPhone.replace(/\D/g, '');
      const normalizedCompare =
        normalizedPhone.startsWith('8') && normalizedPhone.length === 11
          ? '7' + normalizedPhone.slice(1)
          : normalizedPhone;
      const existingClient = users.find((u) => {
        if (u.role !== 'client') return false;
        const d = u.phone.replace(/\D/g, '');
        const norm = d.startsWith('8') && d.length === 11 ? '7' + d.slice(1) : d;
        return norm === normalizedCompare;
      });

      if (existingClient) {
        activeUser = existingClient;
      } else {
        const nextIdNum = users.reduce((max, u) => {
          const match = u.id.match(/usr-(\d+)/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 105);
        const generatedLogin = `client_${nextIdNum + 1}`;
        const newClient: UserAccount = {
          id: `usr-${nextIdNum + 1}`,
          login: generatedLogin,
          password: '123',
          name: input.clientName.trim(),
          phone: input.clientPhone.trim(),
          role: 'client',
          createdAt: formatTimestamp(),
        };
        const updatedUsers = [...users, newClient];
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);
        activeUser = newClient;
      }
      // Only switch the active session to the client if the user was an unauthenticated guest
      if (!currentUser) {
        setCurrentUser(activeUser);
        saveSessionUser(activeUser);
      }
    }

    const newTicket = createTicketRecord(tickets, {
      ...input,
      userId: activeUser.id,
    });
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    saveTicketsToStorage(updated);
    return { ticket: newTicket };
  };

  const handleAddClientReview = (
    ticket: RepairTicket,
    input: NewClientReviewInput
  ): { review?: ReviewItem; error?: string } => {
    if (ticket.status !== 'Выдана') {
      return {
        error: 'Оставить отзыв можно только по завершенной заявке в статусе «Выдана».',
      };
    }
    if (reviews.some((r) => r.ticketRef === ticket.id)) {
      return {
        error: 'По данной заявке отзыв уже был опубликован.',
      };
    }

    const newReview = createClientReviewRecord(ticket, input);
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    saveReviewsToStorage(updatedReviews);
    return { review: newReview };
  };

  const handleAdminUpdateTicket = (
    ticketId: string,
    update: AdminUpdateTicketInput
  ) => {
    const updated = applyAdminUpdate(tickets, ticketId, update);
    setTickets(updated);
    saveTicketsToStorage(updated);
  };

  const handleAdminDeleteTicket = (ticketId: string) => {
    if (currentUser?.role !== 'admin') return;
    const updated = deleteTicketRecord(tickets, ticketId);
    setTickets(updated);
    saveTicketsToStorage(updated);
  };

  const handleClientCancelTicket = (ticketId: string) => {
    if (!currentUser || currentUser.role !== 'client') return;
    const updated = cancelClientTicket(tickets, ticketId, currentUser.id);
    setTickets(updated);
    saveTicketsToStorage(updated);
  };

  const handleResetDemoData = () => {
    if (currentUser?.role !== 'admin') return;
    setTickets(INITIAL_TICKETS);
    saveTicketsToStorage(INITIAL_TICKETS);
    setUsers(INITIAL_USERS);
    saveUsersToStorage(INITIAL_USERS);
    setReviews(CLIENT_REVIEWS);
    saveReviewsToStorage(CLIENT_REVIEWS);
  };

  const handleOpenAuthModal = (initialTab: 'login' | 'register' = 'login') => {
    setAuthModalState({ isOpen: true, initialTab });
  };

  const handleSuccessAuth = (
    user: UserAccount,
    updatedUsers?: UserAccount[]
  ) => {
    if (updatedUsers) {
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
    }
    setCurrentUser(user);
    saveSessionUser(user);
    setAuthModalState({ isOpen: false, initialTab: 'login' });

    if (user.role === 'admin' || user.role === 'master') {
      setMode('admin');
      window.scrollTo(0, 0);
    } else {
      setMode('client');
      const hasUnread =
        getUnreadStatusChangedTickets(tickets, user.id).length > 0;
      if (hasUnread) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const trackerEl = document.getElementById('client-cabinet');
        if (trackerEl) {
          trackerEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleMarkNotificationRead = (ticketId: string) => {
    const updated = markTicketNotificationRead(tickets, ticketId);
    setTickets(updated);
    saveTicketsToStorage(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    if (!currentUser) return;
    const updated = markAllUserTicketNotificationsRead(tickets, currentUser.id);
    setTickets(updated);
    saveTicketsToStorage(updated);
  };

  const handleLogout = () => {
    if (currentUser?.role === 'client') {
      const updated = markAllUserTicketNotificationsRead(
        tickets,
        currentUser.id
      );
      setTickets(updated);
      saveTicketsToStorage(updated);
    }
    setCurrentUser(null);
    saveSessionUser(null);
    setMode('client');
    window.scrollTo(0, 0);
  };

  const handleToggleServiceIssue = (
    deviceType: DeviceType,
    rawIssue: string
  ) => {
    const next = toggleCategoryIssueSelection(
      { deviceType: preselectedDevice, issues: selectedIssues },
      deviceType,
      rawIssue
    );
    setPreselectedDevice(next.deviceType);
    setSelectedIssues(next.issues);
    setPresetIssue(next.formattedDescription);
  };

  const handleSelectServiceDevice = (deviceType: DeviceType) => {
    if (preselectedDevice !== deviceType) {
      setPreselectedDevice(deviceType);
      setSelectedIssues([]);
      setPresetIssue('');
    } else {
      setPreselectedDevice(deviceType);
    }
    const formEl = document.getElementById('booking-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeviceCategoryChange = (deviceType: DeviceType) => {
    setPreselectedDevice(deviceType);
    setSelectedIssues([]);
    setPresetIssue('');
  };

  const handleQuickTrackClick = () => {
    const trackerEl = document.getElementById('client-cabinet');
    if (trackerEl) {
      trackerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const myTickets =
    currentUser && currentUser.role === 'client'
      ? getUserTickets(tickets, currentUser.id)
      : [];

  const unreadStatusTickets =
    currentUser && currentUser.role === 'client'
      ? getUnreadStatusChangedTickets(tickets, currentUser.id)
      : [];

  const staffTickets =
    currentUser?.role === 'master'
      ? tickets.filter((t) => t.master === currentUser.name)
      : currentUser?.role === 'admin'
      ? tickets
      : [];

  const handleSwitchToAdmin = () => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'master') {
      setMode('admin');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E2E8F0] text-slate-900">
      <Header
        mode={mode}
        currentUser={currentUser}
        myTicketsCount={myTickets.length}
        staffTicketsCount={staffTickets.length}
        unreadStatusTickets={unreadStatusTickets}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenAuthModal={handleOpenAuthModal}
        onSwitchToClient={() => {
          setMode('client');
          window.scrollTo(0, 0);
        }}
        onSwitchToAdmin={handleSwitchToAdmin}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {mode === 'client' ? (
          <>
            <ServicesSection
              selectedDevice={preselectedDevice}
              selectedIssues={selectedIssues}
              onToggleServiceIssue={handleToggleServiceIssue}
              onSelectServiceDevice={handleSelectServiceDevice}
              onQuickTrackClick={handleQuickTrackClick}
              currentUser={currentUser}
              myTicketsCount={myTickets.length}
              staffTicketsCount={staffTickets.length}
              onSwitchToAdmin={handleSwitchToAdmin}
            />
            <BookingSection
              currentUser={currentUser}
              preselectedDevice={preselectedDevice}
              presetIssue={presetIssue}
              onDeviceCategoryChange={handleDeviceCategoryChange}
              onCreateTicket={handleCreateTicket}
              onOpenAuthModal={handleOpenAuthModal}
            />
            <ClientTrackerSection
              myTickets={myTickets}
              staffTickets={staffTickets}
              reviews={reviews}
              currentUser={currentUser}
              onOpenAuthModal={handleOpenAuthModal}
              onSwitchToAdmin={handleSwitchToAdmin}
              onMarkNotificationRead={handleMarkNotificationRead}
              onCancelTicket={handleClientCancelTicket}
              onAddReview={handleAddClientReview}
            />
            <ReviewsSection reviews={reviews} />
          </>
        ) : (
          <AdminDashboard
            tickets={tickets}
            currentUser={currentUser}
            onUpdateTicket={handleAdminUpdateTicket}
            onDeleteTicket={handleAdminDeleteTicket}
            onResetDemoData={handleResetDemoData}
            onSwitchToClient={() => {
              setMode('client');
              window.scrollTo(0, 0);
            }}
          />
        )}
      </main>

      <Footer
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
      />

      <AdminLoginModal
        isOpen={authModalState.isOpen}
        initialTab={authModalState.initialTab}
        users={users}
        onClose={() => setAuthModalState({ ...authModalState, isOpen: false })}
        onSuccessAuth={handleSuccessAuth}
      />
    </div>
  );
}
