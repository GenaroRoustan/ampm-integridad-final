import { useNavigate } from 'react-router-dom';
import { AssessmentHeader } from '@/components/AssessmentHeader';
import { CheckCircle2 } from 'lucide-react';

export default function Instructions() {
  const navigate = useNavigate();

  const instructions = [
    'Cada pregunta tiene 4 opciones: No, Pocas veces, Muchas veces, Sí',
    'Responda con sinceridad',
    'Las preguntas se muestran una por una',
    'Cada pregunta tiene un límite de 45 segundos.',
    'Si no responde una pregunta, se continuará automáticamente',
    'La prueba se evalúa de forma automática',
  ];

  return (
    <div className="assessment-container">
      <AssessmentHeader />
      <main className="assessment-content">
        <div className="assessment-card animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Instrucciones
            </h1>
            <p className="text-muted-foreground">
              Lea atentamente antes de continuar
            </p>
          </div>

          <ul className="space-y-4 mb-8">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-foreground">{instruction}</span>
                  {index === 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>
                        <span className="font-medium text-foreground">Sí:</span> aplica casi siempre.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Muchas veces:</span> aplica la mayoría de las veces.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Pocas veces:</span> aplica ocasionalmente.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">No:</span> no aplica.
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate('/stage-intro')}
            className="btn-primary"
          >
            Iniciar
          </button>
        </div>
      </main>
    </div>
  );
}
