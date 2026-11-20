import { useEffect, useRef } from 'react';

export function PrivacyModal({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="animate-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-panel relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-container-low shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-surface-container-lowest/80 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-amber-400">
              verified_user
            </span>
            <h2
              id="privacy-modal-title"
              className="font-headline-sm text-[17px] font-semibold text-on-surface"
            >
              Política de Privacidad y Uso de API de YouTube
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar política de privacidad"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-[13px] leading-relaxed text-on-surface-variant">
          <section className="space-y-1.5">
            <h3 className="text-[14px] font-semibold text-on-surface">
              1. Uso de Servicios de API de YouTube
            </h3>
            <p>
              <strong>¿Qué Veo Hoy?</strong> utiliza la{' '}
              <strong>YouTube Data API v3</strong> para consultar metadatos públicos
              (título, canal, miniatura y duración exacta) y reproduce los videos
              mediante el reproductor oficial embebido de YouTube. Al utilizar esta
              aplicación aceptas estar sujeto a los{' '}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline font-semibold"
              >
                Términos de Servicio de YouTube
              </a>{' '}
              y la{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline font-semibold"
              >
                Política de Privacidad de Google
              </a>
              .
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-[14px] font-semibold text-on-surface">
              2. Datos locales en tu navegador (localStorage)
            </h3>
            <p>
              Esta aplicación no solicita registro, correos electrónicos ni contraseñas, y
              no almacena información personal en servidores propios. Únicamente guardamos
              de forma local en el <code>localStorage</code> de tu dispositivo:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Los identificadores de videos que abriste o descartaste para no
                repetir recomendaciones.
              </li>
              <li>
                Tu historial reciente de reproducción (máximo los últimos 30 videos).
              </li>
              <li>
                Un caché temporal de lotes de búsqueda por 6 horas para optimizar la
                cuota de consulta.
              </li>
            </ul>
            <p>
              Puedes eliminar estos datos locales en cualquier momento pulsando{' '}
              <strong>“Limpiar historial de vistos”</strong>.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-[14px] font-semibold text-on-surface">
              3. Publicidad y cumplimiento con YouTube
            </h3>
            <p>
              Cualquier bloque publicitario futuro se ubica estrictamente separado del
              reproductor de YouTube y nunca se superpone sobre miniaturas ni sobre el
              video en reproducción. Los anuncios de terceros, en caso de habilitarse,
              pueden utilizar cookies estándar del navegador según las políticas del
              proveedor correspondiente.
            </p>
          </section>
        </div>

        {/* Pie */}
        <div className="border-t border-white/10 bg-surface-container-lowest/90 px-5 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-1.5 text-[12px] font-bold text-black hover:brightness-110 transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
