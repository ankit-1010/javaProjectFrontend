import React from 'react';

export const AdminDualLineChart = ({ totalIncome = 0, totalExpenses = 0 }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const hasData = totalIncome > 0 || totalExpenses > 0;

  const data = months.map((month, i) => {
    const factor = hasData ? (i + 1) / months.length : 0;
    return {
      month,
      inc: totalIncome * factor,
      exp: totalExpenses * factor
    };
  });

  const maxVal = Math.max(totalIncome, totalExpenses, 10000) * 1.15;
  const svgWidth = 560;
  const svgHeight = 180;
  const paddingLeft = 55;
  const paddingBottom = 25;
  const chartW = svgWidth - paddingLeft - 15;
  const chartH = svgHeight - paddingBottom;

  const incCoords = data.map((d, i) => ({
    x: paddingLeft + (i / (data.length - 1)) * chartW,
    y: chartH - (d.inc / maxVal) * (chartH - 20),
    ...d
  }));

  const expCoords = data.map((d, i) => ({
    x: paddingLeft + (i / (data.length - 1)) * chartW,
    y: chartH - (d.exp / maxVal) * (chartH - 20),
    ...d
  }));

  const incPath = incCoords.reduce((acc, pt, i) => i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`, '');
  const expPath = expCoords.reduce((acc, pt, i) => i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`, '');

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: '#10B981', borderRadius: '2px' }} />
          <span style={{ color: '#64748B' }}>Income</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: '#EF4444', borderRadius: '2px' }} />
          <span style={{ color: '#64748B' }}>Expenses</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Y Grid */}
        {[
          { label: `₹${Math.round(maxVal).toLocaleString('en-IN')}`, ratio: 1.0 },
          { label: `₹${Math.round(maxVal * 0.66).toLocaleString('en-IN')}`, ratio: 0.66 },
          { label: `₹${Math.round(maxVal * 0.33).toLocaleString('en-IN')}`, ratio: 0.33 },
          { label: '₹0', ratio: 0 }
        ].map(grid => {
          const y = chartH - grid.ratio * (chartH - 20);
          return (
            <g key={grid.label}>
              <text x="5" y={y + 4} fill="#94A3B8" fontSize="10">{grid.label}</text>
              <line x1={paddingLeft} y1={y} x2={svgWidth - 10} y2={y} stroke="#F1F5F9" strokeDasharray="3 3" />
            </g>
          );
        })}

        {/* Lines */}
        <path d={incPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={expPath} fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots & Labels */}
        {incCoords.map((pt, i) => (
          <g key={pt.month}>
            <circle cx={pt.x} cy={pt.y} r="3" fill="#10B981" />
            <circle cx={expCoords[i].x} cy={expCoords[i].y} r="3" fill="#EF4444" />
            <text x={pt.x} y={svgHeight - 6} fill="#94A3B8" fontSize="10" textAnchor="middle">{pt.month}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};
