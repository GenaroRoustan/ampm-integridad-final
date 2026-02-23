import type { Question } from '@/types/assessment';

export const questions: Question[] = [
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

