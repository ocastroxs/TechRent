'use client';
import { useEffect, useState } from 'react';

export default function StatCard({ icon: Icon, label, value, color, bgColor, borderColor, trend, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;

  useEffect(() => {
    if (numericValue === 0) { setDisplayed(0); return; }
    const duration = 800;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayed(numericValue);
          clearInterval(interval);
        } else {
          setDisplayed(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  return (
    <div
      className={`glass rounded-xl p-6 border ${borderColor || 'border-slate-700/50'} card-hover group animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
          <p className={`text-3xl font-extrabold ${color || 'text-white'} tabular-nums`}>
            {typeof value === 'number' ? displayed : value}
          </p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% este mês
            </p>
          )}
        </div>
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bgColor || 'bg-slate-700/50'} border ${borderColor || 'border-slate-600/50'} group-hover:scale-110 transition-transform duration-300`}>
          {Icon && <Icon className={`w-6 h-6 ${color || 'text-white'}`} />}
        </div>
      </div>
    </div>
  );
}
