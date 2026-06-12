const PALETTE = {
  '#f9a8d4': ['#f9a8d4', '#c084fc', '#818cf8'],
  '#c4b5fd': ['#c4b5fd', '#f0abfc', '#818cf8'],
  '#fca5a5': ['#fca5a5', '#f9a8d4', '#fdba74'],
  '#86efac': ['#86efac', '#67e8f9', '#a5b4fc'],
  '#67e8f9': ['#67e8f9', '#86efac', '#c4b5fd'],
  '#fde68a': ['#fde68a', '#fca5a5', '#f9a8d4'],
};

export default function GradientCover({ color, title, size = 200 }) {
  const [c1, c2, c3] = PALETTE[color] ?? ['#f9a8d4', '#c084fc', '#818cf8'];
  const initials = title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const uid = `gc-${title.replace(/\s/g, '')}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ borderRadius: '50%', display: 'block', flexShrink: 0 }}
    >
      <defs>
        <radialGradient id={uid} cx="40%" cy="35%" r="70%">
          <stop offset="0%"   stopColor={c1} />
          <stop offset="50%"  stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </radialGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${uid})`} />
      <text
        x={size / 2} y={size / 2 + size * 0.085}
        textAnchor="middle"
        fontSize={size * 0.22}
        fontFamily="'Playfair Display', serif"
        fontWeight="700"
        fill="rgba(255,255,255,0.85)"
        style={{ userSelect: 'none' }}
      >
        {initials}
      </text>
    </svg>
  );
}
