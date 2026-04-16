'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LayoutDashboard, Monitor } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/equipamentos', label: 'Equipamentos', icon: Monitor },
];

export default function AdminHeader() {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
              <span className="text-sm font-bold text-white">TR</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-none">TechRent</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Admin</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">
                  {usuario?.nome?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">{usuario?.nome}</p>
                <p className="text-xs text-slate-500 leading-none mt-0.5">Administrador</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-200 text-sm font-medium border border-red-500/20 hover:border-red-500/30"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-slate-800/50 px-4 py-2 flex items-center gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive ? 'bg-indigo-500/15 text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
