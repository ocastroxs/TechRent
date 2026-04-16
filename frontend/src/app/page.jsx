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
        router.push('/landing');
      }
    } else {
      // Se não estiver logado, vai para a landing page
      router.push('/landing');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 mb-4 animate-pulse shadow-lg shadow-indigo-500/30">
          <span className="text-2xl font-bold text-white">TR</span>
        </div>
        <h1 className="text-2xl font-bold text-white">TechRent</h1>
        <p className="text-slate-400 mt-2 font-medium">Carregando...</p>
      </div>
    </div>
  );
}
