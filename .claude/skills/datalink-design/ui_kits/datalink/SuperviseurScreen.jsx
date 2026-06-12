// SuperviseurScreen — instructor console: stats + progression table.
const { AsciiFrame: DLFrameD, StatCard: DLStat, PageHeading: DLPH_D, Badge: DLBadgeD } = window.DS;

function SuperviseurScreen({ phases, teams, onBack }) {
  const phaseKeys = Object.keys(phases);
  const total = phaseKeys.length;
  const totalSolved = teams.reduce((s, t) => s + t.found.length, 0);
  const pvCount = teams.filter((t) => t.pv).length;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <window.DS.Button variant="secondary" icon="◂" onClick={onBack}>Retour à la procédure</window.DS.Button>
      </div>
      <DLPH_D subhead={`${teams.length} groupe(s) enregistré(s)`}>Console superviseur</DLPH_D>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', margin: '1.75rem 0' }}>
        <DLStat value={String(teams.length).padStart(2, '0')} label="Équipes" />
        <DLStat value={String(totalSolved).padStart(2, '0')} label="Flags validés" />
        <DLStat value={String(pvCount).padStart(2, '0')} label="PV déposés" />
      </div>

      <DLFrameD title="Progression par groupe">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)' }}>
            <thead>
              <tr>
                <th style={thD('left')}>Groupe</th>
                {phaseKeys.map((p) => <th key={p} style={thD('center')} title={phases[p]}>{p.replace('phase_', 'P')}</th>)}
                <th style={thD('center')}>Score</th>
                <th style={thD('center')}>PV</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => {
                const score = t.found.length;
                const variant = score === total ? 'success' : score > 0 ? 'warn' : 'pending';
                return (
                  <tr key={t.name} className="sv-row">
                    <td style={tdD('left')}>
                      <div style={{ color: 'var(--p-bright)' }}>{t.name}</div>
                      <div style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-xs)' }}>{t.createdAt}</div>
                    </td>
                    {phaseKeys.map((p) => (
                      <td key={p} style={tdD('center')}>
                        {t.found.includes(p)
                          ? <span style={{ color: 'var(--p-bright)', textShadow: 'var(--text-glow)' }}>✓</span>
                          : <span style={{ color: 'var(--p-ghost)' }}>—</span>}
                      </td>
                    ))}
                    <td style={tdD('center')}><DLBadgeD variant={variant}>{score}/{total}</DLBadgeD></td>
                    <td style={tdD('center')}>
                      {t.pv ? <DLBadgeD variant="info">1</DLBadgeD> : <span style={{ color: 'var(--p-ghost)' }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DLFrameD>
      <style>{`.sv-row:hover td{background:var(--p-glow)}`}</style>
    </div>
  );
}

function thD(align) {
  return {
    padding: '.4rem .8rem', textAlign: align, fontSize: 'var(--fs-xs)', letterSpacing: '.1em',
    textTransform: 'uppercase', color: 'var(--p-dim)', borderBottom: '1px solid var(--frame-line)',
  };
}
function tdD(align) {
  return {
    padding: '.5rem .8rem', textAlign: align, borderBottom: '1px solid var(--p-ghost)',
    color: 'var(--p-text)', verticalAlign: 'middle',
  };
}

window.SuperviseurScreen = SuperviseurScreen;
