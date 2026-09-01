import math
import re
from typing import List
import httpx
from app.config import settings

def generate_local_embedding(text: str, dim: int = 64) -> List[float]:
    """Generates a deterministic 64-dim normalized vector for semantic text similarity fallback."""
    text_clean = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
    words = text_clean.split()
    vector = [0.0] * dim
    
    for word in words:
        hash_val = sum(ord(c) * (i + 1) for i, c in enumerate(word))
        idx = hash_val % dim
        vector[idx] += 1.0
        
    norm = math.sqrt(sum(x * x for x in vector))
    if norm > 0:
        vector = [round(x / norm, 4) for x in vector]
    return vector

async def get_embedding(text: str) -> List[float]:
    """Uses OpenAI embedding API if key is set, otherwise generates local embedding vector."""
    if settings.EMBEDDING_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    "https://api.openai.com/v1/embeddings",
                    headers={"Authorization": f"Bearer {settings.EMBEDDING_API_KEY}"},
                    json={"model": "text-embedding-3-small", "input": text}
                )
                if resp.status_code == 200:
                    return resp.json()["data"][0]["embedding"]
        except Exception as e:
            print(f"[Embedding Service Warning] Remote embedding failed, using local: {e}")

    return generate_local_embedding(text)

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculates cosine similarity between two vector lists."""
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return round(dot / (norm1 * norm2), 4)
