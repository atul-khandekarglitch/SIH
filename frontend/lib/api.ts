import { getDemoProblems, getDemoProblemById, addDemoProblem, ProblemData } from './demoData';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('samadhan_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: 'API Error' }));
      throw new Error(errData.detail || `HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn(`[API Fallback Mode] Endpoint: ${endpoint} -> Using shared local demo dataset`);
    return handleLocalFallback(endpoint, options);
  }
}

function handleLocalFallback(endpoint: string, options: RequestInit = {}) {
  const cleanEndpoint = endpoint.split('?')[0];

  // Auth Fallbacks
  if (cleanEndpoint.endsWith('/auth/login') || cleanEndpoint.endsWith('/auth/register')) {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const role = body.role || 'CITIZEN';
    const email = body.email || 'citizen@jharkhand.gov.in';
    const user = {
      id: 'demo-user-id',
      email,
      full_name: body.full_name || 'Ramesh Munda',
      role: role.toUpperCase(),
      district: body.district || 'Ranchi',
      created_at: new Date().toISOString()
    };
    return { access_token: 'demo-jwt-token', token_type: 'bearer', user };
  }

  if (cleanEndpoint.endsWith('/auth/me')) {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('samadhan_user') : null;
    return stored ? JSON.parse(stored) : {
      id: 'demo-user-id',
      email: 'citizen@jharkhand.gov.in',
      full_name: 'Ramesh Munda',
      role: 'CITIZEN',
      district: 'Ranchi',
      created_at: new Date().toISOString()
    };
  }

  // Single problem detail by ID
  const detailMatch = endpoint.match(/\/problems\/([A-Za-z0-9-]+)$/);
  if (detailMatch) {
    const problemId = detailMatch[1];
    const problem = getDemoProblemById(problemId);
    if (problem) return problem;
    const all = getDemoProblems();
    return all[0];
  }

  // Similar problems
  if (endpoint.includes('/similar')) {
    const all = getDemoProblems();
    return [
      { id: all[1]?.id || 'JH-002', title: all[1]?.title || 'Road Potholes', category: all[1]?.category || 'Urban Infrastructure', district: all[1]?.district || 'East Singhbhum', similarity_score: 76.5, is_possible_duplicate: true, status: all[1]?.status || 'ACCEPTED', created_at: all[1]?.created_at },
      { id: all[3]?.id || 'JH-004', title: all[3]?.title || 'Solid Waste Site', category: all[3]?.category || 'Environment', district: all[3]?.district || 'Ranchi', similarity_score: 54.2, is_possible_duplicate: false, status: all[3]?.status || 'RESEARCH', created_at: all[3]?.created_at }
    ];
  }

  // Map markers
  if (cleanEndpoint.endsWith('/map/markers')) {
    const problems = getDemoProblems();
    return problems.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      subcategory: p.subcategory,
      severity: p.severity,
      urgency: p.urgency,
      public_impact: p.public_impact,
      district: p.district,
      address: p.address,
      status: p.status,
      lat: p.location_lat,
      lng: p.location_lng,
      ai_summary: p.ai_summary,
      created_at: p.created_at
    }));
  }

  // Dashboard Stats Analytics
  if (cleanEndpoint.endsWith('/analytics/dashboard-stats')) {
    const problems = getDemoProblems();
    return {
      total_problems: problems.length,
      pending_validation: problems.filter(p => p.status === 'ROUTING_RECOMMENDED' || p.status === 'REPORTED').length,
      high_priority: problems.filter(p => p.severity >= 8).length,
      resolved_problems: problems.filter(p => p.status === 'RESOLVED').length,
      category_counts: problems.reduce((acc: any, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {}),
      district_counts: problems.reduce((acc: any, p) => { acc[p.district] = (acc[p.district] || 0) + 1; return acc; }, {}),
      status_counts: problems.reduce((acc: any, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {}),
      university_involvement: 4,
      industry_involvement: 3,
      government_involvement: 5
    };
  }

  // Admin validations queue
  if (cleanEndpoint.endsWith('/admin/validations')) {
    const problems = getDemoProblems();
    return problems.filter(p => p.status === 'ROUTING_RECOMMENDED' || p.status === 'REPORTED');
  }

  // Organization / Dashboard assigned problems
  if (cleanEndpoint.endsWith('/solutions/organization-assigned') || cleanEndpoint.endsWith('/problems/my')) {
    return getDemoProblems();
  }

  // Create new problem
  if (cleanEndpoint.endsWith('/problems') && options.method === 'POST') {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const created = addDemoProblem({
      title: body.title || 'New Societal Problem',
      description: body.description || 'Detailed description of the issue...',
      category: body.category || 'Water',
      subcategory: body.subcategory || 'Groundwater',
      severity: 7,
      urgency: 7,
      public_impact: 8,
      location_lat: body.location_lat || 23.3441,
      location_lng: body.location_lng || 85.3096,
      address: body.address || `${body.district || 'Ranchi'}, Jharkhand`,
      district: body.district || 'Ranchi',
      status: 'ROUTING_RECOMMENDED',
      recommended_route: 'COLLABORATION',
      citizen_id: 'citizen-01',
      ai_summary: `AI analyzed report for ${body.title}. Category classified as ${body.category}.`,
      confidence_score: 0.94,
      reasoning: 'Automated analysis identified critical local infrastructure needs.',
      required_expertise: ['Domain Engineering', 'Public Policy'],
      images: body.images?.map((url: string) => ({ image_url: url })) || []
    });
    return created;
  }

  // Default problems list
  if (cleanEndpoint.endsWith('/problems') || cleanEndpoint.endsWith('/problems/')) {
    return getDemoProblems();
  }

  // Fallback default message
  return { message: "Operation completed successfully in demo mode", status: "SUCCESS" };
}
