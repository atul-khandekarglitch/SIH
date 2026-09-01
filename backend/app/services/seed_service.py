import json
import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import User, Organization, Problem, ProblemImage, ProblemStatusHistory, ProblemEmbedding, ProblemAssignment, Solution, Milestone, Feedback
from app.ai.embedding_service import generate_local_embedding

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8')[:72], salt).decode('utf-8')

async def seed_demo_data(db: AsyncSession):
    """Populates initial realistic demo data for Jharkhand SIH Portal if database is empty."""
    res = await db.execute(select(User).limit(1))
    if res.scalars().first():
        return {"message": "Database already contains seed data"}

    print("[Seed Service] Seeding Jharkhand SIH demo data...")

    # 1. Create Organizations
    org_dwsd = Organization(
        name="Jharkhand Drinking Water & Sanitation Dept (DWSD)",
        type="GOVERNMENT",
        district="Ranchi",
        expertise=["Water Engineering", "Groundwater Hydrogeology", "Public Health"],
        contact_email="dwsd.jharkhand@gov.in",
        website="https://dwsd.jharkhand.gov.in"
    )
    org_bau = Organization(
        name="Birsa Agricultural University (BAU)",
        type="UNIVERSITY",
        district="Ranchi",
        expertise=["Agronomy", "Soil Science", "Micro-Irrigation", "Crop Protection"],
        contact_email="research@bau.ac.in",
        website="https://bau.ac.in"
    )
    org_bit = Organization(
        name="BIT Mesra Water & Environment Research Lab",
        type="UNIVERSITY",
        district="Ranchi",
        expertise=["Environmental Chemistry", "IoT Water Sensors", "Filtration Tech"],
        contact_email="env.lab@bitmesra.ac.in",
        website="https://bitmesra.ac.in"
    )
    org_tata = Organization(
        name="Tata Cleantech & Social Innovation Foundation",
        type="INDUSTRY",
        district="East Singhbhum",
        expertise=["Industrial Filtration", "Solar Pumping", "CSR Infrastructure"],
        contact_email="csr@tatacleantech.com",
        website="https://tatacleantech.com"
    )
    
    db.add_all([org_dwsd, org_bau, org_bit, org_tata])
    await db.flush()

    # 2. Create Users
    password_hash = hash_password("password123")
    
    user_citizen = User(
        email="citizen@jharkhand.gov.in",
        password_hash=password_hash,
        full_name="Ramesh Munda",
        role="CITIZEN",
        district="Ranchi",
        phone="9876543210"
    )
    user_govt = User(
        email="govt@jharkhand.gov.in",
        password_hash=password_hash,
        full_name="Officer Suresh Sharma (DWSD)",
        role="GOVERNMENT",
        organization_id=org_dwsd.id,
        district="Ranchi",
        phone="9876543211"
    )
    user_uni = User(
        email="university@jharkhand.gov.in",
        password_hash=password_hash,
        full_name="Prof. Ananya Roy (BIT Mesra)",
        role="UNIVERSITY",
        organization_id=org_bit.id,
        district="Ranchi",
        phone="9876543212"
    )
    user_ind = User(
        email="industry@jharkhand.gov.in",
        password_hash=password_hash,
        full_name="Vikram Singh (Tata Cleantech)",
        role="INDUSTRY",
        organization_id=org_tata.id,
        district="East Singhbhum",
        phone="9876543213"
    )
    user_admin = User(
        email="admin@jharkhand.gov.in",
        password_hash=password_hash,
        full_name="Admin Jharkhand State Innovation Board",
        role="ADMIN",
        district="Ranchi",
        phone="9876543214"
    )

    db.add_all([user_citizen, user_govt, user_uni, user_ind, user_admin])
    await db.flush()

    # 3. Create Problems
    p1 = Problem(
        title="High Fluoride Contamination in Village Borewells in Palamu",
        description="Over 400 households in Daltonganj, Palamu district are suffering from severe fluoride contamination in underground tube-well water. Children are showing signs of dental and skeletal fluorosis. The existing handpumps yield acidic and yellow-tainted water.",
        category="Water",
        subcategory="Groundwater Contamination",
        severity=9,
        urgency=9,
        public_impact=10,
        location_lat=24.0371,
        location_lng=84.0722,
        address="Village Chainpur, Daltonganj Block, Palamu, Jharkhand",
        district="Palamu",
        additional_info="Testing kit showed 4.5 ppm fluoride levels, which is far beyond permissible BIS limit of 1.0 ppm.",
        status="ACCEPTED",
        recommended_route="COLLABORATION",
        citizen_id=user_citizen.id,
        ai_summary="Severe fluoride contamination in Palamu borewell water causing fluorosis among children. Immediate clean drinking water and chemical filtration intervention required.",
        confidence_score=0.96,
        reasoning="Critical public health emergency requiring combined government pipeline infrastructure and university filter research.",
        required_expertise=["Water Engineering", "Hydrogeology", "Chemical Filtration"]
    )

    p2 = Problem(
        title="Agricultural Irrigation Failure & Soil Drying in East Singhbhum",
        description="Paddy farmers in Ghatshila block are facing complete crop loss due to drying irrigation canals and lack of solar-powered water lifting systems during dry monsoon spells. Over 150 hectares of farmland is affected.",
        category="Agriculture",
        subcategory="Micro-Irrigation & Drought Mitigation",
        severity=8,
        urgency=8,
        public_impact=9,
        location_lat=22.5800,
        location_lng=86.4800,
        address="Ghatshila Block, East Singhbhum, Jharkhand",
        district="East Singhbhum",
        status="RESEARCH",
        recommended_route="UNIVERSITY",
        citizen_id=user_citizen.id,
        ai_summary="Drought-like conditions and dry irrigation canals ruining paddy crops in Ghatshila. Sustainable solar lift irrigation required.",
        confidence_score=0.91,
        reasoning="Suitable for University research on low-cost solar lift irrigation & soil moisture retention techniques.",
        required_expertise=["Agronomy", "Solar Irrigation", "Soil Conservation"]
    )

    p3 = Problem(
        title="Coal Dust Pollution and Respiratory Issues Near Open Cast Mines in Dhanbad",
        description="Heavy coal dust emissions from un-curtained coal transport trucks in Jharia are polluting local air and domestic water sources. School children and elder residents report chronic bronchitis.",
        category="Environment",
        subcategory="Air & Airborne Particulate Pollution",
        severity=9,
        urgency=8,
        public_impact=10,
        location_lat=23.7957,
        location_lng=86.4304,
        address="Jharia Main Road, Dhanbad, Jharkhand",
        district="Dhanbad",
        status="ROUTING_RECOMMENDED",
        recommended_route="INDUSTRY",
        citizen_id=user_citizen.id,
        ai_summary="Hazardous particulate dust from coal mining transport in Jharia causing widespread respiratory issues.",
        confidence_score=0.94,
        reasoning="Requires Industry equipment solutions (mist cannons, covered conveyors) and pollution board enforcement.",
        required_expertise=["Environmental Engineering", "Air Filtration", "Industrial Safety"]
    )

    p4 = Problem(
        title="Broken Sub-centre Building and Lack of Cold Chain for Vaccines in Khunti",
        description="The primary health sub-centre building roof in Torpa block has collapsed partially. Solar refrigerator for childhood vaccines is non-functional, forcing health workers to travel 35km for daily vaccine supplies.",
        category="Healthcare",
        subcategory="Rural Cold-Chain & Health Facilities",
        severity=8,
        urgency=9,
        public_impact=8,
        location_lat=22.9833,
        location_lng=85.2833,
        address="Torpa Health Sub-centre, Khunti, Jharkhand",
        district="Khunti",
        status="REPORTED",
        recommended_route="GOVERNMENT",
        citizen_id=user_citizen.id,
        ai_summary="Collapsed roof and broken vaccine solar refrigerator at Torpa health sub-centre compromising vaccination drives.",
        confidence_score=0.89,
        reasoning="Direct government health department repair and cold chain replacement needed.",
        required_expertise=["Civil Infrastructure", "Solar Refrigeration", "Healthcare Logistics"]
    )

    db.add_all([p1, p2, p3, p4])
    await db.flush()

    # Images
    db.add_all([
        ProblemImage(problem_id=p1.id, image_url="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80", caption="Borewell water sample"),
        ProblemImage(problem_id=p2.id, image_url="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80", caption="Parched paddy farmland"),
        ProblemImage(problem_id=p3.id, image_url="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80", caption="Coal dust emissions")
    ])

    # Embeddings
    for p in [p1, p2, p3, p4]:
        text = f"{p.title} {p.description} {p.category} {p.district}"
        v = generate_local_embedding(text)
        db.add(ProblemEmbedding(problem_id=p.id, embedding_json=v))

    # Assignments
    db.add_all([
        ProblemAssignment(problem_id=p1.id, organization_id=org_dwsd.id, status="ACCEPTED", notes="Govt DWSD accepted primary pipeline supply plan"),
        ProblemAssignment(problem_id=p1.id, organization_id=org_bit.id, status="ACCEPTED", notes="BIT Mesra testing community activated carbon filtration"),
        ProblemAssignment(problem_id=p2.id, organization_id=org_bau.id, status="ACCEPTED", notes="BAU agronomy team deployed field study")
    ])

    # Milestones for P1
    db.add_all([
        Milestone(problem_id=p1.id, organization_id=org_dwsd.id, title="Water Quality Testing & Chemical Profiling", description="BIT Mesra & DWSD joint sample collection", target_date="2026-09-05", status="COMPLETED"),
        Milestone(problem_id=p1.id, organization_id=org_bit.id, title="Community Defluoridation Filter Prototype", description="Deploying low-cost activated alumina filter units", target_date="2026-09-15", status="IN_PROGRESS"),
        Milestone(problem_id=p1.id, organization_id=org_tata.id, title="Solar Water Pumping Station Construction", description="Installation of 5000L/hr solar filtration plant", target_date="2026-10-01", status="PENDING")
    ])

    # Solutions for P1
    db.add(Solution(
        problem_id=p1.id,
        title="Community Solar-Powered Activated Alumina Defluoridation Plant",
        description="Integrated 3-stage filtration system combining activated alumina for fluoride absorption, UV disinfection, and solar pumping. Capable of delivering 10,000 liters of safe drinking water per day.",
        created_by_org_id=org_bit.id,
        solution_type="PILOT",
        cost_estimate="₹ 3,50,000",
        implementation_time="21 Days"
    ))

    # Status Histories
    for p in [p1, p2, p3, p4]:
        db.add(ProblemStatusHistory(
            problem_id=p.id,
            from_status=None,
            to_status="REPORTED",
            notes="Initial submission by citizen Ramesh Munda"
        ))
        db.add(ProblemStatusHistory(
            problem_id=p.id,
            from_status="REPORTED",
            to_status="ROUTING_RECOMMENDED",
            notes=f"AI pipeline completed. Suggested route: {p.recommended_route}"
        ))

    db.add(ProblemStatusHistory(
        problem_id=p1.id,
        from_status="ROUTING_RECOMMENDED",
        to_status="ACCEPTED",
        notes="Admin approved multi-stakeholder collaboration between DWSD, BIT Mesra, and Tata Cleantech."
    ))

    await db.commit()
    print("[Seed Service] Jharkhand SIH demo data seeded successfully!")
    return {"message": "Demo data seeded successfully"}
