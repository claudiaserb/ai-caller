import { X, Phone, Calendar, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CallDetailsModal = ({ call, isOpen, onClose }) => {
  const { language } = useLanguage();

  const translations = {
    EN: {
      callDetails: 'Call Details',
      customerName: 'Customer Name',
      phoneNumber: 'Phone Number',
      dateTime: 'Date & Time',
      callDuration: 'Call Duration',
      status: 'Status',
      aiToneUsed: 'AI Tone Used',
      notes: 'Notes',
      confirmed: 'Confirmed',
      busy: 'Busy',
      failed: 'Failed',
      pending: 'Pending',
      professional: 'Professional',
      friendly: 'Friendly',
      noNotes: 'No notes available',
      close: 'Close',
    },
    RO: {
      callDetails: 'Detalii Apel',
      customerName: 'Nume Client',
      phoneNumber: 'Număr Telefon',
      dateTime: 'Data & Ora',
      callDuration: 'Durată Apel',
      status: 'Status',
      aiToneUsed: 'Ton AI Utilizat',
      notes: 'Notițe',
      confirmed: 'Confirmat',
      busy: 'Ocupat',
      failed: 'Eșuat',
      pending: 'În Așteptare',
      professional: 'Profesional',
      friendly: 'Prietenos',
      noNotes: 'Nu există notițe',
      close: 'Închide',
    },
  };

  const t = translations[language];

  if (!isOpen || !call) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'Busy':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Failed':
        return 'bg-error/10 text-error border-error/20';
      case 'Pending':
        return 'bg-accent-primary/10 text-accent-primary border-accent-primary/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Confirmed':
        return t.confirmed;
      case 'Busy':
        return t.busy;
      case 'Failed':
        return t.failed;
      case 'Pending':
        return t.pending;
      default:
        return status;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString(language === 'EN' ? 'en-US' : 'ro-RO', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString(language === 'EN' ? 'en-US' : 'ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${day} ${month} ${year}, ${time}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md dark:bg-dark-surface bg-white shadow-2xl z-50 animate-slideInRight overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 dark:bg-dark-surface bg-white border-b dark:border-white/10 border-gray-200/50 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold dark:text-dark-text text-light-text">
            {t.callDetails}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5 transition dark:text-dark-muted text-light-muted"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Name */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block">
              {t.customerName}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-lg font-semibold dark:text-dark-text text-light-text">
                {call.customer_name}
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Phone size={14} />
              {t.phoneNumber}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-lg font-medium dark:text-dark-text text-light-text">
                {call.phone || '+40 721 XXX XXX'}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Calendar size={14} />
              {t.dateTime}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-lg font-medium dark:text-dark-text text-light-text">
                {formatDateTime(call.created_at)}
              </p>
            </div>
          </div>

          {/* Call Duration */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Clock size={14} />
              {t.callDuration}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-lg font-medium dark:text-dark-text text-light-text">
                {call.duration} min
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block">
              {t.status}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  call.status
                )}`}
              >
                {getStatusText(call.status)}
              </span>
            </div>
          </div>

          {/* AI Tone Used */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Sparkles size={14} />
              {t.aiToneUsed}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-lg font-medium dark:text-dark-text text-light-text capitalize">
                {call.ai_tone === 'professional' ? t.professional : t.friendly}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <MessageSquare size={14} />
              {t.notes}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50 min-h-[100px]">
              <p className="text-sm dark:text-dark-text text-light-text leading-relaxed">
                {call.notes || (
                  <span className="dark:text-dark-muted text-light-muted italic">
                    {t.noNotes}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 dark:text-dark-text text-light-text font-semibold transition"
          >
            {t.close}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CallDetailsModal;