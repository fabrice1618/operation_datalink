// HomeScreen — homepage: explanation + access code gate.
const { Button: DLBtnHome, Input: DLInHome, ClassificationChip: DLChipHome } = window.DS;

function HomeScreen({ access, onEnter }) {
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    if (code.trim().toUpperCase() === access.code.toUpperCase()) onEnter();
    else { setError(true); setTimeout(() => setError(false), 2600); }
  }

  return (
    <div style={{ maxWidth: 560, margin: '2.5rem auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: 'var(--fs-xl)', color: 'var(--p-bright)', letterSpacing: '.06em',
                      textShadow: 'var(--text-glow-strong)', lineHeight: 1, whiteSpace: 'nowrap' }}>
          OP. DATALINK
        </div>
        <div style={{ color: 'var(--p-dim)', fontSize: 'var(--fs-sm)', letterSpacing: '.16em',
                      textTransform: 'uppercase', marginTop: '.5rem' }}>
          Portail d'investigation numérique
        </div>
        <div style={{ marginTop: '1.25rem' }}><DLChipHome>{access ? 'ACCÈS CLASSIFIÉ' : ''}</DLChipHome></div>
      </div>

      <div style={{ border: '1px solid var(--frame-line)', background: 'var(--bg-panel)', padding: '1.75rem' }}>
        <div style={{ color: 'var(--p-text)', fontSize: 'var(--fs-sm)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
          {access.intro.map((l, i) => (
            <div key={i} style={{ minHeight: '1.1em' }}>
              {i === 0 ? <span style={{ color: 'var(--p-faint)' }}>&gt;&gt; </span> : null}{l || '\u00a0'}
            </div>
          ))}
        </div>
        <form onSubmit={submit}>
          <DLInHome
            label="CODE D'ACCÈS"
            prompt="A:\&gt;"
            placeholder="DEMO"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={error}
            hint={error ? '// CODE REFUSÉ — réessayez' : `// code de démonstration : ${access.code}`}
            autoFocus
            wrapStyle={{ marginBottom: '1.5rem' }}
          />
          <DLBtnHome type="submit" variant="primary" block icon="▸">Entrer dans le portail</DLBtnHome>
        </form>
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
