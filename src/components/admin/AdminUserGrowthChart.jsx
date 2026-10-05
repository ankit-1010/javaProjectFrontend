import React, { useState } from 'react';

export const AdminUserGrowthChart = ({ totalUsers = 0 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Scale up to totalUsers or default baseline
  const data = months.map((month, idx) => {
    const factor = totalUsers > 0 ? (idx + 1) / months.length : 0;
    const users = Math.round(totalUsers * factor);
    return { month, users };
  });

  const maxVal = Math.max(totalUsers, 10);
  const chartHeight = 180;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', height: `${chartHeight}px`, position: 'relative', alignItems: 'flex-end', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem' }}>
        {/* Y Grid */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
          {[
            Math.round(maxVal),
            Math.round(maxVal * 0.66),
            Math.round(maxVal * 0.33),
            0
          ].map((label, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.68rem', color: '#94A3B8', width: '35px' }}>{label}</span>
              <div style={{ flex: 1, borderTop: '1px dashed #F1F5F9' }} />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', width: '100%', height: '100%', paddingLeft: '40px', zIndex: 1 }}>
          {data.map((item, idx) => {
            const barH = totalUsers > 0 ? Math.max(4, (item.users / maxVal) * (chartHeight - 35)) : 0;
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={item.month}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: `${barH + 8}px`,
                    background: '#0F172A',
                    color: '#FFF',
                    padding: '0.3rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    zIndex: 10
                  }}>
                    {item.month}: {item.users} Users
                  </div>
                )}
                <div style={{
                  width: '9px',
                  height: `${barH}px`,
                  background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.3s ease',
                  opacity: isHovered ? 1 : 0.85
                }} />
                <span style={{ fontSize: '0.68rem', color: isHovered ? '#1E293B' : '#94A3B8', marginTop: '0.3rem', fontWeight: isHovered ? 700 : 500 }}>
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
