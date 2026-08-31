import React from 'react';

interface HeaderProps {
  onOpenMenu: () => void;
  gpsStatusText: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu, gpsStatusText }) => {
  return (
    <header className="floating-header">
      <div className="floating-header-inner">
        <div className="header-info-col">
          <h1 className="brand-title">StepTogether</h1>
          <div className="gps-status-subtitle">
            เรดาร์นำทาง | พิกัด: <span className="gps-status-badge">{gpsStatusText}</span>
          </div>
        </div>

        <div className="header-btn-col">
          <button
            className="btn-secondary header-menu-btn"
            onClick={onOpenMenu}
          >
            ตัวเลือกเมนู
          </button>
        </div>
      </div>
    </header>
  );
};
