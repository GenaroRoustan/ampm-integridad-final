import { AssessmentHeader } from '@/components/AssessmentHeader';
import { Ban } from 'lucide-react';

export default function MaxAttempts() {
  return (
    <div className="assessment-container">
      <AssessmentHeader />
      <main className="assessment-content">
        <div className="assessment-card text-center animate-fade-in">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Prueba ya completada
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Ya ha completado esta prueba anteriormente. Para más información, contacte a Recursos Humanos.
          </p>
        </div>
      </main>
    </div>
  );
}
