// Petits graphiques SVG "maison", sans dépendance externe (pas de recharts à installer).
// Les deux composants remplissent tout l'espace disponible de leur conteneur parent.

type BarDatum = { label: string; value: number };

export function HorizontalBarChart({ data }: { data: BarDatum[] }) {
  const width = 560;
  const height = Math.max(220, data.length * 34);
  const labelWidth = 96;
  const chartWidth = width - labelWidth - 24;
  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const barHeight = 16;
  const rowHeight = height / Math.max(data.length, 1);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {data.map((d, i) => {
        const y = i * rowHeight + (rowHeight - barHeight) / 2;
        const barLen = (d.value / maxValue) * chartWidth;
        return (
          <g key={d.label}>
            <text
              x={labelWidth - 8}
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fontSize="11"
              fill="#57534e"
            >
              {d.label}
            </text>
            <rect
              x={labelWidth}
              y={y}
              width={chartWidth}
              height={barHeight}
              rx={4}
              fill="#f5f5f4"
            />
            <rect
              x={labelWidth}
              y={y}
              width={Math.max(barLen, 2)}
              height={barHeight}
              rx={4}
              fill="#0B664B"
            />
            <text
              x={labelWidth + Math.max(barLen, 2) + 6}
              y={y + barHeight / 2 + 4}
              fontSize="11"
              fill="#292524"
              fontWeight={500}
            >
              {d.value.toLocaleString("fr-FR")}
            </text>
          </g>
        );
      })}
      {data.length === 0 && (
        <text x={width / 2} y={height / 2} textAnchor="middle" fontSize="12" fill="#a8a29e">
          Aucune donnée
        </text>
      )}
    </svg>
  );
}

type LinePoint = { label: string; value: number };

export function RevenueLineChart({ data }: { data: LinePoint[] }) {
  const width = 560;
  const height = 260;
  const padding = { top: 16, right: 16, bottom: 28, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + innerH - (d.value / maxValue) * innerH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`
      : "";

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {gridLines.map((g) => {
        const y = padding.top + innerH - g * innerH;
        return (
          <g key={g}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f0efed" strokeWidth={1} />
            <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#a8a29e">
              {Math.round((g * maxValue) / 1000)}k
            </text>
          </g>
        );
      })}

      {areaPath && <path d={areaPath} fill="#0B664B" fillOpacity={0.08} />}
      {linePath && <path d={linePath} fill="none" stroke="#0B664B" strokeWidth={2.5} />}

      {points.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r={3.5} fill="#0B664B" />
      ))}

      {points.map((p) => (
        <text
          key={`${p.label}-label`}
          x={p.x}
          y={height - 8}
          textAnchor="middle"
          fontSize="10"
          fill="#78716c"
        >
          {p.label}
        </text>
      ))}

      {data.length === 0 && (
        <text x={width / 2} y={height / 2} textAnchor="middle" fontSize="12" fill="#a8a29e">
          Aucune donnée
        </text>
      )}
    </svg>
  );
}
