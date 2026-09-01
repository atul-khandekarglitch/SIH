import os
import json
import httpx
from typing import Dict, Any, List
from app.config import settings
from app.schemas import AIAnalysisResult

SYSTEM_PROMPT = """You are an AI Societal Problem Classifier for Jharkhand State Civic Platform.
Given a citizen's problem report, analyze it and return a valid JSON object matching this schema:
{
  "summary": "Clear, concise 2-sentence summary of the core issue",
  "category": "One of: Education, Healthcare, Agriculture, Water, Sanitation, Environment, Energy, Rural Livelihood, Accessibility, Urban Infrastructure, Public Administration, Other",
  "subcategory": "Specific subcategory e.g. Groundwater, Fluoride Contamination, Road Drainage, Primary Health Centre",
  "severity_score": 1-10 integer score,
  "urgency_score": 1-10 integer score,
  "public_impact_score": 1-10 integer score,
  "required_expertise": ["List of expert domain areas e.g. Water Engineering, Public Health, Environmental Chemistry"],
  "recommended_route": "One of: GOVERNMENT, UNIVERSITY, INDUSTRY, COLLABORATION, EMERGENCY",
  "confidence_score": Float between 0.50 and 0.99,
  "reasoning": "Technical justification for classification and recommended route"
}
Output strictly valid JSON with no extra commentary."""

async def analyze_problem_with_llm(title: str, description: str, category_input: str, district: str) -> AIAnalysisResult:
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
                    parsed = json.loads(content)
                    return AIAnalysisResult(**parsed)
        except Exception as e:
            print(f"[LLM Service Warning] API call failed, using heuristic fallback: {e}")

    # --- DEV / MOCK FALLBACK PROVIDER ---
    desc_lower = (title + " " + description).lower()
    
    # Categorization heuristic
    category = category_input
    subcategory = "General Infrastructure"
    expertise = ["Civil Engineering", "Public Administration"]
    severity = 6
    urgency = 6
    impact = 7
    route = "GOVERNMENT"
    
    if any(w in desc_lower for w in ["water", "drinking", "contamination", "fluoride", "arsenic", "well", "borewell", "handpump"]):
        category = "Water"
        subcategory = "Groundwater Quality & Supply"
        expertise = ["Environmental Engineering", "Hydrogeology", "Water Quality Analysis"]
        severity = 8
        urgency = 8
        impact = 9
        route = "COLLABORATION"
    elif any(w in desc_lower for w in ["crop", "agriculture", "drought", "farming", "soil", "irrigation", "paddy"]):
        category = "Agriculture"
        subcategory = "Irrigation & Soil Management"
        expertise = ["Agronomy", "Agricultural Engineering", "Smart Irrigation"]
        severity = 7
        urgency = 7
        impact = 8
        route = "UNIVERSITY"
    elif any(w in desc_lower for w in ["health", "hospital", "phc", "doctor", "medicine", "disease", "fever", "clinic"]):
        category = "Healthcare"
        subcategory = "Rural Primary Healthcare"
        expertise = ["Public Health", "Telemedicine", "Medical Logistics"]
        severity = 9
        urgency = 9
        impact = 9
        route = "COLLABORATION"
    elif any(w in desc_lower for w in ["road", "bridge", "pothole", "drain", "transport", "traffic"]):
        category = "Urban Infrastructure"
        subcategory = "Roads & Stormwater Drainage"
        expertise = ["Civil Engineering", "Urban Planning"]
        severity = 7
        urgency = 6
        impact = 8
        route = "GOVERNMENT"
    elif any(w in desc_lower for w in ["waste", "garbage", "dump", "plastic", "pollution", "smoke"]):
        category = "Environment"
        subcategory = "Solid Waste Management"
        expertise = ["Waste Management", "Environmental Chemistry", "Recycling Tech"]
        severity = 6
        urgency = 6
        impact = 7
        route = "INDUSTRY"

    summary = f"Issue reported in {district} concerning {category.lower()} ({subcategory}). Needs structured intervention by specialized domain teams."
    reasoning = f"Automated analysis identified critical keywords related to {category}. High public impact detected ({impact}/10). Recommended route '{route}' allows coordinated government action and technical support."
    
    return AIAnalysisResult(
        summary=summary,
        category=category,
        subcategory=subcategory,
        severity_score=severity,
        urgency_score=urgency,
        public_impact_score=impact,
        required_expertise=expertise,
        recommended_route=route,
        confidence_score=0.92,
        reasoning=reasoning
    )
