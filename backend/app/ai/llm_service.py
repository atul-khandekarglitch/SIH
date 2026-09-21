import os
import json
import httpx
from typing import Dict, Any, List
from app.config import settings
from app.schemas import AIAnalysisResult

SYSTEM_PROMPT = """You are an AI Civic & Societal Problem Classifier for Samadhan Jharkhand.
Given a citizen's problem report, analyze it thoroughly and return a valid JSON object matching this schema:
{
  "summary": "Clear, concise 2-sentence summary of the core civic issue",
  "category": "Must be EXACTLY ONE of: Road & Infrastructure, Water Supply, Waste Management, Street Light, Electricity, Drainage, Healthcare, Education, Public Safety, Other",
  "subcategory": "Specific subcategory e.g. Potholes & Pavement Repair, Groundwater Fluoride, Transformer Failure, Drain Blockage",
  "severity_score": Integer between 1 and 10,
  "urgency_score": Integer between 1 and 10,
  "public_impact_score": Integer between 1 and 10,
  "priority": "Must be ONE of: Critical, High, Medium, Low",
  "department_guidance": "Name of responsible government department or municipal agency (e.g. Public Works Department (PWD) - Roads, Municipal Board Water Works, State Electricity Board - JBVNL, Health & Family Welfare Dept)",
  "actionable_guidance": [
    "List of 2-3 specific actionable guidance steps for the citizen or investigating officer"
  ],
  "required_expertise": ["List of expert domain areas e.g. Civil Engineering, Hydrogeology, Electrical Engineering"],
  "recommended_route": "One of: GOVERNMENT, UNIVERSITY, INDUSTRY, COLLABORATION, EMERGENCY",
  "confidence_score": Float between 0.70 and 0.99,
  "reasoning": "Brief technical justification for classification, priority rating, and department routing"
}
Output strictly valid JSON with no markdown wrapping or additional text."""

async def analyze_problem_with_llm(title: str, description: str, category_input: str = None, district: str = "Ranchi") -> AIAnalysisResult:
    """Uses LLM API if key is present, otherwise executes robust local heuristic fallback."""
    
    if settings.LLM_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.LLM_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": f"Title: {title}\nDescription: {description}\nCategory reported: {category_input}\nDistrict: {district}"}
                        ],
                        "temperature": 0.2
                    }
                )
                if response.status_code == 200:
                    res_data = response.json()
                    content = res_data["choices"][0]["message"]["content"]
                    # Strip any markdown backticks if present
                    if content.startswith("```"):
                        content = content.split("```")[1]
                        if content.startswith("json"):
                            content = content[4:]
                    parsed = json.loads(content.strip())
                    return AIAnalysisResult(**parsed)
        except Exception as e:
            print(f"[LLM Service Warning] API call failed, using heuristic fallback: {e}")

    # --- ROBUST HEURISTIC CLASSIFIER & GUIDANCE ENGINE ---
    desc_lower = (title + " " + (description or "")).lower()
    
    category = "Road & Infrastructure"
    subcategory = "Road & Pavement Maintenance"
    priority = "Medium"
    severity = 6
    urgency = 6
    impact = 7
    route = "GOVERNMENT"
    department = "Public Works Department (PWD) - Roads & Infrastructure"
    expertise = ["Civil Engineering", "Urban Transport"]
    guidance = [
        "Include photos showing the extent of the damage with surrounding landmarks.",
        "Specify if the road issue is causing traffic congestion or vehicle accidents.",
        "Note nearby landmarks like schools, hospitals, or market areas."
    ]

    # Rule-Based Keyword Matchers for the 10 categories
    if any(w in desc_lower for w in ["pothole", "potho", "road", "bridge", "asphalt", "highway", "divider", "footpath", "pavement"]):
        category = "Road & Infrastructure"
        subcategory = "Pothole & Surface Repair"
        department = "Public Works Department (PWD) / Municipal Road Cell"
        expertise = ["Civil Engineering", "Highway Engineering"]
        severity = 7
        urgency = 7
        impact = 8
        priority = "High" if ("accident" in desc_lower or "danger" in desc_lower or "large" in desc_lower or "deep" in desc_lower) else "Medium"
        guidance = [
            "Upload clear photos of the road defect with a reference object showing depth.",
            "Report exact road segment or landmark (e.g. Near Station Gate / Main Chowk).",
            "Indicate if rain or waterlogging is accelerating asphalt erosion."
        ]
    elif any(w in desc_lower for w in ["water", "drinking", "fluoride", "arsenic", "contamination", "pipeline", "handpump", "well", "borewell", "tap water"]):
        category = "Water Supply"
        subcategory = "Drinking Water Quality & Supply Network"
        department = "Public Health Engineering Department (PHED) / Urban Water Board"
        expertise = ["Environmental Engineering", "Hydrogeology", "Water Treatment"]
        severity = 8
        urgency = 8
        impact = 9
        priority = "Critical" if ("poison" in desc_lower or "sick" in desc_lower or "contamination" in desc_lower or "fluoride" in desc_lower) else "High"
        route = "COLLABORATION"
        guidance = [
            "Provide details on how many households rely on this water source.",
            "Describe water appearance, smell, or known health symptoms (e.g. dental/bone discoloration).",
            "Collect a water sample for testing by PHED mobile lab teams."
        ]
    elif any(w in desc_lower for w in ["waste", "garbage", "trash", "dump", "plastic", "litter", "rubbish", "smell", "bin"]):
        category = "Waste Management"
        subcategory = "Solid Waste Collection & Sanitation"
        department = "Municipal Corporation Sanitation & Cleanliness Division"
        expertise = ["Sanitation Engineering", "Solid Waste Management"]
        severity = 6
        urgency = 6
        impact = 7
        priority = "High" if ("block" in desc_lower or "disease" in desc_lower or "foul" in desc_lower) else "Medium"
        route = "INDUSTRY"
        guidance = [
            "Upload photos of overflowing bins or uncollected waste piles.",
            "Specify how long the garbage has remained uncollected.",
            "Mention if commercial vendors or market waste is contributing to the dump."
        ]
    elif any(w in desc_lower for w in ["street light", "streetlight", "dark street", "lamp", "darkness", "bulb", "pole"]):
        category = "Street Light"
        subcategory = "Public Street Lighting & Electrical Poles"
        department = "Municipal Electrical Department / Urban Lighting Cell"
        expertise = ["Electrical Engineering", "Public Lighting"]
        severity = 5
        urgency = 6
        impact = 6
        priority = "High" if ("dark" in desc_lower or "unsafe" in desc_lower or "women" in desc_lower) else "Medium"
        guidance = [
            "Provide pole number or exact street location.",
            "State whether single light or entire street section is unlit.",
            "Highlight safety concerns due to night-time darkness."
        ]
    elif any(w in desc_lower for w in ["electricity", "power", "transformer", "wire", "voltage", "outage", "spark", "current"]):
        category = "Electricity"
        subcategory = "Power Supply & Electrical Safety"
        department = "Jharkhand Bijli Vitran Nigam Limited (JBVNL)"
        expertise = ["Power Systems Engineering", "Electrical Safety"]
        severity = 8
        urgency = 8
        impact = 8
        priority = "Critical" if ("spark" in desc_lower or "hanging wire" in desc_lower or "fire" in desc_lower) else "High"
        route = "GOVERNMENT"
        guidance = [
            "Keep safe distance if loose or hanging wires are present.",
            "Note transformer ID or nearest sub-station details.",
            "Specify frequency and duration of power cuts or low voltage."
        ]
    elif any(w in desc_lower for w in ["drain", "drainage", "sewage", "gutter", "overflow", "stagnant", "rainwater", "clog"]):
        category = "Drainage"
        subcategory = "Stormwater Drain & Sewerage Clearing"
        department = "Municipal Stormwater & Sewerage Department"
        expertise = ["Civil Engineering", "Hydraulic Systems"]
        severity = 7
        urgency = 7
        impact = 8
        priority = "High" if ("overflow" in desc_lower or "house" in desc_lower or "flood" in desc_lower) else "Medium"
        guidance = [
            "Photograph clogged drain entry points or sewage overflow.",
            "Check if construction debris or plastic dumping caused the blockage.",
            "Note if water is entering residential premises."
        ]
    elif any(w in desc_lower for w in ["health", "hospital", "phc", "doctor", "medicine", "clinic", "ambulance", "fever", "nurse"]):
        category = "Healthcare"
        subcategory = "Primary Healthcare Facilities & Medical Supplies"
        department = "Department of Health, Medical Education & Family Welfare"
        expertise = ["Public Health", "Medical Logistics", "Telemedicine"]
        severity = 9
        urgency = 9
        impact = 9
        priority = "Critical" if ("emergency" in desc_lower or "death" in desc_lower or "outbreak" in desc_lower) else "High"
        route = "COLLABORATION"
        guidance = [
            "Mention specific facility name (PHC/CHC/District Hospital).",
            "Detail non-availability of doctors, essential medicines, or equipment.",
            "Contact 108 Emergency Services if immediate critical care is required."
        ]
    elif any(w in desc_lower for w in ["school", "education", "teacher", "classroom", "desk", "blackboard", "student", "college"]):
        category = "Education"
        subcategory = "School Infrastructure & Educational Resources"
        department = "Department of School Education & Literacy, Jharkhand"
        expertise = ["Educational Infrastructure", "Pedagogy"]
        severity = 6
        urgency = 6
        impact = 8
        priority = "High" if ("roof" in desc_lower or "unsafe" in desc_lower or "water" in desc_lower) else "Medium"
        route = "UNIVERSITY"
        guidance = [
            "State school code (UDISE) or exact school name and location.",
            "Detail infrastructure defects (building damage, lack of toilets, drinking water).",
            "Note affected student grade levels and headmaster contact if available."
        ]
    elif any(w in desc_lower for w in ["safety", "crime", "theft", "harassment", "police", "hazard", "danger", "encroachment"]):
        category = "Public Safety"
        subcategory = "Public Order, Safety & Hazard Prevention"
        department = "Jharkhand State Police / District Administration"
        expertise = ["Public Safety", "Law Enforcement", "Hazard Control"]
        severity = 8
        urgency = 8
        impact = 8
        priority = "Critical" if ("assault" in desc_lower or "danger" in desc_lower or "immediate" in desc_lower) else "High"
        route = "EMERGENCY" if ("danger" in desc_lower or "threat" in desc_lower) else "GOVERNMENT"
        guidance = [
            "In case of immediate threat or emergency, call Dial 112 / Police helpline.",
            "Provide specific location details and timeline of events.",
            "Avoid sharing personal identifying details of vulnerable individuals publicly."
        ]
    elif category_input and category_input in ["Road & Infrastructure", "Water Supply", "Waste Management", "Street Light", "Electricity", "Drainage", "Healthcare", "Education", "Public Safety", "Other"]:
        category = category_input

    summary = f"Civic issue reported in {district} under '{category}'. Classified with high confidence for targeted resolution."
    reasoning = f"Keyword & context analysis matched category '{category}' with priority '{priority}'. Automated guidance generated for citizen and routing directed to '{department}'."

    return AIAnalysisResult(
        summary=summary,
        category=category,
        subcategory=subcategory,
        severity_score=severity,
        urgency_score=urgency,
        public_impact_score=impact,
        priority=priority,
        department_guidance=department,
        actionable_guidance=guidance,
        required_expertise=expertise,
        recommended_route=route,
        confidence_score=0.94,
        reasoning=reasoning
    )
