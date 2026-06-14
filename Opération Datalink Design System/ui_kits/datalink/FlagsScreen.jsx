// FlagsScreen — flag submission with live validation, typewriter reveal.
const { AsciiFrame: DLFrameF, PageHeading: DLPH_F, ProgressBar: DLProgF, Button: DLBtnF, Badge: DLBadgeF } = window.DS;

function FlagRow({ phase, label, found, onSolve }) {
  const [val, setVal] = React.useState('');
  const [state, setState] = React.useState('idle'); // idle|checking|granted|denied
  const [typed, setTyped] = React.useState('');
  const [shake, setShake] = React.useState(false);

  function submit() {
    const flag = val.trim();
    if (!flag || state === 'checking') return;
    setState('checking');
    setTimeout(() => {
      const ok = /^datalink\{.+\}$/i.test(flag);
      if (ok) {
        setState('granted');
        const msg = '>> ACCESS GRANTED — ' + label;
        let i = 0;
        const t = setInterval(() => {
          setTyped(msg.slice(0, ++i));
          if (i >= msg.length) { clearInterval(t); setTimeout(() => onSolve(phase), 450); }
        }, 24);
      } else {
        setState('denied');
        setShake(true);
        setTimeout(() => setShake(false), 380);
        setTimeout(() => setState('idle'), 2800);
      }
    }, 420);
  }

  const isFound = found || state === 'granted';

  return (
    <div style={{ border: '1px solid var(--frame-line)', background: 'var(--bg-panel)', padding: '.9rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1ch', marginBottom: '.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1ch' }}>
          <span style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-sm)' }}>{phase}</span>
          <span style={{ color: 'var(--p-bright)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
        </div>
        {isFound ? <DLBadgeF variant="success">OK</DLBadgeF> : <DLBadgeF variant="pending">··</DLBadgeF>}
      </div>

      {isFound ? (
        <div style={{ color: 'var(--p-bright)', fontSize: 'var(--fs-sm)' }}>
          <span style={{ color: 'var(--p-faint)' }}>&gt;&gt;</span> flag validé ✓
        </div>
      ) : (
        <React.Fragment>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.6ch', padding: '.35rem .6rem',
            background: 'var(--bg-inset)', border: '1px solid',
            borderColor: state === 'denied' ? 'var(--p-bright)' : 'var(--frame-line)',
            animation: shake ? 'term-shake .3s' : 'none',
          }}>
            <span style={{ color: 'var(--p-dim)' }}>FLAG&gt;</span>
            <input
              value={val} onChange={(e) => setVal(e.target.value)} disabled={state === 'checking'}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="DATALINK{...}" autoComplete="off" spellCheck="false"
              style={{
                flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--p-bright)', fontFamily: 'var(--font-term)', fontSize: 'var(--fs-base)',
                textShadow: 'var(--text-glow)',
              }}
            />
            <button onClick={submit} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--p-bright)',
              fontFamily: 'var(--font-term)', fontSize: 'var(--fs-base)', textShadow: 'var(--text-glow)',
            }}>[▸]</button>
          </div>
          <div style={{ minHeight: '1.3rem', fontSize: 'var(--fs-sm)', marginTop: '.3rem' }}>
            {state === 'checking' && <span style={{ color: 'var(--p-faint)' }}>// vérification en cours...</span>}
            {state === 'granted' && <span style={{ color: 'var(--p-bright)', textShadow: 'var(--text-glow-strong)' }}>{typed}</span>}
            {state === 'denied' && <span className="term-blink" style={{ color: 'var(--p-bright)' }}>// ACCÈS REFUSÉ — flag incorrect</span>}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function FlagsScreen({ phases, group, found, onSolve, onBack }) {
  const entries = Object.entries(phases);
  const total = entries.length;
  const count = found.length;
  return (
    <div style={{ width: '100%' }}>
      <window.DLBackToMenu onBack={onBack} />
      <DLPH_F subhead={<span>Équipe {group} · {count}/{total} validé(s)</span>}>Soumission des flags</DLPH_F>
      <div style={{ margin: '1.5rem 0' }}>
        <DLProgF value={count} max={total} cells={36} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {entries.map(([phase, label]) => (
          <FlagRow key={phase} phase={phase} label={label} found={found.includes(phase)} onSolve={onSolve} />
        ))}
      </div>
    </div>
  );
}

window.FlagsScreen = FlagsScreen;
