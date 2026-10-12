import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Car, 
  Bike,
  AlertTriangle, 
  Calendar, 
  ShoppingBag, 
  FileText, 
  User, 
  LogOut, 
  Shield, 
  Menu, 
  X,
  ChevronDown,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Car },
    { name: 'My Garage', path: '/garage', icon: Car },
    { name: 'Buy & Rent', path: '/marketplace', icon: Bike },
    { name: 'Intelligence', path: '/intelligence', icon: Compass },
    { name: 'Services', path: '/services', icon: Wrench },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Emergency SOS', path: '/sos', icon: AlertTriangle, isSos: true },
    { name: 'Spare Parts', path: '/parts', icon: ShoppingBag },
    { name: 'Documents', path: '/documents', icon: FileText },
  ];

  const roleNames: Record<UserRole, string> = {
    customer: 'Vehicle Owner',
    workshop: 'Workshop Provider',
    roadside: 'Roadside Patrol',
    admin: 'Platform Admin',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 transition-colors">
              <Wrench className="w-5 h-5 text-teal-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                WheelOn<span className="text-teal-400">Palm</span>
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links */}
          {user && (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                      link.isSos
                        ? active
                          ? 'text-red-400 font-semibold'
                          : 'text-red-300 hover:text-red-200 flex items-center gap-1'
                        : active
                        ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.isSos && <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>}
                    {link.name}
                  </Link>
                );
              })}

              {/* Privileged Portals */}
              {(user.role === 'workshop' || user.role === 'roadside' || user.role === 'admin') && (
                <Link
                  to="/provider"
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 text-xs font-semibold uppercase tracking-wider ${
                    isActive('/provider') ? 'text-teal-300 border-b-2 border-teal-300' : 'text-teal-400/90 hover:text-teal-200'
                  }`}
                >
                  Provider Portal
                </Link>
              )}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 text-xs font-semibold uppercase tracking-wider ${
                    isActive('/admin') ? 'text-amber-400 border-b-2 border-amber-400' : 'text-amber-300/90 hover:text-amber-200'
                  }`}
                >
                  Admin Portal
                </Link>
              )}
            </nav>
          )}

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <>
                {/* Role Switcher for preview demonstration */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
                    title="Switch active role mode for review"
                  >
                    <Shield className="w-3.5 h-3.5 text-teal-400" />
                    <span>{roleNames[user.role]}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isRoleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        Test Role Persona
                      </div>
                      {(['customer', 'workshop', 'roadside', 'admin'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchDemoRole(r);
                            setIsRoleMenuOpen(false);
                            if (r === 'admin') navigate('/admin');
                            else if (r === 'workshop' || r === 'roadside') navigate('/provider');
                            else navigate('/dashboard');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700 transition-colors ${
                            user.role === r ? 'text-teal-400 font-semibold bg-slate-750' : 'text-slate-300'
                          }`}
                        >
                          <span>{roleNames[r]}</span>
                          {user.role === r && <span className="text-teal-400 text-[10px]">Active</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile Menu Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-teal-400/50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-semibold text-xs flex items-center justify-center">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] text-teal-400 font-medium">
                          {roleNames[user.role]} (Nepal)
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile & Settings</span>
                      </Link>

                      <Link
                        to="/documents"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>Bluebook & Documents</span>
                      </Link>

                      <div className="border-t border-slate-700 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-slate-700 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                  aria-label="Toggle navigation"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && user && (
        <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-slate-700 text-teal-400' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${link.isSos ? 'text-red-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="border-t border-slate-700 pt-2 mt-2">
            <Link
              to="/provider"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-teal-300 uppercase tracking-wider"
            >
              <Shield className="w-4 h-4 text-teal-400" />
              <span>Provider Portal</span>
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-amber-300 uppercase tracking-wider"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
