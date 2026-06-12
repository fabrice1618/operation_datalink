// RequisitionsScreen — the formal demands for a phase + authorised tools.
const { AsciiFrame: DLFrameR, PageHeading: DLPH_R, Badge: DLBadgeR } = window.DS;

function RequisitionsScreen({ phase, requisitions, outils, found, phaseKeys, onBack, onNext }) {
  const doneCount = phaseKeys.filter((k) => found.includes(k)).length;
  return (
    <div style={{ width: '100%' }}>
      <DLPH_R subhead={`Phase ${phase} — demandes du magistrat`}>Réquisitions</DLPH_R>

      <div style={{ marginTop: '1.75rem' }}>
        <DLFrameR title={`Réquisitions — phase ${phase}`} right={<DLBadgeR variant={doneCount === phaseKeys.length ? 'success' : 'pending'}>{doneCount}/{phaseKeys.length}</DLBadgeR>}>
          <div style={{ fontFamily: 'var(--font-term)' }}>
            {requisitions.map((r, i) => (
              <div key={r.n} style={{
                display: 'flex', gap: '1.2ch', padding: '.5rem 0', alignItems: 'baseline',
                borderBottom: i < requisitions.length - 1 ? '1px solid var(--p-ghost)' : 'none',
              }}>
                <span style={{ color: 'var(--p-bright)', flexShrink: 0, width: '4ch' }}>{r.n}</span>
                <span style={{ flex: 1, color: 'var(--p-text)', fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>{r.text}</span>
                {found.includes(phaseKeys[i])
                  ? <DLBadgeR variant="success">OK</DLBadgeR>
                  : <DLBadgeR variant="pending">··</DLBadgeR>}
              </div>
            ))}
          </div>
        </DLFrameR>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <DLFrameR title="Outils autorisés">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)' }}>
            <tbody>
              {outils.map((o, i) => (
                <tr key={o.cmd}>
                  <td style={{ padding: '.25rem 1ch .25rem 0', color: 'var(--p-bright)', width: '14ch',
                               borderBottom: i < outils.length - 1 ? '1px solid var(--p-ghost)' : 'none' }}>
                    <span style={{ color: 'var(--p-faint)' }}>$</span> {o.cmd}
                  </td>
                  <td style={{ padding: '.25rem 0', color: 'var(--p-dim)',
                               borderBottom: i < outils.length - 1 ? '1px solid var(--p-ghost)' : 'none' }}>{o.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DLFrameR>
      </div>

      <window.DLStepFooter
        backLabel="Saisine" onBack={onBack}
        nextLabel="Saisir les preuves" onNext={onNext}
        note="// répondez aux réquisitions par les preuves recouvrées" />
    </div>
  );
}

window.RequisitionsScreen = RequisitionsScreen;
