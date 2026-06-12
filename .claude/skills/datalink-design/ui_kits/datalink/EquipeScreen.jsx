// EquipeScreen — choose a team name among Greek letters.
const { Button: DLBtnEq, PageHeading: DLPH_Eq } = window.DS;

function EquipeScreen({ teams, onChoose }) {
  const [sel, setSel] = React.useState(null);

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', width: '100%' }}>
      <DLPH_Eq subhead="Choisissez le nom de votre équipe">Identification de l'équipe</DLPH_Eq>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.75rem', margin: '1.75rem 0',
      }}>
        {teams.map((t) => {
          const active = sel === t.name;
          return (
            <button key={t.name} onClick={() => setSel(t.name)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.3rem',
                padding: '1rem .5rem', cursor: 'pointer', fontFamily: 'var(--font-term)',
                border: '1px solid', borderColor: active ? 'var(--p-bright)' : 'var(--frame-line)',
                background: active ? 'var(--inverse-bg)' : 'var(--bg-panel)',
                color: active ? 'var(--inverse-fg)' : 'var(--p-text)',
                textShadow: active ? 'none' : 'var(--text-glow)',
                boxShadow: active ? 'var(--box-glow)' : 'none',
              }}>
              <span style={{ fontSize: 'var(--fs-xl)', lineHeight: 1,
                             color: active ? 'var(--inverse-fg)' : 'var(--p-bright)' }}>{t.glyph}</span>
              <span style={{ fontSize: 'var(--fs-sm)', letterSpacing: '.1em' }}>{t.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5ch' }}>
        <DLBtnEq variant="primary" icon="▸" disabled={!sel}
                 onClick={() => sel && onChoose('ÉQUIPE-' + sel)}>
          Confirmer l'équipe
        </DLBtnEq>
        <span style={{ color: 'var(--p-faint)', fontSize: 'var(--fs-sm)' }}>
          {sel ? `// équipe sélectionnée : ${sel}` : '// sélectionnez une lettre'}
        </span>
      </div>
    </div>
  );
}

window.EquipeScreen = EquipeScreen;
