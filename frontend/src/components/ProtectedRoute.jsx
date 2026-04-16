'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (!token || !usuario) {
      router.push('/login');
      return;
    }

    try {
      const usuarioData = JSON.parse(usuario);
      
      if (requiredRole && usuarioData.nivel_acesso !== requiredRole) {
        router.push('/login');
        return;
      }

      setIsAuthorized(true);
    } catch (e) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">TR</span>
          </div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}
