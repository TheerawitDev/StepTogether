import React, { useState, useEffect, useRef } from 'react';
import { AccessibilitySettings, HazardReport, UserLocation } from './types/hazard';
import { Badge, MysteryBox, Quest, QuestTargetType, UserProfile } from './types/gamification';
import { INITIAL_HAZARDS } from './data/mockHazards';
import { INITIAL_BADGES, INITIAL_MYSTERY_BOXES, INITIAL_QUESTS, INITIAL_USER_PROFILE } from './data/mockGamification';
import { calculateDistanceMeters, checkProximityAndAlert, speakText } from './services/audioRadar';
import { Header } from './components/Header';
import { RadarMap } from './components/RadarMap';
import { ReportModal } from './components/ReportModal';
import { SlideMenu } from './components/SlideMenu';
import { MysteryBoxModal } from './components/MysteryBoxModal';

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

  const prevLocationRef = useRef<UserLocation>(userLocation);

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

  // User Profile Gamification State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('steptogether_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USER_PROFILE;
  });

  // Quests State
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('steptogether_quests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_QUESTS;
  });

  // Badges State
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('steptogether_badges');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_BADGES;
  });

  // Mystery Boxes State
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>(() => {
    const saved = localStorage.getItem('steptogether_mystery_boxes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MYSTERY_BOXES;
  });

  const [selectedMysteryBox, setSelectedMysteryBox] = useState<MysteryBox | null>(null);

  // Accessibility Settings State
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    autoVoiceAlert: true,
    autoVibrate: true
  });

  // Active Proximity Alert Hazard
  const [activeAlert, setActiveAlert] = useState<HazardReport | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('steptogether_hazards', JSON.stringify(hazards));
  }, [hazards]);

  useEffect(() => {
    localStorage.setItem('steptogether_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('steptogether_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('steptogether_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('steptogether_mystery_boxes', JSON.stringify(mysteryBoxes));
  }, [mysteryBoxes]);

  // EXP & Level Up Handler
  const addExp = (expGain: number) => {
    setUserProfile((prev) => {
      let newExp = prev.exp + expGain;
      let newLevel = prev.level;
      let newExpToNext = prev.expToNextLevel;

      if (newExp >= newExpToNext) {
        newExp = newExp - newExpToNext;
        newLevel += 1;
        newExpToNext = newLevel * 100;
        speakText(`ยินดีด้วย! คุณได้รับการอัปเลเวลเป็น เลเวล ${newLevel}`);
      }

      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        expToNextLevel: newExpToNext
      };
    });
  };

  // Helper to unlock badges
  const unlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId && !b.isUnlocked) {
          speakText(`คุณได้รับตราความสำเร็จใหม่: ${b.title}`);
          return { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() };
        }
        return b;
      })
    );
  };

  // Helper to progress Quests
  const triggerQuestProgress = (targetType: QuestTargetType, amountOrTotal: number, isAbsolute: boolean = false) => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (q.targetType !== targetType || q.isCompleted) return q;

        const newCurrent = isAbsolute ? amountOrTotal : q.currentAmount + amountOrTotal;
        const isNowCompleted = newCurrent >= q.targetAmount;

        if (isNowCompleted && !q.isCompleted) {
          speakText(`ภารกิจสำเร็จแล้ว: ${q.title}`);
          if (q.rewardBadgeId) {
            unlockBadge(q.rewardBadgeId);
          }
        }

        return {
          ...q,
          currentAmount: Math.min(newCurrent, q.targetAmount),
          isCompleted: isNowCompleted
        };
      })
    );
  };

  // Distance tracking logic
  useEffect(() => {
    if (!prevLocationRef.current) {
      prevLocationRef.current = userLocation;
      return;
    }

    const dist = calculateDistanceMeters(
      prevLocationRef.current.lat,
      prevLocationRef.current.lng,
      userLocation.lat,
      userLocation.lng
    );

    if (dist >= 1 && dist < 500) {
      setUserProfile((prev) => {
        const newTotal = prev.totalDistanceMeters + dist;
        triggerQuestProgress('WALK_DISTANCE', newTotal, true);
        if (newTotal >= 500) {
          unlockBadge('badge-distance-500');
        }
        return { ...prev, totalDistanceMeters: newTotal };
      });
    }

    prevLocationRef.current = userLocation;
  }, [userLocation]);

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

  // Mystery Box Map Select Handler
  const handleSelectMysteryBox = (box: MysteryBox) => {
    const dist = calculateDistanceMeters(userLocation.lat, userLocation.lng, box.lat, box.lng);
    if (dist <= 30) {
      setSelectedMysteryBox(box);
      speakText(`พบกล่องสุ่มสมบัติ ${box.name} กดเปิดรับของรางวัลได้ทันที`);
    } else {
      const needed = Math.round(dist - 30);
      speakText(`กล่องสุ่มอยู่ห่างเกินไป เดินเข้าใกล้เพิ่มอีกประมาณ ${needed} เมตร`);
    }
  };

  // Claim Mystery Box Handler
  const handleClaimMysteryBox = (box: MysteryBox) => {
    setMysteryBoxes((prev) =>
      prev.map((b) => (b.id === box.id ? { ...b, isOpened: true } : b))
    );

    setUserProfile((prev) => ({
      ...prev,
      boxesOpened: prev.boxesOpened + 1
    }));

    addExp(box.rewardExp);
    triggerQuestProgress('OPEN_BOX', 1);
    unlockBadge('badge-hunter');

    setSelectedMysteryBox(null);
  };

  // Claim Quest Reward Handler
  const handleClaimQuest = (questId: string) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.isClaimed) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
    );

    addExp(targetQuest.rewardExp);
    if (targetQuest.rewardBadgeId) {
      unlockBadge(targetQuest.rewardBadgeId);
    }
    speakText(`รับของรางวัลภารกิจสำเร็จ บวก ${targetQuest.rewardExp} EXP`);
  };

  // Handlers
  const handleAddHazard = (newHazard: HazardReport) => {
    setHazards((prev) => [newHazard, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      reportsSubmitted: prev.reportsSubmitted + 1
    }));
    triggerQuestProgress('REPORT_HAZARD', 1);
    unlockBadge('badge-guardian');
  };

  const handleVerifyHazard = (hazardId: string) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === hazardId ? { ...h, verifyCount: h.verifyCount + 1 } : h))
    );
    setUserProfile((prev) => ({
      ...prev,
      verificationsDone: prev.verificationsDone + 1
    }));
    triggerQuestProgress('VERIFY_HAZARD', 1);
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
        mysteryBoxes={mysteryBoxes}
        onSelectMysteryBox={handleSelectMysteryBox}
        radarRadiusMeters={50}
      />

      {/* 2. Floating Top Minimal Header Bar */}
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        gpsStatusText={gpsStatusText}
        userLevel={userProfile.level}
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
        userProfile={userProfile}
        quests={quests}
        badges={badges}
        onClaimQuest={handleClaimQuest}
      />

      {/* 6. Snap Report Modal Form */}
      {isReportModalOpen ? (
        <ReportModal
          userLocation={userLocation}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleAddHazard}
        />
      ) : null}

      {/* 7. Mystery Box Reward Modal */}
      {selectedMysteryBox ? (
        <MysteryBoxModal
          box={selectedMysteryBox}
          onClose={() => setSelectedMysteryBox(null)}
          onClaim={handleClaimMysteryBox}
        />
      ) : null}
    </div>
  );
};
