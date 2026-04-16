'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function useManutencao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registrar = useCallback(async (chamado_id, descricao) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/manutencao', {
        chamado_id,
        descricao,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao registrar manutenção';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    registrar,
  };
}
