import type { Question } from '@/types/assessment';

export const questions: Question[] = [
  // HONESTIDAD (15 preguntas)
  { id: 'H01', text: '¿Ha tomado alguna vez productos de su trabajo sin autorización?', stage: 'honesty', reverseScoring: true },
  { id: 'H02', text: '¿Ha reportado horas de trabajo que no realizó realmente?', stage: 'honesty', reverseScoring: true },
  { id: 'H03', text: '¿Ha utilizado recursos de la empresa para asuntos personales sin permiso?', stage: 'honesty', reverseScoring: true },
  { id: 'H04', text: '¿Ha mentido a un supervisor para evitar una consecuencia negativa?', stage: 'honesty', reverseScoring: true },
  { id: 'H05', text: '¿Ha cubierto errores de un compañero aunque esto afectara a la empresa?', stage: 'honesty', reverseScoring: true },
  { id: 'H06', text: '¿Ha encontrado dinero en el trabajo y lo ha devuelto inmediatamente?', stage: 'honesty', reverseScoring: false },
  { id: 'H07', text: '¿Ha rechazado participar en actividades que consideraba incorrectas?', stage: 'honesty', reverseScoring: false },
  { id: 'H08', text: '¿Ha informado a sus superiores cuando detectó alguna irregularidad?', stage: 'honesty', reverseScoring: false },
  { id: 'H09', text: '¿Ha aceptado regalos de proveedores a cambio de favores?', stage: 'honesty', reverseScoring: true },
  { id: 'H10', text: '¿Ha modificado registros o documentos para beneficio personal?', stage: 'honesty', reverseScoring: true },
  { id: 'H11', text: '¿Ha cumplido las normas de la empresa aunque nadie lo supervise?', stage: 'honesty', reverseScoring: false },
  { id: 'H12', text: '¿Ha cobrado de más a un cliente aprovechando su desconocimiento?', stage: 'honesty', reverseScoring: true },
  { id: 'H13', text: '¿Ha revelado información confidencial de su trabajo a terceros?', stage: 'honesty', reverseScoring: true },
  { id: 'H14', text: '¿Ha devuelto el cambio correcto aunque el cliente no se diera cuenta?', stage: 'honesty', reverseScoring: false },
  { id: 'H15', text: '¿Ha actuado con integridad aunque eso le cause inconvenientes?', stage: 'honesty', reverseScoring: false },

  // SINCERIDAD (15 preguntas)
  { id: 'S01', text: '¿Ha admitido sus errores ante sus compañeros o supervisores?', stage: 'sincerity', reverseScoring: false },
  { id: 'S02', text: '¿Ha inventado excusas para justificar llegadas tarde?', stage: 'sincerity', reverseScoring: true },
  { id: 'S03', text: '¿Ha exagerado sus logros en una entrevista de trabajo?', stage: 'sincerity', reverseScoring: true },
  { id: 'S04', text: '¿Ha culpado a otros de errores que usted cometió?', stage: 'sincerity', reverseScoring: true },
  { id: 'S05', text: '¿Ha ocultado información importante a su supervisor?', stage: 'sincerity', reverseScoring: true },
  { id: 'S06', text: '¿Ha dicho la verdad aunque esto le trajera consecuencias negativas?', stage: 'sincerity', reverseScoring: false },
  { id: 'S07', text: '¿Ha prometido cosas que sabía que no iba a cumplir?', stage: 'sincerity', reverseScoring: true },
  { id: 'S08', text: '¿Ha fingido estar enfermo para no ir a trabajar?', stage: 'sincerity', reverseScoring: true },
  { id: 'S09', text: '¿Ha reconocido cuando no sabe algo en lugar de inventar una respuesta?', stage: 'sincerity', reverseScoring: false },
  { id: 'S10', text: '¿Ha hablado mal de un compañero a sus espaldas?', stage: 'sincerity', reverseScoring: true },
  { id: 'S11', text: '¿Ha dado su opinión honesta aunque fuera impopular?', stage: 'sincerity', reverseScoring: false },
  { id: 'S12', text: '¿Ha manipulado información para hacer quedar mal a alguien?', stage: 'sincerity', reverseScoring: true },
  { id: 'S13', text: '¿Ha sido transparente sobre sus limitaciones profesionales?', stage: 'sincerity', reverseScoring: false },
  { id: 'S14', text: '¿Ha evitado responder preguntas directas para no comprometerse?', stage: 'sincerity', reverseScoring: true },
  { id: 'S15', text: '¿Ha mantenido su palabra incluso cuando era difícil?', stage: 'sincerity', reverseScoring: false },

  // AUTOCRÍTICA (15 preguntas)
  { id: 'A01', text: '¿Ha reflexionado sobre sus errores para no repetirlos?', stage: 'autocritica', reverseScoring: false },
  { id: 'A02', text: '¿Ha justificado sus faltas culpando a las circunstancias?', stage: 'autocritica', reverseScoring: true },
  { id: 'A03', text: '¿Ha buscado retroalimentación para mejorar su desempeño?', stage: 'autocritica', reverseScoring: false },
  { id: 'A04', text: '¿Ha aceptado críticas constructivas sin ponerse a la defensiva?', stage: 'autocritica', reverseScoring: false },
  { id: 'A05', text: '¿Ha reconocido cuando necesita ayuda de otros?', stage: 'autocritica', reverseScoring: false },
  { id: 'A06', text: '¿Ha pensado que siempre tiene la razón en los conflictos?', stage: 'autocritica', reverseScoring: true },
  { id: 'A07', text: '¿Ha cambiado su comportamiento después de recibir una queja?', stage: 'autocritica', reverseScoring: false },
  { id: 'A08', text: '¿Ha culpado a la mala suerte por sus fracasos?', stage: 'autocritica', reverseScoring: true },
  { id: 'A09', text: '¿Ha pedido disculpas cuando ha cometido un error?', stage: 'autocritica', reverseScoring: false },
  { id: 'A10', text: '¿Ha aprendido nuevas habilidades para superar sus debilidades?', stage: 'autocritica', reverseScoring: false },
  { id: 'A11', text: '¿Ha minimizado la gravedad de sus errores ante los demás?', stage: 'autocritica', reverseScoring: true },
  { id: 'A12', text: '¿Ha analizado sus decisiones para mejorar en el futuro?', stage: 'autocritica', reverseScoring: false },
  { id: 'A13', text: '¿Ha evitado responsabilizarse de resultados negativos?', stage: 'autocritica', reverseScoring: true },
  { id: 'A14', text: '¿Ha pedido opiniones honestas sobre su trabajo?', stage: 'autocritica', reverseScoring: false },
  { id: 'A15', text: '¿Ha tomado acciones concretas para corregir sus defectos?', stage: 'autocritica', reverseScoring: false },
];

export const getQuestionsByStage = (stage: Question['stage']) => 
  questions.filter(q => q.stage === stage);

export const getStageForQuestionIndex = (index: number): Question['stage'] => {
  if (index < 15) return 'honesty';
  if (index < 30) return 'sincerity';
  return 'autocritica';
};

export const getQuestionIndexInStage = (index: number): number => {
  return (index % 15) + 1;
};
