// PvScreen — procès-verbal deposit: drop zone + submitted list.
const { AsciiFrame: DLFrameP, PageHeading: DLPH_P, Button: DLBtnP, Badge: DLBadgeP } = window.DS;

function PvScreen({ group, pvs, onSubmit, onBack, onNext }) {
  const [over, setOver] = React.useState(false);
  function fakeUpload() {
    const n = pvs.length + 1;
    onSubmit({ filename: `PV_${group}_v${n}.pdf`, submittedAt: nowStampPv() });
  }
  return (
    <div style={{ width: '100%' }}>
      <DLPH_P subhead={<span>Équipe {group}</span>}>Dépôt du procès-verbal</DLPH_P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start', marginTop: '1.75rem' }}>
        <DLFrameP title="Déposer le rapport">
          <div
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); fakeUpload(); }}
            style={{
              border: '1px dashed', borderColor: over ? 'var(--p-bright)' : 'var(--line-bright)',
              background: over ? 'var(--p-glow)' : 'var(--bg-inset)',
              padding: '2rem 1rem', textAlign: 'center', transition: 'all var(--t-base)',
            }}>
            <div style={{ fontSize: '1.6rem', color: 'var(--p-bright)', marginBottom: '.5rem' }}>▣</div>
            <div style={{ color: 'var(--p-text)', fontSize: 'var(--fs-sm)', marginBottom: '.2rem' }}>
              Glissez le PV (PDF) ici
            </div>
            <div style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-sm)', marginBottom: '1rem' }}>// ou</div>
            <DLBtnP variant="primary" icon="▲" onClick={fakeUpload}>Sélectionner un fichier</DLBtnP>
          </div>
          <div style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-xs)', marginTop: '.75rem' }}>
            Formats : PDF, TXT, MD, ODT, DOCX
          </div>
        </DLFrameP>

        <DLFrameP title="Fichiers déposés" right={String(pvs.length)}>
          {pvs.length === 0 ? (
            <div style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-sm)', textAlign: 'center', padding: '1.5rem 0' }}>
              // aucun fichier déposé
            </div>
          ) : pvs.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '1ch', padding: '.4rem 0',
              borderBottom: i < pvs.length - 1 ? '1px solid var(--p-ghost)' : 'none', fontSize: 'var(--fs-sm)',
            }}>
              <span style={{ color: 'var(--p-bright)' }}>▣</span>
              <span style={{ flex: 1, color: 'var(--p-text)' }}>{p.filename}</span>
              <span style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-xs)' }}>{p.submittedAt}</span>
              <DLBadgeP variant="success">OK</DLBadgeP>
            </div>
          ))}
        </DLFrameP>
      </div>

      <window.DLStepFooter
        backLabel="Preuves P2" onBack={onBack}
        nextLabel="Terminer" onNext={onNext}
        note={pvs.length > 0 ? '// PV déposé' : '// déposez votre rapport pour clôturer'} />
    </div>
  );
}

function nowStampPv() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

window.PvScreen = PvScreen;
