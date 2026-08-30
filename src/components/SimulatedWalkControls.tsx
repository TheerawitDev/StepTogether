import React from 'react';
import { HazardReport, UserLocation } from '../types/hazard';

interface SimulatedWalkControlsProps {
  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;
  hazards: HazardReport[];
}

export const SimulatedWalkControls: React.FC<SimulatedWalkControlsProps> = ({
  setUserLocation,
  hazards
}) => {
  const handleWalkNearHazard = (hazard: HazardReport) => {
    // Offset slightly by 0.0001 deg (~11 meters) to trigger proximity radar alert
    setUserLocation({
      lat: hazard.lat + 0.0001,
      lng: hazard.lng + 0.0001,
      accuracy: 5
    });
  };

  const handleResetLocation = () => {
    setUserLocation({
      lat: 13.7456,
      lng: 100.5342,
      accuracy: 10
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ backgroundColor: 'var(--color-brand-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-brand-soft)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-brand-dark)', marginBottom: '0.2rem' }}>
          โหมดจำลองการเดินนำทาง (Walk Simulator)
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          แตะปุ่มด้านล่างเพื่อจำลองก้าวเดินเข้าใกล้จุดเสี่ยง เพื่อทดลองระบบเสียงเตือนภาษาไทยโดยไม่ต้องออกไปเดินข้างนอก
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {hazards.slice(0, 4).map((hazard) => (
          <button
            key={hazard.id}
            className="btn-secondary"
            style={{ fontSize: '0.88rem', textAlign: 'left', padding: '0.75rem 1rem', backgroundColor: '#FFFFFF' }}
            onClick={() => handleWalkNearHazard(hazard)}
          >

              <div>{hazard.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {hazard.locationName}
              </div>
          </button>
        ))}

        <button
          className="btn-primary"
          style={{ fontSize: '0.9rem', marginTop: '0.5rem', padding: '0.75rem', fontWeight: 700 }}
          onClick={handleResetLocation}
        >
          รีเซ็ตตำแหน่งพิกัดกลับสยามสแควร์
        </button>
      </div>
    </div>
  );
};
