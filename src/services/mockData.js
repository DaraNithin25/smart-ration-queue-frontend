/**
 * Realistic Mock Data for Demo Mode
 * Used ONLY when user explicitly toggles Demo Mode for demonstration/testing.
 */

export const MOCK_SHOPS = [
  {
    code: 'FPS-HYD-042',
    name: 'Kukatpally FPS',
    address: 'Plot 12, Main Road, Kukatpally, Hyderabad, Telangana',
    dealerName: 'Ramesh Kumar',
    mobile: '9876543210',
    timings: '08:30 AM - 01:00 PM & 03:00 PM - 07:00 PM',
  },
  {
    code: 'FPS-HYD-088',
    name: 'Miyapur Fair Price Shop',
    address: 'Near Old Bus Stop, Miyapur, Hyderabad, Telangana',
    dealerName: 'Sunita Sharma',
    mobile: '9845123456',
    timings: '09:00 AM - 01:00 PM & 03:30 PM - 06:30 PM',
  },
  {
    code: 'FPS-SEC-104',
    name: 'Secunderabad PDS Center',
    address: 'Station Road, Secunderabad, Telangana',
    dealerName: 'Anil Varma',
    mobile: '9701122334',
    timings: '08:00 AM - 12:30 PM & 02:30 PM - 06:30 PM',
  },
];

export const MOCK_USERS = {
  beneficiary: {
    name: 'Nithin',
    mobile: '9876500001',
    role: 'BENEFICIARY',
    rationCardNumber: 'RC-TS-2024-88912',
    assignedShop: MOCK_SHOPS[0],
  },
  dealer: {
    name: 'Ramesh',
    mobile: '9876543210',
    role: 'DEALER',
    shopCode: 'FPS-HYD-042',
    shopName: 'Kukatpally FPS',
  },
  admin: {
    name: 'System Admin',
    mobile: '9999999999',
    role: 'ADMIN',
  },
};

export const INITIAL_MOCK_SLOTS = [
  {
    id: 101,
    shopCode: 'FPS-HYD-042',
    slotDate: '2026-10-20',
    startTime: '09:00:00',
    endTime: '09:30:00',
    capacity: 6,
    bookedCount: 6, // Full
  },
  {
    id: 102,
    shopCode: 'FPS-HYD-042',
    slotDate: '2026-10-20',
    startTime: '09:30:00',
    endTime: '10:00:00',
    capacity: 6,
    bookedCount: 4, // 2 available
  },
  {
    id: 103,
    shopCode: 'FPS-HYD-042',
    slotDate: '2026-10-20',
    startTime: '10:00:00',
    endTime: '10:30:00',
    capacity: 6,
    bookedCount: 2, // 4 available
  },
  {
    id: 104,
    shopCode: 'FPS-HYD-042',
    slotDate: '2026-10-20',
    startTime: '10:30:00',
    endTime: '11:00:00',
    capacity: 6,
    bookedCount: 6, // Full
  },
  {
    id: 105,
    shopCode: 'FPS-HYD-042',
    slotDate: '2026-10-20',
    startTime: '11:00:00',
    endTime: '11:30:00',
    capacity: 6,
    bookedCount: 5, // 1 available
  },
  {
    id: 106,
    shopCode: 'FPS-HYD-042',
    slotDate: '2026-10-20',
    startTime: '11:30:00',
    endTime: '12:00:00',
    capacity: 6,
    bookedCount: 6, // Full
  },
  {
    id: 107,
    shopCode: 'FPS-HYD-042',
    slotDate: '2026-10-21',
    startTime: '09:00:00',
    endTime: '09:30:00',
    capacity: 8,
    bookedCount: 3,
  },
  {
    id: 108,
    shopCode: 'FPS-HYD-042',
    slotDate: '2026-10-21',
    startTime: '09:30:00',
    endTime: '10:00:00',
    capacity: 8,
    bookedCount: 1,
  },
];

export const INITIAL_MOCK_BOOKINGS = [
  {
    id: 501,
    tokenNumber: 'RQ-183290B7',
    status: 'BOOKED',
    bookedAt: '2026-10-10T14:30:00',
    rationCardNumber: 'RC-TS-2024-88912',
    shopCode: 'FPS-HYD-042',
    shopName: 'Kukatpally FPS',
    slotDate: '2026-10-20',
    startTime: '10:00:00',
    endTime: '10:30:00',
  },
  {
    id: 489,
    tokenNumber: 'RQ-992144A1',
    status: 'COMPLETED',
    bookedAt: '2026-09-12T10:15:00',
    rationCardNumber: 'RC-TS-2024-88912',
    shopCode: 'FPS-HYD-042',
    shopName: 'Kukatpally FPS',
    slotDate: '2026-09-15',
    startTime: '09:30:00',
    endTime: '10:00:00',
  },
];

export const MOCK_DEALER_TODAY_BOOKINGS = [
  {
    tokenNo: 'A1041',
    beneficiaryName: 'Sravani',
    mobile: '9876543210',
    timeSlot: '09:30 - 10:00 AM',
    status: 'Arrived',
    action: 'Verify',
  },
  {
    tokenNo: 'A1042',
    beneficiaryName: 'Raju',
    mobile: '9123456789',
    timeSlot: '09:30 - 10:00 AM',
    status: 'Pending',
    action: 'Mark Arrived',
  },
  {
    tokenNo: 'A1043',
    beneficiaryName: 'Lakshmi',
    mobile: '9012345678',
    timeSlot: '10:00 - 10:30 AM',
    status: 'Pending',
    action: 'Mark Arrived',
  },
  {
    tokenNo: 'A1044',
    beneficiaryName: 'Mahesh',
    mobile: '7894561230',
    timeSlot: '10:00 - 10:30 AM',
    status: 'Completed',
    action: 'View',
  },
];

export const MOCK_STOCK_DATA = [
  { item: 'Rice', available: '450 kg', category: 'Grain', color: 'emerald' },
  { item: 'Wheat', available: '200 kg', category: 'Grain', color: 'amber' },
  { item: 'Sugar', available: '100 kg', category: 'Essential', color: 'blue' },
  { item: 'Kerosene', available: '50 liters', category: 'Fuel', color: 'rose' },
];
