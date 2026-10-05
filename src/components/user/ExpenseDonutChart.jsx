import React, { useState } from 'react';

const CATEGORY_COLORS = {
  food: '#F43F5E',
  transport: '#38BDF8',
  shopping: '#818CF8',
  bills: '#FBBF24',
  education: '#8B5CF6',
  health: '#EF4444',
  entertainment: '#3B82F6',
  others: '#94A3B8'
};

export const ExpenseDonutChart = ({ transactions = [] }) => {
  const [activeItem, setActiveItem] = useState(null);

  // Filter only expenses
  const expenses = (transactions || []).filter(t => t.type?.toLowerCase() === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // Group by category
  const categoryMap = {};
  expenses.forEach(t => {
    const cat = t.category || 'Others';
    categoryMap[cat] = (categoryMap[cat] || 0) + (Number(t.amount) || 0);
  });

  const categories = Object.keys(categoryMap).map(name => {
    const amount = categoryMap[name];
    const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
    const color = CATEGORY_COLORS[name.toLowerCase()] || '#6366F1';
    return { name, amount, percent, color };
  });

  // SVG Donut calculation
  const radius = 68;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  if (totalExpense === 0 || categories.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100%', minHeight: '180px', color: '#94A3B8', gap: '0.5rem' }}>
        <div style={{ width: '130px', height: '130px', borderRadius: '50%', border: '16px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#64748B' }}>₹0</div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Total</div>
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.4rem' }}>No expenses recorded yet</span>
      </div>
    );
  }

  return (
    <div className="expense-donut-chart-container" style={{ width: '100%', height: '100%' }}>
      {/* Donut Graphic */}
      <div style={{ position: 'relative', width: '170px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
          {categories.map((cat, idx) => {
            const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += (cat.percent / 100) * circumference;
            const isHovered = activeItem === idx;

            return (
              <circle
                key={cat.name}
                cx="85"
                cy="85"
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setActiveItem(idx)}
                onMouseLeave={() => setActiveItem(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
            {activeItem !== null ? `₹${categories[activeItem].amount.toLocaleString('en-IN')}` : `₹${totalExpense.toLocaleString('en-IN')}`}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
            {activeItem !== null ? categories[activeItem].name : 'Total'}
          </div>
        </div>
      </div>

      {/* Legend list matching screenshot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
        {categories.map((cat, idx) => {
          const isHovered = activeItem === idx;
          return (
            <div 
              key={cat.name} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.3rem 0.5rem',
                borderRadius: '6px',
                backgroundColor: isHovered ? '#F8FAFC' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={() => setActiveItem(idx)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                <span style={{ fontSize: '0.8rem', color: isHovered ? '#0F172A' : '#475569', fontWeight: isHovered ? 600 : 500 }}>
                  {cat.name}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>
                {cat.percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
