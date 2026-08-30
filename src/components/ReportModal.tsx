import React, { useState, useRef } from 'react';
import { HazardCategory, HazardReport, HazardSeverity, UserLocation } from '../types/hazard';
import { speakText } from '../services/audioRadar';

interface ReportModalProps {
  userLocation: UserLocation;
  onClose: () => void;
  onSubmit: (newHazard: HazardReport) => void;
}

interface PresetOption {
  id: string;
  category: HazardCategory;
  categoryNameTh: string;
  title: string;
  defaultSeverity: HazardSeverity;
  severityNameTh: string;
  isCustom?: boolean;
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    id: 'opt-1',
    category: 'POTHOLE',
    categoryNameTh: 'หลุมทางเท้า',
    title: 'หลุมทางเท้า / ท่อระบายน้ำเปิด',
    defaultSeverity: 'HIGH',
    severityNameTh: 'สูงมาก'
  },
  {
    id: 'opt-2',
    category: 'CABLE',
    categoryNameTh: 'สายไฟห้อย',
    title: 'สายไฟ / สายเคเบิลห้อยต่ำขวางทาง',
    defaultSeverity: 'HIGH',
    severityNameTh: 'สูงมาก'
  },
  {
    id: 'opt-3',
    category: 'SURFACE',
    categoryNameTh: 'ทางขรุขระ',
    title: 'กระเบื้องทางเท้าแตก / แผ่นอิฐกระดก',
    defaultSeverity: 'MEDIUM',
    severityNameTh: 'ปานกลาง'
  },
  {
    id: 'opt-4',
    category: 'MOTORBIKE',
    categoryNameTh: 'มอเตอร์ไซค์',
    title: 'มอเตอร์ไซค์ขับขี่บนทางเท้า',
    defaultSeverity: 'HIGH',
    severityNameTh: 'สูงมาก'
  },
  {
    id: 'opt-5',
    category: 'OBSTACLE',
    categoryNameTh: 'สิ่งกีดขวาง',
    title: 'ป้ายสินค้า / สิ่งของวางขวางทางเดิน',
    defaultSeverity: 'MEDIUM',
    severityNameTh: 'ปานกลาง'
  },
  {
    id: 'opt-6',
    category: 'POTHOLE',
    categoryNameTh: 'ฝาท่อชำรุด',
    title: 'ฝาท่อระบายน้ำหาย / เป็นหลุมลึก',
    defaultSeverity: 'HIGH',
    severityNameTh: 'สูงมาก'
  },
  {
    id: 'opt-7',
    category: 'OBSTACLE',
    categoryNameTh: 'กิ่งไม้ห้อย',
    title: 'กิ่งไม้ / ต้นไม้ห้อยต่ำบังทางเดิน',
    defaultSeverity: 'LOW',
    severityNameTh: 'เฝ้าระวัง'
  },
  {
    id: 'opt-8',
    category: 'OBSTACLE',
    categoryNameTh: 'ไร้ทางลาด',
    title: 'สิ่งกีดขวางไร้ทางลาดสำหรับรถเข็น',
    defaultSeverity: 'MEDIUM',
    severityNameTh: 'ปานกลาง'
  },
  {
    id: 'opt-9',
    category: 'OBSTACLE',
    categoryNameTh: 'อื่นๆ',
    title: 'อื่นๆ (พิมพ์ระบุเอง)',
    defaultSeverity: 'MEDIUM',
    severityNameTh: 'ปานกลาง',
    isCustom: true
  }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  userLocation,
  onClose,
  onSubmit
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(PRESET_OPTIONS[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [severity, setSeverity] = useState<HazardSeverity>(PRESET_OPTIONS[0].defaultSeverity);
  const [extraNote, setExtraNote] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Hidden File Input Ref for native camera trigger
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (opt: PresetOption) => {
    setSelectedPreset(opt);
    setSeverity(opt.defaultSeverity);
  };

  const handleTriggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          speakText('ถ่ายภาพแนบจุดเสี่ยงเรียบร้อยแล้ว');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitle = selectedPreset.isCustom
      ? customTitle.trim() || 'สิ่งกีดขวางอื่นๆ'
      : selectedPreset.title;

    const locationName = `พิกัดตำแหน่ง (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`;

    const severityNameTh =
      severity === 'HIGH' ? 'สูงมาก' : severity === 'MEDIUM' ? 'ปานกลาง' : 'เฝ้าระวัง';

    const newReport: HazardReport = {
      id: `hz-${Date.now()}`,
      category: selectedPreset.category,
      categoryNameTh: selectedPreset.categoryNameTh,
      title: finalTitle,
      description: extraNote.trim() || finalTitle,
      severity,
      severityNameTh,
      status: 'ACTIVE',
      lat: userLocation.lat,
      lng: userLocation.lng,
      locationName,
      imageUrl: imagePreview || undefined,
      reportedAt: new Date().toISOString(),
      reportedBy: 'พลเมืองดี StepTogether',
      verifyCount: 1
    };

    onSubmit(newReport);
    speakText(`แจ้งเหตุสำเร็จ: ${finalTitle}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header" style={{ marginBottom: '0.75rem' }}>
          <div>
            <h2 className="card-title">แจ้งเหตุเร่งด่วน</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              เลือกประเภทเหตุการณ์แล้วกดส่งได้ทันที ไม่ต้องพิมพ์สถานที่
            </p>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.3rem 0.65rem', fontWeight: 700 }}>
            ปิด
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Automatic Location Badge */}
          <div style={{
            backgroundColor: 'var(--color-brand-light)',
            border: '1px solid var(--color-brand-soft)',
            padding: '0.55rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--color-brand-dark)',
            marginBottom: '1rem'
          }}>
            ตำแหน่งพิกัดอัตโนมัติ: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
          </div>

          {/* Quick Preset Selector Grid */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.92rem', marginBottom: '0.55rem' }}>
              แตะเลือกประเภทสิ่งกีดขวาง:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {PRESET_OPTIONS.map((opt) => {
                const isSelected = selectedPreset.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectPreset(opt)}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-brand-primary)' : 'var(--bg-card)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-main)',
                      border: isSelected ? '2px solid var(--color-brand-dark)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 0.85rem',
                      fontFamily: 'var(--font-main)',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div>{opt.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input field if 'อื่นๆ (พิมพ์ระบุเอง)' is selected */}
          {selectedPreset.isCustom ? (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.88rem', color: 'var(--color-brand-primary)' }}>
                พิมพ์ระบุเหตุการณ์อื่นๆ:
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="ระบุสิ่งกีดขวาง เช่น มีสุนัขดุร้ายขวางทาง..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                autoFocus
                required
              />
            </div>
          ) : null}

          {/* Optional Severity Override */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>
              ระดับความเสี่ยง:
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                className={`toggle-btn ${severity === 'HIGH' ? 'active' : ''}`}
                style={{ flex: 1, backgroundColor: severity === 'HIGH' ? '#EF4444' : undefined, color: severity === 'HIGH' ? '#FFF' : undefined }}
                onClick={() => setSeverity('HIGH')}
              >
                สูงมาก
              </button>
              <button
                type="button"
                className={`toggle-btn ${severity === 'MEDIUM' ? 'active' : ''}`}
                style={{ flex: 1, backgroundColor: severity === 'MEDIUM' ? '#F59E0B' : undefined, color: severity === 'MEDIUM' ? '#FFF' : undefined }}
                onClick={() => setSeverity('MEDIUM')}
              >
                ปานกลาง
              </button>
              <button
                type="button"
                className={`toggle-btn ${severity === 'LOW' ? 'active' : ''}`}
                style={{ flex: 1, backgroundColor: severity === 'LOW' ? '#10B981' : undefined, color: severity === 'LOW' ? '#FFF' : undefined }}
                onClick={() => setSeverity('LOW')}
              >
                เฝ้าระวัง
              </button>
            </div>
          </div>

          {/* Native Mobile Camera Input Element */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Photo Snap Button */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            {imagePreview ? (
              <div style={{ marginBottom: '0.5rem' }}>
                <img src={imagePreview} alt="รูปถ่ายจุดเสี่ยง" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} />
              </div>
            ) : null}
            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', fontWeight: 600, padding: '0.75rem' }}
              onClick={handleTriggerCamera}
            >
              {imagePreview ? 'ถ่ายภาพแนบใหม่' : 'กดเปิดกล้องถ่ายภาพสิ่งกีดขวาง'}
            </button>
          </div>

          {/* Optional Extra Note */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              รายละเอียดเพิ่มเติม (พิมพ์หรือไม่ก็ได้):
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="ระบุเพิ่มเติม เช่น อยู่ใกล้เสาไฟฟ้าฝั่งซ้าย..."
              value={extraNote}
              onChange={(e) => setExtraNote(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2, fontWeight: 700, padding: '0.75rem 1rem', fontSize: '1rem' }}>
              ยืนยันการแจ้งเหตุ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
