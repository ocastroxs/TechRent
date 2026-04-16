'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminHeader from '@/components/AdminHeader';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { AlertCircle, Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

const statusConfig = {
  operacional: { label: 'Operacional', color: 'bg-green-500/20 border-green-500/30 text-green-400' },
  em_manutencao: { label: 'Em Manutenção', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' },
  desativado: { label: 'Desativado', color: 'bg-red-500/20 border-red-500/30 text-red-400' },
};

function GerenciamentoEquipamentos() {
  const { equipamentos, listar, loading } = useEquipamentos();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    patrimonio: '',
    status: 'operacional',
    descricao: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEquipamentos = async () => {
      await listar();
      setIsLoading(false);
    };
    fetchEquipamentos();
  }, [listar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nome.trim()) {
      setError('Nome do equipamento é obrigatório');
      return;
    }

    if (!formData.categoria.trim()) {
      setError('Categoria é obrigatória');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/equipamentos', {
        nome: formData.nome,
        categoria: formData.categoria,
        patrimonio: formData.patrimonio || null,
        status: formData.status,
        descricao: formData.descricao || null,
      });

      setSuccess('Equipamento cadastrado com sucesso!');
      setFormData({
        nome: '',
        categoria: '',
        patrimonio: '',
        status: 'operacional',
        descricao: '',
      });

      setTimeout(() => {
        setShowModal(false);
        listar();
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao cadastrar equipamento';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este equipamento?')) {
      try {
        await api.delete(`/equipamentos/${id}`);
        setSuccess('Equipamento deletado com sucesso!');
        listar();
      } catch (err) {
        setError('Erro ao deletar equipamento');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão voltar */}
        <Link href="/admin">
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            Voltar para Dashboard
          </button>
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciamento de Equipamentos</h1>
            <p className="text-slate-400 mt-2">Cadastre e gerencie os equipamentos do parque tecnológico</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Novo Equipamento
          </button>
        </div>

        {/* Mensagens */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Conteúdo */}
        {isLoading || loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Carregando equipamentos...</p>
            </div>
          </div>
        ) : equipamentos.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum equipamento cadastrado</h3>
            <p className="text-slate-400 mb-6">Comece adicionando o primeiro equipamento do seu parque.</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Novo Equipamento
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Nome</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Categoria</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Patrimônio</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {equipamentos.map((equip) => {
                  const statusInfo = statusConfig[equip.status] || statusConfig.operacional;
                  return (
                    <tr key={equip.id} className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors">
                      <td className="py-4 px-6 text-white font-medium">{equip.nome}</td>
                      <td className="py-4 px-6 text-slate-400">{equip.categoria}</td>
                      <td className="py-4 px-6 text-slate-400">{equip.patrimonio || '-'}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(equip.id)}
                          className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Deletar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal de Novo Equipamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Novo Equipamento</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="text-sm font-medium text-slate-200 block mb-2">
                  Nome do Equipamento
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Ex: Notebook Dell"
                  value={formData.nome}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200 disabled:opacity-50"
                />
              </div>

              {/* Categoria */}
              <div>
                <label htmlFor="categoria" className="text-sm font-medium text-slate-200 block mb-2">
                  Categoria
                </label>
                <input
                  id="categoria"
                  name="categoria"
                  type="text"
                  placeholder="Ex: Notebook, Impressora, Servidor"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200 disabled:opacity-50"
                />
              </div>

              {/* Patrimônio */}
              <div>
                <label htmlFor="patrimonio" className="text-sm font-medium text-slate-200 block mb-2">
                  Número de Patrimônio (Opcional)
                </label>
                <input
                  id="patrimonio"
                  name="patrimonio"
                  type="text"
                  placeholder="Ex: PAT-001"
                  value={formData.patrimonio}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200 disabled:opacity-50"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="text-sm font-medium text-slate-200 block mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200 disabled:opacity-50"
                >
                  <option value="operacional">Operacional</option>
                  <option value="em_manutencao">Em Manutenção</option>
                  <option value="desativado">Desativado</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="descricao" className="text-sm font-medium text-slate-200 block mb-2">
                  Descrição (Opcional)
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Informações adicionais sobre o equipamento..."
                  value={formData.descricao}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200 disabled:opacity-50"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 border border-slate-600 text-slate-300 hover:bg-slate-700/50 font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EquipamentosPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <GerenciamentoEquipamentos />
    </ProtectedRoute>
  );
}
