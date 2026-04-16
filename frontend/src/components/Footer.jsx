'use client';
import { Monitor } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Monitor className="w-4 h-4" />
            <span>TechRent — Sistema de Gestão de TI</span>
          </div>
          <p className="text-slate-600 text-xs">
            © {year} TechRent. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
