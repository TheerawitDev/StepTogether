import React, { useState } from 'react';
import { HazardReport, UserLocation } from '../types/hazard';
import { calculateDistanceMeters, speakText } from '../services/audioRadar';

interface HazardListProps {
  hazards: HazardReport[];
  userLocation: UserLocation;
  onVerifyHazard: (hazardId: string) => void;
  onSolveHazard: (hazardId: string) => void;
}

export const HazardList: React.FC<HazardListProps> = ({
  hazards,
  userLocation,
  onVerifyHazard,
  onSolveHazard
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'SOLVED'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate distance & sort by closest first
  const processedHazards = hazards
    .map((hazard) => ({
      ...hazard,
      distanceMeters: calculateDistanceMeters(
        userLocation.lat,
        userLocation.lng,
        hazard.lat,
        hazard.lng
      )
    }))
    .filter((hazard) => {
      if (filterStatus !== 'ALL' && hazard.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          hazard.title.toLowerCase().includes(query) ||
          hazard.description.toLowerCase().includes(query) ||
          hazard.categoryNameTh.toLowerCase().includes(query) ||
          hazard.locationName.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  const handleReadDetails = (hazard: HazardReport & { distanceMeters: number }) => {
    const text = `จุดเสี่ยง ${hazard.categoryNameTh} ระยะห่างประมาณ ${hazard.distanceMeters} เมตร ระดับความเสี่ยง ${hazard.severityNameTh} สถานที่ ${hazard.locationName} รายละเอียด ${hazard.description}`;
    speakText(text);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Search & Filter Control Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="พิมพ์ค้นหาจุดเสี่ยงหรือสถานที่..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className={`toggle-btn ${filterStatus === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setFilterStatus('ACTIVE')}
            style={{ flex: 1 }}
          >
            ยังไม่แก้ไข
          </button>
          <button
            className={`toggle-btn ${filterStatus === 'SOLVED' ? 'active' : ''}`}
            onClick={() => setFilterStatus('SOLVED')}
            style={{ flex: 1 }}
          >
            แก้ไขแล้ว
          </button>
          <button
            className={`toggle-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterStatus('ALL')}
            style={{ flex: 1 }}
          >
            ทั้งหมด
          </button>
        </div>
      </div>

      {/* Single Scrollable Clean Cards List */}
      <div>
        {processedHazards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            ไม่พบรายการจุดเสี่ยงในเงื่อนไขนี้
          </div>
        ) : (
          processedHazards.map((hazard) => {
            const severityClass = hazard.severity.toLowerCase();

            return (
              <div
                key={hazard.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.1rem',
                  marginBottom: '0.85rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Header Row: Severity Badge & Distance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className={`badge-pill ${severityClass}`}>
                    ความเสี่ยง: {hazard.severityNameTh}
                  </span>
                  <span className="distance-tag">
                    ระยะ ~{hazard.distanceMeters} เมตร
                  </span>
                </div>

                {/* Hazard Title */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                  {hazard.title}
                </h3>

                {/* Location & Description */}
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                  {hazard.locationName}
                </p>

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', marginBottom: '0.75rem', lineHeight: '1.45' }}>
                  {hazard.description}
                </p>

                {/* Action Buttons Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    ยืนยันแล้ว {hazard.verifyCount} คน
                  </span>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                      onClick={() => handleReadDetails(hazard)}
                    >
                      ฟังเสียงอ่าน
                    </button>

                    {hazard.status === 'ACTIVE' ? (
                      <>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                          onClick={() => onVerifyHazard(hazard.id)}
                        >
                          ร่วมยืนยัน
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', color: '#10B981', borderColor: '#86EFAC' }}
                          onClick={() => onSolveHazard(hazard.id)}
                        >
                          แก้ไขแล้ว
                        </button>
                      </>
                    ) : (
                      <span className="badge-pill low">
                        แก้ไขแล้ว
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
