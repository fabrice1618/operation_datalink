// PreuvesScreen — evidence entry (the flag-equivalent), one row per
// requisition in the phase. Validates DATALINK{...}; typewriter reveal.
const { AsciiFrame: DLFrameP, PageHeading: DLPH_P, ProgressBar: DLProgP, Badge: DLBadgeP } = window.DS;

function PreuveRow({ phase, code, label, found, onSolve }) {
  const [val, setVal] = React.useState('');
  const [state, setState] = React.useState('idle');
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
        const msg = '>> PREUVE VERSÉE — ' + label;
        let i = 0;
        const t = setInterval(() => {
          setTyped(msg.slice(0, ++i));
          if (i >= msg.length) { clearInterval(t); setTimeout(() => onSolve(code), 420); }
        }, 22);
      } else {
        setState('denied'); setShake(true);
        setTimeout(() => setShake(false), 380);
        setTimeout(() => setState('idle'), 2800);
      }
    }, 420);
  }

  const isFound = found || state === 'granted';

  return (
    <div style={{
      padding: '.6rem 0', borderBottom: '1px solid var(--p-ghost)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1ch', marginBottom: '.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1ch' }}>
          <span style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-sm)' }}>{code}</span>
          <span style={{ color: 'var(--p-bright)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
        </div>
        {isFound ? <DLBadgeP variant="success">VERSÉE</DLBadgeP> : <DLBadgeP variant="pending">EN ATTENTE</DLBadgeP>}
      </div>

      {isFound ? (
        <div style={{ color: 'var(--p-bright)', fontSize: 'var(--fs-sm)' }}>
          <span style={{ color: 'var(--p-faint)' }}>&gt;&gt;</span> preuve versée à la procédure ✓
        </div>
      ) : (
        <React.Fragment>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.6ch', padding: '.35rem .6rem',
            background: 'var(--bg-inset)', border: '1px solid',
            borderColor: state === 'denied' ? 'var(--p-bright)' : 'var(--frame-line)',
            animation: shake ? 'term-shake .3s' : 'none',
          }}>
            <span style={{ color: 'var(--p-dim)' }}>PREUVE&gt;</span>
            <input value={val} onChange={(e) => setVal(e.target.value)} disabled={state === 'checking'}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="DATALINK{...}" autoComplete="off" spellCheck="false"
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
                       color: 'var(--p-bright)', fontFamily: 'var(--font-term)', fontSize: 'var(--fs-base)',
                       textShadow: 'var(--text-glow)' }} />
            <button onClick={submit} style={{ background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--p-bright)', fontFamily: 'var(--font-term)', fontSize: 'var(--fs-base)', textShadow: 'var(--text-glow)' }}>[▸]</button>
          </div>
          <div style={{ minHeight: '1.3rem', fontSize: 'var(--fs-sm)', marginTop: '.3rem' }}>
            {state === 'checking' && <span style={{ color: 'var(--p-faint)' }}>// vérification du scellé...</span>}
            {state === 'granted' && <span style={{ color: 'var(--p-bright)', textShadow: 'var(--text-glow-strong)' }}>{typed}</span>}
            {state === 'denied' && <span className="term-blink" style={{ color: 'var(--p-bright)' }}>// PREUVE REJETÉE — format incorrect</span>}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function PreuvesScreen({ phase, phaseKeys, phases, requisitions, group, found, onSolve, onBack, onNext }) {
  const count = phaseKeys.filter((k) => found.includes(k)).length;
  const total = phaseKeys.length;
  const complete = count === total;
  return (
    <div style={{ width: '100%' }}>
      <DLPH_P subhead={<span>Équipe {group} · phase {phase} · {count}/{total} versée(s)</span>}>
        Saisie des preuves
      </DLPH_P>

      <div style={{ margin: '1.5rem 0' }}>
        <DLProgP value={count} max={total} cells={36} />
      </div>

      <DLFrameP title={`Preuves — phase ${phase}`} right={`${count}/${total}`}>
        <div style={{ margin: '-.3rem 0' }}>
          {phaseKeys.map((code, i) => (
            <PreuveRow key={code} phase={phase} code={requisitions[i] ? requisitions[i].n : code}
                       label={phases[code]} found={found.includes(code)} onSolve={onSolve} />
          ))}
        </div>
      </DLFrameP>

      <window.DLStepFooter
        backLabel="Réquisitions" onBack={onBack}
        nextLabel={phase === 1 ? 'Phase 2' : 'Déposer le PV'} onNext={onNext} nextDisabled={!complete}
        note={complete ? '// toutes les preuves sont versées' : `// ${total - count} preuve(s) manquante(s)`} />
    </div>
  );
}

window.PreuvesScreen = PreuvesScreen;
