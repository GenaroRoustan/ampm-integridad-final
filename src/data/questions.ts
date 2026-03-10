import type { Question } from '@/types/assessment';

// ── PRUEBA CON EXPERIENCIA LABORAL (original) ──
export const questionsConExperiencia: Question[] = [
  // HONESTIDAD (15 preguntas)
  { id: 'H01', text: 'Cuando algo en el trabajo me llama la atención y está al alcance, pienso que nadie se va a dar cuenta si me lo llevo.', stage: 'honesty', reverseScoring: true },
  { id: 'H02', text: 'He marcado mi entrada o salida en un horario diferente al que realmente estuve en el trabajo.', stage: 'honesty', reverseScoring: true },
  { id: 'H03', text: 'He usado el teléfono, internet, impresora u otros materiales del trabajo para algo personal sin pedirlo.', stage: 'honesty', reverseScoring: true },
  { id: 'H04', text: 'Cuando algo salió mal en el trabajo, le di a mi jefe una versión diferente a lo que realmente pasó.', stage: 'honesty', reverseScoring: true },
  { id: 'H05', text: 'He guardado silencio cuando vi que un compañero hizo algo mal, aunque eso perjudicara al negocio.', stage: 'honesty', reverseScoring: true },
  { id: 'H06', text: 'Si encuentro dinero o un objeto de valor en mi lugar de trabajo, lo primero que hago es reportarlo o entregarlo.', stage: 'honesty', reverseScoring: false },
  { id: 'H07', text: 'He dicho que no cuando alguien me propuso hacer algo en el trabajo que me parecía deshonesto, aunque eso me trajera problemas.', stage: 'honesty', reverseScoring: false },
  { id: 'H08', text: 'Cuando he visto algo raro o sospechoso en el trabajo (robos, fraudes, malos manejos), lo he reportado a quien corresponde.', stage: 'honesty', reverseScoring: false },
  { id: 'H09', text: 'Un proveedor, vendedor o cliente me ha ofrecido algo (dinero, producto, favor) para que yo le dé preferencia o le ayude con algo.', stage: 'honesty', reverseScoring: true },
  { id: 'H10', text: 'He cambiado, borrado o ajustado números o información del trabajo para que algo cuadrara o para que no se viera un error mío.', stage: 'honesty', reverseScoring: true },
  { id: 'H11', text: 'Cuando estoy solo o sin supervisión en el trabajo, me comporto igual que cuando hay alguien mirando.', stage: 'honesty', reverseScoring: false },
  { id: 'H12', text: 'He cobrado una cantidad diferente a la que marcaba el sistema o la etiqueta, aunque el cliente no lo notó.', stage: 'honesty', reverseScoring: true },
  { id: 'H13', text: 'He comentado con personas de afuera (familiares, amigos) cosas del trabajo que se supone no debería contar.', stage: 'honesty', reverseScoring: true },
  { id: 'H14', text: 'Cuando el cliente me da de más o no revisa el cambio, yo igual le entrego lo correcto sin quedarme con nada.', stage: 'honesty', reverseScoring: false },
  { id: 'H15', text: 'He tomado la decisión correcta en el trabajo aunque me haya costado tiempo, problemas o la molestia de otros.', stage: 'honesty', reverseScoring: false },

  // SINCERIDAD (15 preguntas)
  { id: 'S01', text: 'Cuando he cometido un error en el trabajo, lo he reconocido directamente en lugar de esconderlo o echarle la culpa a algo más.', stage: 'sincerity', reverseScoring: false },
  { id: 'S02', text: 'He dado una razón diferente a la real para explicar por qué llegué tarde o no pude cumplir algo.', stage: 'sincerity', reverseScoring: true },
  { id: 'S03', text: 'En una entrevista o al presentarme, he dicho que sé hacer algo o que tengo experiencia en algo que en realidad no domino bien.', stage: 'sincerity', reverseScoring: true },
  { id: 'S04', text: 'Cuando algo salió mal por causa mía, dejé que otro cargara con la culpa o lo insinué sin decirlo directamente.', stage: 'sincerity', reverseScoring: true },
  { id: 'S05', text: 'Me he quedado callado sobre algo importante que mi jefe necesitaba saber, porque no quería las consecuencias.', stage: 'sincerity', reverseScoring: true },
  { id: 'S06', text: 'He dicho lo que realmente pasó o lo que realmente pienso, aunque sabía que me iba a traer problemas.', stage: 'sincerity', reverseScoring: false },
  { id: 'S07', text: 'He dicho "sí lo hago" o "claro que puedo" cuando en realidad sabía que probablemente no iba a poder o querer cumplirlo.', stage: 'sincerity', reverseScoring: true },
  { id: 'S08', text: 'He pedido permiso o reportado una enfermedad que no era tan grave (o no existía) para no ir a trabajar o salir antes.', stage: 'sincerity', reverseScoring: true },
  { id: 'S09', text: 'Cuando no sé cómo hacer algo o no conozco la respuesta, lo digo abiertamente en lugar de inventar o adivinar.', stage: 'sincerity', reverseScoring: false },
  { id: 'S10', text: 'He comentado cosas negativas de un compañero de trabajo con otras personas, pero sin decírselo a él directamente.', stage: 'sincerity', reverseScoring: true },
  { id: 'S11', text: 'He dicho lo que realmente pienso sobre algo en el trabajo, aunque sabía que no era lo que la mayoría quería escuchar.', stage: 'sincerity', reverseScoring: false },
  { id: 'S12', text: 'He contado algo de una forma que hacía ver mal a alguien, cambiando detalles o dejando cosas fuera a propósito.', stage: 'sincerity', reverseScoring: true },
  { id: 'S13', text: 'He reconocido abiertamente que hay cosas del trabajo que no sé hacer bien o que me cuestan.', stage: 'sincerity', reverseScoring: false },
  { id: 'S14', text: 'He dado una respuesta a medias o poco clara a propósito, para no tener que explicar algo que me complicaba.', stage: 'sincerity', reverseScoring: true },
  { id: 'S15', text: 'Cuando prometí algo en el trabajo, lo cumplí, aunque me costó esfuerzo o tiempo extra.', stage: 'sincerity', reverseScoring: false },

  // AUTOCRÍTICA (15 preguntas)
  { id: 'A01', text: 'Cuando cometo un error, me tomo el tiempo de entender qué pasó para no volver a hacerlo.', stage: 'autocritica', reverseScoring: false },
  { id: 'A02', text: 'Cuando algo me salió mal, pensé que fue por mala suerte, por otros o por las circunstancias, más que por algo mío.', stage: 'autocritica', reverseScoring: true },
  { id: 'A03', text: 'He pedido a mi jefe o a compañeros que me digan qué puedo mejorar en mi trabajo.', stage: 'autocritica', reverseScoring: false },
  { id: 'A04', text: 'Cuando alguien me ha señalado un error o me ha criticado, lo he escuchado con calma en lugar de defenderme o negarme.', stage: 'autocritica', reverseScoring: false },
  { id: 'A05', text: 'He pedido ayuda cuando no supe cómo hacer algo, en lugar de hacerlo mal por no preguntar.', stage: 'autocritica', reverseScoring: false },
  { id: 'A06', text: 'En una discusión o problema con alguien, he sentido que yo tenía razón y que el otro era quien estaba equivocado.', stage: 'autocritica', reverseScoring: true },
  { id: 'A07', text: 'Después de que alguien me llamó la atención o se quejó de mí, cambié algo en la forma en que trabajo o me comporto.', stage: 'autocritica', reverseScoring: false },
  { id: 'A08', text: 'Cuando algo no me salió como esperaba, pensé que fue mala suerte o que el momento no era el adecuado.', stage: 'autocritica', reverseScoring: true },
  { id: 'A09', text: 'Cuando hice algo mal que afectó a alguien, fui directamente a disculparme con esa persona.', stage: 'autocritica', reverseScoring: false },
  { id: 'A10', text: 'He aprendido algo nuevo (curso, práctica, preguntar a otros) porque reconocí que me faltaba mejorar en esa área.', stage: 'autocritica', reverseScoring: false },
  { id: 'A11', text: 'He quitado importancia a algo que hice mal cuando se lo conté a otros, para que no se viera tan grave.', stage: 'autocritica', reverseScoring: true },
  { id: 'A12', text: 'Me he sentado a pensar por qué tomé una decisión que salió mal, para entender qué haría diferente.', stage: 'autocritica', reverseScoring: false },
  { id: 'A13', text: 'Cuando un resultado fue malo, preferí no asumir mi parte de culpa o busqué la forma de que no me asociaran con ese problema.', stage: 'autocritica', reverseScoring: true },
  { id: 'A14', text: 'He buscado que alguien de confianza me diga la verdad sobre cómo estoy haciendo mi trabajo, aunque pueda ser negativo.', stage: 'autocritica', reverseScoring: false },
  { id: 'A15', text: 'Cuando me di cuenta de algo que hago mal, tomé pasos concretos para cambiarlo, no solo me prometí hacerlo.', stage: 'autocritica', reverseScoring: false },
];

// ── PRUEBA SIN EXPERIENCIA LABORAL (situacional) ──
export const questionsSinExperiencia: Question[] = [
  // HONESTIDAD (15 preguntas)
  { id: 'H01', text: 'Estás en caja y al cerrar el turno te das cuenta que hay C$200 de más que no cuadran con las ventas. ¿Lo reportarías aunque nadie te lo pida?', stage: 'honesty', reverseScoring: false },
  { id: 'H02', text: 'Tu primer día de trabajo, un compañero te dice: "Aquí todos nos llevamos una cosita pequeña a veces, es normal." ¿Seguirías su ejemplo para no quedar mal?', stage: 'honesty', reverseScoring: true },
  { id: 'H03', text: 'Estás acomodando mercadería y encuentras un producto dañado que igual podría venderse. ¿Lo sacarías para ti sin decirle a nadie?', stage: 'honesty', reverseScoring: true },
  { id: 'H04', text: 'Un cliente te paga con un billete y tú sabes que te dio de más. ¿Le devolverías el cambio correcto aunque el cliente no se haya dado cuenta?', stage: 'honesty', reverseScoring: false },
  { id: 'H05', text: 'Tu supervisor te pide que registres una venta de una manera que no es del todo correcta. ¿Lo harías para no tener problemas con él?', stage: 'honesty', reverseScoring: true },
  { id: 'H06', text: 'Si ves que un compañero está robando producto de la tienda, ¿lo reportarías a tu jefe aunque ese compañero sea tu amigo?', stage: 'honesty', reverseScoring: false },
  { id: 'H07', text: 'Te ofrecen un trabajo donde el sueldo es mayor pero el dueño te dice que tendrás que hacer "pequeños favores" que no son del todo legales. ¿Rechazarías esa oferta?', stage: 'honesty', reverseScoring: false },
  { id: 'H08', text: 'Al contar el efectivo del día encuentras que falta dinero. Sabes que fue un error tuyo al dar cambio. ¿Lo admitirías inmediatamente ante tu jefe?', stage: 'honesty', reverseScoring: false },
  { id: 'H09', text: 'Un proveedor te ofrece un regalo personal a cambio de que le hagas un pedido más grande de lo necesario. ¿Aceptarías el regalo?', stage: 'honesty', reverseScoring: true },
  { id: 'H10', text: 'Te piden llenar un inventario y notas que si cambias un número pequeño nadie se daría cuenta y tú quedarías bien con tu jefe. ¿Cambiarías ese número?', stage: 'honesty', reverseScoring: true },
  { id: 'H11', text: 'Si cometes un error que causó una pérdida para la tienda, ¿serías capaz de decírselo a tu jefe antes de que él lo descubra solo?', stage: 'honesty', reverseScoring: false },
  { id: 'H12', text: 'Eres cajero y sabes que si cobras C$5 extra en cada transacción nadie lo notaría. ¿Lo harías para ganar un poco más?', stage: 'honesty', reverseScoring: true },
  { id: 'H13', text: 'Te enteras de información interna de la empresa (precios, problemas, conflictos). ¿Se la contarías a personas de fuera aunque te lo pidieran?', stage: 'honesty', reverseScoring: true },
  { id: 'H14', text: 'Si un cliente se queja contigo de algo que fue error tuyo, ¿asumirías la responsabilidad directamente en lugar de buscar una excusa?', stage: 'honesty', reverseScoring: false },
  { id: 'H15', text: '¿Crees que es posible trabajar en una empresa con acceso a efectivo y nunca tomar nada que no sea tuyo, sin importar la situación económica que estés pasando?', stage: 'honesty', reverseScoring: false },

  // SINCERIDAD (15 preguntas)
  { id: 'S01', text: 'Si pudieras hacer algo incorrecto y estás 100% seguro que nadie se enteraría jamás, ¿igual lo evitarías por convicción propia?', stage: 'sincerity', reverseScoring: false },
  { id: 'S02', text: 'Cuando alguien te hace una pregunta incómoda, ¿tiendes a decir lo que esa persona quiere escuchar aunque no sea la verdad?', stage: 'sincerity', reverseScoring: true },
  { id: 'S03', text: 'Si un amigo cercano te pide que lo cubras con una mentira ante tu jefe, ¿lo harías para no perder la amistad?', stage: 'sincerity', reverseScoring: true },
  { id: 'S04', text: '¿Has mentido alguna vez para evitar meterte en problemas, aunque la mentira perjudicara a alguien más?', stage: 'sincerity', reverseScoring: true },
  { id: 'S05', text: 'Cuando estás bajo presión o estrés, ¿tiendes a actuar de formas que normalmente no harías?', stage: 'sincerity', reverseScoring: true },
  { id: 'S06', text: '¿Crees que la honestidad es importante incluso cuando te perjudica a ti mismo?', stage: 'sincerity', reverseScoring: false },
  { id: 'S07', text: 'Si alguien en tu entorno hace algo incorrecto y todos lo aceptan como normal, ¿adoptarías esa conducta para encajar?', stage: 'sincerity', reverseScoring: true },
  { id: 'S08', text: '¿Has exagerado tus cualidades o logros para quedar bien ante alguien importante?', stage: 'sincerity', reverseScoring: true },
  { id: 'S09', text: 'Si ves algo injusto ocurriendo en tu lugar de trabajo, ¿lo reportarías aunque nadie más lo haga y arriesgues ser impopular?', stage: 'sincerity', reverseScoring: false },
  { id: 'S10', text: '¿Crees que las "pequeñas mentiras" que no dañan a nadie son completamente aceptables en el día a día?', stage: 'sincerity', reverseScoring: true },
  { id: 'S11', text: '¿Mantienes los mismos valores y conducta tanto cuando estás siendo observado como cuando estás solo?', stage: 'sincerity', reverseScoring: false },
  { id: 'S12', text: 'Si tu jefe te pide hacer algo que consideras incorrecto, ¿lo harías de todas formas para no perder el trabajo?', stage: 'sincerity', reverseScoring: true },
  { id: 'S13', text: '¿Crees que una persona puede trabajar en un ambiente donde todos actúan mal y mantener sus propios valores intactos?', stage: 'sincerity', reverseScoring: false },
  { id: 'S14', text: '¿Te ha pasado que prometes algo que sabes que probablemente no vas a cumplir?', stage: 'sincerity', reverseScoring: true },
  { id: 'S15', text: 'Si descubres que la empresa donde trabajas está haciendo algo ilegal, ¿lo denunciarías aunque eso signifique quedarte sin trabajo?', stage: 'sincerity', reverseScoring: false },

  // AUTOCRÍTICA (15 preguntas)
  { id: 'A01', text: 'Cuando cometes un error, ¿tu primera reacción es asumir la responsabilidad en lugar de buscar a quién culpar?', stage: 'autocritica', reverseScoring: false },
  { id: 'A02', text: '¿Te cuesta reconocer cuando estás equivocado, especialmente frente a otras personas?', stage: 'autocritica', reverseScoring: true },
  { id: 'A03', text: 'Si un jefe te da una retroalimentación negativa sobre tu trabajo, ¿la recibirías con apertura en lugar de ponerte a la defensiva?', stage: 'autocritica', reverseScoring: false },
  { id: 'A04', text: '¿Crees que eres capaz de identificar tus propios defectos con honestidad, sin sobreestimarte?', stage: 'autocritica', reverseScoring: false },
  { id: 'A05', text: 'Si tu forma de hacer una tarea resulta ser incorrecta y un compañero te lo señala, ¿cambiarías tu método aunque hayas estado seguro de que estabas bien?', stage: 'autocritica', reverseScoring: false },
  { id: 'A06', text: '¿Tiendes a justificar tus errores con circunstancias externas en lugar de asumir tu parte de responsabilidad?', stage: 'autocritica', reverseScoring: true },
  { id: 'A07', text: 'Si causas un problema en el trabajo por descuido, ¿harías todo lo posible por corregirlo aunque nadie te lo pida?', stage: 'autocritica', reverseScoring: false },
  { id: 'A08', text: '¿Te has dado cuenta de que a veces actúas de forma impulsiva y luego te arrepientes?', stage: 'autocritica', reverseScoring: true },
  { id: 'A09', text: '¿Eres capaz de pedir disculpas sinceras cuando sabes que te equivocaste, incluso ante alguien de menor rango que tú?', stage: 'autocritica', reverseScoring: false },
  { id: 'A10', text: 'Si un supervisor reconoce públicamente el trabajo de otro compañero y no el tuyo, ¿podrías felicitar a ese compañero sinceramente?', stage: 'autocritica', reverseScoring: false },
  { id: 'A11', text: '¿Te cuesta aceptar las reglas de una empresa cuando sientes que no estás de acuerdo con ellas?', stage: 'autocritica', reverseScoring: true },
  { id: 'A12', text: 'Cuando algo sale mal en un proyecto grupal en el que participas, ¿asumes tu parte de la culpa aunque otros no lo hagan?', stage: 'autocritica', reverseScoring: false },
  { id: 'A13', text: '¿Has actuado alguna vez de forma diferente a tus valores solo porque todos a tu alrededor lo hacían?', stage: 'autocritica', reverseScoring: true },
  { id: 'A14', text: '¿Crees que aprender de los errores es más valioso que nunca cometerlos?', stage: 'autocritica', reverseScoring: false },
  { id: 'A15', text: 'Si en tu primer mes de trabajo cometes un error grave, ¿serías capaz de decírselo directamente a tu jefe antes de que lo descubra por otro medio?', stage: 'autocritica', reverseScoring: false },
];

// ── EXPORT DINÁMICO según modalidad ──
// modalidad: 'con_experiencia' | 'sin_experiencia'
export function getQuestions(modalidad?: string): Question[] {
  return modalidad === 'sin_experiencia'
    ? questionsSinExperiencia
    : questionsConExperiencia;
}

// Export por defecto (retrocompatibilidad — usa con experiencia)
export const questions = questionsConExperiencia;

export const getQuestionsByStage = (stage: Question['stage'], modalidad?: string) =>
  getQuestions(modalidad).filter(q => q.stage === stage);

export const getStageForQuestionIndex = (index: number): Question['stage'] => {
  if (index < 15) return 'honesty';
  if (index < 30) return 'sincerity';
  return 'autocritica';
};

export const getQuestionIndexInStage = (index: number): number => {
  return (index % 15) + 1;
};
