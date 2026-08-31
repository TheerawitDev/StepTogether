export interface UserProfile {
  level: number;
  exp: number;
  expToNextLevel: number;
  totalDistanceMeters: number;
  reportsSubmitted: number;
  verificationsDone: number;
  boxesOpened: number;
}

export type QuestTargetType = 'WALK_DISTANCE' | 'REPORT_HAZARD' | 'VERIFY_HAZARD' | 'OPEN_BOX';

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetType: QuestTargetType;
  targetAmount: number;
  currentAmount: number;
  rewardExp: number;
  rewardBadgeId?: string;
  rewardItemName?: string;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconSymbol: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface MysteryBox {
  id: string;
  lat: number;
  lng: number;
  name: string;
  isOpened: boolean;
  rewardTitle: string;
  rewardExp: number;
  rewardType: 'EXP' | 'POINTS' | 'VOUCHER' | 'BADGE';
  rewardDetail: string;
}
