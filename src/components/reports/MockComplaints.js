const MockComplaints = [
  { id: 'JS-2026-4821', title: 'Large pothole near Link Road', description: 'A deep pothole is affecting traffic and two-wheelers near the main junction.', category: 'Pothole', location: 'Andheri West', city: 'Mumbai', latitude: 19.1364, longitude: 72.8296, image: null, priority: 'High', status: 'In Progress', confirmations: 127, createdAt: '18 Aug 2026' },
  { id: 'JS-2026-4819', title: 'Broken streetlight near Carter Road', description: 'The streetlight has been out for several nights, reducing visibility for pedestrians.', category: 'Broken Streetlight', location: 'Bandra', city: 'Mumbai', latitude: 19.0553, longitude: 72.8204, image: null, priority: 'Medium', status: 'Assigned', confirmations: 84, createdAt: '17 Aug 2026' },
  { id: 'JS-2026-4815', title: 'Garbage not collected on Market Lane', description: 'Household waste has remained uncollected beside the community market.', category: 'Garbage Not Collected', location: 'Kurla', city: 'Mumbai', latitude: 19.0726, longitude: 72.8793, image: null, priority: 'High', status: 'Verified', confirmations: 93, createdAt: '16 Aug 2026' },
  { id: 'JS-2026-4810', title: 'Water leakage outside station road', description: 'A continuous water leak is creating a slippery stretch near the station entrance.', category: 'Water Leakage', location: 'Dadar', city: 'Mumbai', latitude: 19.0178, longitude: 72.8478, image: null, priority: 'Critical', status: 'In Progress', confirmations: 156, createdAt: '15 Aug 2026' },
  { id: 'JS-2026-4808', title: 'Drainage overflow after rainfall', description: 'Waterlogging is making the lane difficult for residents and school buses.', category: 'Drainage / Waterlogging', location: 'Powai', city: 'Mumbai', latitude: 19.1176, longitude: 72.9060, image: null, priority: 'High', status: 'Reported', confirmations: 61, createdAt: '15 Aug 2026' },
  { id: 'JS-2026-4802', title: 'Damaged railing near public garden', description: 'A damaged railing leaves an unsafe opening beside the walking path.', category: 'Damaged Public Infrastructure', location: 'Borivali', city: 'Mumbai', latitude: 19.2307, longitude: 72.8567, image: null, priority: 'Medium', status: 'Resolved', confirmations: 48, createdAt: '13 Aug 2026' },
  { id: 'JS-2026-4796', title: 'Uneven surface near bus stop', description: 'The road surface has broken down around the bus stop and needs repair.', category: 'Pothole', location: 'Thane', city: 'Mumbai', latitude: 19.2183, longitude: 72.9781, image: null, priority: 'Medium', status: 'Verified', confirmations: 72, createdAt: '12 Aug 2026' },
  { id: 'JS-2026-4791', title: 'Blocked drain beside housing colony', description: 'A blocked drain is causing stagnant water along the colony boundary.', category: 'Drainage / Waterlogging', location: 'Navi Mumbai', city: 'Mumbai', latitude: 19.0330, longitude: 73.0297, image: null, priority: 'High', status: 'Assigned', confirmations: 112, createdAt: '11 Aug 2026' },
  { id: 'JS-2026-4782', title: 'Uncollected waste near Lalpur Chowk', description: 'Mixed waste is accumulating beside the roadside collection point.', category: 'Garbage Not Collected', location: 'Lalpur', city: 'Ranchi', latitude: 23.3656, longitude: 85.3272, image: null, priority: 'Medium', status: 'In Progress', confirmations: 39, createdAt: '10 Aug 2026' },
  { id: 'JS-2026-4778', title: 'Streetlight not working near Harmu Road', description: 'The light near the crossing has not been working since last week.', category: 'Broken Streetlight', location: 'Harmu', city: 'Ranchi', latitude: 23.3887, longitude: 85.3381, image: null, priority: 'Low', status: 'Resolved', confirmations: 24, createdAt: '09 Aug 2026' },
  { id: 'JS-2026-4773', title: 'Pothole outside Doranda market', description: 'A large pothole is forcing vehicles into the opposite lane.', category: 'Pothole', location: 'Doranda', city: 'Ranchi', latitude: 23.3344, longitude: 85.3068, image: null, priority: 'High', status: 'Reported', confirmations: 67, createdAt: '08 Aug 2026' },
  { id: 'JS-2026-4769', title: 'Water supply pipe leakage', description: 'Water is pooling around a leaking public supply pipe.', category: 'Water Leakage', location: 'Morabadi', city: 'Ranchi', latitude: 23.4050, longitude: 85.3338, image: null, priority: 'Medium', status: 'Verified', confirmations: 51, createdAt: '07 Aug 2026' },
  { id: 'JS-2026-4761', title: 'Damaged footpath tiles', description: 'Loose footpath tiles are creating a tripping hazard for residents.', category: 'Damaged Public Infrastructure', location: 'Kanke', city: 'Ranchi', latitude: 23.4342, longitude: 85.3206, image: null, priority: 'Low', status: 'Resolved', confirmations: 31, createdAt: '05 Aug 2026' },
  { id: 'JS-2026-4754', title: 'Normal street maintenance request', description: 'Routine resurfacing is needed along the residential approach road.', category: 'Normal Street', location: 'Ranchi', city: 'Ranchi', latitude: 23.3441, longitude: 85.3096, image: null, priority: 'Low', status: 'Assigned', confirmations: 18, createdAt: '03 Aug 2026' },
  { id: 'JS-2026-4748', title: 'Drainage cover missing near Ashok Nagar', description: 'A missing drain cover needs urgent attention before it causes an injury.', category: 'Drainage / Waterlogging', location: 'Harmu', city: 'Ranchi', latitude: 23.3823, longitude: 85.3370, image: null, priority: 'Critical', status: 'In Progress', confirmations: 76, createdAt: '01 Aug 2026' },
]

export const locationSets = {
  Mumbai: { center: [19.0760, 72.8777], zoom: 11, areas: ['Andheri', 'Bandra', 'Kurla', 'Powai', 'Dadar', 'Borivali', 'Thane', 'Navi Mumbai'] },
  Ranchi: { center: [23.3441, 85.3096], zoom: 12, areas: ['Ranchi', 'Doranda', 'Harmu', 'Lalpur', 'Kanke', 'Morabadi'] },
  'Other Areas': { center: [21.1458, 79.0882], zoom: 5, areas: [] },
}

export const reportStats = [
  ['2,486', 'Total Reports'],
  ['1,142', 'Resolved'],
  ['824', 'In Progress'],
  ['520', 'Reported'],
]

export default MockComplaints
