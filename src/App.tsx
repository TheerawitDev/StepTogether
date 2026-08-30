import React, { useState, useEffect } from 'react';
import { AccessibilitySettings, HazardReport, UserLocation } from './types/hazard';
import { INITIAL_HAZARDS } from './data/mockHazards';
import { checkProximityAndAlert, speakText } from './services/audioRadar';
import { Header } from './components/Header';
import { RadarMap } from './components/RadarMap';
import { ReportModal } from './components/ReportModal';
import { SlideMenu } from './components/SlideMenu';

export const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState('กำลังเชื่อมต่อสัญญาณ...');

  // Default Siam Square center location
  const [userLocation, setUserLocation] = useState<UserLocation>({
    lat: 13.7456,
    lng: 100.5342,
    accuracy: 10
  });

  // Hazards List State with LocalStorage persistence
  const [hazards, setHazards] = useState<HazardReport[]>(() => {
    const saved = localStorage.getItem('steptogether_hazards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved hazards', err);
      }
    }
    return INITIAL_HAZARDS;
  });

  // Accessibility Settings State
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    autoVoiceAlert: true,
    autoVibrate: true
  });

  // Active Proximity Alert Hazard
  const [activeAlert, setActiveAlert] = useState<HazardReport | null>(null);

  // Save hazards to localStorage
  useEffect(() => {
    localStorage.setItem('steptogether_hazards', JSON.stringify(hazards));
  }, [hazards]);

  // Live HTML5 Geolocation Tracking
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsStatusText('พิกัดจำลอง');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setGpsStatusText(`เปิดอยู่ (~${Math.round(pos.coords.accuracy)} ม.)`);
      },
      (err) => {
        console.warn('Geolocation fallback', err.message);
        setGpsStatusText('พิกัดจำลอง (สยาม)');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Check Proximity Alert on Location or Hazard change
  useEffect(() => {
    const alerted = checkProximityAndAlert(
      userLocation,
      hazards,
      accessibilitySettings.autoVoiceAlert,
      accessibilitySettings.autoVibrate,
      40 // 40 meters proximity radius
    );

    if (alerted) {
      setActiveAlert(alerted);
    }
  }, [userLocation, hazards, accessibilitySettings]);

  // Handlers
  const handleAddHazard = (newHazard: HazardReport) => {
    setHazards((prev) => [newHazard, ...prev]);
  };

  const handleVerifyHazard = (hazardId: string) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === hazardId ? { ...h, verifyCount: h.verifyCount + 1 } : h))
    );
    speakText('ขอบคุณสำหรับการร่วมยืนยันข้อมูลจุดเสี่ยง');
  };

  const handleSolveHazard = (hazardId: string) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === hazardId ? { ...h, status: 'SOLVED' as const } : h))
    );
    speakText('บันทึกการแก้ไขจุดเสี่ยงเรียบร้อยแล้ว ขอบคุณที่ร่วมสร้างทางเท้าปลอดภัย');
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 1. Full-Screen Interactive Radar Map */}
      <RadarMap
        userLocation={userLocation}
        hazards={hazards}
        radarRadiusMeters={50}
      />

      {/* 2. Floating Top Minimal Header Bar */}
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        gpsStatusText={gpsStatusText}
      />

      {/* 3. Proximity Audio Alert Banner (When approaching hazard) */}
      {activeAlert ? (
        <div className="floating-banner-overlay">
          <div className="proximity-banner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="proximity-banner-title">
                  เตือนภัยเรดาร์: พบจุดเสี่ยงในรัศมีใกล้!
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                  {activeAlert.categoryNameTh} • {activeAlert.title} - {activeAlert.locationName}
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                onClick={() => setActiveAlert(null)}
              >
                ปิดเตือน
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 4. Big Floating Center-Bottom Report Action Button (Pure Thai) */}
      <div className="floating-report-container">
        <button
          className="floating-report-btn"
          onClick={() => setIsReportModalOpen(true)}
        >
          กดแจ้งเหตุสิ่งกีดขวาง
        </button>
      </div>

      {/* 5. Slide-Over Menu */}
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accessibilitySettings={accessibilitySettings}
        setAccessibilitySettings={setAccessibilitySettings}
        hazards={hazards}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        onVerifyHazard={handleVerifyHazard}
        onSolveHazard={handleSolveHazard}
      />

      {/* 6. Snap Report Modal Form */}
      {isReportModalOpen ? (
        <ReportModal
          userLocation={userLocation}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleAddHazard}
        />
      ) : null}
    </div>
  );
};
