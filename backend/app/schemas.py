from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime

# --- AUTH SCHEMAS ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "CITIZEN" # CITIZEN, GOVERNMENT, UNIVERSITY, INDUSTRY, ADMIN
    organization_name: Optional[str] = None
    district: Optional[str] = "Ranchi"
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    organization_id: Optional[str] = None
    district: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- ORGANIZATION SCHEMAS ---
class OrganizationResponse(BaseModel):
    id: str
    name: str
    type: str
    district: Optional[str] = None
    expertise: Optional[List[str]] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None

    class Config:
        from_attributes = True

# --- PROBLEM SCHEMAS ---
class ProblemCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=20)
    category: str
    subcategory: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    address: Optional[str] = None
    district: str = "Ranchi"
    additional_info: Optional[str] = None
    images: Optional[List[str]] = []

class AIAnalysisResult(BaseModel):
    summary: str
    category: str
    subcategory: Optional[str] = None
    severity_score: int = Field(..., ge=1, le=10)
    urgency_score: int = Field(..., ge=1, le=10)
    public_impact_score: int = Field(..., ge=1, le=10)
    required_expertise: List[str]
    recommended_route: str # GOVERNMENT, UNIVERSITY, INDUSTRY, COLLABORATION, EMERGENCY
    confidence_score: float
    reasoning: str

class SimilarProblemResponse(BaseModel):
    id: str
    title: str
    category: str
    district: str
    similarity_score: float
    status: str
    created_at: datetime

class ProblemValidateRequest(BaseModel):
    route: str # GOVERNMENT, UNIVERSITY, INDUSTRY, COLLABORATION
    assigned_org_ids: List[str] = []
    notes: Optional[str] = None

class ProblemStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class ProblemResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    subcategory: Optional[str] = None
    severity: int
    urgency: int
    public_impact: int
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    address: Optional[str] = None
    district: str
    additional_info: Optional[str] = None
    status: str
    recommended_route: Optional[str] = None
    citizen_id: str
    ai_summary: Optional[str] = None
    confidence_score: Optional[float] = None
    reasoning: Optional[str] = None
    required_expertise: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime
    images: List[Any] = []
    assignments: List[Any] = []
    milestones: List[Any] = []
    solutions: List[Any] = []

    class Config:
        from_attributes = True

# --- SOLUTION & RESEARCH SCHEMAS ---
class SolutionCreate(BaseModel):
    title: str
    description: str
    solution_type: str = "PROPOSED" # PROPOSED, PILOT, FINAL
    cost_estimate: Optional[str] = None
    implementation_time: Optional[str] = None

class ResearchProjectCreate(BaseModel):
    title: str
    scope: str
    faculty_mentor: Optional[str] = None
    student_team: Optional[List[str]] = []
    prototype_url: Optional[str] = None

class FeasibilityAssessmentCreate(BaseModel):
    technical_feasibility: str
    economic_feasibility: str
    estimated_cost: Optional[str] = None
    estimated_timeline: Optional[str] = None
    mentorship_details: Optional[str] = None

# --- MILESTONE SCHEMAS ---
class MilestoneCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_date: Optional[str] = None

class MilestoneUpdate(BaseModel):
    status: str # PENDING, IN_PROGRESS, COMPLETED, DELAYED
    completed_date: Optional[datetime] = None

# --- FEEDBACK SCHEMAS ---
class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comments: Optional[str] = None
    is_satisfied: bool = True
    requested_reopen: bool = False

# --- NOTIFICATION SCHEMAS ---
class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str
    read: bool
    link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
