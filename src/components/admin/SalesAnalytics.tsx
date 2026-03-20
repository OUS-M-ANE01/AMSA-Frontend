import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Calendar, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { exportSalesPDF } from '../../utils/exportSalesPDF';

interface SalesData {
  _id: string;
  totalSales: number;
  orderCount: number;
  averageOrder: number;
}

interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrder: number;
  growth: number;
}

export default function SalesAnalytics() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, [period]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSalesData(period);
      console.log('📊 Sales API Response:', response.data);
      // Les données de ventes sont dans salesByDay
      const apiData = response.data.data || {};
      const data = apiData.salesByDay || [];
      
      console.log('📊 Sales Data (salesByDay):', data);
      console.log('📊 Data length:', data.length);
      
      // Formater les données pour le graphique
      const formattedData = data.map((item: any) => {
        let label = '';
        if (item._id && typeof item._id === 'object') {
          const { day, month, year } = item._id;
          const monthNames = ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
          
          if (day && month) {
            // Format: "16 Mars" pour les jours
            label = `${day} ${monthNames[month - 1]}`;
          } else if (month && year) {
            // Format: "Mars 2024" pour les mois
            label = `${monthNames[month - 1]} ${year}`;
          } else if (year) {
            // Format: "2024" pour les années
            label = String(year);
          } else {
            label = String(item._id);
          }
        } else {
          label = String(item._id);
        }
        
        return {
          _id: label,
          totalSales: item.totalSales || 0,
          orderCount: item.orderCount || 0,
          averageOrder: item.orderCount > 0 ? item.totalSales / item.orderCount : 0
        };
      });
      
      const totalRevenue = formattedData.reduce((sum: number, item: any) => sum + item.totalSales, 0);
      const totalOrders = formattedData.reduce((sum: number, item: any) => sum + item.orderCount, 0);
      const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      setSalesData(formattedData);
      setStats({
        totalRevenue,
        totalOrders,
        averageOrder,
        growth: 12.5
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des ventes');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    if (!stats) {
      toast.error('Aucune donnée à exporter');
      return;
    }
    
    try {
      await exportSalesPDF(salesData, stats, period);
      toast.success('PDF généré avec succès!');
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const periodLabels = {
    week: 'Semaine',
    month: 'Mois',
    year: 'Année'
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #E8E0D5',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>{payload[0].payload._id}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
              {entry.name === 'totalSales' ? 'Revenu' : 'Commandes'}: {' '}
              {entry.name === 'totalSales' 
                ? `${Number(entry.value).toLocaleString('fr-FR')} FCFA`
                : entry.value
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-[#8B7355]" size={24} />
          <h2 className="text-xl font-bold text-[#3A3A3A]">Analyse des Ventes</h2>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-white text-[#3A3A3A] border border-[#E8E0D5] hover:border-[#8B7355]'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-[#3A3A3A] border border-[#E8E0D5] hover:border-[#8B7355] flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Revenu Total</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#3A3A3A]">
              {stats.totalRevenue.toLocaleString('fr-FR')} F
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+{stats.growth}%</span>
              <span className="text-sm text-gray-500">vs période précédente</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Nombre de Ventes</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#3A3A3A]">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500 mt-2">commandes</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Panier Moyen</p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#3A3A3A]">
              {stats.averageOrder.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F
            </p>
            <p className="text-sm text-gray-500 mt-2">par commande</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Période</p>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#3A3A3A]">{periodLabels[period]}</p>
            <p className="text-sm text-gray-500 mt-2">{salesData.length} points de données</p>
          </div>
        </div>
      )}

      {/* Graphique */}
      <div className="bg-white rounded-xl p-6 border border-[#E8E0D5]">
        <h3 className="text-lg font-bold text-[#3A3A3A] mb-4">Évolution des Ventes</h3>
        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="_id" 
                stroke="#666" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  if (value === 'totalSales') return 'Revenu (FCFA)';
                  if (value === 'orderCount') return 'Nombre de commandes';
                  return value;
                }}
              />
              <Bar dataKey="totalSales" fill="#8B7355" radius={[8, 8, 0, 0]} />
              <Bar dataKey="orderCount" fill="#D4C4B0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <TrendingUp size={48} className="mb-4 opacity-50" />
            <p>Aucune donnée de vente pour cette période</p>
          </div>
        )}
      </div>

      {/* Tableau détaillé */}
      {salesData.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E8E0D5] overflow-hidden">
          <div className="p-6 border-b border-[#E8E0D5]">
            <h3 className="text-lg font-bold text-[#3A3A3A]">Détails par Période</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F1ED]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">
                    Revenu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">
                    Commandes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">
                    Panier Moyen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D5]">
                {salesData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F1ED]/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3A3A3A]">
                      {item._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3A3A3A]">
                      {item.totalSales.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3A3A3A]">
                      {item.orderCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3A3A3A]">
                      {item.averageOrder.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
