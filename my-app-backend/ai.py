# # ai.py

# import os
# import json
# from google import generativeai as genai
# from models import LogEntry, AIInsightSchema as AIInsightsFormat
# from dotenv import load_dotenv

# # Load your GEMINI_API_KEY from .env
# GEMINI_API_KEY="AIzaSyBJnQbET7XHyMzSxh6b4d0lqMWXhkP9REI"
# load_dotenv()
# # genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# genai.configure(api_key=GEMINI_API_KEY)

# def generate_insights(logs: list[LogEntry]) -> list[dict] | None:
#     """
#     Send a batch of NGINX access-log entries to Gemini and parse
#     its JSON response into the AIInsightsFormat schema.
#     """
#     # Build a prompt that mentions NGINX logs explicitly
#     prompt = f"""
# You are an AI assistant that analyzes NGINX access logs to identify security threats,
# anomalies, and performance issues useful for a SOC analyst.  For each insight, output
# a JSON object with these fields:
#   - type: one of ("security","anomaly","performance")
#   - title: short descriptive title
#   - description: what happened
#   - severity: one of ("low","medium","high")
#   - recommendation: action to take
#   - confidence: integer 0–100
#   - anomaly_logs: list of log entry IDs related to this insight

# Here are the log entries (as JSON)
# {json.dumps([log.dict() if hasattr(log, "dict") else log for log in logs], indent=2)}

# Please reply **ONLY** with a JSON array of those insight objects.
# """

#     try:
#         client = genai.Client()
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=prompt,
#             config={
#                 "response_mime_type": "application/json",
#                 "response_schema": list[AIInsightsFormat],
#             },
#         )
#         # `response.text` will be a JSON array string
#         return json.loads(response.text)
#     # except Exception as e:
#     #     print(f"Error generating insights: {e}")
#     #     return None
#     except Exception as e:
#         print("🛑 Gemini error:", e, flush=True)
#         raise
# ai.py

# load your GEMINI_API_KEY from .env (or hard-code temporarily for debugging)
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
anomalies, and performance issues useful for a SOC analyst. Return the JSON array of insights"

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