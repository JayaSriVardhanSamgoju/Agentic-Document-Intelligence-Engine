from fastapi import APIRouter, Depends, HTTPException
from app.auth.dependencies import require_permission
from app.utils.logger import get_logger

# Import from the correct top-level evaluation module
from evaluation.benchmark_runner import BenchmarkRunner

router = APIRouter()
logger = get_logger()

# We might want to persist the runner instance or instantiate per request
# depending on load. Given benchmarks are rare, instantiating per request is fine.

@router.post(
    "/benchmark/run",
    dependencies=[Depends(require_permission("manage_users"))],
    tags=["Evaluation"]
)
async def run_benchmark():
    """
    Triggers the enterprise automated evaluation benchmark suite.
    Restricted to Admins (manage_users permission).
    """
    try:
        logger.info("Admin initiated benchmark run")
        runner = BenchmarkRunner()
        report = runner.run_benchmark()
        
        if "error" in report:
            raise HTTPException(status_code=400, detail=report["error"])
            
        return report

    except Exception as error:
        logger.error(f"Benchmark execution failed: {error}")
        raise HTTPException(
            status_code=500,
            detail=f"Benchmark failed: {str(error)}"
        )
