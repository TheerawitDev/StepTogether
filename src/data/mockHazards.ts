import { HazardReport } from '../types/hazard';

export const INITIAL_HAZARDS: HazardReport[] = [
  {
    id: 'hz-101',
    category: 'CABLE',
    categoryNameTh: 'สายไฟห้อยต่ำ',
    title: 'สายเคเบิลสื่อสารห้อยต่ำขวางทางเท้า',
    description: 'สายเคเบิลสีดำห้อยลงมาเหลือระดับความสูงเพียง 1.5 เมตร ผู้พิการทางสายตาและคนเดินเท้าอาจชนศีรษะได้',
    severity: 'HIGH',
    severityNameTh: 'สูงมาก',
    status: 'ACTIVE',
    lat: 13.7456,
    lng: 100.5342,
    locationName: 'หน้าสถานีรถไฟฟ้าสยาม ทางออก 2',
    reportedAt: '2026-08-30T10:15:00',
    reportedBy: 'พลเมืองดี StepTogether',
    verifyCount: 8
  },
  {
    id: 'hz-102',
    category: 'POTHOLE',
    categoryNameTh: 'หลุมทางเท้า / ฝาท่อชำรุด',
    title: 'ฝาท่อคอนกรีตแตกเป็นหลุมลึก',
    description: 'ฝาท่อระบายน้ำขอบทางเท้าชำรุด มีช่องว่างกว้าง 30 ซม. ล้อรถเข็นหรือคทาผู้พิการอาจตกหลุมได้',
    severity: 'HIGH',
    severityNameTh: 'สูงมาก',
    status: 'ACTIVE',
    lat: 13.7462,
    lng: 100.5358,
    locationName: 'ทางเท้าหน้าศูนย์การค้าสยามสแควร์',
    reportedAt: '2026-08-30T11:40:00',
    reportedBy: 'ชมรมผู้สูงอายุสยาม',
    verifyCount: 12
  },
  {
    id: 'hz-103',
    category: 'MOTORBIKE',
    categoryNameTh: 'มอเตอร์ไซค์บนทางเท้า',
    title: 'มอเตอร์ไซค์ขับย้อนศรบนทางเท้าบ่อยครั้ง',
    description: 'มีมอเตอร์ไซค์ขับขึ้นมาบนทางเท้าช่วงเวลาเร่งด่วน 17:00-19:00 น. เสี่ยงต่อการเฉี่ยวชนผู้สัญจร',
    severity: 'MEDIUM',
    severityNameTh: 'ปานกลาง',
    status: 'ACTIVE',
    lat: 13.7448,
    lng: 100.5325,
    locationName: 'แยกปทุมวัน ฝั่งจุฬาลงกรณ์มหาวิทยาลัย',
    reportedAt: '2026-08-30T08:30:00',
    reportedBy: 'นิสิตจิตอาสา',
    verifyCount: 5
  },
  {
    id: 'hz-104',
    category: 'SURFACE',
    categoryNameTh: 'ทางขรุขระ / แผ่นอิฐหลุด',
    title: 'แผ่นปูทางเท้ากระดกและขรุขระ',
    description: 'แผ่นอิฐปูทางเท้าหลุดกระดกหลายแผ่น เมื่อฝนตกจะมีน้ำขังและทำให้คนสะดุดล้มง่าย',
    severity: 'LOW',
    severityNameTh: 'เฝ้าระวัง',
    status: 'ACTIVE',
    lat: 13.7470,
    lng: 100.5330,
    locationName: 'ซอยสยามสแควร์ 5',
    reportedAt: '2026-08-29T16:20:00',
    reportedBy: 'ผู้สัญจรทั่วไป',
    verifyCount: 3
  }
];
