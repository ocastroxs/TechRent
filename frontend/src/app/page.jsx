'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se há token armazenado
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (token && usuario) {
      try {
        const usuarioData = JSON.parse(usuario);
        // Redirecionar baseado no nível de acesso
        if (usuarioData.nivel_acesso === 'admin') {
          router.push('/admin');
        } else if (usuarioData.nivel_acesso === 'tecnico') {
          router.push('/tecnico');
        } else {
          router.push('/cliente');
        }
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4 animate-pulse">
          <span className="text-2xl font-bold text-white">TR</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">TechRent</h1>
        <p className="text-gray-600 mt-2">Carregando...</p>
      </div>
    </div>
  );
}
