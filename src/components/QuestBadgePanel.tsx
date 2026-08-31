import React from 'react';
import { Badge, Quest, UserProfile } from '../types/gamification';

interface QuestBadgePanelProps {
  userProfile: UserProfile;
  quests: Quest[];
  badges: Badge[];
  onClaimQuest: (questId: string) => void;
}

export const QuestBadgePanel: React.FC<QuestBadgePanelProps> = ({
  userProfile,
  quests,
  badges,
  onClaimQuest
}) => {
  const expPercent = Math.min(100, Math.round((userProfile.exp / userProfile.expToNextLevel) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. User Level & EXP Card */}
      <div className="card-panel" style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>ระดับผู้ใช้งาน StepTogether</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>เลเวล {userProfile.level}</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            ระยะทางสะสม {userProfile.totalDistanceMeters} ม.
          </div>
        </div>

        {/* EXP Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem', opacity: 0.95 }}>
            <span>ค่าประสบการณ์ (EXP)</span>
            <span>{userProfile.exp} / {userProfile.expToNextLevel} EXP ({expPercent}%)</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${expPercent}%`, height: '100%', backgroundColor: '#38BDF8', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* 2. Quests List Section */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--color-text-main)' }}>
          🎯 ภารกิจสำรวจทางเท้า
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {quests.map((quest) => {
            const progressPct = Math.min(100, Math.round((quest.currentAmount / quest.targetAmount) * 100));
            const isReadyToClaim = quest.isCompleted && !quest.isClaimed;

            return (
              <div
                key={quest.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: quest.isClaimed ? '1px solid var(--color-border)' : isReadyToClaim ? '2px solid #10B981' : '1px solid var(--color-brand-soft)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{quest.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{quest.description}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-brand-primary)', whiteSpace: 'nowrap' }}>
                    +{quest.rewardExp} EXP
                  </div>
                </div>

                {/* Progress Bar & Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.6rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                      <span>ความคืบหน้า</span>
                      <span>{quest.currentAmount} / {quest.targetAmount}</span>
                    </div>
                    <div style={{ width: '100%', height: '7px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: quest.isClaimed ? '#94A3B8' : '#0284C7', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>

                  <div>
                    {quest.isClaimed ? (
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        ✓ รับแล้ว
                      </span>
                    ) : isReadyToClaim ? (
                      <button
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#10B981', fontWeight: 700 }}
                        onClick={() => onClaimQuest(quest.id)}
                      >
                        รับรางวัล
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>
                        {progressPct}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Badges Gallery Section */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--color-text-main)' }}>
          🏅 ตราความสำเร็จ & Badge
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem' }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                backgroundColor: badge.isUnlocked ? 'var(--color-brand-light)' : 'var(--bg-card-subtle)',
                border: badge.isUnlocked ? '2px solid var(--color-brand-accent)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                opacity: badge.isUnlocked ? 1 : 0.65
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.2rem', filter: badge.isUnlocked ? 'none' : 'grayscale(100%)' }}>
                {badge.iconSymbol}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: badge.isUnlocked ? 'var(--color-brand-dark)' : 'var(--color-text-muted)' }}>
                {badge.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {badge.isUnlocked ? 'ปลดล็อกแล้ว' : 'ยังไม่ปลดล็อก'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
