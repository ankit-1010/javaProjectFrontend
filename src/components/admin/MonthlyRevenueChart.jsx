import React from 'react';

export const MonthlyRevenueChart = ({ totalIncome = 0 }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const max = Math.max(totalIncome, 1000);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', width: '100%', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem' }}>
      {months.map((m, idx) => {
        const factor = totalIncome > 0 ? (idx + 1) / months.length : 0;
        const h = totalIncome > 0 ? Math.max(4, factor * 100) : 0;
        return (
          <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ width: '12px', height: `${h}px`, backgroundColor: '#3B82F6', borderRadius: '3px 3px 0 0', transition: 'height 0.3s ease' }} />
            <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{m}</span>
          </div>
        );
      })}
    </div>
  );
};
