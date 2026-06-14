// Phase2Screen — supplément d'information: new seals + the order to continue.
const { AsciiFrame: DLFrameP2, PageHeading: DLPH_P2, ClassificationChip: DLChipP2, Badge: DLBadgeP2 } = window.DS;

function Capture2Row({ file, last }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" onClick={(e) => e.preventDefault()}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         display: 'flex', alignItems: 'center', gap: '1ch', padding: '.4rem .6rem', textDecoration: 'none',
         fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)',
         borderBottom: last ? 'none' : '1px solid var(--p-ghost)',
         background: hover ? 'var(--inverse-bg)' : 'transparent',
         color: hover ? 'var(--inverse-fg)' : 'var(--p-text)',
         textShadow: hover ? 'none' : 'var(--text-glow)',
       }}>
      <span style={{ color: hover ? 'var(--inverse-fg)' : 'var(--p-bright)' }}>▣</span>
      <span style={{ flex: 1 }}>{file.name}</span>
      <span style={{ color: hover ? 'var(--inverse-fg)' : 'var(--p-faint)' }}>{file.kind}</span>
      <span style={{ color: hover ? 'var(--inverse-fg)' : 'var(--p-dim)', width: '7ch', textAlign: 'right' }}>{file.size}</span>
      <span>{hover ? '▼' : '↓'}</span>
    </a>
  );
}

function Phase2Screen({ supplement, captures2, onBack, onNext }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '1.25rem' }}><DLChipP2 blink>SUPPLÉMENT D'INFORMATION</DLChipP2></div>
      <DLPH_P2 subhead="Phase 2 — nouveaux scellés versés à la procédure">Supplément d'information</DLPH_P2>

      <div style={{ marginTop: '1.75rem' }}>
        <DLFrameP2 title="Ordonnance">
          <div style={{ fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)', lineHeight: 1.55, color: 'var(--p-text)' }}>
            {supplement.referral.map((l, i) => (
              <div key={i} style={{ minHeight: '1.15em' }}>{l || '\u00a0'}</div>
            ))}
          </div>
        </DLFrameP2>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <DLFrameP2 title="Nouveaux scellés" right={<DLBadgeP2 variant="info">{captures2.length}</DLBadgeP2>}>
          <div style={{ margin: '-.2rem 0' }}>
            {captures2.map((f, i) => <Capture2Row key={f.name} file={f} last={i === captures2.length - 1} />)}
          </div>
        </DLFrameP2>
      </div>

      <window.DLStepFooter
        backLabel="Preuves P1" onBack={onBack}
        nextLabel="Saisir les preuves" onNext={onNext}
        note="// poursuivez l'analyse sur les nouveaux scellés" />
    </div>
  );
}

window.Phase2Screen = Phase2Screen;
