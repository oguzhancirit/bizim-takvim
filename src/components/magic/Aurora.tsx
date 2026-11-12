/**
 * Arka planda yavaşça dolaşan yumuşak renk lekeleri. iPhone için: filter/blur yok,
 * sadece radial-gradient + transform animasyonu (GPU'da ucuz).
 */
export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div className={`aurora ${className}`} aria-hidden>
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
    </div>
  );
}

