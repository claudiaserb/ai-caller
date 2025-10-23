import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye } from 'lucide-react';

const Dashboard = () => {
  const { language } = useLanguage();

  const translations = {
    EN: {
      pageTitle: 'Dashboard',
      aiAgentStatus: 'AI Agent Status',
      active: 'Active',
      totalOrdersCalls: 'Total Orders & Calls',
      successRate: 'Success Rate',
      recentCalls: 'Recent Calls',
      customer: 'Customer',
      duration: 'Duration',
      status: 'Status',
      action: 'Action',
      viewDetails: 'View Details',
      reportsInsights: 'Reports / Insights',
      increaseThisMonth: 'Increase this month',
      confirmed: 'Confirmed',
      busy: 'Busy',
      failed: 'Failed',
      pending: 'Pending',
    },
    RO: {
      pageTitle: 'Tablou de Bord',
      aiAgentStatus: 'Status Agent AI',
      active: 'Activ',
      totalOrdersCalls: 'Total Comenzi & Apeluri',
      successRate: 'Rată de Succes',
      recentCalls: 'Apeluri Recente',
      customer: 'Client',
      duration: 'Durată',
      status: 'Status',
      action: 'Acțiune',
      viewDetails: 'Vezi Detalii',
      reportsInsights: 'Rapoarte / Statistici',
      increaseThisMonth: 'Creștere luna aceasta',
      confirmed: 'Confirmat',
      busy: 'Ocupat',
      failed: 'Eșuat',
      pending: 'În Așteptare',
    },
  };

  const t = translations[language];

  const recentCalls = [
    { id: 1, customer: 'Jane Doe', duration: '2:34', status: 'Confirmed' },
    { id: 2, customer: 'Jane Smith', duration: '1:45', status: 'Busy' },
    { id: 3, customer: 'Peter Jones', duration: '3:12', status: 'Failed' },
    { id: 4, customer: 'Mary Johnson', duration: '2:03', status: 'Pending' },
  ];

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

  return (
    <Layout title={t.pageTitle}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass dark:glass glass-light p-6 rounded-2xl">
            <h3 className="text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
              {t.aiAgentStatus}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold dark:text-dark-text text-light-text">
                {t.active}
              </span>
              <div className="w-2 h-2 rounded-full bg-success shadow-lg shadow-success/50"></div>
            </div>
          </div>

          <div className="glass dark:glass glass-light p-6 rounded-2xl">
            <h3 className="text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
              {t.totalOrdersCalls}
            </h3>
            <span className="text-2xl font-bold dark:text-dark-text text-light-text">
              1,248
            </span>
          </div>

          <div className="glass dark:glass glass-light p-6 rounded-2xl">
            <h3 className="text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
              {t.successRate}
            </h3>
            <span className="text-2xl font-bold dark:text-dark-text text-light-text">
              95%
            </span>
          </div>
        </div>

        <div className="glass dark:glass glass-light p-6 rounded-2xl">
          <h2 className="text-lg font-semibold dark:text-dark-text text-light-text mb-4">
            {t.recentCalls}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-white/10 border-gray-200/50">
                  <th className="text-left py-3 px-4 text-sm font-medium dark:text-dark-muted text-light-muted">
                    {t.customer}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium dark:text-dark-muted text-light-muted">
                    {t.duration}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium dark:text-dark-muted text-light-muted">
                    {t.status}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium dark:text-dark-muted text-light-muted">
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="border-b dark:border-white/5 border-gray-200/30 dark:hover:bg-white/5 hover:bg-black/5 transition"
                  >
                    <td className="py-3 px-4 dark:text-dark-text text-light-text font-medium">
                      {call.customer}
                    </td>
                    <td className="py-3 px-4 dark:text-dark-muted text-light-muted">
                      {call.duration}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          call.status
                        )}`}
                      >
                        {getStatusText(call.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition">
                        <Eye size={16} />
                        <span className="text-sm font-medium">{t.viewDetails}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass dark:glass glass-light p-6 rounded-2xl">
          <h2 className="text-lg font-semibold dark:text-dark-text text-light-text mb-2">
            {t.reportsInsights}
          </h2>
          <div className="text-center py-8">
            <span className="text-3xl font-bold text-success">+25%</span>
            <p className="text-sm dark:text-dark-muted text-light-muted mt-2">
              {t.increaseThisMonth}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;