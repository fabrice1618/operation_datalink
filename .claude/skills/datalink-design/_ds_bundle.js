/* @ds-bundle: {"format":3,"namespace":"OpRationDatalinkDesignSystem_63bf2d","components":[{"name":"AsciiFrame","sourcePath":"components/core/AsciiFrame.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardHeader","sourcePath":"components/core/Card.jsx"},{"name":"CardBody","sourcePath":"components/core/Card.jsx"},{"name":"ClassificationChip","sourcePath":"components/core/ClassificationChip.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"MenuItem","sourcePath":"components/navigation/MenuItem.jsx"},{"name":"NavLink","sourcePath":"components/navigation/NavLink.jsx"},{"name":"PageHeading","sourcePath":"components/navigation/PageHeading.jsx"}],"sourceHashes":{"components/core/AsciiFrame.jsx":"198bcff9faf2","components/core/Badge.jsx":"7c6cdc0bea6e","components/core/Button.jsx":"30cec2931a41","components/core/Card.jsx":"94f244a6b94a","components/core/ClassificationChip.jsx":"2dc75fdd8054","components/data/StatCard.jsx":"e42ac2b48b95","components/feedback/Alert.jsx":"de9ffda36356","components/feedback/ProgressBar.jsx":"9ef41100f746","components/forms/Input.jsx":"655d8c97585c","components/navigation/MenuItem.jsx":"982a61beaa69","components/navigation/NavLink.jsx":"36023a3f10ff","components/navigation/PageHeading.jsx":"0af59581f56c","ui_kits/datalink/AppShell.jsx":"3f2fd21acf2c","ui_kits/datalink/BootSequence.jsx":"3c19a1d8cbbc","ui_kits/datalink/EquipeScreen.jsx":"c72ffd60df9a","ui_kits/datalink/FinScreen.jsx":"e0e793cedfad","ui_kits/datalink/FlagsScreen.jsx":"6110f2a4c234","ui_kits/datalink/HomeScreen.jsx":"b0095dfa7ed1","ui_kits/datalink/Phase2Screen.jsx":"79f3f8f138c6","ui_kits/datalink/PreuvesScreen.jsx":"49fb24d9403c","ui_kits/datalink/PvScreen.jsx":"6ec8d978795e","ui_kits/datalink/RequisitionsScreen.jsx":"c1ad10850856","ui_kits/datalink/SaisineScreen.jsx":"584265414e90","ui_kits/datalink/StepFooter.jsx":"3335dd2110ed","ui_kits/datalink/SuperviseurScreen.jsx":"cf98da134784","ui_kits/datalink/data.js":"3a30f810bd71"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OpRationDatalinkDesignSystem_63bf2d = window.OpRationDatalinkDesignSystem_63bf2d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/AsciiFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * AsciiFrame — the signature terminal group-box: a square border with
 * the title cut into the top edge as ┤ TITLE ├, and an optional ┤ right ├
 * slot. This is the primary container of the system.
 */
function AsciiFrame({
  title,
  right,
  children,
  style,
  bodyStyle,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      border: '1px solid var(--frame-line)',
      background: 'var(--bg-panel)',
      ...style
    }
  }, rest), title != null ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: '1.2ch',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '.6ch',
      background: 'var(--bg-screen)',
      padding: '0 .6ch',
      color: 'var(--p-bright)',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      textShadow: 'var(--text-glow)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.5
    }
  }, "\u2524"), title, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.5
    }
  }, "\u251C")) : null, right != null ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: '1.2ch',
      transform: 'translateY(-50%)',
      background: 'var(--bg-screen)',
      padding: '0 .6ch',
      fontSize: 'var(--fs-xs)',
      color: 'var(--p-dim)',
      whiteSpace: 'nowrap'
    }
  }, right) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      ...bodyStyle
    }
  }, children));
}
Object.assign(__ds_scope, { AsciiFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/AsciiFrame.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — a terminal status tag. Monochrome: "validated" uses inverse
 * video, "danger/warn" blink, others vary by brightness. Pass short
 * text like OK / ·· / !! / 3.
 */
function Badge({
  variant = 'pending',
  children,
  style,
  ...rest
}) {
  const map = {
    success: {
      fg: 'var(--inverse-fg)',
      bg: 'var(--inverse-bg)',
      blink: false
    },
    info: {
      fg: 'var(--p-bright)',
      bg: 'transparent',
      blink: false
    },
    warn: {
      fg: 'var(--p-bright)',
      bg: 'transparent',
      blink: true
    },
    pending: {
      fg: 'var(--p-faint)',
      bg: 'transparent',
      blink: false
    },
    danger: {
      fg: 'var(--inverse-fg)',
      bg: 'var(--inverse-bg)',
      blink: true
    }
  };
  const s = map[variant] || map.pending;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: s.blink ? 'term-blink' : undefined,
    style: {
      display: 'inline-block',
      padding: s.bg === 'transparent' ? '0' : '0 .5ch',
      background: s.bg,
      color: s.fg,
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      textShadow: s.bg === 'transparent' ? 'var(--text-glow)' : 'none',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — a bracketed terminal command: [ ▸ LABEL ]. No box; the
 * brackets ARE the button. Hover fills with inverse video. Monochrome:
 * "primary" = peak phosphor, "secondary" = dim, "danger" = blinking.
 */
function Button({
  variant = 'primary',
  block = false,
  icon,
  disabled = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const color = {
    primary: 'var(--p-bright)',
    secondary: 'var(--p-dim)',
    danger: 'var(--p-bright)'
  }[variant] || 'var(--p-bright)';
  const inverse = hover && !disabled;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    className: variant === 'danger' && !inverse ? 'term-blink' : undefined,
    style: {
      display: block ? 'flex' : 'inline-flex',
      width: block ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '.6ch',
      padding: '.28rem .8rem',
      border: 'none',
      background: inverse ? 'var(--inverse-bg)' : 'transparent',
      color: inverse ? 'var(--inverse-fg)' : color,
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      textShadow: inverse ? 'none' : 'var(--text-glow)',
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'background var(--t-fast), color var(--t-fast)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6
    }
  }, "["), icon ? /*#__PURE__*/React.createElement("span", null, icon) : null, /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6
    }
  }, "]"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — a plain terminal panel: square frame-line border over the
 * faint phosphor panel tint. Compose with CardHeader / CardBody.
 * For a titled group-box with the title cut into the border, use
 * AsciiFrame instead.
 */
function Card({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      background: 'var(--bg-panel)',
      border: '1px solid var(--frame-line)',
      ...style
    }
  }, rest), children);
}

/** Card header — bottom-ruled bar with a bright uppercase label + right slot. */
function CardHeader({
  label,
  right,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: '.4rem .9rem',
      borderBottom: '1px solid var(--frame-line)',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--p-dim)',
      ...style
    }
  }, rest), children ?? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)'
    }
  }, label), right ? /*#__PURE__*/React.createElement("span", null, right) : null);
}

/** Card body — default padded well. */
function CardBody({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding: 'var(--space-5)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card, CardHeader, CardBody });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/ClassificationChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ClassificationChip — the "ACCÈS CLASSIFIÉ" marker, rendered as a
 * bracketed inverse-video bar (the loudest thing a monochrome terminal
 * can say). Optionally blinks.
 */
function ClassificationChip({
  children = 'ACCÈS CLASSIFIÉ',
  blink = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: blink ? 'term-blink' : undefined,
    style: {
      display: 'inline-block',
      background: 'var(--inverse-bg)',
      color: 'var(--inverse-fg)',
      padding: '.1rem 1.2ch',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      letterSpacing: '.26em',
      textTransform: 'uppercase',
      textShadow: 'none',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { ClassificationChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ClassificationChip.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatCard — a framed metric: a big phosphor numeral over a dim
 * uppercase label. Monochrome; the `color` prop is accepted for API
 * compatibility but every numeral renders in peak phosphor.
 */
function StatCard({
  value,
  label,
  color,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      border: '1px solid var(--frame-line)',
      background: 'var(--bg-panel)',
      textAlign: 'center',
      padding: 'var(--space-4)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xl)',
      lineHeight: 1,
      color: 'var(--p-bright)',
      textShadow: 'var(--text-glow-strong)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      color: 'var(--p-dim)',
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      marginTop: '.35rem'
    }
  }, label));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Alert — a terminal status line prefixed ">>". Monochrome: "danger"
 * blinks, others vary by brightness. Optional [X] dismiss.
 */
function Alert({
  variant = 'info',
  onDismiss,
  children,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(true);
  const map = {
    success: {
      color: 'var(--p-bright)',
      blink: false
    },
    danger: {
      color: 'var(--p-bright)',
      blink: true
    },
    warning: {
      color: 'var(--p-bright)',
      blink: false
    },
    info: {
      color: 'var(--p-text)',
      blink: false
    }
  };
  const s = map[variant] || map.info;
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '.8ch',
      padding: '.5rem .8rem',
      marginBottom: 'var(--space-5)',
      border: '1px solid var(--frame-line)',
      background: 'var(--bg-panel)',
      color: s.color,
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: s.blink ? 'term-blink' : undefined,
    style: {
      color: 'var(--p-dim)',
      flexShrink: 0
    }
  }, ">>"), /*#__PURE__*/React.createElement("span", {
    className: s.blink ? 'term-blink' : undefined,
    style: {
      flex: 1
    }
  }, children), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setOpen(false);
      onDismiss?.();
    },
    "aria-label": "Fermer",
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--p-dim)',
      cursor: 'pointer',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      flexShrink: 0,
      textShadow: 'var(--text-glow)'
    }
  }, "[X]"));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProgressBar — an ASCII meter: [████████░░░░░░░░] with an optional
 * trailing percentage. Pure text, monospaced, phosphor glow.
 */
function ProgressBar({
  value = 0,
  max = 100,
  cells = 24,
  showPercent = true,
  style,
  ...rest
}) {
  const ratio = Math.max(0, Math.min(1, max === 0 ? 0 : value / max));
  const filled = Math.round(ratio * cells);
  const pct = Math.round(ratio * 100);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-base)',
      color: 'var(--p-dim)',
      letterSpacing: '-.02em',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-dim)'
    }
  }, "["), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)',
      textShadow: 'var(--text-glow-strong)'
    }
  }, '\u2588'.repeat(filled)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-ghost)'
    }
  }, '\u2591'.repeat(cells - filled)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-dim)'
    }
  }, "]")), showPercent ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)'
    }
  }, String(pct).padStart(3, ' '), "%") : null);
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — a terminal prompt field: a "›" prompt prefix, recessed well,
 * block caret. Focus brightens the border + glow. Error shakes + blinks
 * the hint. Optional label + hint render a complete labelled control.
 */
function Input({
  label,
  hint,
  error = false,
  prompt = '›',
  id,
  style,
  wrapStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const fieldId = id || reactId;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrapStyle
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'block',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--p-dim)',
      marginBottom: '.3rem'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.6ch',
      padding: '.4rem .7rem',
      background: 'var(--bg-inset)',
      border: '1px solid',
      borderColor: error ? 'var(--p-bright)' : focus ? 'var(--p-bright)' : 'var(--frame-line)',
      boxShadow: focus && !error ? 'var(--box-glow)' : 'none',
      transition: 'border-color var(--t-base)',
      animation: error ? 'term-shake .3s' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-dim)',
      flexShrink: 0
    }
  }, prompt), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    onFocus: e => {
      setFocus(true);
      rest.onFocus?.(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur?.(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--p-bright)',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-base)',
      textShadow: 'var(--text-glow)',
      ...style
    }
  }, rest))), hint ? /*#__PURE__*/React.createElement("div", {
    className: error ? 'term-blink' : undefined,
    style: {
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      color: error ? 'var(--p-bright)' : 'var(--p-faint)',
      marginTop: '.3rem'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/MenuItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MenuItem — a numbered row for the main-menu hub:
 *   [1] ▸ LABEL ......................... STATUS
 * The whole row inverts on hover/active (keyboard or mouse selection).
 * Dotted leader fills the gap to the right-hand status.
 */
function MenuItem({
  number,
  label,
  right,
  active = false,
  href = '#',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const on = active || hover;
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch',
      padding: '.35rem 1ch',
      textDecoration: 'none',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-md)',
      background: on ? 'var(--inverse-bg)' : 'transparent',
      color: on ? 'var(--inverse-fg)' : 'var(--p-text)',
      textShadow: on ? 'none' : 'var(--text-glow)',
      transition: 'background var(--t-fast), color var(--t-fast)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: on ? 'var(--inverse-fg)' : 'var(--p-bright)'
    }
  }, "[", number, "]"), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0
    }
  }, on ? '▸' : ' '), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      textTransform: 'uppercase',
      letterSpacing: '.06em'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: on ? 'var(--inverse-fg)' : 'var(--p-ghost)',
      opacity: 0.7
    }
  }, ' ' + '.'.repeat(200)), right != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      color: on ? 'var(--inverse-fg)' : 'var(--p-dim)'
    }
  }, right) : null);
}
Object.assign(__ds_scope, { MenuItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/MenuItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * NavLink — top-bar nav item rendered as bracketed text [ LABEL ].
 * Active/hover fills with inverse video.
 */
function NavLink({
  active = false,
  href = '#',
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const on = active || hover;
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '.5ch',
      padding: '.15rem .7ch',
      textDecoration: 'none',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      background: on ? 'var(--inverse-bg)' : 'transparent',
      color: on ? 'var(--inverse-fg)' : 'var(--p-dim)',
      textShadow: on ? 'none' : 'var(--text-glow)',
      transition: 'background var(--t-fast), color var(--t-fast)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.5
    }
  }, "["), children, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.5
    }
  }, "]"));
}
Object.assign(__ds_scope, { NavLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavLink.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PageHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PageHeading — a terminal screen title: a bright solid block ▌ then the
 * title, with an optional "// subhead" comment line beneath.
 */
function PageHeading({
  children,
  subhead,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-lg)',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--p-bright)',
      textShadow: 'var(--text-glow-strong)',
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-max)'
    }
  }, "\u258C"), children), subhead ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      color: 'var(--p-dim)',
      marginTop: '.25rem',
      paddingLeft: '2ch'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)'
    }
  }, "// "), subhead) : null);
}
Object.assign(__ds_scope, { PageHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PageHeading.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/AppShell.jsx
try { (() => {
// AppShell — CRT chrome: title bar (brand · clock · superviseur · phosphor
// toggle) and, once a session is open, a linear PROGRESS STEPPER that drives
// navigation through the judicial pipeline.

function useClock() {
  const [now, setNow] = React.useState('');
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = n => String(n).padStart(2, '0');
      setNow(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}
function PhosphorToggle({
  phosphor,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    title: "Basculer vert / ambre",
    style: {
      background: 'none',
      border: '1px solid var(--frame-line)',
      cursor: 'pointer',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      letterSpacing: '.1em',
      color: 'var(--p-dim)',
      padding: '.1rem .6ch',
      textShadow: 'var(--text-glow)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: phosphor === 'green' ? 'var(--p-bright)' : 'var(--p-faint)'
    }
  }, "VRT"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .4
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: phosphor === 'amber' ? 'var(--p-bright)' : 'var(--p-faint)'
    }
  }, "AMB"));
}

// The pipeline steps, in order.
const DL_STEPS = [{
  key: 'saisine',
  label: 'Saisine'
}, {
  key: 'requisitions',
  label: 'Réquis.'
}, {
  key: 'preuves',
  label: 'Preuves'
}, {
  key: 'phase2',
  label: 'Phase 2'
}, {
  key: 'preuves2',
  label: 'Preuves'
}, {
  key: 'pv',
  label: 'PV'
}, {
  key: 'fin',
  label: 'Fin'
}];
function Stepper({
  route,
  maxStep,
  onNav
}) {
  const curIdx = DL_STEPS.findIndex(s => s.key === route);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '.2ch',
      padding: '.45rem 1.5rem',
      borderBottom: '1px solid var(--frame-line)',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)'
    }
  }, DL_STEPS.map((s, i) => {
    const isCurrent = i === curIdx;
    const reached = i <= maxStep;
    const done = reached && i < curIdx;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: s.key
    }, i > 0 ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--p-ghost)',
        margin: '0 .1ch'
      }
    }, "\u203A") : null, /*#__PURE__*/React.createElement("button", {
      onClick: () => reached && onNav(s.key),
      disabled: !reached,
      style: {
        border: 'none',
        cursor: reached ? 'pointer' : 'default',
        fontFamily: 'var(--font-term)',
        fontSize: 'var(--fs-sm)',
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        padding: '.08rem .7ch',
        background: isCurrent ? 'var(--inverse-bg)' : 'transparent',
        color: isCurrent ? 'var(--inverse-fg)' : done ? 'var(--p-bright)' : reached ? 'var(--p-dim)' : 'var(--p-ghost)',
        textShadow: isCurrent ? 'none' : 'var(--text-glow)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: .6
      }
    }, String(i + 1)), " ", s.label, done ? ' ✓' : ''));
  }));
}
function AppShell({
  route,
  group,
  phosphor,
  maxStep,
  onTogglePhosphor,
  onNav,
  onSuperviseur,
  children
}) {
  const clock = useClock();
  const preSession = route === 'boot' || route === 'home' || route === 'equipe';
  const showStepper = !preSession && route !== 'superviseur';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--frame-line)',
      padding: '0 1.5rem',
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-max)',
      flexShrink: 0
    }
  }, "\u258C"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      window.DLNAV?.(group ? 'saisine' : 'home');
    },
    style: {
      textDecoration: 'none',
      color: 'var(--p-bright)',
      fontSize: 'var(--fs-md)',
      letterSpacing: '.1em',
      textShadow: 'var(--text-glow-strong)',
      whiteSpace: 'nowrap'
    }
  }, "OP. DATALINK"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-xs)',
      letterSpacing: '.1em',
      whiteSpace: 'nowrap'
    }
  }, "INSTR. 2026/DL-03")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.2ch',
      fontSize: 'var(--fs-xs)',
      flexShrink: 0,
      whiteSpace: 'nowrap'
    }
  }, group ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-dim)'
    }
  }, "EQ:", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)'
    }
  }, group)) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-dim)'
    }
  }, clock), !preSession ? /*#__PURE__*/React.createElement("button", {
    onClick: onSuperviseur,
    title: "Console superviseur",
    style: {
      background: 'none',
      border: '1px solid var(--frame-line)',
      cursor: 'pointer',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-xs)',
      letterSpacing: '.1em',
      color: route === 'superviseur' ? 'var(--p-bright)' : 'var(--p-dim)',
      padding: '.1rem .6ch',
      textShadow: 'var(--text-glow)'
    }
  }, "\u25CA SUP") : null, /*#__PURE__*/React.createElement(PhosphorToggle, {
    phosphor: phosphor,
    onToggle: onTogglePhosphor
  }))), showStepper ? /*#__PURE__*/React.createElement(Stepper, {
    route: route,
    maxStep: maxStep,
    onNav: onNav
  }) : null, /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: preSession ? '0 1.5rem' : '1.75rem 1.5rem 3.5rem',
      display: 'flex',
      flexDirection: 'column'
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--frame-line)',
      padding: '.4rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem',
      fontSize: 'var(--fs-2xs)',
      color: 'var(--p-faint)',
      letterSpacing: '.08em'
    }
  }, /*#__PURE__*/React.createElement("span", null, "SYS_STATUS: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-dim)'
    }
  }, "ONLINE")), /*#__PURE__*/React.createElement("span", null, "PROC\xC9DURE JUDICIAIRE \u2014 LIAISON CHIFFR\xC9E")));
}
window.AppShell = AppShell;
window.DL_STEPS = DL_STEPS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/BootSequence.jsx
try { (() => {
// BootSequence — a short fake POST / connection sequence on launch.
// Types out lines, then auto-advances to the login screen. Skippable.
function BootSequence({
  onDone
}) {
  const lines = React.useMemo(() => [{
    t: 'DATALINK BIOS v2.0 — (C) 1987 SERVICE CRYPTOLOGIQUE',
    d: 60
  }, {
    t: '',
    d: 30
  }, {
    t: 'TEST MÉMOIRE ........ 640K ........ OK',
    d: 220
  }, {
    t: 'CONTRÔLEUR RÉSEAU ... DL-NIC ....... OK',
    d: 220
  }, {
    t: 'MODULE CRYPTO ....... AES-256 ...... OK',
    d: 220
  }, {
    t: 'LIAISON SÉCURISÉE ... HÔTE DISTANT . ÉTABLIE',
    d: 320
  }, {
    t: '',
    d: 30
  }, {
    t: '>> OPÉRATION DATALINK — PORTAIL D\u2019INVESTIGATION RÉSEAU',
    d: 260
  }, {
    t: '>> AUTHENTIFICATION REQUISE',
    d: 200
  }], []);
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    if (shown >= lines.length) {
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown(s => s + 1), lines[shown].d);
    return () => clearTimeout(t);
  }, [shown, lines, onDone]);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onDone,
    style: {
      minHeight: 'calc(100vh - var(--header-height))',
      padding: '2.5rem 0',
      cursor: 'pointer',
      fontSize: 'var(--fs-base)',
      lineHeight: 1.5
    }
  }, lines.slice(0, shown).map((l, i) => {
    const sys = l.t.startsWith('>>');
    const okMatch = / (OK|ÉTABLIE)$/.test(l.t);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        color: sys ? 'var(--p-bright)' : 'var(--p-text)',
        minHeight: '1.3em'
      }
    }, okMatch ? /*#__PURE__*/React.createElement("span", null, l.t.replace(/ (OK|ÉTABLIE)$/, ' '), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--p-bright)',
        textShadow: 'var(--text-glow-strong)'
      }
    }, l.t.match(/(OK|ÉTABLIE)$/)[0])) : l.t || '\u00a0');
  }), shown < lines.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-text)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "term-cursor"
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: '3rem',
      right: '2rem',
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-xs)',
      whiteSpace: 'nowrap'
    }
  }, "[ cliquer pour passer ]"));
}
window.BootSequence = BootSequence;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/BootSequence.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/EquipeScreen.jsx
try { (() => {
// EquipeScreen — choose a team name among Greek letters.
const {
  Button: DLBtnEq,
  PageHeading: DLPH_Eq
} = window.DS;
function EquipeScreen({
  teams,
  onChoose
}) {
  const [sel, setSel] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '2rem auto',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(DLPH_Eq, {
    subhead: "Choisissez le nom de votre \xE9quipe"
  }, "Identification de l'\xE9quipe"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '.75rem',
      margin: '1.75rem 0'
    }
  }, teams.map(t => {
    const active = sel === t.name;
    return /*#__PURE__*/React.createElement("button", {
      key: t.name,
      onClick: () => setSel(t.name),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '.3rem',
        padding: '1rem .5rem',
        cursor: 'pointer',
        fontFamily: 'var(--font-term)',
        border: '1px solid',
        borderColor: active ? 'var(--p-bright)' : 'var(--frame-line)',
        background: active ? 'var(--inverse-bg)' : 'var(--bg-panel)',
        color: active ? 'var(--inverse-fg)' : 'var(--p-text)',
        textShadow: active ? 'none' : 'var(--text-glow)',
        boxShadow: active ? 'var(--box-glow)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--fs-xl)',
        lineHeight: 1,
        color: active ? 'var(--inverse-fg)' : 'var(--p-bright)'
      }
    }, t.glyph), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--fs-sm)',
        letterSpacing: '.1em'
      }
    }, t.name));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5ch'
    }
  }, /*#__PURE__*/React.createElement(DLBtnEq, {
    variant: "primary",
    icon: "\u25B8",
    disabled: !sel,
    onClick: () => sel && onChoose('ÉQUIPE-' + sel)
  }, "Confirmer l'\xE9quipe"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-sm)'
    }
  }, sel ? `// équipe sélectionnée : ${sel}` : '// sélectionnez une lettre')));
}
window.EquipeScreen = EquipeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/EquipeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/FinScreen.jsx
try { (() => {
// FinScreen — end screen: avancement summary + verdict.
const {
  AsciiFrame: DLFrameF,
  PageHeading: DLPH_F,
  ProgressBar: DLProgF,
  Badge: DLBadgeF,
  StatCard: DLStatF,
  Button: DLBtnF
} = window.DS;
function FinScreen({
  group,
  phases,
  found,
  pvs,
  onSuperviseur
}) {
  const entries = Object.entries(phases);
  const total = entries.length;
  const count = found.length;
  const complete = count === total && pvs.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(DLPH_F, {
    subhead: /*#__PURE__*/React.createElement("span", null, "\xC9quipe ", group)
  }, "Fin de proc\xE9dure \u2014 avancement"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: '1rem',
      margin: '1.75rem 0'
    }
  }, /*#__PURE__*/React.createElement(DLStatF, {
    value: `${count}/${total}`,
    label: "Preuves vers\xE9es"
  }), /*#__PURE__*/React.createElement(DLStatF, {
    value: String(pvs.length).padStart(2, '0'),
    label: "PV d\xE9pos\xE9s"
  }), /*#__PURE__*/React.createElement(DLStatF, {
    value: `${Math.round(count / total * 100)}%`,
    label: "Avancement"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 0 1.5rem'
    }
  }, /*#__PURE__*/React.createElement(DLProgF, {
    value: count,
    max: total,
    cells: 40
  })), /*#__PURE__*/React.createElement(DLFrameF, {
    title: "R\xE9capitulatif des preuves",
    right: `${count}/${total}`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-term)'
    }
  }, entries.map(([code, label], i) => {
    const done = found.includes(code);
    return /*#__PURE__*/React.createElement("div", {
      key: code,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '1ch',
        padding: '.3rem 0',
        borderBottom: i < entries.length - 1 ? '1px solid var(--p-ghost)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--p-faint)',
        width: '9ch',
        flexShrink: 0
      }
    }, code), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: done ? 'var(--p-bright)' : 'var(--p-dim)'
      }
    }, label), done ? /*#__PURE__*/React.createElement(DLBadgeF, {
      variant: "success"
    }, "OK") : /*#__PURE__*/React.createElement(DLBadgeF, {
      variant: "pending"
    }, "\xB7\xB7"));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement(DLFrameF, {
    title: "Verdict"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-lg)',
      color: complete ? 'var(--p-bright)' : 'var(--p-dim)'
    }
  }, complete ? /*#__PURE__*/React.createElement("span", {
    className: "term-blink"
  }, "\u2588 DOSSIER COMPLET \u2014 TRANSMIS AU MAGISTRAT") : `Procédure en cours — ${total - count} preuve(s) et ${pvs.length === 0 ? 'le PV' : '—'} restant(s)`))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1ch',
      marginTop: '1.75rem',
      paddingTop: '1rem',
      borderTop: '1px solid var(--p-ghost)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(DLBtnF, {
    variant: "secondary",
    icon: "\u25CA",
    onClick: onSuperviseur
  }, "Console superviseur")));
}
window.FinScreen = FinScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/FinScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/FlagsScreen.jsx
try { (() => {
// FlagsScreen — flag submission with live validation, typewriter reveal.
const {
  AsciiFrame: DLFrameF,
  PageHeading: DLPH_F,
  ProgressBar: DLProgF,
  Button: DLBtnF,
  Badge: DLBadgeF
} = window.DS;
function FlagRow({
  phase,
  label,
  found,
  onSolve
}) {
  const [val, setVal] = React.useState('');
  const [state, setState] = React.useState('idle'); // idle|checking|granted|denied
  const [typed, setTyped] = React.useState('');
  const [shake, setShake] = React.useState(false);
  function submit() {
    const flag = val.trim();
    if (!flag || state === 'checking') return;
    setState('checking');
    setTimeout(() => {
      const ok = /^datalink\{.+\}$/i.test(flag);
      if (ok) {
        setState('granted');
        const msg = '>> ACCESS GRANTED — ' + label;
        let i = 0;
        const t = setInterval(() => {
          setTyped(msg.slice(0, ++i));
          if (i >= msg.length) {
            clearInterval(t);
            setTimeout(() => onSolve(phase), 450);
          }
        }, 24);
      } else {
        setState('denied');
        setShake(true);
        setTimeout(() => setShake(false), 380);
        setTimeout(() => setState('idle'), 2800);
      }
    }, 420);
  }
  const isFound = found || state === 'granted';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--frame-line)',
      background: 'var(--bg-panel)',
      padding: '.9rem 1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1ch',
      marginBottom: '.6rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-sm)'
    }
  }, phase), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, label)), isFound ? /*#__PURE__*/React.createElement(DLBadgeF, {
    variant: "success"
  }, "OK") : /*#__PURE__*/React.createElement(DLBadgeF, {
    variant: "pending"
  }, "\xB7\xB7")), isFound ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-bright)',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)'
    }
  }, ">>"), " flag valid\xE9 \u2713") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.6ch',
      padding: '.35rem .6rem',
      background: 'var(--bg-inset)',
      border: '1px solid',
      borderColor: state === 'denied' ? 'var(--p-bright)' : 'var(--frame-line)',
      animation: shake ? 'term-shake .3s' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-dim)'
    }
  }, "FLAG>"), /*#__PURE__*/React.createElement("input", {
    value: val,
    onChange: e => setVal(e.target.value),
    disabled: state === 'checking',
    onKeyDown: e => {
      if (e.key === 'Enter') submit();
    },
    placeholder: "DATALINK{...}",
    autoComplete: "off",
    spellCheck: "false",
    style: {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--p-bright)',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-base)',
      textShadow: 'var(--text-glow)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--p-bright)',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-base)',
      textShadow: 'var(--text-glow)'
    }
  }, "[\u25B8]")), /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '1.3rem',
      fontSize: 'var(--fs-sm)',
      marginTop: '.3rem'
    }
  }, state === 'checking' && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)'
    }
  }, "// v\xE9rification en cours..."), state === 'granted' && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)',
      textShadow: 'var(--text-glow-strong)'
    }
  }, typed), state === 'denied' && /*#__PURE__*/React.createElement("span", {
    className: "term-blink",
    style: {
      color: 'var(--p-bright)'
    }
  }, "// ACC\xC8S REFUS\xC9 \u2014 flag incorrect"))));
}
function FlagsScreen({
  phases,
  group,
  found,
  onSolve,
  onBack
}) {
  const entries = Object.entries(phases);
  const total = entries.length;
  const count = found.length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(window.DLBackToMenu, {
    onBack: onBack
  }), /*#__PURE__*/React.createElement(DLPH_F, {
    subhead: /*#__PURE__*/React.createElement("span", null, "\xC9quipe ", group, " \xB7 ", count, "/", total, " valid\xE9(s)")
  }, "Soumission des flags"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '1.5rem 0'
    }
  }, /*#__PURE__*/React.createElement(DLProgF, {
    value: count,
    max: total,
    cells: 36
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem'
    }
  }, entries.map(([phase, label]) => /*#__PURE__*/React.createElement(FlagRow, {
    key: phase,
    phase: phase,
    label: label,
    found: found.includes(phase),
    onSolve: onSolve
  }))));
}
window.FlagsScreen = FlagsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/FlagsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/HomeScreen.jsx
try { (() => {
// HomeScreen — homepage: explanation + access code gate.
const {
  Button: DLBtnHome,
  Input: DLInHome,
  ClassificationChip: DLChipHome
} = window.DS;
function HomeScreen({
  access,
  onEnter
}) {
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState(false);
  function submit(e) {
    e.preventDefault();
    if (code.trim().toUpperCase() === access.code.toUpperCase()) onEnter();else {
      setError(true);
      setTimeout(() => setError(false), 2600);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: '2.5rem auto',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '2rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-xl)',
      color: 'var(--p-bright)',
      letterSpacing: '.06em',
      textShadow: 'var(--text-glow-strong)',
      lineHeight: 1,
      whiteSpace: 'nowrap'
    }
  }, "OP. DATALINK"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-dim)',
      fontSize: 'var(--fs-sm)',
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      marginTop: '.5rem'
    }
  }, "Portail d'investigation num\xE9rique"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement(DLChipHome, null, access ? 'ACCÈS CLASSIFIÉ' : ''))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--frame-line)',
      background: 'var(--bg-panel)',
      padding: '1.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-text)',
      fontSize: 'var(--fs-sm)',
      lineHeight: 1.55,
      marginBottom: '1.5rem'
    }
  }, access.intro.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      minHeight: '1.1em'
    }
  }, i === 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)'
    }
  }, ">> ") : null, l || '\u00a0'))), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, /*#__PURE__*/React.createElement(DLInHome, {
    label: "CODE D'ACC\xC8S",
    prompt: "A:\\>",
    placeholder: "DEMO",
    value: code,
    onChange: e => setCode(e.target.value),
    error: error,
    hint: error ? '// CODE REFUSÉ — réessayez' : `// code de démonstration : ${access.code}`,
    autoFocus: true,
    wrapStyle: {
      marginBottom: '1.5rem'
    }
  }), /*#__PURE__*/React.createElement(DLBtnHome, {
    type: "submit",
    variant: "primary",
    block: true,
    icon: "\u25B8"
  }, "Entrer dans le portail"))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/Phase2Screen.jsx
try { (() => {
// Phase2Screen — supplément d'information: new seals + the order to continue.
const {
  AsciiFrame: DLFrameP2,
  PageHeading: DLPH_P2,
  ClassificationChip: DLChipP2,
  Badge: DLBadgeP2
} = window.DS;
function Capture2Row({
  file,
  last
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch',
      padding: '.4rem .6rem',
      textDecoration: 'none',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      borderBottom: last ? 'none' : '1px solid var(--p-ghost)',
      background: hover ? 'var(--inverse-bg)' : 'transparent',
      color: hover ? 'var(--inverse-fg)' : 'var(--p-text)',
      textShadow: hover ? 'none' : 'var(--text-glow)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: hover ? 'var(--inverse-fg)' : 'var(--p-bright)'
    }
  }, "\u25A3"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, file.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: hover ? 'var(--inverse-fg)' : 'var(--p-faint)'
    }
  }, file.kind), /*#__PURE__*/React.createElement("span", {
    style: {
      color: hover ? 'var(--inverse-fg)' : 'var(--p-dim)',
      width: '7ch',
      textAlign: 'right'
    }
  }, file.size), /*#__PURE__*/React.createElement("span", null, hover ? '▼' : '↓'));
}
function Phase2Screen({
  supplement,
  captures2,
  onBack,
  onNext
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement(DLChipP2, {
    blink: true
  }, "SUPPL\xC9MENT D'INFORMATION")), /*#__PURE__*/React.createElement(DLPH_P2, {
    subhead: "Phase 2 \u2014 nouveaux scell\xE9s vers\xE9s \xE0 la proc\xE9dure"
  }, "Suppl\xE9ment d'information"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.75rem'
    }
  }, /*#__PURE__*/React.createElement(DLFrameP2, {
    title: "Ordonnance"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      lineHeight: 1.55,
      color: 'var(--p-text)'
    }
  }, supplement.referral.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      minHeight: '1.15em'
    }
  }, l || '\u00a0'))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement(DLFrameP2, {
    title: "Nouveaux scell\xE9s",
    right: /*#__PURE__*/React.createElement(DLBadgeP2, {
      variant: "info"
    }, captures2.length)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '-.2rem 0'
    }
  }, captures2.map((f, i) => /*#__PURE__*/React.createElement(Capture2Row, {
    key: f.name,
    file: f,
    last: i === captures2.length - 1
  }))))), /*#__PURE__*/React.createElement(window.DLStepFooter, {
    backLabel: "Preuves P1",
    onBack: onBack,
    nextLabel: "Saisir les preuves",
    onNext: onNext,
    note: "// poursuivez l'analyse sur les nouveaux scell\xE9s"
  }));
}
window.Phase2Screen = Phase2Screen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/Phase2Screen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/PreuvesScreen.jsx
try { (() => {
// PreuvesScreen — evidence entry (the flag-equivalent), one row per
// requisition in the phase. Validates DATALINK{...}; typewriter reveal.
const {
  AsciiFrame: DLFrameP,
  PageHeading: DLPH_P,
  ProgressBar: DLProgP,
  Badge: DLBadgeP
} = window.DS;
function PreuveRow({
  phase,
  code,
  label,
  found,
  onSolve
}) {
  const [val, setVal] = React.useState('');
  const [state, setState] = React.useState('idle');
  const [typed, setTyped] = React.useState('');
  const [shake, setShake] = React.useState(false);
  function submit() {
    const flag = val.trim();
    if (!flag || state === 'checking') return;
    setState('checking');
    setTimeout(() => {
      const ok = /^datalink\{.+\}$/i.test(flag);
      if (ok) {
        setState('granted');
        const msg = '>> PREUVE VERSÉE — ' + label;
        let i = 0;
        const t = setInterval(() => {
          setTyped(msg.slice(0, ++i));
          if (i >= msg.length) {
            clearInterval(t);
            setTimeout(() => onSolve(code), 420);
          }
        }, 22);
      } else {
        setState('denied');
        setShake(true);
        setTimeout(() => setShake(false), 380);
        setTimeout(() => setState('idle'), 2800);
      }
    }, 420);
  }
  const isFound = found || state === 'granted';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '.6rem 0',
      borderBottom: '1px solid var(--p-ghost)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1ch',
      marginBottom: '.4rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-sm)'
    }
  }, code), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, label)), isFound ? /*#__PURE__*/React.createElement(DLBadgeP, {
    variant: "success"
  }, "VERS\xC9E") : /*#__PURE__*/React.createElement(DLBadgeP, {
    variant: "pending"
  }, "EN ATTENTE")), isFound ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-bright)',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)'
    }
  }, ">>"), " preuve vers\xE9e \xE0 la proc\xE9dure \u2713") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.6ch',
      padding: '.35rem .6rem',
      background: 'var(--bg-inset)',
      border: '1px solid',
      borderColor: state === 'denied' ? 'var(--p-bright)' : 'var(--frame-line)',
      animation: shake ? 'term-shake .3s' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-dim)'
    }
  }, "PREUVE>"), /*#__PURE__*/React.createElement("input", {
    value: val,
    onChange: e => setVal(e.target.value),
    disabled: state === 'checking',
    onKeyDown: e => {
      if (e.key === 'Enter') submit();
    },
    placeholder: "DATALINK{...}",
    autoComplete: "off",
    spellCheck: "false",
    style: {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--p-bright)',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-base)',
      textShadow: 'var(--text-glow)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--p-bright)',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-base)',
      textShadow: 'var(--text-glow)'
    }
  }, "[\u25B8]")), /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '1.3rem',
      fontSize: 'var(--fs-sm)',
      marginTop: '.3rem'
    }
  }, state === 'checking' && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)'
    }
  }, "// v\xE9rification du scell\xE9..."), state === 'granted' && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)',
      textShadow: 'var(--text-glow-strong)'
    }
  }, typed), state === 'denied' && /*#__PURE__*/React.createElement("span", {
    className: "term-blink",
    style: {
      color: 'var(--p-bright)'
    }
  }, "// PREUVE REJET\xC9E \u2014 format incorrect"))));
}
function PreuvesScreen({
  phase,
  phaseKeys,
  phases,
  requisitions,
  group,
  found,
  onSolve,
  onBack,
  onNext
}) {
  const count = phaseKeys.filter(k => found.includes(k)).length;
  const total = phaseKeys.length;
  const complete = count === total;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(DLPH_P, {
    subhead: /*#__PURE__*/React.createElement("span", null, "\xC9quipe ", group, " \xB7 phase ", phase, " \xB7 ", count, "/", total, " vers\xE9e(s)")
  }, "Saisie des preuves"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '1.5rem 0'
    }
  }, /*#__PURE__*/React.createElement(DLProgP, {
    value: count,
    max: total,
    cells: 36
  })), /*#__PURE__*/React.createElement(DLFrameP, {
    title: `Preuves — phase ${phase}`,
    right: `${count}/${total}`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '-.3rem 0'
    }
  }, phaseKeys.map((code, i) => /*#__PURE__*/React.createElement(PreuveRow, {
    key: code,
    phase: phase,
    code: requisitions[i] ? requisitions[i].n : code,
    label: phases[code],
    found: found.includes(code),
    onSolve: onSolve
  })))), /*#__PURE__*/React.createElement(window.DLStepFooter, {
    backLabel: "R\xE9quisitions",
    onBack: onBack,
    nextLabel: phase === 1 ? 'Phase 2' : 'Déposer le PV',
    onNext: onNext,
    nextDisabled: !complete,
    note: complete ? '// toutes les preuves sont versées' : `// ${total - count} preuve(s) manquante(s)`
  }));
}
window.PreuvesScreen = PreuvesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/PreuvesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/PvScreen.jsx
try { (() => {
// PvScreen — procès-verbal deposit: drop zone + submitted list.
const {
  AsciiFrame: DLFrameP,
  PageHeading: DLPH_P,
  Button: DLBtnP,
  Badge: DLBadgeP
} = window.DS;
function PvScreen({
  group,
  pvs,
  onSubmit,
  onBack,
  onNext
}) {
  const [over, setOver] = React.useState(false);
  function fakeUpload() {
    const n = pvs.length + 1;
    onSubmit({
      filename: `PV_${group}_v${n}.pdf`,
      submittedAt: nowStampPv()
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(DLPH_P, {
    subhead: /*#__PURE__*/React.createElement("span", null, "\xC9quipe ", group)
  }, "D\xE9p\xF4t du proc\xE8s-verbal"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      alignItems: 'start',
      marginTop: '1.75rem'
    }
  }, /*#__PURE__*/React.createElement(DLFrameP, {
    title: "D\xE9poser le rapport"
  }, /*#__PURE__*/React.createElement("div", {
    onDragOver: e => {
      e.preventDefault();
      setOver(true);
    },
    onDragLeave: () => setOver(false),
    onDrop: e => {
      e.preventDefault();
      setOver(false);
      fakeUpload();
    },
    style: {
      border: '1px dashed',
      borderColor: over ? 'var(--p-bright)' : 'var(--line-bright)',
      background: over ? 'var(--p-glow)' : 'var(--bg-inset)',
      padding: '2rem 1rem',
      textAlign: 'center',
      transition: 'all var(--t-base)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      color: 'var(--p-bright)',
      marginBottom: '.5rem'
    }
  }, "\u25A3"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-text)',
      fontSize: 'var(--fs-sm)',
      marginBottom: '.2rem'
    }
  }, "Glissez le PV (PDF) ici"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-sm)',
      marginBottom: '1rem'
    }
  }, "// ou"), /*#__PURE__*/React.createElement(DLBtnP, {
    variant: "primary",
    icon: "\u25B2",
    onClick: fakeUpload
  }, "S\xE9lectionner un fichier")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-xs)',
      marginTop: '.75rem'
    }
  }, "Formats : PDF, TXT, MD, ODT, DOCX")), /*#__PURE__*/React.createElement(DLFrameP, {
    title: "Fichiers d\xE9pos\xE9s",
    right: String(pvs.length)
  }, pvs.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-sm)',
      textAlign: 'center',
      padding: '1.5rem 0'
    }
  }, "// aucun fichier d\xE9pos\xE9") : pvs.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch',
      padding: '.4rem 0',
      borderBottom: i < pvs.length - 1 ? '1px solid var(--p-ghost)' : 'none',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)'
    }
  }, "\u25A3"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--p-text)'
    }
  }, p.filename), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-xs)'
    }
  }, p.submittedAt), /*#__PURE__*/React.createElement(DLBadgeP, {
    variant: "success"
  }, "OK"))))), /*#__PURE__*/React.createElement(window.DLStepFooter, {
    backLabel: "Preuves P2",
    onBack: onBack,
    nextLabel: "Terminer",
    onNext: onNext,
    note: pvs.length > 0 ? '// PV déposé' : '// déposez votre rapport pour clôturer'
  }));
}
function nowStampPv() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
window.PvScreen = PvScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/PvScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/RequisitionsScreen.jsx
try { (() => {
// RequisitionsScreen — the formal demands for a phase + authorised tools.
const {
  AsciiFrame: DLFrameR,
  PageHeading: DLPH_R,
  Badge: DLBadgeR
} = window.DS;
function RequisitionsScreen({
  phase,
  requisitions,
  outils,
  found,
  phaseKeys,
  onBack,
  onNext
}) {
  const doneCount = phaseKeys.filter(k => found.includes(k)).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(DLPH_R, {
    subhead: `Phase ${phase} — demandes du magistrat`
  }, "R\xE9quisitions"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.75rem'
    }
  }, /*#__PURE__*/React.createElement(DLFrameR, {
    title: `Réquisitions — phase ${phase}`,
    right: /*#__PURE__*/React.createElement(DLBadgeR, {
      variant: doneCount === phaseKeys.length ? 'success' : 'pending'
    }, doneCount, "/", phaseKeys.length)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-term)'
    }
  }, requisitions.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.n,
    style: {
      display: 'flex',
      gap: '1.2ch',
      padding: '.5rem 0',
      alignItems: 'baseline',
      borderBottom: i < requisitions.length - 1 ? '1px solid var(--p-ghost)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)',
      flexShrink: 0,
      width: '4ch'
    }
  }, r.n), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--p-text)',
      fontSize: 'var(--fs-sm)',
      lineHeight: 1.5
    }
  }, r.text), found.includes(phaseKeys[i]) ? /*#__PURE__*/React.createElement(DLBadgeR, {
    variant: "success"
  }, "OK") : /*#__PURE__*/React.createElement(DLBadgeR, {
    variant: "pending"
  }, "\xB7\xB7")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement(DLFrameR, {
    title: "Outils autoris\xE9s"
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("tbody", null, outils.map((o, i) => /*#__PURE__*/React.createElement("tr", {
    key: o.cmd
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '.25rem 1ch .25rem 0',
      color: 'var(--p-bright)',
      width: '14ch',
      borderBottom: i < outils.length - 1 ? '1px solid var(--p-ghost)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)'
    }
  }, "$"), " ", o.cmd), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '.25rem 0',
      color: 'var(--p-dim)',
      borderBottom: i < outils.length - 1 ? '1px solid var(--p-ghost)' : 'none'
    }
  }, o.use))))))), /*#__PURE__*/React.createElement(window.DLStepFooter, {
    backLabel: "Saisine",
    onBack: onBack,
    nextLabel: "Saisir les preuves",
    onNext: onNext,
    note: "// r\xE9pondez aux r\xE9quisitions par les preuves recouvr\xE9es"
  }));
}
window.RequisitionsScreen = RequisitionsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/RequisitionsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/SaisineScreen.jsx
try { (() => {
// SaisineScreen — the magistrate's referral that opens the case, plus the
// capture files placed under seal (downloadable).
const {
  AsciiFrame: DLFrameSa,
  PageHeading: DLPH_Sa,
  ClassificationChip: DLChipSa,
  Badge: DLBadgeSa
} = window.DS;
function CaptureRow({
  file,
  last
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch',
      padding: '.4rem .6rem',
      textDecoration: 'none',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      borderBottom: last ? 'none' : '1px solid var(--p-ghost)',
      background: hover ? 'var(--inverse-bg)' : 'transparent',
      color: hover ? 'var(--inverse-fg)' : 'var(--p-text)',
      textShadow: hover ? 'none' : 'var(--text-glow)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: hover ? 'var(--inverse-fg)' : 'var(--p-bright)'
    }
  }, "\u25A3"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, file.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: hover ? 'var(--inverse-fg)' : 'var(--p-faint)'
    }
  }, file.kind), /*#__PURE__*/React.createElement("span", {
    style: {
      color: hover ? 'var(--inverse-fg)' : 'var(--p-dim)',
      width: '7ch',
      textAlign: 'right'
    }
  }, file.size), /*#__PURE__*/React.createElement("span", null, hover ? '▼' : '↓'));
}
function Field({
  k,
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1ch'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)',
      width: '13ch',
      flexShrink: 0,
      textTransform: 'uppercase'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)'
    }
  }, ":"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-bright)'
    }
  }, v));
}
function SaisineScreen({
  saisine,
  captures,
  onNext
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement(DLChipSa, {
    blink: true
  }, saisine.classification)), /*#__PURE__*/React.createElement(DLPH_Sa, {
    subhead: saisine.dossier
  }, "Saisine du juge d'instruction"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      alignItems: 'start',
      marginTop: '1.75rem'
    }
  }, /*#__PURE__*/React.createElement(DLFrameSa, {
    title: "En-t\xEAte"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '.35rem',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    k: "Juridiction",
    v: saisine.juridiction
  }), /*#__PURE__*/React.createElement(Field, {
    k: "Magistrat",
    v: saisine.magistrat
  }), /*#__PURE__*/React.createElement(Field, {
    k: "Horodatage",
    v: saisine.horodatage
  }), /*#__PURE__*/React.createElement(Field, {
    k: "R\xE9seau",
    v: saisine.reseau
  }))), /*#__PURE__*/React.createElement(DLFrameSa, {
    title: "Scell\xE9s num\xE9riques",
    right: /*#__PURE__*/React.createElement(DLBadgeSa, {
      variant: "info"
    }, captures.length)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '-.2rem 0'
    }
  }, captures.map((f, i) => /*#__PURE__*/React.createElement(CaptureRow, {
    key: f.name,
    file: f,
    last: i === captures.length - 1
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement(DLFrameSa, {
    title: "R\xE9quisitoire introductif"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)',
      lineHeight: 1.55,
      color: 'var(--p-text)'
    }
  }, saisine.referral.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      minHeight: '1.15em'
    }
  }, l || '\u00a0'))))), /*#__PURE__*/React.createElement(window.DLStepFooter, {
    nextLabel: "Acc\xE9der aux r\xE9quisitions",
    onNext: onNext,
    note: "// t\xE9l\xE9chargez les scell\xE9s puis poursuivez"
  }));
}
window.SaisineScreen = SaisineScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/SaisineScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/StepFooter.jsx
try { (() => {
// Shared bits for pipeline screens: a "continue" footer bar.
const {
  Button: DLBtnNav
} = window.DS;
function StepFooter({
  backLabel,
  onBack,
  nextLabel,
  onNext,
  nextDisabled,
  note
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1ch',
      marginTop: '1.75rem',
      paddingTop: '1rem',
      borderTop: '1px solid var(--p-ghost)'
    }
  }, onBack ? /*#__PURE__*/React.createElement(DLBtnNav, {
    variant: "secondary",
    icon: "\u25C2",
    onClick: onBack
  }, backLabel || 'Retour') : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), note ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--p-faint)',
      fontSize: 'var(--fs-sm)'
    }
  }, note) : null, onNext ? /*#__PURE__*/React.createElement(DLBtnNav, {
    variant: "primary",
    icon: "\u25B8",
    disabled: nextDisabled,
    onClick: onNext
  }, nextLabel || 'Continuer') : null);
}
window.DLStepFooter = StepFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/StepFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/SuperviseurScreen.jsx
try { (() => {
// SuperviseurScreen — instructor console: stats + progression table.
const {
  AsciiFrame: DLFrameD,
  StatCard: DLStat,
  PageHeading: DLPH_D,
  Badge: DLBadgeD
} = window.DS;
function SuperviseurScreen({
  phases,
  teams,
  onBack
}) {
  const phaseKeys = Object.keys(phases);
  const total = phaseKeys.length;
  const totalSolved = teams.reduce((s, t) => s + t.found.length, 0);
  const pvCount = teams.filter(t => t.pv).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement(window.DS.Button, {
    variant: "secondary",
    icon: "\u25C2",
    onClick: onBack
  }, "Retour \xE0 la proc\xE9dure")), /*#__PURE__*/React.createElement(DLPH_D, {
    subhead: `${teams.length} groupe(s) enregistré(s)`
  }, "Console superviseur"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: '1rem',
      margin: '1.75rem 0'
    }
  }, /*#__PURE__*/React.createElement(DLStat, {
    value: String(teams.length).padStart(2, '0'),
    label: "\xC9quipes"
  }), /*#__PURE__*/React.createElement(DLStat, {
    value: String(totalSolved).padStart(2, '0'),
    label: "Flags valid\xE9s"
  }), /*#__PURE__*/React.createElement(DLStat, {
    value: String(pvCount).padStart(2, '0'),
    label: "PV d\xE9pos\xE9s"
  })), /*#__PURE__*/React.createElement(DLFrameD, {
    title: "Progression par groupe"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-term)',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: thD('left')
  }, "Groupe"), phaseKeys.map(p => /*#__PURE__*/React.createElement("th", {
    key: p,
    style: thD('center'),
    title: phases[p]
  }, p.replace('phase_', 'P'))), /*#__PURE__*/React.createElement("th", {
    style: thD('center')
  }, "Score"), /*#__PURE__*/React.createElement("th", {
    style: thD('center')
  }, "PV"))), /*#__PURE__*/React.createElement("tbody", null, teams.map(t => {
    const score = t.found.length;
    const variant = score === total ? 'success' : score > 0 ? 'warn' : 'pending';
    return /*#__PURE__*/React.createElement("tr", {
      key: t.name,
      className: "sv-row"
    }, /*#__PURE__*/React.createElement("td", {
      style: tdD('left')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--p-bright)'
      }
    }, t.name), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--p-faint)',
        fontSize: 'var(--fs-xs)'
      }
    }, t.createdAt)), phaseKeys.map(p => /*#__PURE__*/React.createElement("td", {
      key: p,
      style: tdD('center')
    }, t.found.includes(p) ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--p-bright)',
        textShadow: 'var(--text-glow)'
      }
    }, "\u2713") : /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--p-ghost)'
      }
    }, "\u2014"))), /*#__PURE__*/React.createElement("td", {
      style: tdD('center')
    }, /*#__PURE__*/React.createElement(DLBadgeD, {
      variant: variant
    }, score, "/", total)), /*#__PURE__*/React.createElement("td", {
      style: tdD('center')
    }, t.pv ? /*#__PURE__*/React.createElement(DLBadgeD, {
      variant: "info"
    }, "1") : /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--p-ghost)'
      }
    }, "\u2014")));
  }))))), /*#__PURE__*/React.createElement("style", null, `.sv-row:hover td{background:var(--p-glow)}`));
}
function thD(align) {
  return {
    padding: '.4rem .8rem',
    textAlign: align,
    fontSize: 'var(--fs-xs)',
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    color: 'var(--p-dim)',
    borderBottom: '1px solid var(--frame-line)'
  };
}
function tdD(align) {
  return {
    padding: '.5rem .8rem',
    textAlign: align,
    borderBottom: '1px solid var(--p-ghost)',
    color: 'var(--p-text)',
    verticalAlign: 'middle'
  };
}
window.SuperviseurScreen = SuperviseurScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/SuperviseurScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/datalink/data.js
try { (() => {
// Opération Datalink — demo content for the UI-kit click-through.
// Judicial cyber-investigation framing. All copy in French.
window.DATALINK_DATA = {
  // Homepage access gate.
  access: {
    code: 'DEMO',
    intro: ['Vous accédez au portail d\u2019investigation numérique placé sous', 'autorité judiciaire. Votre équipe assiste le juge d\u2019instruction', 'dans l\u2019analyse d\u2019une intrusion sur le réseau CORP-NET.', '', 'Saisissez le code d\u2019accès communiqué par l\u2019enseignant pour', 'ouvrir une session.']
  },
  // Team names — Greek letters.
  greekTeams: [{
    name: 'ALPHA',
    glyph: '\u0391'
  }, {
    name: 'BÊTA',
    glyph: '\u0392'
  }, {
    name: 'GAMMA',
    glyph: '\u0393'
  }, {
    name: 'DELTA',
    glyph: '\u0394'
  }, {
    name: 'EPSILON',
    glyph: '\u0395'
  }, {
    name: 'ZÊTA',
    glyph: '\u0396'
  }, {
    name: 'ÊTA',
    glyph: '\u0397'
  }, {
    name: 'THÊTA',
    glyph: '\u0398'
  }],
  // Saisine — the magistrate's referral that opens the case.
  saisine: {
    classification: 'CONFIDENTIEL — PROCÉDURE JUDICIAIRE',
    juridiction: 'TRIBUNAL JUDICIAIRE — SECTION CYBERCRIMINALITÉ',
    magistrat: 'Juge d\u2019instruction — cabinet 04',
    dossier: 'INSTR. N° 2026/DL-03',
    horodatage: '14 MARS — 02:47',
    reseau: 'CORP-NET / 10.42.0.0/24',
    referral: ['Vu le signalement du système de détection d\u2019intrusion faisant état', 'd\u2019une exfiltration de données vers un hôte externe non référencé ;', '', 'Vu l\u2019isolement du segment compromis et le prélèvement d\u2019une capture', 'complète du trafic réseau placée sous scellé numérique ;', '', 'Requérons votre équipe aux fins de reconstituer la chaîne d\u2019attaque', 'et d\u2019identifier l\u2019opérateur à l\u2019origine de l\u2019intrusion.']
  },
  // Capture files to download on the saisine screen (phase 1) and phase 2.
  captures: [{
    name: 'datalink_03.pcap',
    size: '4.2 Mo',
    kind: 'capture réseau'
  }, {
    name: 'corp-net_dns.log',
    size: '310 Ko',
    kind: 'journal DNS'
  }, {
    name: 'passerelle_10.42.0.1.log',
    size: '88 Ko',
    kind: 'journal passerelle'
  }],
  captures2: [{
    name: 'charge_utile.bin',
    size: '512 Ko',
    kind: 'binaire extrait'
  }, {
    name: 'scelle_usb.img',
    size: '1.1 Go',
    kind: 'image disque scellée'
  }],
  // Requisitions — the formal demands, per phase.
  requisitions: {
    1: [{
      n: 'R.1',
      text: 'Cartographier les hôtes actifs du segment 10.42.0.0/24.'
    }, {
      n: 'R.2',
      text: 'Isoler le flux d\u2019exfiltration vers l\u2019hôte externe.'
    }, {
      n: 'R.3',
      text: 'Extraire les identifiants transmis en clair.'
    }],
    2: [{
      n: 'R.4',
      text: 'Décoder la charge utile binaire transférée.'
    }, {
      n: 'R.5',
      text: 'Attribuer l\u2019infrastructure à un opérateur identifié.'
    }]
  },
  // Tools authorised (shown on requisitions).
  outils: [{
    cmd: 'tshark',
    use: 'inspection et filtrage de la capture'
  }, {
    cmd: 'nmap',
    use: 'reconstruction de la topologie'
  }, {
    cmd: 'strings',
    use: 'extraction de chaînes du binaire'
  }, {
    cmd: 'CyberChef',
    use: 'décodage des charges utiles'
  }],
  // Evidence (preuves) — the flag-equivalent inputs, grouped by phase.
  phases: {
    phase_01: 'Reconnaissance réseau',
    phase_02: 'Capture du trafic exfiltré',
    phase_03: 'Identifiants en clair',
    phase_04: 'Décodage de la charge utile',
    phase_05: 'Attribution de l\u2019opérateur'
  },
  phaseGroups: {
    1: ['phase_01', 'phase_02', 'phase_03'],
    2: ['phase_04', 'phase_05']
  },
  // Phase 2 supplément d'information.
  supplement: {
    referral: ['L\u2019exploitation de la capture a révélé un second hôte interne', 'compromis et une charge utile chiffrée non encore analysée.', '', 'Un supplément d\u2019information est ordonné : de nouveaux scellés', 'numériques sont versés à la procédure. Poursuivez l\u2019analyse.']
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/datalink/data.js", error: String((e && e.message) || e) }); }

__ds_ns.AsciiFrame = __ds_scope.AsciiFrame;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.CardBody = __ds_scope.CardBody;

__ds_ns.ClassificationChip = __ds_scope.ClassificationChip;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.MenuItem = __ds_scope.MenuItem;

__ds_ns.NavLink = __ds_scope.NavLink;

__ds_ns.PageHeading = __ds_scope.PageHeading;

})();
