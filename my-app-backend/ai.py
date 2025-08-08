# # ai.py

import json
from datetime import datetime
from google import genai
from models import AIInsightSchema as AIInsightsFormat, LogEntry
import os
from dotenv import load_dotenv

load_dotenv()
def generate_insights(logs: list[LogEntry]) -> list[dict] | None:
    # 1) Turn each ORM object into a JSON-friendly dict
    serializable_logs = []
    for l in logs:
        serializable_logs.append({
            "id":            l.id,
            "timestamp":     l.timestamp.isoformat(),
            "ip":            l.ip,
            "method":        l.method,
            "uri":           l.uri,
            "status":        l.status,
            "bytes":         l.bytes,
            "user_agent":    l.user_agent,
            "referer":       l.referer,
        })

    prompt = f"""
You are an AI assistant that analyzes NGINX access logs to identify security threats,
anomalies, and performance issues useful for a SOC analyst. The severity can only be high, medium, low. Return the JSON array of insights"

Here are the log entries (as JSON):
{json.dumps(serializable_logs, indent=2)}
"""

    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": list[AIInsightsFormat],
            },
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error generating insights: {e}")
        return None