'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Monitor, Wrench, BarChart3, Shield, Zap, Users,
  CheckCircle, ArrowRight, Star, ChevronDown, Menu, X
} from 'lucide-react';

const features = [
  {
    icon: Monitor,
    title: 'Gestão de Equipamentos',
    description: 'Controle todo o parque de equipamentos de TI em um só lugar, com status em tempo real.',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
  },
  {
    icon: Wrench,
    title: 'Chamados de Suporte',
    description: 'Abertura e acompanhamento de chamados técnicos com prioridades e histórico completo.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analítico',
    description: 'Visualize métricas e indicadores de desempenho com gráficos interativos e relatórios.',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  {
    icon: Users,
    title: 'Multi-perfil de Acesso',
    description: 'Três níveis de acesso: Administrador, Técnico e Cliente, cada um com sua visão personalizada.',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  {
    icon: Zap,
    title: 'Atendimento Ágil',
    description: 'Fluxo otimizado para abertura, atribuição e resolução de chamados com notificações.',
    color: 'from-yellow-500 to-orange-600',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  {
    icon: Shield,
    title: 'Segurança e Controle',
    description: 'Autenticação JWT, controle de acesso por perfil e auditoria de todas as ações.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime garantido' },
  { value: '< 2min', label: 'Tempo de resposta' },
  { value: '3', label: 'Perfis de acesso' },
  { value: '100%', label: 'Rastreabilidade' },
];

const steps = [
  { step: '01', title: 'Cadastre-se', desc: 'Crie sua conta em menos de 2 minutos.' },
  { step: '02', title: 'Abra um Chamado', desc: 'Descreva o problema e selecione o equipamento.' },
  { step: '03', title: 'Acompanhe', desc: 'Monitore o status em tempo real até a resolução.' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center animate-glow">
                <span className="text-sm font-bold text-white">TR</span>
              </div>
              <span className="text-lg font-bold text-white">TechRent</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Funcionalidades</a>
              <a href="#how" className="text-slate-400 hover:text-white transition-colors text-sm">Como funciona</a>
              <a href="#stats" className="text-slate-400 hover:text-white transition-colors text-sm">Sobre</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm px-4 py-2">
                Entrar
              </Link>
              <Link href="/registro" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm px-5 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25">
                Começar grátis
              </Link>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-400 hover:text-white">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 py-4 space-y-3">
            <a href="#features" className="block text-slate-300 hover:text-white py-2">Funcionalidades</a>
            <a href="#how" className="block text-slate-300 hover:text-white py-2">Como funciona</a>
            <Link href="/login" className="block text-slate-300 hover:text-white py-2">Entrar</Link>
            <Link href="/registro" className="block bg-indigo-600 text-white px-4 py-2 rounded-lg text-center font-semibold">
              Começar grátis
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl animate-float delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-indigo-300 font-medium">Sistema de Gestão de TI</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up">
            Gerencie seus{' '}
            <span className="gradient-text">chamados de TI</span>
            <br />
            com eficiência
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            Plataforma completa para abertura, acompanhamento e resolução de chamados técnicos.
            Controle equipamentos, equipes e métricas em um só lugar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
            <Link href="/registro" className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1">
              Começar agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-slate-800/50">
              Já tenho conta
            </Link>
          </div>

          {/* Preview card */}
          <div className="relative max-w-4xl mx-auto animate-fade-in-up delay-400">
            <div className="glass rounded-2xl p-1 neon-border">
              <div className="bg-slate-900 rounded-xl overflow-hidden">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <div className="flex-1 mx-4 bg-slate-700 rounded-full h-5 flex items-center px-3">
                    <span className="text-xs text-slate-400">techrent.app/admin</span>
                  </div>
                </div>
                {/* Dashboard preview */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { label: 'Chamados Abertos', value: '12', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                      { label: 'Em Atendimento', value: '5', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                      { label: 'Resolvidos', value: '48', color: 'text-green-400', bg: 'bg-green-500/10' },
                    ].map((item) => (
                      <div key={item.label} className={`${item.bg} rounded-lg p-4 border border-slate-700/50`}>
                        <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                        <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-3">Chamados por Status</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Aberto', w: '45%', color: 'bg-blue-500' },
                          { label: 'Atendimento', w: '30%', color: 'bg-yellow-500' },
                          { label: 'Resolvido', w: '75%', color: 'bg-green-500' },
                        ].map(b => (
                          <div key={b.label} className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 w-20">{b.label}</span>
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div className={`${b.color} h-2 rounded-full`} style={{ width: b.w }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-3">Equipamentos</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Disponível', count: '24', color: 'text-green-400' },
                          { label: 'Alugado', count: '8', color: 'text-blue-400' },
                          { label: 'Manutenção', count: '3', color: 'text-orange-400' },
                        ].map(e => (
                          <div key={e.label} className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">{e.label}</span>
                            <span className={`text-sm font-bold ${e.color}`}>{e.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-indigo-600/10 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-extrabold gradient-text mb-2">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300 font-medium">Funcionalidades</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Tudo que você precisa para{' '}
              <span className="gradient-text">gerenciar TI</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Uma plataforma completa com todas as ferramentas necessárias para sua equipe de TI trabalhar com eficiência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`card-hover glass rounded-xl p-6 border ${feature.border} group`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'transparent', filter: 'drop-shadow(0 0 8px currentColor)' }} />
                    <Icon className={`w-6 h-6 absolute`} style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                  </div>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} mb-4 group-hover:scale-110 transition-transform duration-300 -mt-16`}>
                    <Icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como <span className="gradient-text">funciona</span>
            </h2>
            <p className="text-slate-400 text-lg">Simples, rápido e eficiente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 mb-6 mx-auto">
                  <span className="text-3xl font-extrabold gradient-text">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 neon-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 mb-6 animate-glow">
                <span className="text-2xl font-bold text-white">TR</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Junte-se à plataforma e transforme a gestão de TI da sua empresa hoje mesmo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/registro" className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1">
                  Criar conta gratuita
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                  Fazer login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">TR</span>
              </div>
              <span className="text-white font-semibold">TechRent</span>
              <span className="text-slate-500 text-sm">— Sistema de Gestão de TI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/login" className="hover:text-slate-300 transition-colors">Login</Link>
              <Link href="/registro" className="hover:text-slate-300 transition-colors">Registro</Link>
              <span>© 2025 TechRent. Todos os direitos reservados.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
