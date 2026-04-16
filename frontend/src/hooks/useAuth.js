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
    const storedToken = localStorage.getItem('token');

    if (storedUsuario && storedToken) {
      try {
        // Validar se é um JSON válido e não é a string "undefined"
        if (storedUsuario === 'undefined' || storedUsuario === 'null') {
          // Limpar localStorage se tiver valores inválidos
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
          return;
        }

        const usuarioData = JSON.parse(storedUsuario);
        
        // Validar se o objeto tem as propriedades esperadas
        if (usuarioData && usuarioData.id && usuarioData.email) {
          setUsuario(usuarioData);
        } else {
          // Limpar se o objeto não tiver as propriedades necessárias
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
        }
      } catch (e) {
        console.error('Erro ao restaurar usuário:', e);
        // Limpar localStorage se houver erro de parsing
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = useCallback(async (email, senha) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token } = response.data;

      // Validar se o token foi retornado
      if (!token) {
        throw new Error('Token não foi retornado pelo servidor');
      }

      // Decodificar o token para extrair os dados do usuário (sem verificar assinatura)
      // Formato do JWT: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token inválido');
      }

      // Decodificar o payload (segunda parte do token)
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
      
      const usuarioData = {
        id: payload.id,
        nome: payload.nome,
        email: payload.email,
        nivel_acesso: payload.nivel_acesso,
      };

      // Validar se o usuário tem os dados necessários
      if (!usuarioData.id || !usuarioData.email) {
        throw new Error('Dados do usuário inválidos');
      }

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
      const errorMessage = err.response?.data?.mensagem || err.message || 'Erro ao fazer login';
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
