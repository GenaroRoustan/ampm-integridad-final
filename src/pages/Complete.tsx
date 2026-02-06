import { AssessmentHeader } from '@/components/AssessmentHeader';
import { CheckCircle } from 'lucide-react';

export default function Complete() {
  return (
    <div className="assessment-container">
      <AssessmentHeader />
      <main className="assessment-content">
        <div className="assessment-card text-center animate-scale-in">
          <div className="w-24 h-24 bg-stage-autocritica/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-stage-autocritica" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">
            ¡Gracias!
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-2">
            Sus respuestas han sido enviadas correctamente.
          </p>
          
          <p className="text-muted-foreground">
            Recibirá información sobre los siguientes pasos del proceso por parte del equipo de Recursos Humanos.
          </p>
        </div>
      </main>
    </div>
  );
}
