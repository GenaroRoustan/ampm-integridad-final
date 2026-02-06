import { AssessmentHeader } from '@/components/AssessmentHeader';
import { AlertTriangle } from 'lucide-react';

export default function InvalidToken() {
  return (
    <div className="assessment-container">
      <AssessmentHeader />
      <main className="assessment-content">
        <div className="assessment-card text-center animate-fade-in">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Enlace inválido o expirado
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            El enlace de la prueba es inválido o ha expirado. Por favor contacte a Recursos Humanos para obtener un nuevo enlace.
          </p>
        </div>
      </main>
    </div>
  );
}
