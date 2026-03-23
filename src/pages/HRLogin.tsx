import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AMPMLogo } from '@/components/AMPMLogo';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const PROXY_BASE_URL = 'https://proxy-seguridad.replit.app';
const HR_LOGIN_URL = `${PROXY_BASE_URL}/hr/login`;

export default function HRLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(HR_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (!res.ok) {
        setError('Credenciales incorrectas. Por favor intente nuevamente.');
        return;
      }

      const data: unknown = await res.json().catch(() => null);
      const user = typeof (data as { user?: unknown } | null)?.user === 'string'
        ? (data as { user: string }).user
        : username.trim();

      sessionStorage.setItem('hr_session', JSON.stringify({
        user,
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      }));
      navigate('/hr/dashboard');
    } catch {
      setError('No se pudo conectar al servidor. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #2b2d5b 0%, #3d3f7a 60%, #1e2045 100%)' }}
    >
      {/* Card principal */}
      <div className="w-full max-w-md">

        {/* Logo + título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <AMPMLogo size="lg" />
          </div>
          <div
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ backgroundColor: '#ee2e24', color: '#fff' }}
          >
            Recursos Humanos
          </div>
          <h1 className="text-2xl font-bold text-white">
            Panel de Control
          </h1>
          <p className="text-blue-200 mt-1 text-sm">
            Ingrese sus credenciales para acceder
          </p>
        </div>

        {/* Formulario */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="rounded-lg p-3 text-sm font-medium"
                style={{ backgroundColor: 'rgba(238,46,36,0.15)', border: '1px solid #ee2e24', color: '#ffb366' }}
              >
                {error}
              </div>
            )}

            {/* Usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-blue-100 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#ee2e24' }} />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                  }}
                  onFocus={e => e.currentTarget.style.border = '1px solid #e87200'}
                  onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-blue-100 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#ee2e24' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                  }}
                  onFocus={e => e.currentTarget.style.border = '1px solid #e87200'}
                  onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm tracking-wide transition-all mt-2"
              style={{
                backgroundColor: isLoading ? '#b35800' : '#e87200',
                boxShadow: '0 4px 20px rgba(238,46,36,0.4)',
              }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.backgroundColor = '#ff9520')}
              onMouseLeave={e => !isLoading && (e.currentTarget.style.backgroundColor = '#e87200')}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-blue-300 mt-6 opacity-70">
          ¿Problemas para acceder? Contacte al administrador del sistema.
        </p>
      </div>
    </div>
  );
}
