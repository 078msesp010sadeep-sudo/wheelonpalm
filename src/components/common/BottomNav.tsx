import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Car, AlertTriangle, Calendar, ShoppingBag, Bike } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const tabs = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Garage', path: '/garage', icon: Car },
    { name: 'Buy/Rent', path: '/marketplace', icon: Bike },
    { name: 'SOS Help', path: '/sos', icon: AlertTriangle, isSos: true },
    { name: 'Shop', path: '/parts', icon: ShoppingBag },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all ${
                tab.isSos
                  ? isActive
                    ? 'text-red-400 font-bold scale-105'
                    : 'text-red-400/80 hover:text-red-300'
                  : isActive
                  ? 'text-teal-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${tab.isSos ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.isSos && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
