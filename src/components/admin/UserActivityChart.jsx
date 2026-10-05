import React from 'react';

export const UserActivityChart = ({ totalUsers = 0 }) => {
  const activePercent = totalUsers > 0 ? 100 : 0;
  const inactivePercent = 0;

  const radius = 55;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const activeLen = (activePercent / 100) * circumference;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', width: '100%' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
          {totalUsers === 0 ? (
            <circle
              cx="65" cy="65" r={radius}
              fill="transparent" stroke="#F1F5F9" strokeWidth={strokeWidth}
            />
          ) : (
            <circle
              cx="65" cy="65" r={radius}
              fill="transparent" stroke="#2563EB" strokeWidth={strokeWidth}
              strokeDasharray={`${activeLen} ${circumference}`}
              strokeDashoffset="0"
            />
          )}
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
            <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>Active</span>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>{activePercent}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>Inactive</span>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>{inactivePercent}%</span>
        </div>
      </div>
    </div>
  );
};
