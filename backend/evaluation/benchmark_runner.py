import json
import time
from pathlib import Path
from datetime import datetime

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from app.services.query_service import QueryService
from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger()

class BenchmarkRunner:
    """
    Enterprise automated evaluation benchmark runner.
    Tests the RAG pipeline against a golden dataset,
    utilizing LLM-as-a-judge for accuracy scoring.
    """

    def __init__(self):
        logger.info("Initializing BenchmarkRunner...")
        self.query_service = QueryService()
        
        # LLM-as-a-judge for accuracy evaluation
        self.eval_llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME,
            temperature=0
        )

        self.eval_prompt = ChatPromptTemplate.from_template(
            """
You are an expert enterprise AI auditor. 
Evaluate the following generated answer against the expected golden answer.

Expected Answer:
{expected}

Generated Answer:
{generated}

Provide an accuracy score between 0.0 and 1.0 based on how well the generated answer captures the exact facts, nuance, and intent of the expected answer. 0.0 means completely wrong, 1.0 means perfectly accurate.

Respond ONLY with a JSON object in this exact format:
{{"accuracy": 0.95, "reasoning": "short explanation"}}
"""
        )

        self.dataset_path = Path("data/golden_dataset.json")
        self.reports_dir = Path("logs/benchmark_reports")
        self.reports_dir.mkdir(parents=True, exist_ok=True)

    def load_dataset(self) -> list:
        if not self.dataset_path.exists():
            logger.error(f"Golden dataset not found at {self.dataset_path}")
            return []
        
        with open(self.dataset_path, "r") as f:
            return json.load(f)

    def evaluate_accuracy(self, expected: str, generated: str) -> dict:
        try:
            chain = self.eval_prompt | self.eval_llm
            response = chain.invoke({
                "expected": expected,
                "generated": generated
            })
            
            # Simple parse
            content = response.content.strip()
            # Ensure we extract the JSON if wrapped in backticks
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            result = json.loads(content)
            return result
        except Exception as e:
            logger.error(f"LLM Judge failed: {e}")
            return {"accuracy": 0.0, "reasoning": f"Judge error: {str(e)}"}

    def run_benchmark(self) -> dict:
        logger.info("Starting Enterprise Benchmark Suite...")
        dataset = self.load_dataset()
        
        if not dataset:
            return {"error": "Dataset missing or empty."}

        results = []
        total_latency = 0
        total_accuracy = 0
        total_groundedness = 0
        total_hallucination = 0
        total_retrieval = 0
        
        for item in dataset:
            query = item["query"]
            expected = item["expected_answer"]
            
            logger.info(f"Benchmarking query: {query}")
            
            start_time = time.time()
            # Run the actual pipeline (using a unique session to avoid context contamination)
            session_id = f"benchmark_{int(time.time())}"
            response = self.query_service.ask(query, session_id=session_id)
            latency_ms = (time.time() - start_time) * 1000
            
            generated_answer = response.get("answer", "")
            eval_metrics = response.get("evaluation", {})
            
            # LLM Judge accuracy
            judge_eval = self.evaluate_accuracy(expected, generated_answer)
            accuracy = float(judge_eval.get("accuracy", 0.0))
            
            # Extract pipeline metrics
            groundedness = float(eval_metrics.get("groundedness", 0.0))
            
            raw_hallucination = eval_metrics.get("hallucination_risk", 1.0)
            if isinstance(raw_hallucination, str):
                if raw_hallucination.upper() == 'LOW':
                    hallucination = 0.1
                elif raw_hallucination.upper() == 'MEDIUM':
                    hallucination = 0.5
                else:
                    hallucination = 0.9
            else:
                hallucination = float(raw_hallucination)
                
            retrieval_quality = float(eval_metrics.get("retrieval_quality", 0.0))
            
            # Accumulate for averages
            total_latency += latency_ms
            total_accuracy += accuracy
            total_groundedness += groundedness
            total_hallucination += hallucination
            total_retrieval += retrieval_quality
            
            results.append({
                "query_id": item.get("id"),
                "category": item.get("category"),
                "latency_ms": round(latency_ms, 2),
                "accuracy": accuracy,
                "groundedness": groundedness,
                "hallucination_risk": hallucination,
                "retrieval_quality": retrieval_quality,
                "judge_reasoning": judge_eval.get("reasoning", "")
            })
            
            # Respect rate limits
            time.sleep(1.0)
            
        n = len(dataset)
        
        report = {
            "timestamp": str(datetime.now()),
            "total_queries": n,
            "aggregate_metrics": {
                "avg_accuracy": round(total_accuracy / n, 2),
                "avg_groundedness": round(total_groundedness / n, 2),
                "avg_hallucination_risk": round(total_hallucination / n, 2),
                "avg_retrieval_quality": round(total_retrieval / n, 2),
                "avg_latency_ms": round(total_latency / n, 2)
            },
            "detailed_results": results
        }
        
        report_filename = self.reports_dir / f"benchmark_report_{int(time.time())}.json"
        with open(report_filename, "w") as f:
            json.dump(report, f, indent=4)
            
        logger.info(f"Benchmark complete. Report saved to {report_filename}")
        
        return report

