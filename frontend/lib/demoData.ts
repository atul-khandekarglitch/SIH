export interface ProblemData {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  severity: number;
  urgency: number;
  public_impact: number;
  location_lat: number;
  location_lng: number;
  address: string;
  district: string;
  status: string;
  recommended_route: string;
  citizen_id: string;
  ai_summary: string;
  confidence_score: number;
  reasoning: string;
  required_expertise: string[];
  created_at: string;
  updated_at: string;
  images: { image_url: string; caption?: string }[];
  assignments?: { organization: { name: string; type: string }; status: string }[];
  milestones?: { id: string; title: string; target_date: string; status: string; description?: string }[];
  solutions?: { id: string; title: string; description: string; cost_estimate: string; implementation_time: string }[];
}

export const INITIAL_DEMO_PROBLEMS: ProblemData[] = [
  {
    id: "JH-001",
    title: "Seasonal Drinking Water Shortage & Tube-Well Fluoride Contamination",
    description: "Over 450 households in Harmu and Kanke blocks of Ranchi are suffering from acute drinking water shortage during summer months. Water samples from local handpumps show fluoride contamination exceeding 3.8 ppm, leading to dental fluorosis among children.",
    category: "Water",
    subcategory: "Groundwater Depletion & Fluoride",
    severity: 8,
    urgency: 8,
    public_impact: 9,
    location_lat: 23.3441,
    location_lng: 85.3096,
    address: "Harmu Housing Colony & Kanke Block, Ranchi, Jharkhand",
    district: "Ranchi",
    status: "ACCEPTED",
    recommended_route: "COLLABORATION",
    citizen_id: "citizen-01",
    ai_summary: "Acute groundwater depletion and fluoride contamination in Ranchi borewells requiring community filtration units and municipal pipeline extension.",
    confidence_score: 0.95,
    reasoning: "Critical public health and drinking water supply issue requiring joint intervention by DWSD and university filtration R&D labs.",
    required_expertise: ["Water Engineering", "Chemical Filtration", "Hydrogeology"],
    created_at: "2026-08-20T10:00:00Z",
    updated_at: "2026-08-27T14:30:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80", caption: "Contaminated tube-well water sample" }],
    assignments: [{ organization: { name: "Jharkhand DWSD", type: "GOVERNMENT" }, status: "ACCEPTED" }, { organization: { name: "BIT Mesra Water Lab", type: "UNIVERSITY" }, status: "ACCEPTED" }],
    milestones: [
      { id: "m1", title: "Water Quality & Fluoride Testing", target_date: "2026-09-02", status: "COMPLETED" },
      { id: "m2", title: "Community Defluoridation Filter Installation", target_date: "2026-09-20", status: "IN_PROGRESS" }
    ],
    solutions: [{ id: "s1", title: "Activated Alumina Defluoridation Plant", description: "3-stage solar filtration unit capable of processing 8,000L/day.", cost_estimate: "₹ 3,20,000", implementation_time: "20 Days" }]
  },
  {
    id: "JH-002",
    title: "Damaged Industrial Freight Corridor Road & Severe Potholes",
    description: "The 6km stretch connecting Golmuri to Adityapur Industrial Area in Jamshedpur has suffered severe asphalt breakdown. Heavy truck traffic and monsoon rains have created deep potholes causing frequent freight vehicle accidents and long traffic delays.",
    category: "Urban Infrastructure",
    subcategory: "Roads & Freight Infrastructure",
    severity: 7,
    urgency: 7,
    public_impact: 8,
    location_lat: 22.8046,
    location_lng: 86.2029,
    address: "Golmuri-Adityapur Main Road, Jamshedpur, East Singhbhum, Jharkhand",
    district: "East Singhbhum",
    status: "IMPLEMENTATION",
    recommended_route: "GOVERNMENT",
    citizen_id: "citizen-02",
    ai_summary: "Critical road surface damage on Jamshedpur industrial corridor affecting heavy logistics and commuter safety.",
    confidence_score: 0.91,
    reasoning: "Direct municipal and PWD infrastructure repair required with high-grade polymer asphalt overlay.",
    required_expertise: ["Civil Engineering", "Transportation Planning"],
    created_at: "2026-08-21T11:15:00Z",
    updated_at: "2026-08-27T16:00:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80", caption: "Damaged road stretch" }],
    milestones: [{ id: "m3", title: "Road Base Excavation & Resurfacing", target_date: "2026-09-10", status: "IN_PROGRESS" }]
  },
  {
    id: "JH-003",
    title: "Mine Pit Coal Dust Air Pollution & Respiratory Health Risks",
    description: "Un-curtained coal transportation trucks operating around open-cast mine pits in Jharia, Dhanbad are releasing hazardous PM2.5 and PM10 coal dust particles into nearby residential areas. Over 1,200 residents report chronic respiratory distress.",
    category: "Environment",
    subcategory: "Air Quality & Industrial Emissions",
    severity: 9,
    urgency: 9,
    public_impact: 10,
    location_lat: 23.7957,
    location_lng: 86.4304,
    address: "Jharia Open Cast Mining Belt, Dhanbad, Jharkhand",
    district: "Dhanbad",
    status: "ROUTING_RECOMMENDED",
    recommended_route: "INDUSTRY",
    citizen_id: "citizen-03",
    ai_summary: "Hazardous airborne coal particulate matter in Dhanbad residential zone requiring industrial mist cannons and covered truck enforcement.",
    confidence_score: 0.94,
    reasoning: "Requires Industry equipment innovation (automatic water mist cannons) and State Pollution Control Board enforcement.",
    required_expertise: ["Environmental Engineering", "Air Quality Control", "Industrial Safety"],
    created_at: "2026-08-22T09:30:00Z",
    updated_at: "2026-08-26T12:00:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80", caption: "Coal dust emissions" }]
  },
  {
    id: "JH-004",
    title: "Improper Solid Waste Disposal & Overflowing Jhiri Dump Yard",
    description: "The municipal solid waste dumping ground at Jhiri on the outskirts of Ranchi is overflowing. Lack of automated waste segregation leads to open burning, releasing toxic dioxin fumes and contaminating surrounding groundwater wells.",
    category: "Environment",
    subcategory: "Solid Waste & Recycling",
    severity: 7,
    urgency: 6,
    public_impact: 7,
    location_lat: 23.3800,
    location_lng: 85.2700,
    address: "Jhiri Waste Dump Yard, Ring Road, Ranchi, Jharkhand",
    district: "Ranchi",
    status: "RESEARCH",
    recommended_route: "UNIVERSITY",
    citizen_id: "citizen-04",
    ai_summary: "Municipal solid waste overflow at Jhiri site requiring bio-remediation and automated waste segregation tech.",
    confidence_score: 0.89,
    reasoning: "Ideal for University R&D research on bio-methanation and waste-to-energy pilot systems.",
    required_expertise: ["Environmental Chemistry", "Waste Management Tech"],
    created_at: "2026-08-23T14:20:00Z",
    updated_at: "2026-08-27T10:00:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80", caption: "Overflowing waste site" }]
  },
  {
    id: "JH-005",
    title: "Rural Primary Healthcare Access & Sub-Centre Cold Chain Failure",
    description: "In Mahuadanr block of Latehar district, the primary health sub-centre roof has partially collapsed. The solar-powered vaccine refrigerator has been non-functional for 3 weeks, forcing healthcare workers to travel 40km over unpaved roads to fetch vaccines.",
    category: "Healthcare",
    subcategory: "Rural Primary Healthcare & Cold Chain",
    severity: 9,
    urgency: 9,
    public_impact: 9,
    location_lat: 23.3900,
    location_lng: 84.1100,
    address: "Mahuadanr Primary Health Sub-Centre, Latehar, Jharkhand",
    district: "Latehar",
    status: "REPORTED",
    recommended_route: "GOVERNMENT",
    citizen_id: "citizen-05",
    ai_summary: "Broken vaccine cold storage and collapsed sub-centre infrastructure in Latehar threatening rural child immunization.",
    confidence_score: 0.93,
    reasoning: "Immediate Government Health Department intervention needed for civil roof repairs and solar refrigerator unit replacement.",
    required_expertise: ["Public Health", "Solar Refrigeration", "Healthcare Logistics"],
    created_at: "2026-08-24T08:45:00Z",
    updated_at: "2026-08-24T08:45:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80", caption: "Dilapidated sub-centre roof" }]
  },
  {
    id: "JH-006",
    title: "Dilapidated Primary School Infrastructure & Classroom Roof Leakage",
    description: "Raidih Tribal Primary School in Gumla district has 3 damaged classrooms with leaking roofs during monsoon. 180 tribal students are forced to study in a single overcrowded hallway without proper lighting or sanitation.",
    category: "Education",
    subcategory: "School Infrastructure & Facilities",
    severity: 8,
    urgency: 7,
    public_impact: 8,
    location_lat: 23.0400,
    location_lng: 84.5400,
    address: "Raidih Government Tribal Primary School, Gumla, Jharkhand",
    district: "Gumla",
    status: "ACCEPTED",
    recommended_route: "COLLABORATION",
    citizen_id: "citizen-06",
    ai_summary: "Leaking classroom roofs and severe space shortage at Gumla tribal school impacting 180 students.",
    confidence_score: 0.90,
    reasoning: "Requires Education Department roof renovation combined with Industry CSR infrastructure funding.",
    required_expertise: ["Civil Infrastructure", "School Facility Management"],
    created_at: "2026-08-24T11:00:00Z",
    updated_at: "2026-08-27T15:00:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80", caption: "Damaged classroom building" }]
  },
  {
    id: "JH-007",
    title: "Insufficient Micro-Irrigation & Crop Drying in Paddy Farmland",
    description: "Paddy farmers in Ichak block, Hazaribagh are facing crop failure due to dried up traditional check dams and lack of micro-irrigation systems. Over 200 hectares of agricultural land is dry during post-monsoon dry spells.",
    category: "Agriculture",
    subcategory: "Micro-Irrigation & Soil Conservation",
    severity: 8,
    urgency: 8,
    public_impact: 9,
    location_lat: 24.0300,
    location_lng: 85.4200,
    address: "Ichak Agricultural Block, Hazaribagh, Jharkhand",
    district: "Hazaribagh",
    status: "RESEARCH",
    recommended_route: "UNIVERSITY",
    citizen_id: "citizen-07",
    ai_summary: "Severe irrigation deficit ruining paddy crops in Hazaribagh. Low-cost solar lift irrigation needed.",
    confidence_score: 0.92,
    reasoning: "Assigned to Birsa Agricultural University R&D for low-cost solar lift pumps and soil moisture retention techniques.",
    required_expertise: ["Agronomy", "Solar Micro-Irrigation", "Soil Conservation"],
    created_at: "2026-08-25T09:15:00Z",
    updated_at: "2026-08-27T11:30:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80", caption: "Parched paddy farmland" }]
  },
  {
    id: "JH-008",
    title: "Unreliable Rural Electricity Supply & Low Voltage Triggers",
    description: "14 villages in Mohanpur block of Deoghar district receive less than 4 hours of electricity per day. Frequent voltage drops damage domestic appliances and prevent farmers from running agricultural pump motors.",
    category: "Energy",
    subcategory: "Rural Grid Reliability & Solar Microgrids",
    severity: 7,
    urgency: 6,
    public_impact: 7,
    location_lat: 24.4800,
    location_lng: 86.7000,
    address: "Mohanpur Rural Block, Deoghar, Jharkhand",
    district: "Deoghar",
    status: "REPORTED",
    recommended_route: "GOVERNMENT",
    citizen_id: "citizen-08",
    ai_summary: "Severe voltage instability and power outages in Deoghar rural villages requiring transformer upgrades and solar microgrid installation.",
    confidence_score: 0.88,
    reasoning: "Power distribution company (JBVNL) transformer upgrades needed along with decentralized solar microgrids.",
    required_expertise: ["Electrical Engineering", "Solar Microgrids"],
    created_at: "2026-08-25T13:00:00Z",
    updated_at: "2026-08-25T13:00:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80", caption: "Rural transformer line" }]
  },
  {
    id: "JH-009",
    title: "Lack of Public Bus Transportation & Connectivity for Workers",
    description: "Daily wage industrial workers living in Chas suburb struggle to commute to Bokaro Steel City due to missing public bus routes. Workers rely on overcrowded auto-rickshaws, paying over 25% of their daily income on transport.",
    category: "Urban Infrastructure",
    subcategory: "Public Transit & Commuter Mobility",
    severity: 6,
    urgency: 6,
    public_impact: 7,
    location_lat: 23.6300,
    location_lng: 86.1700,
    address: "Chas-Bokaro Steel City Corridor, Bokaro, Jharkhand",
    district: "Bokaro",
    status: "ACCEPTED",
    recommended_route: "GOVERNMENT",
    citizen_id: "citizen-09",
    ai_summary: "Inadequate affordable public bus transport between Chas and Bokaro Steel City burdening daily workers.",
    confidence_score: 0.87,
    reasoning: "State Transport Department route expansion and electric city bus deployment required.",
    required_expertise: ["Urban Transit Planning", "Fleet Operations"],
    created_at: "2026-08-26T10:30:00Z",
    updated_at: "2026-08-27T09:00:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80", caption: "Commuter transit corridor" }]
  },
  {
    id: "JH-010",
    title: "Monsoon Waterlogging & Clogged Stormwater Drainage",
    description: "Commercial streets in Hindpiri and Upper Bazar areas of Ranchi experience severe waterlogging up to 2 feet during monsoon rains. Clogged brick drains and illegal garbage dumping block rainwater outflow into Harmu River.",
    category: "Urban Infrastructure",
    subcategory: "Stormwater Drainage & Flood Mitigation",
    severity: 8,
    urgency: 8,
    public_impact: 8,
    location_lat: 23.3600,
    location_lng: 85.3200,
    address: "Hindpiri Main Road & Upper Bazar, Ranchi, Jharkhand",
    district: "Ranchi",
    status: "IMPLEMENTATION",
    recommended_route: "GOVERNMENT",
    citizen_id: "citizen-10",
    ai_summary: "Chronic urban flooding and clogged drainage in Ranchi commercial hubs creating health risks and business disruptions.",
    confidence_score: 0.93,
    reasoning: "Ranchi Municipal Corporation (RMC) drainage desilting and culvert reconstruction required.",
    required_expertise: ["Stormwater Drainage", "Urban Hydraulics"],
    created_at: "2026-08-26T14:10:00Z",
    updated_at: "2026-08-27T17:20:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80", caption: "Waterlogged street" }],
    milestones: [{ id: "m4", title: "Drainage Desilting & Culvert Widening", target_date: "2026-09-15", status: "IN_PROGRESS" }]
  },
  {
    id: "JH-011",
    title: "Forest Fires & Wildfire Monitoring in Bano Forest Range",
    description: "Dry leaf litter in Bano forest range, Simdega district experiences seasonal forest fires during spring months, endangering local flora, tribal medicinal plant gathering, and forest wildlife.",
    category: "Environment",
    subcategory: "Forest Conservation & Wildfire Early Warning",
    severity: 8,
    urgency: 7,
    public_impact: 8,
    location_lat: 22.6200,
    location_lng: 84.8800,
    address: "Bano Forest Range, Simdega, Jharkhand",
    district: "Simdega",
    status: "RESEARCH",
    recommended_route: "UNIVERSITY",
    citizen_id: "citizen-11",
    ai_summary: "Recurrent forest fire risks in Simdega requiring IoT thermal sensor monitoring and community firebreak lines.",
    confidence_score: 0.90,
    reasoning: "University forestry & IoT R&D lab assigned to deploy low-cost solar thermal sensors for early wildfire alerts.",
    required_expertise: ["Forest Ecology", "IoT Wireless Sensors", "Environmental Protection"],
    created_at: "2026-08-27T08:00:00Z",
    updated_at: "2026-08-27T12:45:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80", caption: "Forest landscape" }]
  },
  {
    id: "JH-012",
    title: "Remote Tribal Community Center & Digital Ration Service Access",
    description: "Inhabitants of Manoharpur forest block in West Singhbhum must walk 18km through dense forest to access the nearest PDS ration shop. Biometric internet connectivity fails frequently, causing denial of monthly food grain allocations.",
    category: "Public Administration",
    subcategory: "Tribal Welfare & Digital Service Delivery",
    severity: 7,
    urgency: 7,
    public_impact: 8,
    location_lat: 22.3800,
    location_lng: 85.2000,
    address: "Manoharpur Forest Block, West Singhbhum, Jharkhand",
    district: "West Singhbhum",
    status: "ACCEPTED",
    recommended_route: "COLLABORATION",
    citizen_id: "citizen-12",
    ai_summary: "Biometric PDS connectivity failures in remote West Singhbhum forest villages causing ration distribution delays.",
    confidence_score: 0.89,
    reasoning: "Requires Offline-first biometric sync POS terminals & local satellite internet antenna deployment.",
    required_expertise: ["Public Administration", "Telecom Infrastructure", "E-Governance"],
    created_at: "2026-08-27T09:30:00Z",
    updated_at: "2026-08-27T16:15:00Z",
    images: [{ image_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80", caption: "Tribal community hamlet" }]
  }
];

export function getDemoProblems(): ProblemData[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('samadhan_local_problems');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
  }
  return INITIAL_DEMO_PROBLEMS;
}

export function getDemoProblemById(id: string): ProblemData | undefined {
  const problems = getDemoProblems();
  return problems.find(p => p.id === id || p.id.toLowerCase() === id.toLowerCase());
}

export function addDemoProblem(newProblem: Omit<ProblemData, 'id' | 'created_at' | 'updated_at'>): ProblemData {
  const problems = getDemoProblems();
  const nextNum = problems.length + 1;
  const formattedId = `JH-${String(nextNum).padStart(3, '0')}`;
  
  const created: ProblemData = {
    ...newProblem,
    id: formattedId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updatedList = [created, ...problems];
  if (typeof window !== 'undefined') {
    localStorage.setItem('samadhan_local_problems', JSON.stringify(updatedList));
  }
  return created;
}
