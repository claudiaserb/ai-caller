import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Eye } from 'lucide-react';
import CallDetailsModal from '../components/CallDetailsModal';

const Dashboard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [calls, setCalls] = useState([]);
  const [aiSettings, setAiSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedCall, setSelectedCall] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCalls: 0,
    successRate: 0,
    confirmed: 0,
    busy: 0,
    failed: 0,
    pending: 0,
  });

  const CALLS_PER_PAGE = 10;

  const translations = {
    EN: {
      pageTitle: 'Dashboard',
      aiAgentStatus: 'AI Agent Status',
      active: 'Active',
      inactive: 'Inactive',
      totalOrdersCalls: 'Total Orders & Calls',
      successRate: 'Success Rate',
      recentCalls: 'Recent Calls',
      customer: 'Customer',
      dateTime: 'Date / Time',
      status: 'Status',
      action: 'Action',
      viewDetails: 'View Details',
      reportsInsights: 'Reports / Insights',
      increaseThisMonth: 'Increase this month',
      confirmed: 'Confirmed',
      busy: 'Busy',
      failed: 'Failed',
      pending: 'Pending',
      noCalls: 'No calls yet',
      loadingMore: 'Loading more...',
      noMoreCalls: 'No more calls to load',
    },
    RO: {
      pageTitle: 'Tablou de Bord',
      aiAgentStatus: 'Status Agent AI',
      active: 'Activ',
      inactive: 'Inactiv',
      totalOrdersCalls: 'Total Comenzi & Apeluri',
      successRate: 'Rată de Succes',
      recentCalls: 'Apeluri Recente',
      customer: 'Client',
      dateTime: 'Data / Ora',
      status: 'Status',
      action: 'Acțiune',
      viewDetails: 'Vezi Detalii',
      reportsInsights: 'Rapoarte / Statistici',
      increaseThisMonth: 'Creștere luna aceasta',
      confirmed: 'Confirmat',
      busy: 'Ocupat',
      failed: 'Eșuat',
      pending: 'În Așteptare',
      noCalls: 'Niciun apel încă',
      loadingMore: 'Se încarcă...',
      noMoreCalls: 'Nu mai sunt apeluri',
    },
  };

  const t = translations[language];

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load AI settings
        const { data: settingsData } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setAiSettings(settingsData);

        // Get total count for stats
        const { count } = await supabase
          .from('calls')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Load first page of calls
        const { data: callsData, error } = await supabase
          .from('calls')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(0, CALLS_PER_PAGE - 1);

        if (error) throw error;

        setCalls(callsData || []);
        setOffset(CALLS_PER_PAGE);
        setHasMore((count || 0) > CALLS_PER_PAGE);

        // Calculate stats from all calls
        const { data: allCallsData } = await supabase
          .from('calls')
          .select('status')
          .eq('user_id', user.id);

        const totalCalls = count || 0;
        const confirmed = allCallsData?.filter(c => c.status === 'Confirmed').length || 0;
        const successRate = totalCalls > 0 ? Math.round((confirmed / totalCalls) * 100) : 0;

        setStats({
          totalCalls,
          successRate,
          confirmed,
          busy: allCallsData?.filter(c => c.status === 'Busy').length || 0,
          failed: allCallsData?.filter(c => c.status === 'Failed').length || 0,
          pending: allCallsData?.filter(c => c.status === 'Pending').length || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Load more calls function
  const loadMoreCalls = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + CALLS_PER_PAGE - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        setCalls(prev => [...prev, ...data]);
        setOffset(prev => prev + data.length);
        setHasMore(data.length === CALLS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more calls:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > 0.8 && !loadingMore && hasMore) {
      loadMoreCalls();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-success/10 text-success';
      case 'Busy':
        return 'bg-warning/10 text-warning';
      case 'Failed':
        return 'bg-error/10 text-error';
      case 'Pending':
        return 'bg-accent-primary/10 text-accent-primary';
      default:
        return 'bg-gray-500/10 text-gray-500';
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

  const isAiActive = () => {
    if (!aiSettings) return false;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = aiSettings.start_time.split(':').map(Number);
    const [endHour, endMin] = aiSettings.end_time.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    return currentTime >= startTime && currentTime <= endTime;
  };

  const handleViewDetails = (call) => {
    setSelectedCall(call);
    setIsModalOpen(true);
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

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass dark:glass glass-light p-6 rounded-2xl">
            <h3 className="text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
              {t.aiAgentStatus}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold dark:text-dark-text text-light-text">
                {isAiActive() ? t.active : t.inactive}
              </span>
              <div className={`w-2 h-2 rounded-full ${isAiActive() ? 'bg-success' : 'bg-gray-400'} shadow-lg ${isAiActive() ? 'shadow-success/50' : ''}`}></div>
            </div>
          </div>

          <div className="glass dark:glass glass-light p-6 rounded-2xl">
            <h3 className="text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
              {t.totalOrdersCalls}
            </h3>
            <span className="text-2xl font-bold dark:text-dark-text text-light-text">
              {stats.totalCalls}
            </span>
          </div>

          <div className="glass dark:glass glass-light p-6 rounded-2xl">
            <h3 className="text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
              {t.successRate}
            </h3>
            <span className="text-2xl font-bold dark:text-dark-text text-light-text">
              {stats.successRate}%
            </span>
          </div>
        </div>

        {/* Recent Calls Table - COMPACT cu FONT MARE */}
        <div className="glass dark:glass glass-light p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold dark:text-dark-text text-light-text">
              {t.recentCalls}
            </h2>
            {calls.length > 0 && (
              <span className="text-sm dark:text-dark-muted text-light-muted">
                {calls.length} / {stats.totalCalls}
              </span>
            )}
          </div>

          {calls.length === 0 ? (
            <div className="text-center py-8">
              <p className="dark:text-dark-muted text-light-muted">{t.noCalls}</p>
            </div>
          ) : (
            <div
              onScroll={handleScroll}
              className="overflow-x-auto overflow-y-auto custom-scrollbar"
              style={{ maxHeight: '280px' }}
            >
              <table className="w-full">
                <thead className="sticky top-0 dark:bg-dark-surface bg-white z-10">
                  <tr className="border-b dark:border-white/10 border-gray-200/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.customer}
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.dateTime}
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.status}
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold dark:text-dark-muted text-light-muted bg-inherit uppercase tracking-wider">
                      {t.action}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call, index) => (
                    <tr
                      key={`${call.id}-${index}`}
                      className="border-b dark:border-white/5 border-gray-200/30 dark:hover:bg-white/5 hover:bg-black/5 transition"
                    >
                      <td className="py-3 px-4 dark:text-dark-text text-light-text font-semibold text-sm">
                        {call.customer_name}
                      </td>
                      <td className="py-3 px-4 dark:text-dark-muted text-light-muted text-sm">
                        {formatDateTime(call.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            call.status
                          )}`}
                        >
                          {getStatusText(call.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetails(call)}
                          className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition"
                        >
                          <Eye size={16} />
                          <span className="text-sm font-medium">{t.viewDetails}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Loading indicator */}
              {loadingMore && (
                <div className="py-4 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-accent-primary">
                    <div className="w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">{t.loadingMore}</span>
                  </div>
                </div>
              )}

              {/* No more data indicator */}
              {!hasMore && calls.length > 0 && !loadingMore && (
                <div className="py-3 text-center">
                  <span className="text-sm dark:text-dark-muted text-light-muted">
                    {t.noMoreCalls}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reports Widget */}
        <div className="glass dark:glass glass-light p-6 rounded-2xl">
          <h2 className="text-lg font-semibold dark:text-dark-text text-light-text mb-2">
            {t.reportsInsights}
          </h2>
          <div className="text-center py-8">
            <span className="text-3xl font-bold text-success">
              {stats.successRate > 0 ? `+${stats.successRate}%` : '0%'}
            </span>
            <p className="text-sm dark:text-dark-muted text-light-muted mt-2">
              {t.increaseThisMonth}
            </p>
          </div>
        </div>
      </div>

      {/* Call Details Modal */}
      <CallDetailsModal
        call={selectedCall}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default Dashboard;