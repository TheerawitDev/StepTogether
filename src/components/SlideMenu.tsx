import React, { useState } from 'react';
import { AccessibilitySettings, HazardReport, UserLocation } from '../types/hazard';
import { Badge, Quest, UserProfile } from '../types/gamification';
import { AccessibilityBar } from './AccessibilityBar';
import { HazardList } from './HazardList';
import { SimulatedWalkControls } from './SimulatedWalkControls';
import { QuestBadgePanel } from './QuestBadgePanel';

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  accessibilitySettings: AccessibilitySettings;
  setAccessibilitySettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  hazards: HazardReport[];
  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;
  onVerifyHazard: (id: string) => void;
  onSolveHazard: (id: string) => void;
  userProfile: UserProfile;
  quests: Quest[];
  badges: Badge[];
  onClaimQuest: (questId: string) => void;
}

export const SlideMenu: React.FC<SlideMenuProps> = ({
  isOpen,
  onClose,
  accessibilitySettings,
  setAccessibilitySettings,
  hazards,
  userLocation,
  setUserLocation,
  onVerifyHazard,
  onSolveHazard,
  userProfile,
  quests,
  badges,
  onClaimQuest
}) => {
  const [activeTab, setActiveTab] = useState<'LIST' | 'QUESTS' | 'ACCESSIBILITY' | 'SIMULATOR'>('LIST');

  if (!isOpen) return null;

  const activeCount = hazards.filter((h) => h.status === 'ACTIVE').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h2 className="card-title" style={{ fontSize: '1.2rem' }}>เมนูควบคุม StepTogether</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              จุดเสี่ยงรอการแก้ไข: {activeCount} รายการ
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.35rem 0.85rem', fontWeight: 700 }}>
            ปิดเมนู
          </button>
        </div>

        {/* Clean Segmented Tab Control (Pure Thai) */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-card-subtle)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          marginBottom: '1rem'
        }}>
          <button
            className={`nav-btn ${activeTab === 'LIST' ? 'active' : ''}`}
            onClick={() => setActiveTab('LIST')}
            style={{ flex: 1, padding: '0.45rem', fontSize: '0.82rem' }}
          >
            จุดเสี่ยง ({activeCount})
          </button>

          <button
            className={`nav-btn ${activeTab === 'QUESTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('QUESTS')}
            style={{ flex: 1, padding: '0.45rem', fontSize: '0.82rem' }}
          >
            🎯 ภารกิจ & Lv
          </button>

          <button
            className={`nav-btn ${activeTab === 'ACCESSIBILITY' ? 'active' : ''}`}
            onClick={() => setActiveTab('ACCESSIBILITY')}
            style={{ flex: 1, padding: '0.45rem', fontSize: '0.82rem' }}
          >
            โหมดเสียงอ่าน
          </button>

          <button
            className={`nav-btn ${activeTab === 'SIMULATOR' ? 'active' : ''}`}
            onClick={() => setActiveTab('SIMULATOR')}
            style={{ flex: 1, padding: '0.45rem', fontSize: '0.82rem' }}
          >
            ทดลองเดิน
          </button>
        </div>

        {/* Single Scrollable Body Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {activeTab === 'LIST' && (
            <HazardList
              hazards={hazards}
              userLocation={userLocation}
              onVerifyHazard={onVerifyHazard}
              onSolveHazard={onSolveHazard}
            />
          )}

          {activeTab === 'QUESTS' && (
            <QuestBadgePanel
              userProfile={userProfile}
              quests={quests}
              badges={badges}
              onClaimQuest={onClaimQuest}
            />
          )}

          {activeTab === 'ACCESSIBILITY' && (
            <AccessibilityBar
              settings={accessibilitySettings}
              setSettings={setAccessibilitySettings}
            />
          )}

          {activeTab === 'SIMULATOR' && (
            <SimulatedWalkControls
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              hazards={hazards}
            />
          )}
        </div>
      </div>
    </div>
  );
};
