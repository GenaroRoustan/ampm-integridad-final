import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import { isAlreadySubmitted, markSubmitted, acquireSendLock, releaseSendLock } from "@/lib/submissionGuard";

// Pages
import TestEntry from "./pages/TestEntry";
import CandidateForm from "./pages/CandidateForm";
import Instructions from "./pages/Instructions";
import StageIntro from "./pages/StageIntro";
import Question from "./pages/Question";
import Complete from "./pages/Complete";
import InvalidToken from "./pages/InvalidToken";
import MaxAttempts from "./pages/MaxAttempts";
import SessionLost from "./pages/SessionLost";
import HRLogin from "./pages/HRLogin";
import HRDashboard from "./pages/HRDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PROXY_URL = 'https://proxy-seguridad.replit.app/enviar-prueba';

function usePendingSubmissions() {
  useEffect(() => {
    const KEY = 'ampm_pending_submissions';
    let pending: Array<{ _submissionId?: string }>;
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      pending = Array.isArray(raw) ? raw : [];
    } catch { return; }
    if (pending.length === 0) return;

    // Si hay un envío inline en curso, NO disparar el reintento ahora.
    // El próximo App-mount lo reintentará si quedaran pendientes.
    if (!acquireSendLock()) return;

    // Filtrar de entrada los que ya están confirmados — evita reenviar algo
    // que el server ya recibió pero el frontend no llegó a marcar por timeout.
    const fresh = pending.filter(e => !e?._submissionId || !isAlreadySubmitted(e._submissionId));
    if (fresh.length !== pending.length) {
      try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch { /* quota */ }
    }
    if (fresh.length === 0) { releaseSendLock(); return; }

    void (async () => {
      const stillPending: typeof fresh = [];
      try {
        for (const entry of fresh) {
          try {
            const res = await fetch(PROXY_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(entry),
            });
            if (res.ok) {
              if (entry._submissionId) markSubmitted(entry._submissionId);
            } else {
              stillPending.push(entry);
            }
          } catch {
            stillPending.push(entry);
          }
        }
        try { localStorage.setItem(KEY, JSON.stringify(stillPending)); } catch { /* quota */ }
      } finally {
        releaseSendLock();
      }
    })();
  }, []);
}

const App = () => {
  usePendingSubmissions();
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AssessmentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* HR Panel (default) */}
            <Route path="/" element={<HRLogin />} />
            
            {/* Assessment Flow */}
            <Route path="/test" element={<TestEntry />} />
            <Route path="/candidate-form" element={<CandidateForm />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/stage-intro" element={<StageIntro />} />
            <Route path="/question" element={<Question />} />
            <Route path="/complete" element={<Complete />} />
            
            {/* Error States */}
            <Route path="/invalid-token" element={<InvalidToken />} />
            <Route path="/max-attempts" element={<MaxAttempts />} />
            <Route path="/session-lost" element={<SessionLost />} />
            
            {/* HR Panel */}
            <Route path="/hr/login" element={<HRLogin />} />
            <Route path="/hr/dashboard" element={<HRDashboard />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AssessmentProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
