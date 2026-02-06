import { useNavigate } from 'react-router-dom';
import { AssessmentHeader } from '@/components/AssessmentHeader';
import { CheckCircle2 } from 'lucide-react';

export default function Instructions() {
  const navigate = useNavigate();

  const instructions = [
    'Cada pregunta tiene 4 opciones: No, Pocas veces, Muchas veces, Sí',
    'Responda con sinceridad',
    'Las preguntas se muestran una por una',
    'Algunas preguntas tienen tiempo limitado',
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
                <span className="text-foreground">{instruction}</span>
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
