'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Eye, EyeOff, ArrowRight, Shield, Zap, Users } from 'lucide-react';

const features = [
  { icon: Shield, text: 'Acesso seguro com JWT' },
  { icon: Zap, text: 'Chamados em tempo real' },
  { icon: Users, text: 'Multi-perfil de acesso' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, senha);
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Left panel - visible on lg+ */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <Link href="/landing" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center animate-glow">
            <span className="text-sm font-bold text-white">TR</span>
          </div>
          <span className="text-xl font-bold text-white">TechRent</span>
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-indigo-300 font-medium">Sistema de Gestão de TI</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Gerencie seus chamados<br />
            <span className="gradient-text">com eficiência</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Plataforma completa para abertura, acompanhamento e resolução de chamados técnicos.
          </p>

          <div className="space-y-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-slate-600 text-sm">© 2025 TechRent. Todos os direitos reservados.</p>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 mb-4 animate-glow">
              <span className="text-2xl font-bold text-white">TR</span>
            </div>
            <h1 className="text-2xl font-bold text-white">TechRent</h1>
          </div>

          {/* Form card */}
          <div className="glass rounded-2xl border border-slate-700/50 shadow-2xl p-8 animate-fade-in-up">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Bem-vindo de volta</h2>
              <p className="text-slate-400 text-sm mt-1">Faça login para acessar sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="senha" className="text-sm font-medium text-slate-300">Senha</label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl h-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !email || !senha}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-11 group"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Entrar
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-700/50" />
              <span className="text-xs text-slate-500">OU</span>
              <div className="flex-1 h-px bg-slate-700/50" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Não tem uma conta?{' '}
              <Link href="/registro" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Cadastre-se aqui
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            © 2025 TechRent. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
