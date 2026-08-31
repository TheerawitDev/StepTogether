import { Badge, MysteryBox, Quest, UserProfile } from '../types/gamification';

export const INITIAL_USER_PROFILE: UserProfile = {
  level: 1,
  exp: 40,
  expToNextLevel: 100,
  totalDistanceMeters: 35,
  reportsSubmitted: 0,
  verificationsDone: 0,
  boxesOpened: 0
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q-1',
    title: 'สำรวจทางเท้า 100 เมตร',
    description: 'เดินสำรวจทางเท้าปลอดภัยให้ครบ 100 เมตร',
    targetType: 'WALK_DISTANCE',
    targetAmount: 100,
    currentAmount: 35,
    rewardExp: 50,
    rewardBadgeId: 'badge-explorer',
    rewardItemName: 'เหรียญนักสำรวจมือใหม่',
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'q-2',
    title: 'แจ้งเหตุสิ่งกีดขวาง 1 ครั้ง',
    description: 'ช่วยรายงานจุดเสี่ยงหรือสิ่งกีดขวางบนทางเท้า 1 รายการ',
    targetType: 'REPORT_HAZARD',
    targetAmount: 1,
    currentAmount: 0,
    rewardExp: 80,
    rewardBadgeId: 'badge-guardian',
    rewardItemName: 'ตราผู้พิทักษ์ทางเท้า',
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'q-3',
    title: 'ยืนยันจุดเสี่ยง 1 ครั้ง',
    description: 'ช่วยกดยืนยันข้อมูลจุดเสี่ยงจากเพื่อนสมาชิก',
    targetType: 'VERIFY_HAZARD',
    targetAmount: 1,
    currentAmount: 0,
    rewardExp: 40,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'q-4',
    title: 'ล่ากล่องสุ่มสมบัติ 1 กล่อง',
    description: 'เดินเข้าใกล้และเปิดกล่องสุ่มสมบัติบนแผนที่เรดาร์ 1 ครั้ง',
    targetType: 'OPEN_BOX',
    targetAmount: 1,
    currentAmount: 0,
    rewardExp: 60,
    rewardBadgeId: 'badge-hunter',
    rewardItemName: 'ตรานักล่าสมบัติทางเท้า',
    isCompleted: false,
    isClaimed: false
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-explorer',
    title: 'นักสำรวจมือใหม่',
    description: 'เดินสำรวจเส้นทางเท้าครบ 100 เมตรแรก',
    iconSymbol: '🚶‍♂️',
    isUnlocked: false
  },
  {
    id: 'badge-guardian',
    title: 'ผู้พิทักษ์ทางเท้า',
    description: 'รายงานสิ่งกีดขวางช่วยสังคม 1 ครั้ง',
    iconSymbol: '🛡️',
    isUnlocked: false
  },
  {
    id: 'badge-hunter',
    title: 'นักล่ากล่องสุ่ม',
    description: 'เปิดกล่องสุ่มสมบัติบนแผนที่เรดาร์ 1 ครั้ง',
    iconSymbol: '🎁',
    isUnlocked: false
  },
  {
    id: 'badge-distance-500',
    title: 'นักเดินทาง 500m',
    description: 'พิชิตการเดินสำรวจสะสมครบ 500 เมตร',
    iconSymbol: '🏆',
    isUnlocked: false
  }
];

// Initial mystery boxes near Siam Square center (13.7456, 100.5342)
export const INITIAL_MYSTERY_BOXES: MysteryBox[] = [
  {
    id: 'box-1',
    lat: 13.7459,
    lng: 100.5346,
    name: 'กล่องสุ่มสมบัติสยาม ซอย 1',
    isOpened: false,
    rewardTitle: '+50 EXP & คูปองเครื่องดื่มร้านทางเท้า',
    rewardExp: 50,
    rewardType: 'VOUCHER',
    rewardDetail: 'รับส่วนลด 10 บาท ร้านน้ำดื่มเพื่อสุขภาพ Siam'
  },
  {
    id: 'box-2',
    lat: 13.7451,
    lng: 100.5338,
    name: 'กล่องสุ่มพลังพลเมืองดี',
    isOpened: false,
    rewardTitle: '+80 EXP & แต้มสะสม StepPoint 50 แต้ม',
    rewardExp: 80,
    rewardType: 'POINTS',
    rewardDetail: 'แลกของรางวัลหมวดสวัสดิการชุมชนในอนาคต'
  },
  {
    id: 'box-3',
    lat: 13.7462,
    lng: 100.5335,
    name: 'กล่องสุ่มสมบัติวิภาวดี',
    isOpened: false,
    rewardTitle: '+100 EXP Bonus!',
    rewardExp: 100,
    rewardType: 'EXP',
    rewardDetail: 'เพิ่มระดับเลเวลนำทางอย่างรวดเร็ว'
  }
];
