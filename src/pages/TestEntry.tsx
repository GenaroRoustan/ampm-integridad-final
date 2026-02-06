import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { AssessmentHeader } from '@/components/AssessmentHeader';
import { Loader2 } from 'lucide-react';

const generateOpenToken = () => `OPEN-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export default function TestEntry() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAssessment();
  const [isValidating] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token') || generateOpenToken();
    setToken(token);
    navigate('/candidate-form');
  }, [searchParams, navigate, setToken]);

  if (isValidating) {
    return (
      <div className="assessment-container">
        <AssessmentHeader />
        <main className="assessment-content">
          <div className="text-center animate-fade-in">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Validando acceso...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
