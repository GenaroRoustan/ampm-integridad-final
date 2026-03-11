import { useNavigate } from 'react-router-dom';
import { AssessmentHeader } from '@/components/AssessmentHeader';
import { CheckCircle2 } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

export default function Instructions() {
  const navigate = useNavigate();
  const { state } = useAssessment();
  const sinExperiencia = state.modalidad === 'sin_experiencia';

  const instructions = sinExperiencia
    ? [
        'Cada pregunta tiene 4 opciones: Nunca lo haría, Probablemente no, Probablemente sí, Sin duda lo haría',
        'Responda con sinceridad y según sus valores personales',
        'Las preguntas se muestran una por una',
        'Cada pregunta tiene un límite de 45 segundos.',
        'Si no responde una pregunta, se continuará automáticamente',
        'La prueba se evalúa de forma automática',
      ]
    : [
        'Cada pregunta tiene 4 opciones: No, Pocas veces, Muchas veces, Sí',
        'Responda con sinceridad',
        'Las preguntas se muestran una por una',
        'Cada pregunta tiene un límite de 45 segundos.',
        'Si no responde una pregunta, se continuará automáticamente',
        'La prueba se evalúa de forma automática',
      ];

  const scaleDescriptions = sinExperiencia
    ? [
        { label: 'Sin duda lo haría', desc: 'es totalmente tu forma de actuar.' },
        { label: 'Probablemente sí', desc: 'es probable que lo harías.' },
        { label: 'Probablemente no', desc: 'probablemente no lo harías.' },
        { label: 'Nunca lo haría', desc: 'va en contra de tus valores.' },
      ]
    : [
        { label: 'Sí', desc: 'aplica casi siempre.' },
        { label: 'Muchas veces', desc: 'aplica la mayoría de las veces.' },
        { label: 'Pocas veces', desc: 'aplica ocasionalmente.' },
        { label: 'No', desc: 'no aplica.' },
      ];

  return (
    <div className="assessment-container">
      <AssessmentHeader />
      <main className="assessment-content">
        <div className="assessment-card animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Instrucciones</h1>
            <p className="text-muted-foreground">Lea atentamente antes de continuar</p>
          </div>
          <ul className="space-y-4 mb-8">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-foreground">{instruction}</span>
                  {index === 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {scaleDescriptions.map((item) => (
                        <li key={item.label}>
                          <span className="font-medium text-foreground">{item.label}:</span> {item.desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate('/stage-intro')} className="btn-primary">
            Iniciar
          </button>
        </div>
      </main>
    </div>
  );
}
