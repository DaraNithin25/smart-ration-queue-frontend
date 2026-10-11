import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Home,
  CalendarCheck,
  Ticket,
  User,
  HelpCircle,
  LogOut,
  CalendarDays,
  Package,
  QrCode,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  UserPlus,
  Store,
  Layers,
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'BENEFICIARY';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (role === 'ADMIN') {
      return [
        { label: 'Dashboard', path: '/admin', icon: Home },
        { label: 'Create Dealer', path: '/admin/create-dealer', icon: UserPlus },
        { label: 'Link Dealer to Shop', path: '/admin/link-shop', icon: Store },
        { label: 'Manage FPS', path: '/admin/fps', icon: Layers, comingSoon: true },
        { label: 'Users & Roles', path: '/admin/users', icon: Users, comingSoon: true },
        { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3, comingSoon: true },
        { label: 'System Settings', path: '/admin/settings', icon: Settings, comingSoon: true },
      ];
    }

    if (role === 'DEALER') {
      return [
        { label: 'Dashboard', path: '/dealer', icon: Home },
        { label: 'Manage Slots', path: '/dealer/slots', icon: CalendarDays },
        { label: "Today's Bookings", path: '/dealer/today', icon: Users, comingSoon: true },
        { label: 'Ration Stock', path: '/dealer/stock', icon: Package, comingSoon: true },
        { label: 'Verify Token', path: '/dealer/verify', icon: QrCode, comingSoon: true },
        { label: 'Shop Profile', path: '/dealer/profile', icon: User },
      ];
    }

    // Default to BENEFICIARY
    return [
      { label: 'Home', path: '/beneficiary', icon: Home },
      { label: 'Book Slot', path: '/beneficiary/book-slot', icon: CalendarCheck },
      { label: 'My Bookings', path: '/beneficiary/my-bookings', icon: Ticket },
      { label: 'My Profile', path: '/beneficiary/profile', icon: User },
      { label: 'Help & FAQs', path: '/beneficiary/help', icon: HelpCircle },
    ];
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
          <Sprout className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h2 className="font-extrabold text-slate-900 text-sm tracking-tight leading-tight">
            Smart Ration Queue
          </h2>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {role === 'ADMIN' ? 'Admin Portal' : role === 'DEALER' ? 'Dealer Portal' : 'Beneficiary'}
          </span>
        </div>
      </div>

      {/* User profile card */}
      <div className="mx-4 my-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
          <p className="text-[10px] text-slate-500 truncate">{user?.mobile || 'No Mobile'}</p>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-3 space-y-1.5 overflow-y-auto py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/beneficiary' || item.path === '/dealer' || item.path === '/admin'}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-100/90 text-emerald-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.comingSoon && (
                <span className="text-[9px] font-medium bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
