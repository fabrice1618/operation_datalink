// ds-base.js — load the Opération Datalink design system into this template.
// One line for the consumer to edit: `base` points at the design-system root.
(() => {
  const base = '../..';
  for (const p of ['styles.css']) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error(
    'ds-base.js: failed to load ' + s.src +
    ' — in a consuming project point the base line at the bound _ds/<folder> tree ' +
    'relative to this page (e.g. _ds/<folder> at the root, ../_ds/<folder> one level down); ' +
    'in this design system itself it just means the bundle has not been compiled yet.'
  );
  document.head.appendChild(s);
})();
