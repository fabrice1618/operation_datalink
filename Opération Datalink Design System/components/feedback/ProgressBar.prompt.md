ASCII progress meter — `[████░░░░] NN%`, built from block characters.

```jsx
<ProgressBar value={3} max={5} />
<ProgressBar value={62} cells={32} />
```

`cells` sets the meter width in characters; `showPercent` toggles the trailing percentage.
