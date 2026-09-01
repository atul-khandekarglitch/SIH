import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="CITIZEN")  # CITIZEN, GOVERNMENT, UNIVERSITY, INDUSTRY, ADMIN
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    phone = Column(String(20), nullable=True)
    district = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="members")
    problems = relationship("Problem", back_populates="citizen")
    notifications = relationship("Notification", back_populates="user")

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # GOVERNMENT, UNIVERSITY, INDUSTRY
    district = Column(String(100), nullable=True)
    expertise = Column(JSON, nullable=True)  # List of strings e.g. ["Water Engineering", "Civil"]
    contact_email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("User", back_populates="organization")
    assignments = relationship("ProblemAssignment", back_populates="organization")
    solutions = relationship("Solution", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    role = Column(String(50), default="MEMBER")
    created_at = Column(DateTime, default=datetime.utcnow)

class Problem(Base):
    __tablename__ = "problems"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100), nullable=True)
    severity = Column(Integer, default=5)  # 1 to 10
    urgency = Column(Integer, default=5)   # 1 to 10
    public_impact = Column(Integer, default=5) # 1 to 10
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    address = Column(String(500), nullable=True)
    district = Column(String(100), nullable=False, default="Ranchi")
    additional_info = Column(Text, nullable=True)
    
    status = Column(String(50), nullable=False, default="REPORTED")
    # REPORTED, AI_PROCESSING, AI_ANALYZED, ROUTING_RECOMMENDED, PENDING_VALIDATION, ASSIGNED, ACCEPTED, RESEARCH, FEASIBILITY, SOLUTION_PROPOSED, FUNDING, PILOT, IMPLEMENTATION, VERIFICATION, RESOLVED, CLOSED
    
    recommended_route = Column(String(50), nullable=True)  # GOVERNMENT, UNIVERSITY, INDUSTRY, COLLABORATION, EMERGENCY
    citizen_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    ai_summary = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    reasoning = Column(Text, nullable=True)
    required_expertise = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    citizen = relationship("User", back_populates="problems")
    images = relationship("ProblemImage", back_populates="problem", cascade="all, delete-orphan")
    assignments = relationship("ProblemAssignment", back_populates="problem", cascade="all, delete-orphan")
    status_history = relationship("ProblemStatusHistory", back_populates="problem", cascade="all, delete-orphan")
    solutions = relationship("Solution", back_populates="problem", cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="problem", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="problem", cascade="all, delete-orphan")

class ProblemImage(Base):
    __tablename__ = "problem_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    problem = relationship("Problem", back_populates="images")

class ProblemAssignment(Base):
    __tablename__ = "problem_assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    status = Column(String(50), default="ASSIGNED") # ASSIGNED, ACCEPTED, DECLINED
    assigned_at = Column(DateTime, default=datetime.utcnow)
    accepted_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

    problem = relationship("Problem", back_populates="assignments")
    organization = relationship("Organization", back_populates="assignments")

class ProblemStatusHistory(Base):
    __tablename__ = "problem_status_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    from_status = Column(String(50), nullable=True)
    to_status = Column(String(50), nullable=False)
    changed_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    problem = relationship("Problem", back_populates="status_history")

class ProblemEmbedding(Base):
    __tablename__ = "problem_embeddings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False, unique=True)
    embedding_json = Column(JSON, nullable=False) # List of floats representing vector embedding
    created_at = Column(DateTime, default=datetime.utcnow)

class Solution(Base):
    __tablename__ = "solutions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    created_by_org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    solution_type = Column(String(50), default="PROPOSED") # PROPOSED, PILOT, FINAL
    cost_estimate = Column(String(100), nullable=True)
    implementation_time = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    problem = relationship("Problem", back_populates="solutions")
    organization = relationship("Organization", back_populates="solutions")

class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    university_org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    title = Column(String(255), nullable=False)
    scope = Column(Text, nullable=False)
    faculty_mentor = Column(String(255), nullable=True)
    student_team = Column(JSON, nullable=True) # list of student names / roles
    prototype_url = Column(String(500), nullable=True)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

class FeasibilityAssessment(Base):
    __tablename__ = "feasibility_assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    industry_org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    technical_feasibility = Column(Text, nullable=False)
    economic_feasibility = Column(Text, nullable=False)
    estimated_cost = Column(String(100), nullable=True)
    estimated_timeline = Column(String(100), nullable=True)
    mentorship_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    government_org_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    university_org_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    industry_org_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    status = Column(String(50), default="ACTIVE")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_date = Column(String(50), nullable=True)
    status = Column(String(50), default="PENDING") # PENDING, IN_PROGRESS, COMPLETED, DELAYED
    completed_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    problem = relationship("Problem", back_populates="milestones")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    citizen_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False) # 1 to 5
    comments = Column(Text, nullable=True)
    is_satisfied = Column(Boolean, default=True)
    requested_reopen = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    problem = relationship("Problem", back_populates="feedback")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")
    read = Column(Boolean, default=False)
    link = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(36), nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
