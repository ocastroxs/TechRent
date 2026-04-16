'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function useChamados() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/chamados');
      setChamados(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao listar chamados';
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
      const response = await api.get(`/chamados/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao buscar chamado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (titulo, descricao, equipamento_id, prioridade) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/chamados', {
        titulo,
        descricao,
        equipamento_id,
        prioridade,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao criar chamado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarStatus = useCallback(async (id, status, tecnico_id = null) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { status };
      if (tecnico_id) {
        payload.tecnico_id = tecnico_id;
      }
      const response = await api.put(`/chamados/${id}/status`, payload);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao atualizar status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    chamados,
    loading,
    error,
    listar,
    buscarPorId,
    criar,
    atualizarStatus,
  };
}
