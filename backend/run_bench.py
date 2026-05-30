import sys
import json
sys.path.append('.')

from evaluation.benchmark_runner import BenchmarkRunner

if __name__ == "__main__":
    runner = BenchmarkRunner()
    result = runner.run_benchmark()
    print(json.dumps(result, indent=2))
