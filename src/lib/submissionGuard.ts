// Capa anti-duplicado del cliente. Trabaja en conjunto con el dedup del proxy.
// Mantiene en localStorage:
//   ampm_completed_sids   → set de _submissionId ya confirmados por el server (TTL 7 días)
//   ampm_send_lock        → timestamp del envío inline en curso (evita que el reintento pisotee)
//   ampm_submission_anchor→ por (cedula+token+modalidad) guarda el _submissionId asignado
//                           para que un reload del flujo no genere uno nuevo.

const COMPLETED_KEY = 'ampm_completed_sids';
const LOCK_KEY = 'ampm_send_lock';
const ANCHOR_KEY = 'ampm_submission_anchor';
const COMPLETED_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const LOCK_TTL_MS = 90 * 1000;

type CompletedMap = Record<string, number>;
type AnchorMap = Record<string, string>;

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
};

const readCompleted = (): CompletedMap => {
  const map = safeParse<CompletedMap>(localStorage.getItem(COMPLETED_KEY), {});
  const now = Date.now();
  let mutated = false;
  for (const k of Object.keys(map)) {
    if (typeof map[k] !== 'number' || now - map[k] > COMPLETED_TTL_MS) {
      delete map[k];
      mutated = true;
    }
  }
  if (mutated) {
    try { localStorage.setItem(COMPLETED_KEY, JSON.stringify(map)); } catch { /* quota */ }
  }
  return map;
};

export const isAlreadySubmitted = (submissionId: string): boolean => {
  if (!submissionId) return false;
  return Boolean(readCompleted()[submissionId]);
};

export const markSubmitted = (submissionId: string): void => {
  if (!submissionId) return;
  const map = readCompleted();
  map[submissionId] = Date.now();
  try { localStorage.setItem(COMPLETED_KEY, JSON.stringify(map)); } catch { /* quota */ }
};

export const acquireSendLock = (): boolean => {
  const now = Date.now();
  const raw = Number(localStorage.getItem(LOCK_KEY) ?? 0);
  if (raw && now - raw < LOCK_TTL_MS) return false;
  try { localStorage.setItem(LOCK_KEY, String(now)); } catch { /* quota */ }
  return true;
};

export const releaseSendLock = (): void => {
  try { localStorage.removeItem(LOCK_KEY); } catch { /* ignore */ }
};

const anchorKeyFor = (cedula: string, token: string, modalidad: string): string =>
  `${cedula}|${token}|${modalidad}`;

// Devuelve un _submissionId estable por (cedula, token, modalidad). La primera vez
// crea uno nuevo y lo persiste; en reentradas devuelve el mismo. Esto evita que
// un reload del flujo o una reapertura del link genere un sid distinto.
export const getOrCreateSubmissionAnchor = (
  cedula: string,
  token: string,
  modalidad: string,
  fallbackId: string,
): string => {
  if (!cedula || !token) return fallbackId;
  const map = safeParse<AnchorMap>(localStorage.getItem(ANCHOR_KEY), {});
  const key = anchorKeyFor(cedula, token, modalidad);
  if (map[key]) return map[key];
  map[key] = fallbackId;
  try { localStorage.setItem(ANCHOR_KEY, JSON.stringify(map)); } catch { /* quota */ }
  return fallbackId;
};
