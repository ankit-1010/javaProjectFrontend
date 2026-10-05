import React from 'react';

export const TransactionTypeChart = ({ totalIncome = 0, totalExpenses = 0 }) => {
  const sum = totalIncome + totalExpenses;
  const incomeRatio = sum > 0 ? totalIncome / sum : 0.5;
  const expenseRatio = sum > 0 ? totalExpenses / sum : 0.5;

  const incomePercent = Math.round(incomeRatio * 100);
  const expensePercent = 100 - incomePercent;

  const radius = 55;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const incomeLen = (sum > 0 ? incomeRatio : 0) * circumference;
  const expenseLen = (sum > 0 ? expenseRatio : 0) * circumference;

  return (
    <div className="admin-donut-chart-container" style={{ width: '100%' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
          {sum === 0 ? (
            <circle
              cx="65" cy="65" r={radius}
              fill="transparent" stroke="#F1F5F9" strokeWidth={strokeWidth}
            />
          ) : (
            <>
              <circle
                cx="65" cy="65" r={radius}
                fill="transparent" stroke="#10B981" strokeWidth={strokeWidth}
                strokeDasharray={`${incomeLen} ${circumference}`}
                strokeDashoffset="0"
              />
              <circle
                cx="65" cy="65" r={radius}
                fill="transparent" stroke="#EF4444" strokeWidth={strokeWidth}
                strokeDasharray={`${expenseLen} ${circumference}`}
                strokeDashoffset={-incomeLen}
              />
            </>
          )}
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>Income</span>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
            {sum > 0 ? `${incomePercent}%` : '0%'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>Expense</span>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
            {sum > 0 ? `${expensePercent}%` : '0%'}
          </span>
        </div>
      </div>
    </div>
  );
};
