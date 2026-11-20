import { useState } from 'react';

/**
 * Contenedor modular preparado para monetización (ej. Google AdSense).
 * Se mantiene separado por amplio margen vertical (my-10) de las tarjetas de video
 * y completamente fuera de TheaterModal para cumplir las políticas de YouTube Data API.
 *
 * Cuando no hay un anuncio activo (`enabled === false` y sin `children`),
 * muestra una tarjeta sutil de apoyo/compartir sin cuadros vacíos ni placeholders rotos.
 */
export function AdSlot({
  enabled = false,
  slotId = '',
  children = null,
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyShareLink = async () => {
    const shareUrl = 'https://queveohoy-sigma.vercel.app/';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  if (enabled && children) {
    return (
      <aside
        aria-label="Contenido patrocinado"
        data-ad-slot={slotId || undefined}
        className={`my-10 w-full rounded-DEFAULT border border-white/10 bg-surface-container-low/60 p-4 ${className}`}
      >
        {children}
      </aside>
    );
  }

  return (
    <aside
      aria-label="Recomendación y apoyo"
      className={`my-10 w-full rounded-DEFAULT border border-white/10 bg-surface-container-low/55 px-space-md py-4 flex flex-col sm:flex-row items-center justify-between gap-space-md ${className}`}
    >
      <div className="flex items-center gap-3 text-center sm:text-left">
        <span
          aria-hidden="true"
          className="hidden sm:inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
        </span>
        <p className="text-[12px] sm:text-[13px] text-on-surface-variant">
          <strong className="text-on-surface font-semibold">
            ¿Te salvó la comida de hoy?
          </strong>{' '}
          Comparte este recomendador con quien siempre tarda 20 minutos en elegir qué ver.
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopyShareLink}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-surface-container px-4 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-surface-container-high transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[15px]">
          {copied ? 'check' : 'content_copy'}
        </span>
        <span>{copied ? 'Enlace copiado' : 'Copiar enlace'}</span>
      </button>
    </aside>
  );
}
