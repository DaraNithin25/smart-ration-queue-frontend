import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { getSystemStats, getAllDealers } from '../../services/adminService';
import {
  Users,
  Store,
  Ticket,
  CalendarCheck,
  UserPlus,
  Link as LinkIcon,
  ShieldCheck,
  MapPin,
  Phone,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDealers: 0,
    totalSlots: 0,
    totalBookings: 0,
  });
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, dealersData] = await Promise.all([
        getSystemStats(),
        getAllDealers(),
      ]);
      setStats(statsData || {});
      setDealers(Array.isArray(dealersData) ? dealersData : []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Could not connect to live backend admin services. Check Spring Boot status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
            System Administration
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor Fair Price Shops, onboard dealers, and manage PDS queue infrastructure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/create-dealer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Dealer</span>
          </Link>
          <Link
            to="/admin/link-shop"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            <span>Link Dealer to Shop</span>
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

      {/* Real Live Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers || 0}
          subtext="Registered in database"
          color="emerald"
        />
        <StatCard
          icon={Store}
          title="Total Shops"
          value={stats.totalDealers || 0}
          subtext="Fair Price Outlets"
          color="blue"
        />
        <StatCard
          icon={CalendarCheck}
          title="Total Queue Slots"
          value={stats.totalSlots || 0}
          subtext="Published appointment slots"
          color="green"
        />
        <StatCard
          icon={Ticket}
          title="Total Bookings"
          value={stats.totalBookings || 0}
          subtext="Appointments booked"
          color="amber"
        />
      </div>

      {/* Fair Price Shops Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Active Fair Price Shops</h3>
            <p className="text-[11px] text-slate-500">Live directory of authorized ration distribution shops</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {dealers.length} Shops
          </span>
        </div>

        {loading ? (
          <Loading text="Loading shops directory..." />
        ) : dealers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No dealers found. Use the "Create Dealer" button above to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Shop Code</th>
                  <th className="py-3 px-4">Shop Name</th>
                  <th className="py-3 px-4">Dealer / Owner</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Daily Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dealers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {d.shopCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {d.shopName}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {d.ownerName || d.userName || 'Assigned Dealer'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {d.mobile}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {d.district}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {d.dailyCapacity} beneficiaries/day
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
