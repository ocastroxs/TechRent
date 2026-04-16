'use client';

const statusMap = {
  // Chamados
  aberto: { label: 'Aberto', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  em_atendimento: { label: 'Em Atendimento', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  resolvido: { label: 'Resolvido', className: 'bg-green-500/15 text-green-400 border-green-500/30', dot: 'bg-green-400' },
  cancelado: { label: 'Cancelado', className: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' },
  // Equipamentos
  disponivel: { label: 'Disponível', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  alugado: { label: 'Alugado', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  manutencao: { label: 'Manutenção', className: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
  // Prioridades
  baixa: { label: 'Baixa', className: 'bg-slate-500/15 text-slate-400 border-slate-500/30', dot: 'bg-slate-400' },
  media: { label: 'Média', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  alta: { label: 'Alta', className: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
  critica: { label: 'Crítica', className: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' },
};

export default function StatusBadge({ status, showDot = true, size = 'sm' }) {
  const config = statusMap[status] || {
    label: status,
    className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    dot: 'bg-slate-400',
  };

  const sizeClass = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${config.className} ${sizeClass}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
}
