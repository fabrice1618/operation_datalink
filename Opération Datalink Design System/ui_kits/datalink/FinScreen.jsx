// FinScreen — end screen: avancement summary + verdict.
const { AsciiFrame: DLFrameF, PageHeading: DLPH_F, ProgressBar: DLProgF, Badge: DLBadgeF, StatCard: DLStatF, Button: DLBtnF } = window.DS;

function FinScreen({ group, phases, found, pvs, onSuperviseur }) {
  const entries = Object.entries(phases);
  const total = entries.length;
  const count = found.length;
  const complete = count === total && pvs.length > 0;

  return (
    <div style={{ width: '100%' }}>
      <DLPH_F subhead={<span>Équipe {group}</span>}>Fin de procédure — avancement</DLPH_F>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', margin: '1.75rem 0' }}>
        <DLStatF value={`${count}/${total}`} label="Preuves versées" />
        <DLStatF value={String(pvs.length).padStart(2, '0')} label="PV déposés" />
        <DLStatF value={`${Math.round(count / total * 100)}%`} label="Avancement" />
      </div>

      <div style={{ margin: '0 0 1.5rem' }}>
        <DLProgF value={count} max={total} cells={40} />
      </div>

      <DLFrameF title="Récapitulatif des preuves" right={`${count}/${total}`}>
        <div style={{ fontFamily: 'var(--font-term)' }}>
          {entries.map(([code, label], i) => {
            const done = found.includes(code);
            return (
              <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '1ch', padding: '.3rem 0',
                borderBottom: i < entries.length - 1 ? '1px solid var(--p-ghost)' : 'none' }}>
                <span style={{ color: 'var(--p-faint)', width: '9ch', flexShrink: 0 }}>{code}</span>
                <span style={{ flex: 1, color: done ? 'var(--p-bright)' : 'var(--p-dim)' }}>{label}</span>
                {done ? <DLBadgeF variant="success">OK</DLBadgeF> : <DLBadgeF variant="pending">··</DLBadgeF>}
              </div>
            );
          })}
        </div>
      </DLFrameF>

      <div style={{ marginTop: '1.5rem' }}>
        <DLFrameF title="Verdict">
          <div style={{ fontSize: 'var(--fs-lg)', color: complete ? 'var(--p-bright)' : 'var(--p-dim)' }}>
            {complete
              ? <span className="term-blink">█ DOSSIER COMPLET — TRANSMIS AU MAGISTRAT</span>
              : `Procédure en cours — ${total - count} preuve(s) et ${pvs.length === 0 ? 'le PV' : '—'} restant(s)`}
          </div>
        </DLFrameF>
      </div>

      <div style={{ display: 'flex', gap: '1ch', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--p-ghost)' }}>
        <span style={{ flex: 1 }} />
        <DLBtnF variant="secondary" icon="◊" onClick={onSuperviseur}>Console superviseur</DLBtnF>
      </div>
    </div>
  );
}

window.FinScreen = FinScreen;
