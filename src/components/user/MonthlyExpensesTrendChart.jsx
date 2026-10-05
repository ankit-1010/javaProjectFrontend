import React from 'react';

export const MonthlyExpensesTrendChart = ({ transactions = [] }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  // Calculate actual monthly expenses
  const points = months.map((month, idx) => {
    const monthTxns = (transactions || []).filter(t => {
      if (!t.transactionDate || t.type?.toLowerCase() !== 'expense') return false;
      const d = new Date(t.transactionDate);
      return !isNaN(d.getTime()) && d.getMonth() === idx;
    });

    const val = monthTxns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return { month, val };
  });

  const maxExpense = Math.max(...points.map(p => p.val), 1000);
  const maxVal = maxExpense * 1.25;

  const svgWidth = 520;
  const svgHeight = 180;
  const paddingLeft = 45;
  const paddingBottom = 25;
  const chartW = svgWidth - paddingLeft - 20;
  const chartH = svgHeight - paddingBottom;

  const coords = points.map((p, idx) => {
    const x = paddingLeft + (idx / (points.length - 1)) * chartW;
    const y = chartH - (p.val / maxVal) * (chartH - 20);
    return { ...p, x, y };
  });

  const pathD = coords.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', minWidth: '400px' }}>
        {/* Y Grid lines */}
        {[
          { label: `₹${Math.round(maxVal).toLocaleString('en-IN')}`, ratio: 1.0 },
          { label: `₹${Math.round(maxVal * 0.75).toLocaleString('en-IN')}`, ratio: 0.75 },
          { label: `₹${Math.round(maxVal * 0.5).toLocaleString('en-IN')}`, ratio: 0.5 },
          { label: `₹${Math.round(maxVal * 0.25).toLocaleString('en-IN')}`, ratio: 0.25 },
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

        {/* Trend Line */}
        <path d={pathD} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points & Labels */}
        {coords.map((pt) => (
          <g key={pt.month}>
            <circle cx={pt.x} cy={pt.y} r="4" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2" />
            <text x={pt.x} y={svgHeight - 6} fill="#94A3B8" fontSize="11" textAnchor="middle">{pt.month}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};
