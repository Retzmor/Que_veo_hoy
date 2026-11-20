const DURATION_GUIDES = [
  {
    icon: 'cookie',
    range: '5–10 min',
    title: 'Snacks y desayunos',
    description:
      'Cuando buscas qué ver mientras como algo rápido —un café, un sándwich o fruta—, los ensayos breves y curiosidades directas evitan dejar el video a medias.',
  },
  {
    icon: 'lunch_dining',
    range: '10–20 min',
    title: 'Almuerzos y cenas',
    description:
      'El punto ideal de videos de 15 minutos en YouTube: historias completas de ciencia, tecnología o humor con el ritmo justo para disfrutar todo tu plato caliente.',
  },
  {
    icon: 'coffee',
    range: '20–35 min',
    title: 'Comidas largas o sobremesa',
    description:
      'Funciona como un recomendador de videos sin algoritmo infinito para cenas tranquilas, mini documentales e investigaciones narradas sin distracciones.',
  },
];

const FAQ_ITEMS = [
  {
    question: '¿Es completamente gratis usar "¿Qué Veo Hoy?"?',
    answer:
      'Sí. ¿Qué Veo Hoy? es una herramienta 100 % gratuita pensada para resolver en segundos qué ver mientras comes, sin suscripciones ni muros de pago.',
  },
  {
    question: '¿Requiere registro o crear una cuenta?',
    answer:
      'No requiere registro ni inicio de sesión. Tu historial de videos vistos y descartados se guarda únicamente en el almacenamiento local (localStorage) de tu navegador.',
  },
  {
    question: '¿Cómo filtra exactamente la duración de cada video?',
    answer:
      'La aplicación consulta la duración real en segundos de cada video mediante la API oficial de YouTube y filtra estrictamente los que encajan en tu ventana de comida: 5–10 min, 10–20 min o 20–35 min.',
  },
];

export function EditorialSection() {
  return (
    <section
      aria-labelledby="editorial-guide-heading"
      className="mt-10 space-y-6 border-t border-white/10 pt-8"
    >
      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
          <span className="material-symbols-outlined text-[14px]">menu_book</span>
          Guía rápida de sobremesa
        </span>
        <h2
          id="editorial-guide-heading"
          className="font-headline-sm text-[18px] sm:text-[20px] font-semibold text-on-surface tracking-tight"
        >
          ¿Cómo elegir qué ver en YouTube mientras comes sin que se enfríe tu plato?
        </h2>
      </div>

      {/* 3 columnas compactas por duración */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {DURATION_GUIDES.map((item) => (
          <article
            key={item.range}
            className="rounded-DEFAULT border border-white/10 bg-surface-container-low/65 p-space-md space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-amber-400">
                  {item.icon}
                </span>
                {item.title}
              </span>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 tabular-nums">
                {item.range}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-on-surface-variant">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      {/* Mini FAQ con <details> accesibles */}
      <div className="space-y-2.5 pt-2">
        <h3 className="text-[12px] font-bold uppercase tracking-wider text-amber-400">
          Preguntas frecuentes
        </h3>
        <div className="space-y-2">
          {FAQ_ITEMS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-DEFAULT border border-white/10 bg-surface-container-low/65 px-space-md py-3 transition-colors open:bg-surface-container/80"
            >
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-[13px] font-semibold text-on-surface select-none">
                <span>{faq.question}</span>
                <span className="material-symbols-outlined text-[18px] text-amber-400 transition-transform duration-200 group-open:rotate-180 shrink-0">
                  expand_more
                </span>
              </summary>
              <p className="mt-2 pt-2 border-t border-white/5 text-[12px] leading-relaxed text-on-surface-variant">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
