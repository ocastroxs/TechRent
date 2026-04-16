'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function useEquipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/equipamentos');
      setEquipamentos(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao listar equipamentos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/equipamentos/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao buscar equipamento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    equipamentos,
    loading,
    error,
    listar,
    buscarPorId,
  };
}
