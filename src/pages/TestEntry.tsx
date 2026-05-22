import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';

const generateOpenToken = () => `OPEN-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export default function TestEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, setPuesto, setModalidad, setHrEmail, setCandidateInfo } = useAssessment();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = (params.get('token') || generateOpenToken()).trim();
    const puestoRaw = (params.get('puesto') || '').trim();
    const puesto = puestoRaw
      ? decodeURIComponent(puestoRaw).replace(/_/g, ' ').trim()
      : null;
    const modalidad = params.get('modalidad') || 'con_experiencia';
    const hrEmail = decodeURIComponent(params.get('hr') || '');
    const nombre = (params.get('nombre') || '').trim();
    const cedula = (params.get('cedula') || '').trim();

    setToken(token);
    setPuesto(puesto);
    setModalidad(modalidad);
    setHrEmail(hrEmail);
    if (nombre || cedula) {
      setCandidateInfo({ fullName: nombre, cedula });
    }

    navigate('/candidate-form', { replace: true });
  }, [location.search, navigate, setToken, setPuesto, setModalidad, setHrEmail, setCandidateInfo]);

  return null;
}
