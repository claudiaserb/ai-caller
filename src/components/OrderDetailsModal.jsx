import { X, ExternalLink, RotateCcw, Store, User, Phone, Mail, Calendar, CreditCard, Truck, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const OrderDetailsModal = ({ order, isOpen, onClose, onMarkAsReturn }) => {
  const { language } = useLanguage();

  const translations = {
    EN: {
      orderDetails: 'Order Details',
      orderId: 'Order ID',
      customer: 'Customer',
      phone: 'Phone',
      email: 'Email',
      placedAt: 'Placed At',
      shop: 'Shop',
      orderStatus: 'Order Status',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
      shippingStatus: 'Shipping Status',
      total: 'Total',
      notes: 'Notes',
      noNotes: 'No notes available',
      openInShopify: 'Open in Shopify',
      markAsReturn: 'Mark as Return',
      close: 'Close',
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      delivered: 'Delivered',
      paid: 'Paid',
      return: 'Return',
      card: 'Card',
      cash: 'Cash',
      bankTransfer: 'Bank Transfer',
    },
    RO: {
      orderDetails: 'Detalii Comandă',
      orderId: 'ID Comandă',
      customer: 'Client',
      phone: 'Telefon',
      email: 'Email',
      placedAt: 'Plasată La',
      shop: 'Magazin',
      orderStatus: 'Status Comandă',
      paymentMethod: 'Metodă Plată',
      paymentStatus: 'Status Plată',
      shippingStatus: 'Status Livrare',
      total: 'Total',
      notes: 'Notițe',
      noNotes: 'Nu există notițe',
      openInShopify: 'Deschide în Shopify',
      markAsReturn: 'Marchează ca Retur',
      close: 'Închide',
      confirmed: 'Confirmată',
      pending: 'În Așteptare',
      cancelled: 'Anulată',
      delivered: 'Livrată',
      paid: 'Plătită',
      return: 'Retur',
      card: 'Card',
      cash: 'Cash',
      bankTransfer: 'Transfer Bancar',
    },
  };

  const t = translations[language];

  if (!isOpen || !order) return null;

  const getStatusColor = (status, type) => {
    if (type === 'order') {
      switch (status) {
        case 'confirmed':
          return 'bg-success/10 text-success border-success/20';
        case 'pending':
          return 'bg-warning/10 text-warning border-warning/20';
        case 'cancelled':
          return 'bg-error/10 text-error border-error/20';
        case 'delivered':
          return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        default:
          return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      }
    } else if (type === 'payment') {
      switch (status) {
        case 'paid':
          return 'bg-success/10 text-success border-success/20';
        case 'pending':
          return 'bg-warning/10 text-warning border-warning/20';
        case 'cancelled':
          return 'bg-error/10 text-error border-error/20';
        default:
          return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      }
    } else if (type === 'shipping') {
      switch (status) {
        case 'delivered':
          return 'bg-success/10 text-success border-success/20';
        case 'return':
          return 'bg-error/10 text-error border-error/20';
        case 'pending':
          return 'bg-warning/10 text-warning border-warning/20';
        default:
          return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      }
    }
  };

  const getStatusText = (status, type) => {
    if (type === 'order') {
      return t[status] || status;
    } else if (type === 'payment') {
      return t[status] || status;
    } else if (type === 'shipping') {
      return t[status] || status;
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

  const getCountryFlag = (code) => {
    const flags = {
      'RO': '🇷🇴',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'IT': '🇮🇹',
      'ES': '🇪🇸',
      'GB': '🇬🇧',
      'US': '🇺🇸',
    };
    return flags[code] || '🌍';
  };

  const handleOpenInShopify = () => {
    if (!order.shopify_order_id || !order.shop?.store_url) {
      return;
    }
    const url = `${order.shop.store_url}/admin/orders/${order.shopify_order_id}`;
    window.open(url, '_blank');
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
            {t.orderDetails}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5 transition dark:text-dark-muted text-light-muted"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Order ID */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block">
              {t.orderId}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-lg font-bold dark:text-dark-text text-light-text">
                {order.order_number}
              </p>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <User size={14} />
              {t.customer}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-base font-semibold dark:text-dark-text text-light-text flex items-center gap-2">
                <span>{getCountryFlag(order.country_code)}</span>
                {order.customer_name}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Phone size={14} />
              {t.phone}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-base font-medium dark:text-dark-text text-light-text">
                {order.customer_phone || '-'}
              </p>
            </div>
          </div>

          {/* Email */}
          {order.customer_email && (
            <div>
              <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Mail size={14} />
                {t.email}
              </label>
              <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
                <p className="text-sm dark:text-dark-text text-light-text truncate">
                  {order.customer_email}
                </p>
              </div>
            </div>
          )}

          {/* Placed At */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Calendar size={14} />
              {t.placedAt}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-base font-medium dark:text-dark-text text-light-text">
                {formatDateTime(order.placed_at)}
              </p>
            </div>
          </div>

          {/* Shop */}
          {order.shop && (
            <div>
              <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Store size={14} />
                {t.shop}
              </label>
              <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
                <p className="text-base font-medium dark:text-dark-text text-light-text">
                  {order.shop.name}
                </p>
              </div>
            </div>
          )}

          {/* Order Status */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block">
              {t.orderStatus}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                  order.order_status, 'order'
                )}`}
              >
                {getStatusText(order.order_status, 'order')}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <CreditCard size={14} />
              {t.paymentMethod}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-base font-medium dark:text-dark-text text-light-text capitalize">
                {t[order.payment_method] || order.payment_method}
              </p>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block">
              {t.paymentStatus}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                  order.payment_status, 'payment'
                )}`}
              >
                {getStatusText(order.payment_status, 'payment')}
              </span>
            </div>
          </div>

          {/* Shipping Status */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Truck size={14} />
              {t.shippingStatus}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                  order.shipping_status, 'shipping'
                )}`}
              >
                {getStatusText(order.shipping_status, 'shipping')}
              </span>
            </div>
          </div>

          {/* Total */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block">
              {t.total}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50">
              <p className="text-2xl font-bold text-accent-primary">
                {order.total_amount} {order.currency}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
              <FileText size={14} />
              {t.notes}
            </label>
            <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-gray-200/50 min-h-[80px]">
              <p className="text-sm dark:text-dark-text text-light-text leading-relaxed">
                {order.notes || (
                  <span className="dark:text-dark-muted text-light-muted italic">
                    {t.noNotes}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            {order.shopify_order_id && order.shop?.store_url && (
              <button 
                onClick={handleOpenInShopify}
                className="w-full py-3 rounded-xl dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 dark:text-dark-text text-light-text font-semibold transition flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                {t.openInShopify}
              </button>
            )}

            {order.shipping_status !== 'return' && (
              <button
                onClick={() => onMarkAsReturn && onMarkAsReturn(order.id)}
                className="w-full py-3 rounded-xl dark:bg-error/10 bg-error/10 dark:hover:bg-error/20 hover:bg-error/20 text-error font-semibold transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                {t.markAsReturn}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 dark:text-dark-text text-light-text font-semibold transition"
            >
              {t.close}
            </button>
          </div>
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

export default OrderDetailsModal;