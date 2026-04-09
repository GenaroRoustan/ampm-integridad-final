import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";

// Pages
import TestEntry from "./pages/TestEntry";
import CandidateForm from "./pages/CandidateForm";
import Instructions from "./pages/Instructions";
import StageIntro from "./pages/StageIntro";
import Question from "./pages/Question";
import Complete from "./pages/Complete";
import InvalidToken from "./pages/InvalidToken";
import MaxAttempts from "./pages/MaxAttempts";
import HRLogin from "./pages/HRLogin";
import HRDashboard from "./pages/HRDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PROXY_URL = 'https://proxy-seguridad.replit.app/enviar-prueba';

function usePendingSubmissions() {
  useEffect(() => {
    const KEY = 'ampm_pending_submissions';
    const pending: unknown[] = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (pending.length === 0) return;

    void (async () => {
      const stillPending: unknown[] = [];
      for (const entry of pending) {
        try {
          const res = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
          });
          if (!res.ok) stillPending.push(entry);
        } catch {
          stillPending.push(entry);
        }
      }
      localStorage.setItem(KEY, JSON.stringify(stillPending));
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
