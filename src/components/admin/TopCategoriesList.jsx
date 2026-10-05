import React from 'react';

const DEFAULT_COLORS = ['#EF4444', '#EC4899', '#10B981', '#F59E0B', '#64748B', '#8B5CF6'];

export const TopCategoriesList = ({ categories = [] }) => {
  if (!categories || categories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem', color: '#94A3B8', fontSize: '0.85rem' }}>
        No categories found
      </div>
    );
  }

  const topCats = categories.slice(0, 5);
  const maxCount = Math.max(...topCats.map(c => Number(c.transactionCount) || 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {topCats.map((c, idx) => {
        const count = Number(c.transactionCount) || 0;
        const percent = Math.round((count / maxCount) * 100);
        const color = c.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

        return (
          <div key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ fontWeight: 600, color: '#1E293B' }}>{c.name}</span>
              <span style={{ fontWeight: 700, color: '#64748B' }}>{count.toLocaleString()}</span>
            </div>
            <div style={{ width: '100%', height: '7px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${percent}%`, height: '100%', backgroundColor: color, borderRadius: '999px', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
