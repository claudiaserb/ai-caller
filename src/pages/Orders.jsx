import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { supabase } from '../lib/supabase';
import { Search, X, ChevronDown, ChevronUp, ExternalLink, RotateCcw, User, Phone, Mail, Calendar, Store, CreditCard, FileText } from 'lucide-react';

const Orders = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { selectedShop } = useShop();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [shippingStatusFilter, setShippingStatusFilter] = useState('all');

  // Dropdown states
  const [showOrderStatusDropdown, setShowOrderStatusDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showShippingDropdown, setShowShippingDropdown] = useState(false);

  const ORDERS_PER_PAGE = 50;

  const translations = {
    EN: {
      pageTitle: 'Orders',
      searchPlaceholder: 'Search order #...',
      orderStatus: 'Order Status',
      paymentStatus: 'Payment',
      shippingStatus: 'Shipping',
      resetFilters: 'Reset',
      all: 'All',
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      delivered: 'Delivered',
      paid: 'Paid',
      return: 'Return',
      orderNumber: 'Order #',
      country: 'Country',
      placedAt: 'Placed At',
      orderStatusLabel: 'Order Status',
      payment: 'Payment',
      shipping: 'Shipping',
      total: 'Total',
      actions: 'Actions',
      noOrders: 'No orders found',
      loadingMore: 'Loading more...',
      noMoreOrders: 'No more orders',
      showing: 'Showing',
      of: 'of',
      customer: 'Customer',
      phone: 'Phone',
      email: 'Email',
      shop: 'Shop',
      paymentMethod: 'Payment Method',
      notes: 'Notes',
      openInShopify: 'Open in Shopify',
      markAsReturn: 'Mark as Return',
      card: 'Card',
      cash: 'Cash',
      bankTransfer: 'Bank Transfer',
    },
    RO: {
      pageTitle: 'Comenzi',
      searchPlaceholder: 'Caută comandă #...',
      orderStatus: 'Status Comandă',
      paymentStatus: 'Plată',
      shippingStatus: 'Livrare',
      resetFilters: 'Resetează',
      all: 'Toate',
      confirmed: 'Confirmată',
      pending: 'În Așteptare',
      cancelled: 'Anulată',
      delivered: 'Livrată',
      paid: 'Plătită',
      return: 'Retur',
      orderNumber: 'Comandă #',
      country: 'Țară',
      placedAt: 'Plasată La',
      orderStatusLabel: 'Status Comandă',
      payment: 'Plată',
      shipping: 'Livrare',
      total: 'Total',
      actions: 'Acțiuni',
      noOrders: 'Nu s-au găsit comenzi',
      loadingMore: 'Se încarcă...',
      noMoreOrders: 'Nu mai sunt comenzi',
      showing: 'Se afișează',
      of: 'din',
      customer: 'Client',
      phone: 'Telefon',
      email: 'Email',
      shop: 'Magazin',
      paymentMethod: 'Metodă Plată',
      notes: 'Notițe',
      openInShopify: 'Deschide în Shopify',
      markAsReturn: 'Marchează Retur',
      card: 'Card',
      cash: 'Cash',
      bankTransfer: 'Transfer Bancar',
    },
  };

  const t = translations[language];

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        let query = supabase
          .from('orders')
          .select('*, shop:shops(*)')
          .eq('user_id', user.id)
          .order('placed_at', { ascending: false });

        if (selectedShop) {
          query = query.eq('shop_id', selectedShop.id);
        }

        const { data, error } = await query.range(0, ORDERS_PER_PAGE - 1);

        if (error) throw error;

        setOrders(data || []);
        setFilteredOrders(data || []);
        setOffset(ORDERS_PER_PAGE);
        setHasMore((data?.length || 0) === ORDERS_PER_PAGE);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user, selectedShop]);

  useEffect(() => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (orderStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === orderStatusFilter);
    }

    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === paymentStatusFilter);
    }

    if (shippingStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.shipping_status === shippingStatusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, orderStatusFilter, paymentStatusFilter, shippingStatusFilter, orders]);

  const loadMoreOrders = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      let query = supabase
        .from('orders')
        .select('*, shop:shops(*)')
        .eq('user_id', user.id)
        .order('placed_at', { ascending: false });

      if (selectedShop) {
        query = query.eq('shop_id', selectedShop.id);
      }

      const { data, error } = await query.range(offset, offset + ORDERS_PER_PAGE - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        setOrders(prev => [...prev, ...data]);
        setOffset(prev => prev + data.length);
        setHasMore(data.length === ORDERS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more orders:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > 0.8 && !loadingMore && hasMore) {
      loadMoreOrders();
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setOrderStatusFilter('all');
    setPaymentStatusFilter('all');
    setShippingStatusFilter('all');
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleMarkAsReturn = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ shipping_status: 'return' })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, shipping_status: 'return' } : order
        )
      );
    } catch (error) {
      console.error('Error marking as return:', error);
    }
  };

  const getStatusColor = (status, type) => {
    if (type === 'shipping') {
      switch (status) {
        case 'delivered':
          return 'bg-success/10 text-success';
        case 'return':
          return 'bg-error/10 text-error';
        case 'pending':
          return 'bg-warning/10 text-warning';
        default:
          return 'bg-gray-500/10 text-gray-500';
      }
    }
  };

  const getStatusText = (status) => {
    return t[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString(language === 'EN' ? 'en-US' : 'ro-RO', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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
    const lowerCode = code.toLowerCase();
    return <span className={`fi fi-${lowerCode} rounded`} style={{ fontSize: '1rem', lineHeight: 1 }}></span>;
  };

  // Custom Dropdown Component - Z-INDEX MIC
  const CustomDropdown = ({ value, onChange, options, label, isOpen, setIsOpen }) => {
    return (
      <div className="relative z-[20]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2.5 rounded-lg dark:bg-[#2A2D3A] bg-white border-2 dark:border-[#3A3D4A] border-gray-300 dark:text-white text-gray-900 hover:border-accent-primary focus:outline-none focus:border-accent-primary transition text-sm font-medium flex items-center gap-3 min-w-[180px] justify-between"
        >
          <span className="truncate">{label}: {t[value] || t.all}</span>
          <ChevronDown size={16} className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-[25]" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-full dark:bg-[#1E2028] bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 dark:border-[#3A3D4A] border-gray-300 overflow-hidden z-[30] py-2">              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-5 py-3 text-left text-sm font-medium transition ${
                    value === option.value
                      ? 'bg-accent-primary text-white'
                      : 'dark:hover:bg-[#2A2D3A] hover:bg-gray-100 dark:text-white text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout title={t.pageTitle}>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="dark:text-dark-muted text-light-muted">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const orderStatusOptions = [
    { value: 'all', label: t.all },
    { value: 'confirmed', label: t.confirmed },
    { value: 'pending', label: t.pending },
    { value: 'cancelled', label: t.cancelled },
    { value: 'delivered', label: t.delivered },
  ];

  const paymentStatusOptions = [
    { value: 'all', label: t.all },
    { value: 'paid', label: t.paid },
    { value: 'pending', label: t.pending },
    { value: 'cancelled', label: t.cancelled },
  ];

  const shippingStatusOptions = [
    { value: 'all', label: t.all },
    { value: 'delivered', label: t.delivered },
    { value: 'pending', label: t.pending },
    { value: 'return', label: t.return },
  ];

  return (
    <Layout title={t.pageTitle}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(108, 99, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(108, 99, 255, 0.5);
        }
      `}</style>

      <div className="space-y-4">
        {/* Filters - SOLID BACKGROUND */}
        <div className="dark:bg-[#1E2028] bg-white p-4 rounded-2xl border dark:border-white/10 border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-dark-muted text-light-muted" size={16} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-lg dark:bg-dark-surface bg-white border dark:border-white/20 border-gray-300 dark:text-white text-gray-900 placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded dark:hover:bg-white/5 hover:bg-black/5 transition"
                >
                  <X size={14} className="dark:text-dark-muted text-light-muted" />
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <CustomDropdown
                value={orderStatusFilter}
                onChange={setOrderStatusFilter}
                options={orderStatusOptions}
                label={t.orderStatus}
                isOpen={showOrderStatusDropdown}
                setIsOpen={(isOpen) => {
                  setShowOrderStatusDropdown(isOpen);
                  if (isOpen) {
                    setShowPaymentDropdown(false);
                    setShowShippingDropdown(false);
                  }
                }}
              />

              <CustomDropdown
                value={paymentStatusFilter}
                onChange={setPaymentStatusFilter}
                options={paymentStatusOptions}
                label={t.paymentStatus}
                isOpen={showPaymentDropdown}
                setIsOpen={(isOpen) => {
                  setShowPaymentDropdown(isOpen);
                  if (isOpen) {
                    setShowOrderStatusDropdown(false);
                    setShowShippingDropdown(false);
                  }
                }}
              />

              <CustomDropdown
                value={shippingStatusFilter}
                onChange={setShippingStatusFilter}
                options={shippingStatusOptions}
                label={t.shippingStatus}
                isOpen={showShippingDropdown}
                setIsOpen={(isOpen) => {
                  setShowShippingDropdown(isOpen);
                  if (isOpen) {
                    setShowOrderStatusDropdown(false);
                    setShowPaymentDropdown(false);
                  }
                }}
              />

              {(searchQuery || orderStatusFilter !== 'all' || paymentStatusFilter !== 'all' || shippingStatusFilter !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-lg dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 dark:text-white text-gray-900 font-medium transition text-sm"
                >
                  {t.resetFilters}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass dark:glass glass-light p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold dark:text-dark-text text-light-text">
              {t.pageTitle}
            </h2>
            {filteredOrders.length > 0 && (
              <span className="text-xs dark:text-dark-muted text-light-muted">
                {t.showing} {filteredOrders.length} {t.of} {orders.length}
              </span>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="dark:text-dark-muted text-light-muted">{t.noOrders}</p>
            </div>
          ) : (
            <div
              onScroll={handleScroll}
              className="overflow-x-auto overflow-y-auto custom-scrollbar"
              style={{ maxHeight: '600px' }}
            >
              <table className="w-full">
                <thead className="sticky top-0 dark:bg-dark-surface bg-white z-[5]">
                  <tr className="border-b-2 dark:border-white/10 border-gray-300">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.orderNumber}
                    </th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.country}
                    </th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.placedAt}
                    </th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.orderStatusLabel}
                    </th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.payment}
                    </th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.shipping}
                    </th>
                    <th className="text-right py-2.5 px-3 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.total}
                    </th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <>
                      <tr
                        key={order.id}
                        className="border-b dark:border-white/5 border-gray-200 dark:hover:bg-white/5 hover:bg-black/5 transition cursor-pointer"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <td className="py-2.5 px-3 dark:text-white text-gray-900 font-semibold text-sm">
                          {order.order_number}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {getCountryFlag(order.country_code)}
                        </td>
                        <td className="py-2.5 px-3 dark:text-dark-muted text-light-muted text-sm">
                          {formatDate(order.placed_at)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-sm font-bold dark:text-white text-gray-900">
                            {getStatusText(order.order_status)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-sm font-bold dark:text-white text-gray-900">
                            {getStatusText(order.payment_status)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${getStatusColor(order.shipping_status, 'shipping')}`}>
                            {getStatusText(order.shipping_status)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right dark:text-white text-gray-900 font-bold text-sm">
                          {order.total_amount} {order.currency}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {expandedOrderId === order.id ? (
                            <ChevronUp size={18} className="mx-auto text-accent-primary" />
                          ) : (
                            <ChevronDown size={18} className="mx-auto dark:text-dark-muted text-light-muted" />
                          )}
                        </td>
                      </tr>

                      {expandedOrderId === order.id && (
                        <tr className="border-b-2 dark:border-white/10 border-gray-300 dark:bg-white/5 bg-gray-50">
                          <td colSpan="8" className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase flex items-center gap-1.5 mb-1">
                                  <User size={12} />
                                  {t.customer}
                                </label>
                                <p className="text-sm dark:text-white text-gray-900 font-medium">
                                  {order.customer_name}
                                </p>
                              </div>

                              <div>
                                <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase flex items-center gap-1.5 mb-1">
                                  <Phone size={12} />
                                  {t.phone}
                                </label>
                                <p className="text-sm dark:text-white text-gray-900">
                                  {order.customer_phone || '-'}
                                </p>
                              </div>

                              {order.customer_email && (
                                <div>
                                  <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase flex items-center gap-1.5 mb-1">
                                    <Mail size={12} />
                                    {t.email}
                                  </label>
                                  <p className="text-sm dark:text-white text-gray-900 truncate">
                                    {order.customer_email}
                                  </p>
                                </div>
                              )}

                              <div>
                                <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase flex items-center gap-1.5 mb-1">
                                  <Calendar size={12} />
                                  {t.placedAt}
                                </label>
                                <p className="text-sm dark:text-white text-gray-900">
                                  {formatDateTime(order.placed_at)}
                                </p>
                              </div>

                              {order.shop && (
                                <div>
                                  <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase flex items-center gap-1.5 mb-1">
                                    <Store size={12} />
                                    {t.shop}
                                  </label>
                                  <p className="text-sm dark:text-white text-gray-900">
                                    {order.shop.name}
                                  </p>
                                </div>
                              )}

                              <div>
                                <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase flex items-center gap-1.5 mb-1">
                                  <CreditCard size={12} />
                                  {t.paymentMethod}
                                </label>
                                <p className="text-sm dark:text-white text-gray-900 capitalize">
                                  {t[order.payment_method] || order.payment_method}
                                </p>
                              </div>

                              {order.notes && (
                                <div className="md:col-span-2 lg:col-span-3">
                                  <label className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase flex items-center gap-1.5 mb-1">
                                    <FileText size={12} />
                                    {t.notes}
                                  </label>
                                  <p className="text-sm dark:text-white text-gray-900">
                                    {order.notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 mt-4">
                              {order.shopify_order_id && (
                                <button className="px-4 py-2 rounded-lg dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 dark:text-white text-gray-900 font-medium transition text-xs flex items-center gap-2">
                                  <ExternalLink size={14} />
                                  {t.openInShopify}
                                </button>
                              )}

                              {order.shipping_status !== 'return' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsReturn(order.id);
                                  }}
                                  className="px-4 py-2 rounded-lg dark:bg-error/10 bg-error/10 dark:hover:bg-error/20 hover:bg-error/20 text-error font-medium transition text-xs flex items-center gap-2"
                                >
                                  <RotateCcw size={14} />
                                  {t.markAsReturn}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>

              {loadingMore && (
                <div className="py-3 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-accent-primary">
                    <div className="w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs">{t.loadingMore}</span>
                  </div>
                </div>
              )}

              {!hasMore && filteredOrders.length > 0 && !loadingMore && (
                <div className="py-2 text-center">
                  <span className="text-xs dark:text-dark-muted text-light-muted">
                    {t.noMoreOrders}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;