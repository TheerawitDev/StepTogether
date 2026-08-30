import React from 'react';

interface HeaderProps {
  onOpenMenu: () => void;
  gpsStatusText: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu, gpsStatusText }) => {
  return (
    <header className="floating-header">
      <div className="floating-header-inner">
        <div>
          <h1 className="brand-title" style={{ fontSize: '1.25rem' }}>StepTogether</h1>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            เรดาร์นำทางทางเท้า | พิกัด: {gpsStatusText}
          </div>
        </div>

        <div>
          <button
            className="btn-secondary"
            onClick={onOpenMenu}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            ตัวเลือกเมนู
          </button>
        </div>
      </div>
    </header>
  );
};
