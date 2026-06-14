// SaisineScreen — the magistrate's referral that opens the case, plus the
// capture files placed under seal (downloadable).
const { AsciiFrame: DLFrameSa, PageHeading: DLPH_Sa, ClassificationChip: DLChipSa, Badge: DLBadgeSa } = window.DS;

function CaptureRow({ file, last }) {
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

function Field({ k, v }) {
  return (
    <div style={{ display: 'flex', gap: '1ch' }}>
      <span style={{ color: 'var(--p-faint)', width: '13ch', flexShrink: 0, textTransform: 'uppercase' }}>{k}</span>
      <span style={{ color: 'var(--p-faint)' }}>:</span>
      <span style={{ color: 'var(--p-bright)' }}>{v}</span>
    </div>
  );
}

function SaisineScreen({ saisine, captures, onNext }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '1.25rem' }}><DLChipSa blink>{saisine.classification}</DLChipSa></div>
      <DLPH_Sa subhead={saisine.dossier}>Saisine du juge d'instruction</DLPH_Sa>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start', marginTop: '1.75rem' }}>
        <DLFrameSa title="En-tête">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', fontSize: 'var(--fs-sm)' }}>
            <Field k="Juridiction" v={saisine.juridiction} />
            <Field k="Magistrat" v={saisine.magistrat} />
            <Field k="Horodatage" v={saisine.horodatage} />
            <Field k="Réseau" v={saisine.reseau} />
          </div>
        </DLFrameSa>

        <DLFrameSa title="Scellés numériques" right={<DLBadgeSa variant="info">{captures.length}</DLBadgeSa>}>
          <div style={{ margin: '-.2rem 0' }}>
            {captures.map((f, i) => <CaptureRow key={f.name} file={f} last={i === captures.length - 1} />)}
          </div>
        </DLFrameSa>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <DLFrameSa title="Réquisitoire introductif">
          <div style={{ fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)', lineHeight: 1.55, color: 'var(--p-text)' }}>
            {saisine.referral.map((l, i) => (
              <div key={i} style={{ minHeight: '1.15em' }}>{l || '\u00a0'}</div>
            ))}
          </div>
        </DLFrameSa>
      </div>

      <window.DLStepFooter
        nextLabel="Accéder aux réquisitions" onNext={onNext}
        note="// téléchargez les scellés puis poursuivez" />
    </div>
  );
}

window.SaisineScreen = SaisineScreen;
