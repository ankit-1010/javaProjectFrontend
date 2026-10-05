import React, { useState } from 'react';

export const IncomeExpenseBarChart = ({ transactions = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  // Dynamically calculate income and expense per month
  const data = months.map((month, idx) => {
    const monthTxns = (transactions || []).filter(t => {
      if (!t.transactionDate) return false;
      const d = new Date(t.transactionDate);
      return !isNaN(d.getTime()) && d.getMonth() === idx;
    });

    const income = monthTxns
      .filter(t => t.type?.toLowerCase() === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const expense = monthTxns
      .filter(t => t.type?.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return { month, income, expense };
  });

  const maxVal = Math.max(
    ...data.map(d => Math.max(d.income, d.expense)),
    5000
  );

  const chartHeight = 200;

  return (
    <div style={{ width: '100%' }}>
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#10B981' }} />
          <span style={{ color: '#64748B' }}>Income</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#F43F5E' }} />
          <span style={{ color: '#64748B' }}>Expenses</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ display: 'flex', height: `${chartHeight}px`, position: 'relative', alignItems: 'flex-end', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
        {/* Y Axis Guide lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', zIndex: 0 }}>
          {[
            `₹${Math.round(maxVal).toLocaleString('en-IN')}`,
            `₹${Math.round(maxVal * 0.75).toLocaleString('en-IN')}`,
            `₹${Math.round(maxVal * 0.5).toLocaleString('en-IN')}`,
            `₹${Math.round(maxVal * 0.25).toLocaleString('en-IN')}`,
            '₹0'
          ].map((label, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8', width: '50px' }}>{label}</span>
              <div style={{ flex: 1, borderTop: '1px dashed #F1F5F9' }} />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', width: '100%', height: '100%', paddingLeft: '55px', zIndex: 1 }}>
          {data.map((item, idx) => {
            const incomeHeight = item.income > 0 ? Math.max(6, (item.income / maxVal) * (chartHeight - 35)) : 0;
            const expenseHeight = item.expense > 0 ? Math.max(6, (item.expense / maxVal) * (chartHeight - 35)) : 0;
            const isHovered = hoveredIndex === idx;

            return (
              <div 
                key={item.month} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: `${Math.max(incomeHeight, expenseHeight) + 10}px`,
                    background: '#0F172A',
                    color: '#FFF',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <strong style={{ color: '#E2E8F0' }}>{item.month}</strong>
                    <span style={{ color: '#34D399' }}>Income: ₹{item.income.toLocaleString('en-IN')}</span>
                    <span style={{ color: '#FB7185' }}>Expense: ₹{item.expense.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Bars group */}
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                  {/* Income Bar */}
                  <div 
                    style={{ 
                      width: '7px', 
                      height: `${incomeHeight}px`, 
                      backgroundColor: '#10B981', 
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.3s ease, filter 0.2s',
                      filter: isHovered ? 'brightness(1.15)' : 'none'
                    }} 
                  />
                  {/* Expense Bar */}
                  <div 
                    style={{ 
                      width: '7px', 
                      height: `${expenseHeight}px`, 
                      backgroundColor: '#F43F5E', 
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.3s ease, filter 0.2s',
                      filter: isHovered ? 'brightness(1.15)' : 'none'
                    }} 
                  />
                </div>

                {/* Month Label */}
                <span style={{ 
                  marginTop: '0.45rem', 
                  fontSize: '0.7rem', 
                  fontWeight: isHovered ? 700 : 500, 
                  color: isHovered ? '#1E293B' : '#94A3B8',
                  transition: 'color 0.2s'
                }}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
