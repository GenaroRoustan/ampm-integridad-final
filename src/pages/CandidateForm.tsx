import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssessmentHeader } from '@/components/AssessmentHeader';
import { useAssessment } from '@/contexts/AssessmentContext';

const CEDULA_REGEX = /^\d{3}-\d{6}-\d{4}[A-Z]$/;

function formatCedulaNicaragua(input: string): string {
  const upper = input.toUpperCase();
  const digits = upper.replace(/\D/g, '').slice(0, 13);
  const letter = (upper.match(/[A-Z]/g) ?? []).join('').slice(0, 1);

  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 9);
  const p3 = digits.slice(9, 13);

  let out = p1;
  if (p2.length > 0) out += `-${p2}`;
  if (p3.length > 0) out += `-${p3}`;

  // Only allow the final letter once all 13 digits are present.
  if (digits.length === 13 && letter) out += letter;
  return out;
}

function isValidCedulaBirthDateDDMMYY(ddmmyy: string): boolean {
  if (!/^\d{6}$/.test(ddmmyy)) return false;

  const day = Number(ddmmyy.slice(0, 2));
  const month = Number(ddmmyy.slice(2, 4));
  const year2 = Number(ddmmyy.slice(4, 6));

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const now = new Date();
  const currentYear2 = now.getFullYear() % 100;
  const fullYear = year2 > currentYear2 ? 1900 + year2 : 2000 + year2;

  const date = new Date(fullYear, month - 1, day);
  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // Not in the future (date part is a birth date).
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const candidateDate = new Date(fullYear, month - 1, day);
  return candidateDate.getTime() <= today.getTime();
}

export default function CandidateForm() {
  const navigate = useNavigate();
  const { setCandidateInfo } = useAssessment();
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; cedula?: string }>({});

  const handleCedulaChange = (nextRaw: string) => {
    const formatted = formatCedulaNicaragua(nextRaw);
    setCedula(formatted);

    // Live validation of the embedded date when available (DDMMYY).
    const digits = formatted.replace(/\D/g, '');
    if (digits.length >= 9) {
      const ddmmyy = digits.slice(3, 9);
      const validDate = isValidCedulaBirthDateDDMMYY(ddmmyy);
      setErrors(prev => ({
        ...prev,
        cedula: validDate ? undefined : 'La fecha (DDMMYY) en la cédula es inválida o está en el futuro',
      }));
    } else {
      // Clear date error while user is still typing.
      setErrors(prev => ({ ...prev, cedula: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { fullName?: string; cedula?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Por favor ingrese su nombre completo';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!cedula.trim()) {
      newErrors.cedula = 'Por favor ingrese su número de cédula';
    } else if (!CEDULA_REGEX.test(cedula)) {
      newErrors.cedula = 'Formato inválido. Use 000-000000-0000A';
    } else {
      const digits = cedula.replace(/\D/g, '');
      const ddmmyy = digits.slice(3, 9);
      if (!isValidCedulaBirthDateDDMMYY(ddmmyy)) {
        newErrors.cedula = 'La fecha (DDMMYY) en la cédula es inválida o está en el futuro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setCandidateInfo({ fullName: fullName.trim(), cedula: cedula.trim() });
    navigate('/instructions');
  };

  return (
    <div className="assessment-container">
      <AssessmentHeader />
      <main className="assessment-content">
        <div className="assessment-card animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Prueba de Integridad
            </h1>
            <p className="text-muted-foreground">
              Por favor ingrese sus datos para iniciar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`form-input ${errors.fullName ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
                placeholder="Ingrese su nombre completo"
                autoComplete="name"
              />
              {errors.fullName && (
                <p className="error-message">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="cedula" className="block text-sm font-medium text-foreground mb-2">
                Número de cédula
              </label>
              <input
                type="text"
                id="cedula"
                value={cedula}
                onChange={(e) => handleCedulaChange(e.target.value)}
                className={`form-input ${errors.cedula ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
                placeholder="Ej: 001-000000-0000X"
                maxLength={16}
                autoCapitalize="characters"
                autoComplete="off"
              />
              {errors.cedula && (
                <p className="error-message">{errors.cedula}</p>
              )}
            </div>

            <button type="submit" className="btn-primary mt-8">
              Iniciar prueba
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
