import { HazardReport, UserLocation } from '../types/hazard';

// Calculate distance in meters using Haversine Formula
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Track recently announced hazards to avoid repeating every second
const announcedHazardsMap = new Map<string, number>();

export function speakText(text: string): void {
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'th-TH';
  utterance.rate = 0.95; // Slightly clearer pace for elderly
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function playAudioRadarBeep(severity: 'HIGH' | 'MEDIUM' | 'LOW'): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const frequency = severity === 'HIGH' ? 880 : severity === 'MEDIUM' ? 660 : 440;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {
    console.warn('Audio Context not allowed without user interaction yet', err);
  }
}

export function triggerVibration(severity: 'HIGH' | 'MEDIUM' | 'LOW'): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    if (severity === 'HIGH') {
      navigator.vibrate([300, 100, 300, 100, 300]);
    } else if (severity === 'MEDIUM') {
      navigator.vibrate([200, 100, 200]);
    } else {
      navigator.vibrate([150]);
    }
  }
}

export function checkProximityAndAlert(
  userLoc: UserLocation,
  hazards: HazardReport[],
  autoVoice: boolean,
  autoVibrate: boolean,
  alertRadiusMeters: number = 40
): HazardReport | null {
  const now = Date.now();
  let closestHazard: HazardReport | null = null;
  let minDistance = Infinity;

  for (const hazard of hazards) {
    if (hazard.status !== 'ACTIVE') continue;

    const dist = calculateDistanceMeters(userLoc.lat, userLoc.lng, hazard.lat, hazard.lng);

    if (dist <= alertRadiusMeters && dist < minDistance) {
      minDistance = dist;
      closestHazard = hazard;
    }
  }

  if (closestHazard) {
    const lastTime = announcedHazardsMap.get(closestHazard.id) || 0;
    // Don't repeat alert for the same hazard within 20 seconds
    if (now - lastTime > 20000) {
      announcedHazardsMap.set(closestHazard.id, now);

      if (autoVibrate) {
        triggerVibration(closestHazard.severity);
      }

      playAudioRadarBeep(closestHazard.severity);

      if (autoVoice) {
        const textToAnnounce = `เตือนภัยทางเท้า อีกประมาณ ${minDistance} เมตรข้างหน้า มี${closestHazard.categoryNameTh} ระดับความเสี่ยง ${closestHazard.severityNameTh} รายละเอียด ${closestHazard.title}`;
        speakText(textToAnnounce);
      }
    }
  }

  return closestHazard;
}
