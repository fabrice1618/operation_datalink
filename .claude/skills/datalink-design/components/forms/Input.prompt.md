Terminal prompt field — a `›` prefix in a recessed well, phosphor glow on focus, shake + blinking hint on error.

```jsx
<Input label="Identifiant d'équipe" placeholder="EQUIPE-DELTA" hint="Saisir puis [ENTRÉE]." />
<Input prompt="FLAG›" placeholder="DATALINK{...}" error hint="// ACCÈS REFUSÉ" />
```

Accepts all native `<input>` props. `prompt` customises the prefix glyph.
