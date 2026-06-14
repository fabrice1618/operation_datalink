// BootSequence — a short fake POST / connection sequence on launch.
// Types out lines, then auto-advances to the login screen. Skippable.
function BootSequence({ onDone }) {
  const lines = React.useMemo(() => [
    { t: 'DATALINK BIOS v2.0 — (C) 1987 SERVICE CRYPTOLOGIQUE', d: 60 },
    { t: '', d: 30 },
    { t: 'TEST MÉMOIRE ........ 640K ........ OK', d: 220 },
    { t: 'CONTRÔLEUR RÉSEAU ... DL-NIC ....... OK', d: 220 },
    { t: 'MODULE CRYPTO ....... AES-256 ...... OK', d: 220 },
    { t: 'LIAISON SÉCURISÉE ... HÔTE DISTANT . ÉTABLIE', d: 320 },
    { t: '', d: 30 },
    { t: '>> OPÉRATION DATALINK — PORTAIL D\u2019INVESTIGATION RÉSEAU', d: 260 },
    { t: '>> AUTHENTIFICATION REQUISE', d: 200 },
  ], []);

  const [shown, setShown] = React.useState(0);

  React.useEffect(() => {
    if (shown >= lines.length) {
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), lines[shown].d);
    return () => clearTimeout(t);
  }, [shown, lines, onDone]);

  return (
    <div
      onClick={onDone}
      style={{
        minHeight: 'calc(100vh - var(--header-height))',
        padding: '2.5rem 0', cursor: 'pointer', fontSize: 'var(--fs-base)', lineHeight: 1.5,
      }}
    >
      {lines.slice(0, shown).map((l, i) => {
        const sys = l.t.startsWith('>>');
        const okMatch = / (OK|ÉTABLIE)$/.test(l.t);
        return (
          <div key={i} style={{ color: sys ? 'var(--p-bright)' : 'var(--p-text)', minHeight: '1.3em' }}>
            {okMatch ? (
              <span>
                {l.t.replace(/ (OK|ÉTABLIE)$/, ' ')}
                <span style={{ color: 'var(--p-bright)', textShadow: 'var(--text-glow-strong)' }}>
                  {l.t.match(/(OK|ÉTABLIE)$/)[0]}
                </span>
              </span>
            ) : l.t || '\u00a0'}
          </div>
        );
      })}
      {shown < lines.length ? (
        <div style={{ color: 'var(--p-text)' }}><span className="term-cursor"></span></div>
      ) : null}
      <div style={{ position: 'fixed', bottom: '3rem', right: '2rem', color: 'var(--p-faint)', fontSize: 'var(--fs-xs)', whiteSpace: 'nowrap' }}>
        [ cliquer pour passer ]
      </div>
    </div>
  );
}

window.BootSequence = BootSequence;
