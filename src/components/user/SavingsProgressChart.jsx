import React from 'react';

export const SavingsProgressChart = ({ goals = [] }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const totalSaved = (goals || []).reduce((sum, g) => sum + (Number(g.savedAmount) || 0), 0);
  const totalTarget = (goals || []).reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);

  // If no goals, flat baseline
  const maxVal = Math.max(totalTarget, totalSaved, 10000);

  // Calculate points dynamically
  const points = months.map((month, idx) => {
    // If totalSaved > 0, scale up to current month (Sep is idx 8)
    const factor = totalSaved > 0 ? (idx + 1) / months.length : 0;
    const val = Math.round(totalSaved * factor);
    return { month, val };
  });

  const svgWidth = 600;
  const svgHeight = 180;
  const paddingLeft = 55;
  const paddingBottom = 25;
  const chartW = svgWidth - paddingLeft - 20;
  const chartH = svgHeight - paddingBottom;

  // Calculate coordinates
  const coords = points.map((p, idx) => {
    const x = paddingLeft + (idx / (points.length - 1)) * chartW;
    const y = chartH - (p.val / maxVal) * (chartH - 25);
    return { ...p, x, y };
  });

  const pathD = coords.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1].x},${chartH} L ${coords[0].x},${chartH} Z`;

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Grid lines */}
        {[
          { label: `₹${Math.round(maxVal).toLocaleString('en-IN')}`, ratio: 1.0 },
          { label: `₹${Math.round(maxVal * 0.75).toLocaleString('en-IN')}`, ratio: 0.75 },
          { label: `₹${Math.round(maxVal * 0.5).toLocaleString('en-IN')}`, ratio: 0.5 },
          { label: `₹${Math.round(maxVal * 0.25).toLocaleString('en-IN')}`, ratio: 0.25 },
          { label: '₹0', ratio: 0 }
        ].map(grid => {
          const y = chartH - grid.ratio * (chartH - 25);
          return (
            <g key={grid.label}>
              <text x="5" y={y + 4} fill="#94A3B8" fontSize="10" fontWeight="500">{grid.label}</text>
              <line x1={paddingLeft} y1={y} x2={svgWidth - 10} y2={y} stroke="#F1F5F9" strokeDasharray="3 3" />
            </g>
          );
        })}

        {/* Gradient Fill under line */}
        <path d={areaD} fill="url(#savingsGrad)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points & Labels */}
        {coords.map((pt) => (
          <g key={pt.month}>
            <circle cx={pt.x} cy={pt.y} r="3.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
            <text x={pt.x} y={svgHeight - 6} fill="#94A3B8" fontSize="11" textAnchor="middle">{pt.month}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};
