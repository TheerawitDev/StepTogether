export type HazardCategory = 'POTHOLE' | 'CABLE' | 'SURFACE' | 'MOTORBIKE' | 'OBSTACLE';

export type HazardSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export type HazardStatus = 'ACTIVE' | 'SOLVED';

export interface HazardReport {
  id: string;
  category: HazardCategory;
  categoryNameTh: string;
  title: string;
  description: string;
  severity: HazardSeverity;
  severityNameTh: string;
  status: HazardStatus;
  lat: number;
  lng: number;
  locationName: string;
  imageUrl?: string;
  reportedAt: string;
  reportedBy: string;
  verifyCount: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  autoVoiceAlert: boolean;
  autoVibrate: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}
