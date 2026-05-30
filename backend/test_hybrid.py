import sys
import json
sys.path.append('.')

from app.services.query_service import QueryService

if __name__ == "__main__":
    service = QueryService()
    
    print("\n--- Test 1: General Knowledge ---")
    res1 = service.ask("Who won the recent cricket match?")
    print(f"Source Type: {res1.get('source_type')}")
    print(f"Answer: {res1.get('answer')[:100]}...")
    print(f"Trace: {[t['agent'] for t in res1.get('agent_trace', [])]}")
    
    print("\n--- Test 2: Document Context ---")
    res2 = service.ask("Summarize the uploaded healthcare document")
    print(f"Source Type: {res2.get('source_type')}")
    print(f"Answer: {res2.get('answer')[:100]}...")
    print(f"Trace: {[t['agent'] for t in res2.get('agent_trace', [])]}")
