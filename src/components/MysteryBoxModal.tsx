import React from 'react';
import { MysteryBox } from '../types/gamification';

interface MysteryBoxModalProps {
  box: MysteryBox;
  onClose: () => void;
  onClaim: (box: MysteryBox) => void;
}

export const MysteryBoxModal: React.FC<MysteryBoxModalProps> = ({ box, onClose, onClaim }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ textAlign: 'center', maxWidth: '420px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem', animation: 'boxBounce 0.6s infinite alternate' }}>
          🎁
        </div>

        <h2 className="card-title" style={{ fontSize: '1.4rem', color: 'var(--color-brand-primary)', marginBottom: '0.25rem' }}>
          ยินดีด้วย! คุณเปิดกล่องสุ่มสำเร็จ
        </h2>

        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
          {box.name}
        </div>

        <div style={{
          backgroundColor: 'var(--color-brand-light)',
          border: '2px dashed var(--color-brand-accent)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-brand-dark)', marginBottom: '0.35rem' }}>
            {box.rewardTitle}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
            {box.rewardDetail}
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontWeight: 700, fontSize: '1.05rem' }}
          onClick={() => onClaim(box)}
        >
          รับของรางวัล (+{box.rewardExp} EXP)
        </button>
      </div>
    </div>
  );
};
