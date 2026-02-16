import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AMPMLogo } from '@/components/AMPMLogo';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Link as LinkIcon,
  LogOut,
  Copy,
  Check,
  RefreshCw,
  Search,
  Loader2
} from 'lucide-react';

interface Session {
  user: string;
  expiresAt: number;
}

type Decision = 'APTO' | 'CONTRATAR' | 'REVISAR' | 'NO_APTO' | 'INVALIDA';

interface CandidateRecord {
  id: string;
  name: string;
  cedula: string;
  date: string;
  honestyScore?: number;
  sincerityScore?: number;
  autocriticaScore?: number;
  decision: Decision;
  _timestamp: number;
}

const DASHBOARD_DATA_URL = 'https://genaroroustan1.app.n8n.cloud/webhook/dashboard-data';

const asString = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

const asNumber = (value: unknown): number | undefined => {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const parseTimestamp = (value: unknown): number => {
  const str = asString(value);
  const ts = str ? Date.parse(str) : NaN;
  return Number.isFinite(ts) ? ts : 0;
};

const normalizeDecisionKey = (value: unknown): Decision => {
  const normalized = asString(value)
    .toUpperCase()
    .replace(/_/g, ' ')
    .trim();

  if (normalized === 'NO APTO') return 'NO_APTO';
  if (normalized === 'APTO') return 'APTO';
  if (normalized === 'CONTRATAR') return 'CONTRATAR';
  if (normalized === 'REVISAR') return 'REVISAR';
  return 'INVALIDA';
};

const normalizeCandidate = (raw: unknown): CandidateRecord | null => {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const name = asString(r.name ?? r.nombre ?? r.fullName ?? r.candidateName) || 'Sin nombre';
  const cedula = asString(r.cedula ?? r.candidateId ?? r.id_cedula ?? r.identificacion);
  const dateRaw = r.fecha_reporte ?? r.createdAt ?? r.date;
  const dateStr = asString(dateRaw);
  const timestamp = parseTimestamp(dateRaw);

  const decision = normalizeDecisionKey(
    r.decision ?? r.decision_final ?? r.resultado ?? r.decisionFinal
  );

  const honestyScore = asNumber(r.honestyScore ?? r.honestidadScore ?? r.honesty ?? r.honestidad);
  const sincerityScore = asNumber(r.sincerityScore ?? r.sinceridadScore ?? r.sincerity ?? r.sinceridad);
  const autocriticaScore = asNumber(r.autocriticaScore ?? r.autoCriticaScore ?? r.autocritica ?? r.autocritica_score);

  const id = asString(r.id) || `${cedula || 'no-cedula'}-${dateStr || timestamp || Math.random().toString(36).slice(2)}`;

  return {
    id,
    name,
    cedula,
    date: dateStr ? dateStr.slice(0, 10) : '-',
    honestyScore,
    sincerityScore,
    autocriticaScore,
    decision,
    _timestamp: timestamp,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getArrayProp = (value: unknown, key: string): unknown[] | null => {
  if (!isRecord(value)) return null;
  const prop = value[key];
  return Array.isArray(prop) ? (prop as unknown[]) : null;
};

export default function HRDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [selectedPuesto, setSelectedPuesto] = useState('');

  const puestos = [
    'Agente SAC',
    'Asistente de Gerente de tienda',
    'Gerente de tienda',
    'Operativo',
  ];

  useEffect(() => {
    const sessionData = sessionStorage.getItem('hr_session');
    if (!sessionData) {
      setIsCheckingSession(false);
      navigate('/hr/login');
      return;
    }

    const parsed = JSON.parse(sessionData) as Session;
    if (Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem('hr_session');
      setIsCheckingSession(false);
      navigate('/hr/login');
      return;
    }

    setSession(parsed);
    setIsCheckingSession(false);
  }, [navigate]);

  useEffect(() => {
    if (!session) return;

    const controller = new AbortController();
    setIsLoadingCandidates(true);
    setCandidatesError(null);

    fetch(DASHBOARD_DATA_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: unknown = await res.json();
        const list: unknown[] =
          (Array.isArray(data) ? data : null) ??
          getArrayProp(data, 'candidates') ??
          getArrayProp(data, 'data') ??
          [];

        const normalized = (list as unknown[])
          .map(normalizeCandidate)
          .filter((x): x is CandidateRecord => x !== null)
          .sort((a, b) => (b._timestamp || 0) - (a._timestamp || 0));

        setCandidates(normalized);
      })
      .catch((err: unknown) => {
        if (
          (err instanceof DOMException && err.name === 'AbortError') ||
          (isRecord(err) && err.name === 'AbortError')
        ) {
          return;
        }
        setCandidatesError('No se pudieron cargar los datos en vivo.');
        setCandidates([]);
      })
      .finally(() => {
        setIsLoadingCandidates(false);
      });

    return () => controller.abort();
  }, [session]);

  const handleLogout = () => {
    sessionStorage.removeItem('hr_session');
    setSession(null);
    navigate('/hr/login');
  };

  const generateLink = () => {
    if (!selectedPuesto) return;
    const token = `${Date.now()}-${Math.random().toString(36).substr(2, 12)}`;
    const puestoParam = selectedPuesto.replace(/\s+/g, '_');
    const link = `http://192.168.0.56:8081/test?token=${token}&puesto=${encodeURIComponent(puestoParam)}`;
    setGeneratedLink(link);
    setLinkCopied(false);
  };

  const copyTextFallback = (text: string): boolean => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  const copyLink = async () => {
    const linkToCopy = generatedLink;
    if (!linkToCopy) return;

    try {
      const hasClipboardApi = typeof navigator.clipboard?.writeText === 'function';
      if (!hasClipboardApi || !window.isSecureContext) {
        throw new Error('Clipboard API not available in this context');
      }

      await navigator.clipboard.writeText(linkToCopy);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      const ok = copyTextFallback(linkToCopy);
      if (ok) {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } else {
        setLinkCopied(false);
      }
    }
  };

  const getDecisionBadge = (decision: Decision) => {
    const key = (decision || 'INVALIDA').toUpperCase() as Decision;

    const styles: Record<Decision, string> = {
      APTO: 'bg-stage-autocritica/10 text-stage-autocritica',
      CONTRATAR: 'bg-stage-autocritica/10 text-stage-autocritica',
      REVISAR: 'bg-timer-warning/10 text-timer-warning',
      NO_APTO: 'bg-destructive/10 text-destructive',
      INVALIDA: 'bg-muted text-muted-foreground',
    };

    const labels: Record<Decision, string> = {
      APTO: 'Apto',
      CONTRATAR: 'Contratar',
      REVISAR: 'Revisar',
      NO_APTO: 'No Apto',
      INVALIDA: 'Inválida',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[key]}`}>
        {labels[key]}
      </span>
    );
  };

  const stats = {
    total: candidates.length,
    apto: candidates.filter(r => r.decision === 'APTO' || r.decision === 'CONTRATAR').length,
    revisar: candidates.filter(r => r.decision === 'REVISAR').length,
    noApto: candidates.filter(r => r.decision === 'NO_APTO').length,
  };

  const sortedCandidates = [...candidates].sort((a, b) => (b._timestamp || 0) - (a._timestamp || 0));
  const trimmedSearch = searchTerm.trim();
  const normalizedSearch = trimmedSearch.toLowerCase();

  const matchesSearch = (r: CandidateRecord) => {
    if (!trimmedSearch) return true;
    return (
      (r.name || '').toLowerCase().includes(normalizedSearch) ||
      (r.cedula || '').includes(trimmedSearch)
    );
  };

  const displayedCandidates = trimmedSearch
    ? sortedCandidates.filter(matchesSearch)
    : sortedCandidates.slice(0, 10);

  const isShowingTop10Only = !trimmedSearch && sortedCandidates.length > 10;

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="rounded-xl border border-border bg-card px-6 py-8 shadow-lg">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertTriangle className="h-6 w-6 text-timer-warning" />
            <p className="text-sm font-semibold text-foreground">Verificando sesión...</p>
            <p className="text-xs text-muted-foreground">Espere un momento mientras cargamos el dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <AMPMLogo size="sm" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Bienvenido, <span className="font-medium text-foreground">{session.user}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Panel de Control - Pruebas de Integridad
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <Users className="w-8 h-8 text-primary mb-2" />
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total evaluados</div>
          </div>
          <div className="stat-card">
            <CheckCircle className="w-8 h-8 text-stage-autocritica mb-2" />
            <div className="stat-value text-stage-autocritica">{stats.apto}</div>
            <div className="stat-label">Aptos</div>
          </div>
          <div className="stat-card">
            <AlertTriangle className="w-8 h-8 text-timer-warning mb-2" />
            <div className="stat-value text-timer-warning">{stats.revisar}</div>
            <div className="stat-label">En revisión</div>
          </div>
          <div className="stat-card">
            <XCircle className="w-8 h-8 text-destructive mb-2" />
            <div className="stat-value text-destructive">{stats.noApto}</div>
            <div className="stat-label">No aptos</div>
          </div>
        </div>

        {/* Generate Link Card */}
        <div className="dashboard-card mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Generar enlace de prueba
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Puesto
              </label>
              <select
                value={selectedPuesto}
                onChange={(e) => setSelectedPuesto(e.target.value)}
                aria-label="Puesto"
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Selecciona un puesto</option>
                {puestos.map((puesto) => (
                  <option key={puesto} value={puesto}>
                    {puesto}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateLink}
              disabled={!selectedPuesto}
              className="btn-primary flex items-center justify-center gap-2 sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4" />
              Generar nuevo enlace
            </button>
            {generatedLink && (
              <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-4 py-3">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  placeholder="Enlace generado"
                  title="Enlace generado"
                  aria-label="Enlace generado"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none"
                />
                <button
                  onClick={copyLink}
                  className={`flex items-center gap-1 transition-colors ${
                    linkCopied
                      ? 'text-stage-autocritica'
                      : 'text-primary hover:text-primary/80'
                  }`}
                >
                  {!linkCopied && <Copy className="w-4 h-4" />}
                  <span className="text-sm">{linkCopied ? '✅ Copiado' : 'Copiar'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Records Table */}
        <div className="dashboard-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Resultados de evaluaciones
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoadingCandidates && (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            )}

            {!isLoadingCandidates && candidatesError && (
              <div className="text-center py-10 text-destructive text-sm">{candidatesError}</div>
            )}

            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cédula</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Hon.</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Sin.</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Aut.</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Decisión</th>
                </tr>
              </thead>
              <tbody>
                {!isLoadingCandidates && !candidatesError && displayedCandidates.map((record) => (
                  <tr key={record.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{record.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{record.cedula || '-'}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{record.date || '-'}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">{record.honestyScore ?? '-'}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">{record.sincerityScore ?? '-'}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">{record.autocriticaScore ?? '-'}</td>
                    <td className="py-3 px-4 text-center">{getDecisionBadge(record.decision)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isLoadingCandidates && !candidatesError && trimmedSearch && displayedCandidates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron resultados para "{searchTerm}"
            </div>
          )}

          {!isLoadingCandidates && !candidatesError && isShowingTop10Only && (
            <div className="mt-4 text-center text-xs text-muted-foreground">
              Mostrando los 10 registros más recientes. Usa el buscador para encontrar anteriores.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
