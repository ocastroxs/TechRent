'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Restaurar usuário do localStorage ao montar
  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      try {
        setUsuario(JSON.parse(storedUsuario));
      } catch (e) {
        console.error('Erro ao restaurar usuário:', e);
      }
    }
  }, []);

  const login = useCallback(async (email, senha) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario: usuarioData } = response.data;

      // Armazenar token e usuário
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      setUsuario(usuarioData);

      // Redirecionar baseado no nível de acesso
      if (usuarioData.nivel_acesso === 'admin') {
        router.push('/admin');
      } else if (usuarioData.nivel_acesso === 'tecnico') {
        router.push('/tecnico');
      } else {
        router.push('/cliente');
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao fazer login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [router]);

  const registro = useCallback(async (nome, email, senha, nivel_acesso = 'cliente') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/registro', {
        nome,
        email,
        senha,
        nivel_acesso,
      });

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao registrar';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    router.push('/login');
  }, [router]);

  return {
    usuario,
    loading,
    error,
    login,
    registro,
    logout,
    isAuthenticated: !!usuario,
  };
}
