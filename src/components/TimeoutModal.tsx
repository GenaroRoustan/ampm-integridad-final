interface TimeoutModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export function TimeoutModal({ isOpen, onContinue }: TimeoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Tiempo Agotado
        </h3>
        <p className="text-muted-foreground mb-6">Se acabó el tiempo para responder esta pregunta.</p>
        <button onClick={onContinue} className="btn-primary w-full">
          Continuar
        </button>
      </div>
    </div>
  );
}
