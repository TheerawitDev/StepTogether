import React from 'react';
import { AccessibilitySettings } from '../types/hazard';
import { speakText } from '../services/audioRadar';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({ settings, setSettings }) => {
  const toggleLargeText = () => {
    const nextVal = !settings.largeText;
    setSettings((prev) => ({ ...prev, largeText: nextVal }));
    if (nextVal) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  };

  const toggleHighContrast = () => {
    const nextVal = !settings.highContrast;
    setSettings((prev) => ({ ...prev, highContrast: nextVal }));
    if (nextVal) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const toggleVoiceAlert = () => {
    const nextVal = !settings.autoVoiceAlert;
    setSettings((prev) => ({ ...prev, autoVoiceAlert: nextVal }));
    if (nextVal) {
      speakText('เปิดการอ่านเตือนภัยด้วยเสียงภาษาไทยเรียบร้อยแล้ว');
    }
  };

  const toggleVibrate = () => {
    setSettings((prev) => ({ ...prev, autoVibrate: !prev.autoVibrate }));
  };

  const handleTestSpeech = () => {
    speakText('ทดสอบเสียงเตือนระบบ StepTogether: อีกประมาณ 15 เมตรข้างหน้า มีสายไฟห้อยต่ำขวางทางเท้า โปรดระมัดระวัง');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ backgroundColor: 'var(--color-brand-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-brand-soft)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-brand-dark)', marginBottom: '0.2rem' }}>
          โหมดช่วยเหลือผู้สูงอายุและผู้พิการทางสายตา
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          ปรับแต่งระบบอ่านเสียงและการแสดงผลให้เหมาะกับการใช้งานของคุณ
        </p>
      </div>

      {/* Row 1: Large Text */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '0.85rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ตัวหนังสือขนาดใหญ่</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ขยายขนาดฟอนต์ให้อ่านง่ายชัดเจน</div>
        </div>
        <button
          className={`toggle-btn ${settings.largeText ? 'active' : ''}`}
          onClick={toggleLargeText}
          style={{ minWidth: '80px' }}
        >
          {settings.largeText ? 'เปิดใช้งาน' : 'ปิด'}
        </button>
      </div>

      {/* Row 2: High Contrast */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '0.85rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>สีหน้าจอคอนทราสต์สูง</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ปรับโทนสีดำ-ตัดขาวสำหรับผู้สายตาฝ้าฟาง</div>
        </div>
        <button
          className={`toggle-btn ${settings.highContrast ? 'active' : ''}`}
          onClick={toggleHighContrast}
          style={{ minWidth: '80px' }}
        >
          {settings.highContrast ? 'เปิดใช้งาน' : 'ปิด'}
        </button>
      </div>

      {/* Row 3: Thai Audio Alert */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '0.85rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ระบบเสียงอ่านเตือนภาษาไทย</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>อ่านเตือนด้วยเสียงเมื่อเดินเข้าใกล้จุดเสี่ยง</div>
        </div>
        <button
          className={`toggle-btn ${settings.autoVoiceAlert ? 'active' : ''}`}
          onClick={toggleVoiceAlert}
          style={{ minWidth: '80px' }}
        >
          {settings.autoVoiceAlert ? 'เปิดใช้งาน' : 'ปิด'}
        </button>
      </div>

      {/* Row 4: Vibration */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '0.85rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ระบบสั่นเตือนที่สมาร์ทโฟน</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>สั่นเตือนตามระดับความเสี่ยง</div>
        </div>
        <button
          className={`toggle-btn ${settings.autoVibrate ? 'active' : ''}`}
          onClick={toggleVibrate}
          style={{ minWidth: '80px' }}
        >
          {settings.autoVibrate ? 'เปิดใช้งาน' : 'ปิด'}
        </button>
      </div>

      {/* Test Audio Button */}
      <button
        className="btn-primary"
        style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', fontWeight: 700 }}
        onClick={handleTestSpeech}
      >
        ทดสอบระบบเสียงอ่านเตือนภาษาไทย
      </button>
    </div>
  );
};
