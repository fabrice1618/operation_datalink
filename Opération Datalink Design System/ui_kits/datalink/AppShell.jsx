// AppShell — CRT chrome: title bar (brand · clock · superviseur · phosphor
// toggle) and, once a session is open, a linear PROGRESS STEPPER that drives
// navigation through the judicial pipeline.

function useClock() {
  const [now, setNow] = React.useState('');
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      setNow(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function PhosphorToggle({ phosphor, onToggle }) {
  return (
    <button onClick={onToggle} title="Basculer vert / ambre"
      style={{
        background: 'none', border: '1px solid var(--frame-line)', cursor: 'pointer',
        fontFamily: 'var(--font-term)', fontSize: 'var(--fs-xs)', letterSpacing: '.1em',
        color: 'var(--p-dim)', padding: '.1rem .6ch', textShadow: 'var(--text-glow)',
      }}>
      <span style={{ color: phosphor === 'green' ? 'var(--p-bright)' : 'var(--p-faint)' }}>VRT</span>
      <span style={{ opacity: .4 }}>/</span>
      <span style={{ color: phosphor === 'amber' ? 'var(--p-bright)' : 'var(--p-faint)' }}>AMB</span>
    </button>
  );
}

// The pipeline steps, in order.
const DL_STEPS = [
  { key: 'saisine',     label: 'Saisine' },
  { key: 'requisitions', label: 'Réquis.' },
  { key: 'preuves',     label: 'Preuves' },
  { key: 'phase2',      label: 'Phase 2' },
  { key: 'preuves2',    label: 'Preuves' },
  { key: 'pv',          label: 'PV' },
  { key: 'fin',         label: 'Fin' },
];

function Stepper({ route, maxStep, onNav }) {
  const curIdx = DL_STEPS.findIndex((s) => s.key === route);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '.2ch',
      padding: '.45rem 1.5rem', borderBottom: '1px solid var(--frame-line)',
      fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)',
    }}>
      {DL_STEPS.map((s, i) => {
        const isCurrent = i === curIdx;
        const reached = i <= maxStep;
        const done = reached && i < curIdx;
        return (
          <React.Fragment key={s.key}>
            {i > 0 ? <span style={{ color: 'var(--p-ghost)', margin: '0 .1ch' }}>›</span> : null}
            <button
              onClick={() => reached && onNav(s.key)}
              disabled={!reached}
              style={{
                border: 'none', cursor: reached ? 'pointer' : 'default',
                fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)', letterSpacing: '.06em',
                textTransform: 'uppercase', padding: '.08rem .7ch',
                background: isCurrent ? 'var(--inverse-bg)' : 'transparent',
                color: isCurrent ? 'var(--inverse-fg)'
                     : done ? 'var(--p-bright)'
                     : reached ? 'var(--p-dim)' : 'var(--p-ghost)',
                textShadow: isCurrent ? 'none' : 'var(--text-glow)',
              }}>
              <span style={{ opacity: .6 }}>{String(i + 1)}</span> {s.label}{done ? ' ✓' : ''}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function AppShell({ route, group, phosphor, maxStep, onTogglePhosphor, onNav, onSuperviseur, children }) {
  const clock = useClock();
  const preSession = route === 'boot' || route === 'home' || route === 'equipe';
  const showStepper = !preSession && route !== 'superviseur';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Title bar */}
      <div style={{
        borderBottom: '1px solid var(--frame-line)', padding: '0 1.5rem',
        height: 'var(--header-height)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1ch', minWidth: 0 }}>
          <span style={{ color: 'var(--p-max)', flexShrink: 0 }}>&#9612;</span>
          <a href="#" onClick={(e) => { e.preventDefault(); window.DLNAV?.(group ? 'saisine' : 'home'); }}
             style={{ textDecoration: 'none', color: 'var(--p-bright)', fontSize: 'var(--fs-md)',
                      letterSpacing: '.1em', textShadow: 'var(--text-glow-strong)', whiteSpace: 'nowrap' }}>
            OP. DATALINK
          </a>
          <span style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-xs)', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>
            INSTR. 2026/DL-03
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2ch', fontSize: 'var(--fs-xs)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {group ? <span style={{ color: 'var(--p-dim)' }}>EQ:<span style={{ color: 'var(--p-bright)' }}>{group}</span></span> : null}
          <span style={{ color: 'var(--p-dim)' }}>{clock}</span>
          {!preSession ? (
            <button onClick={onSuperviseur} title="Console superviseur"
              style={{ background: 'none', border: '1px solid var(--frame-line)', cursor: 'pointer',
                       fontFamily: 'var(--font-term)', fontSize: 'var(--fs-xs)', letterSpacing: '.1em',
                       color: route === 'superviseur' ? 'var(--p-bright)' : 'var(--p-dim)',
                       padding: '.1rem .6ch', textShadow: 'var(--text-glow)' }}>
              ◊ SUP
            </button>
          ) : null}
          <PhosphorToggle phosphor={phosphor} onToggle={onTogglePhosphor} />
        </div>
      </div>

      {showStepper ? <Stepper route={route} maxStep={maxStep} onNav={onNav} /> : null}

      {/* Content */}
      <main style={{
        flex: 1, width: '100%', maxWidth: 'var(--container-max)', margin: '0 auto',
        padding: preSession ? '0 1.5rem' : '1.75rem 1.5rem 3.5rem',
        display: 'flex', flexDirection: 'column',
      }}>
        {children}
      </main>

      {/* Status footer */}
      <div style={{
        borderTop: '1px solid var(--frame-line)', padding: '.4rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', gap: '1rem',
        fontSize: 'var(--fs-2xs)', color: 'var(--p-faint)', letterSpacing: '.08em',
      }}>
        <span>SYS_STATUS: <span style={{ color: 'var(--p-dim)' }}>ONLINE</span></span>
        <span>PROCÉDURE JUDICIAIRE — LIAISON CHIFFRÉE</span>
      </div>
    </div>
  );
}

window.AppShell = AppShell;
window.DL_STEPS = DL_STEPS;
