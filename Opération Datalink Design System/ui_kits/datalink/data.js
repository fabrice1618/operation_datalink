// Opération Datalink — demo content for the UI-kit click-through.
// Judicial cyber-investigation framing. All copy in French.
window.DATALINK_DATA = {

  // Homepage access gate.
  access: {
    code: 'DEMO',
    intro: [
      'Vous accédez au portail d\u2019investigation numérique placé sous',
      'autorité judiciaire. Votre équipe assiste le juge d\u2019instruction',
      'dans l\u2019analyse d\u2019une intrusion sur le réseau CORP-NET.',
      '',
      'Saisissez le code d\u2019accès communiqué par l\u2019enseignant pour',
      'ouvrir une session.',
    ],
  },

  // Team names — Greek letters.
  greekTeams: [
    { name: 'ALPHA',   glyph: '\u0391' },
    { name: 'BÊTA',    glyph: '\u0392' },
    { name: 'GAMMA',   glyph: '\u0393' },
    { name: 'DELTA',   glyph: '\u0394' },
    { name: 'EPSILON', glyph: '\u0395' },
    { name: 'ZÊTA',    glyph: '\u0396' },
    { name: 'ÊTA',     glyph: '\u0397' },
    { name: 'THÊTA',   glyph: '\u0398' },
  ],

  // Saisine — the magistrate's referral that opens the case.
  saisine: {
    classification: 'CONFIDENTIEL — PROCÉDURE JUDICIAIRE',
    juridiction: 'TRIBUNAL JUDICIAIRE — SECTION CYBERCRIMINALITÉ',
    magistrat: 'Juge d\u2019instruction — cabinet 04',
    dossier: 'INSTR. N° 2026/DL-03',
    horodatage: '14 MARS — 02:47',
    reseau: 'CORP-NET / 10.42.0.0/24',
    referral: [
      'Vu le signalement du système de détection d\u2019intrusion faisant état',
      'd\u2019une exfiltration de données vers un hôte externe non référencé ;',
      '',
      'Vu l\u2019isolement du segment compromis et le prélèvement d\u2019une capture',
      'complète du trafic réseau placée sous scellé numérique ;',
      '',
      'Requérons votre équipe aux fins de reconstituer la chaîne d\u2019attaque',
      'et d\u2019identifier l\u2019opérateur à l\u2019origine de l\u2019intrusion.',
    ],
  },

  // Capture files to download on the saisine screen (phase 1) and phase 2.
  captures: [
    { name: 'datalink_03.pcap',           size: '4.2 Mo',  kind: 'capture réseau' },
    { name: 'corp-net_dns.log',           size: '310 Ko',  kind: 'journal DNS' },
    { name: 'passerelle_10.42.0.1.log',   size: '88 Ko',   kind: 'journal passerelle' },
  ],
  captures2: [
    { name: 'charge_utile.bin',           size: '512 Ko',  kind: 'binaire extrait' },
    { name: 'scelle_usb.img',             size: '1.1 Go',  kind: 'image disque scellée' },
  ],

  // Requisitions — the formal demands, per phase.
  requisitions: {
    1: [
      { n: 'R.1', text: 'Cartographier les hôtes actifs du segment 10.42.0.0/24.' },
      { n: 'R.2', text: 'Isoler le flux d\u2019exfiltration vers l\u2019hôte externe.' },
      { n: 'R.3', text: 'Extraire les identifiants transmis en clair.' },
    ],
    2: [
      { n: 'R.4', text: 'Décoder la charge utile binaire transférée.' },
      { n: 'R.5', text: 'Attribuer l\u2019infrastructure à un opérateur identifié.' },
    ],
  },

  // Tools authorised (shown on requisitions).
  outils: [
    { cmd: 'tshark',    use: 'inspection et filtrage de la capture' },
    { cmd: 'nmap',      use: 'reconstruction de la topologie' },
    { cmd: 'strings',   use: 'extraction de chaînes du binaire' },
    { cmd: 'CyberChef', use: 'décodage des charges utiles' },
  ],

  // Evidence (preuves) — the flag-equivalent inputs, grouped by phase.
  phases: {
    phase_01: 'Reconnaissance réseau',
    phase_02: 'Capture du trafic exfiltré',
    phase_03: 'Identifiants en clair',
    phase_04: 'Décodage de la charge utile',
    phase_05: 'Attribution de l\u2019opérateur',
  },
  phaseGroups: {
    1: ['phase_01', 'phase_02', 'phase_03'],
    2: ['phase_04', 'phase_05'],
  },

  // Phase 2 supplément d'information.
  supplement: {
    referral: [
      'L\u2019exploitation de la capture a révélé un second hôte interne',
      'compromis et une charge utile chiffrée non encore analysée.',
      '',
      'Un supplément d\u2019information est ordonné : de nouveaux scellés',
      'numériques sont versés à la procédure. Poursuivez l\u2019analyse.',
    ],
  },
};
