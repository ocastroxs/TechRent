'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminHeader from '@/components/AdminHeader';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { SkeletonCard } from '@/components/ui/Skeleton';
import {
  AlertCircle, Loader2, Plus, Trash2, ArrowLeft,
  Monitor, Search, Filter, CheckCircle, X
} from 'lucide-react';
import api from '@/lib/api';

const categoriaIcons = {
  Notebook: '💻',
  Laptop: '💻',
  Desktop: '🖥️',
  Servidor: '🖧',
  Impressora: '🖨️',
  Projetor: '📽️',
  Tablet: '📱',
  Monitor: '🖥️',
  Roteador: '📡',
  Switch: '🔀',
};

const getCategoriaIcon = (categoria) => {
  if (!categoria) return '🔧';
  const key = Object.keys(categoriaIcons).find(k =>
    categoria.toLowerCase().includes(k.toLowerCase())
  );
  return key ? categoriaIcons[key] : '🔧';
};

const statusOptions = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'alugado', label: 'Alugado' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'operacional', label: 'Operacional' },
  { value: 'em_manutencao', label: 'Em Manutenção' },
  { value: 'desativado', label: 'Desativado' },
];

function GerenciamentoEquipamentos() {
  const { equipamentos, listar, loading } = useEquipamentos();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    patrimonio: '',
    status: 'disponivel',
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nome.trim()) { setError('Nome do equipamento é obrigatório'); return; }
    if (!formData.categoria.trim()) { setError('Categoria é obrigatória'); return; }

    setIsSubmitting(true);
    try {
      await api.post('/equipamentos', {
        nome: formData.nome,
        categoria: formData.categoria,
        patrimonio: formData.patrimonio || null,
        status: formData.status,
        descricao: formData.descricao || null,
      });
      setSuccess('Equipamento cadastrado com sucesso!');
      setFormData({ nome: '', categoria: '', patrimonio: '', status: 'disponivel', descricao: '' });
      setTimeout(() => { setShowModal(false); setSuccess(''); listar(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Erro ao cadastrar equipamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja deletar "${nome}"?`)) {
      try {
        await api.delete(`/equipamentos/${id}`);
        listar();
      } catch (err) {
        setError('Erro ao deletar equipamento');
      }
    }
  };

  // Filtros
  const equipamentosFiltrados = (equipamentos || []).filter(equip => {
    const matchSearch = !searchTerm ||
      equip.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.patrimonio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'todos' || equip.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Contadores por status
  const statusCounts = (equipamentos || []).reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Voltar */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">Equipamentos</h1>
            <p className="text-slate-400 mt-1">
              {equipamentos?.length || 0} equipamento{equipamentos?.length !== 1 ? 's' : ''} cadastrado{equipamentos?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => { setShowModal(true); setError(''); setSuccess(''); }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            Novo Equipamento
          </button>
        </div>

        {/* Status summary pills */}
        {!isLoading && equipamentos?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
            <button
              onClick={() => setFilterStatus('todos')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterStatus === 'todos' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
            >
              Todos ({equipamentos.length})
            </button>
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterStatus === status ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
              >
                <StatusBadge status={status} showDot size="xs" /> ({count})
              </button>
            ))}
          </div>
        )}

        {/* Search bar */}
        {!isLoading && equipamentos?.length > 0 && (
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar equipamento..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Visualização em grid"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Visualização em lista"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mensagens */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 mb-6 animate-fade-in">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}
        {error && !showModal && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Conteúdo */}
        {isLoading || loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : equipamentos.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700 mb-6">
              <Monitor className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum equipamento cadastrado</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Comece adicionando o primeiro equipamento do seu parque tecnológico.</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <Plus className="w-5 h-5" />
              Cadastrar Equipamento
            </button>
          </div>
        ) : equipamentosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-500 animate-fade-in">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nenhum equipamento encontrado para "{searchTerm}"</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipamentosFiltrados.map((equip, i) => (
              <div
                key={equip.id}
                className="glass rounded-xl p-5 border border-slate-700/50 hover:border-indigo-500/40 card-hover group animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {getCategoriaIcon(equip.categoria)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm leading-tight">{equip.nome}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{equip.categoria}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(equip.id, equip.nome)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={equip.status} showDot />
                    {equip.patrimonio && (
                      <span className="text-xs text-slate-500 font-mono">{equip.patrimonio}</span>
                    )}
                  </div>
                  {equip.descricao && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2">{equip.descricao}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/30">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Equipamento</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Categoria</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Patrimônio</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {equipamentosFiltrados.map((equip) => (
                  <tr key={equip.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getCategoriaIcon(equip.categoria)}</span>
                        <span className="text-sm font-medium text-white">{equip.nome}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-slate-400 hidden sm:table-cell">{equip.categoria}</td>
                    <td className="py-3.5 px-5 text-sm text-slate-500 font-mono hidden md:table-cell">{equip.patrimonio || '-'}</td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={equip.status} showDot />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDelete(equip.id, equip.nome)}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />

      {/* Modal de Novo Equipamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Novo Equipamento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 mb-4">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'nome', label: 'Nome do Equipamento', placeholder: 'Ex: Notebook Dell Latitude', required: true },
                { id: 'categoria', label: 'Categoria', placeholder: 'Ex: Notebook, Impressora, Servidor', required: true },
                { id: 'patrimonio', label: 'Número de Patrimônio', placeholder: 'Ex: PAT-001 (opcional)', required: false },
              ].map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="text-sm font-medium text-slate-300 block mb-1.5">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    id={field.id}
                    name={field.id}
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm transition-all disabled:opacity-50"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="status" className="text-sm font-medium text-slate-300 block mb-1.5">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm transition-all disabled:opacity-50"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="descricao" className="text-sm font-medium text-slate-300 block mb-1.5">Descrição (Opcional)</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Informações adicionais sobre o equipamento..."
                  value={formData.descricao}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm transition-all disabled:opacity-50 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cadastrando...
                    </span>
                  ) : 'Cadastrar'}
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
