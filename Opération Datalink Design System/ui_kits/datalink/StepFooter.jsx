// Shared bits for pipeline screens: a "continue" footer bar.
const { Button: DLBtnNav } = window.DS;

function StepFooter({ backLabel, onBack, nextLabel, onNext, nextDisabled, note }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1ch', marginTop: '1.75rem',
      paddingTop: '1rem', borderTop: '1px solid var(--p-ghost)',
    }}>
      {onBack ? <DLBtnNav variant="secondary" icon="◂" onClick={onBack}>{backLabel || 'Retour'}</DLBtnNav> : null}
      <span style={{ flex: 1 }} />
      {note ? <span style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-sm)' }}>{note}</span> : null}
      {onNext ? (
        <DLBtnNav variant="primary" icon="▸" disabled={nextDisabled} onClick={onNext}>
          {nextLabel || 'Continuer'}
        </DLBtnNav>
      ) : null}
    </div>
  );
}

window.DLStepFooter = StepFooter;
