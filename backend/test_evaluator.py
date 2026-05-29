from app.evaluation.evaluator import (
    Evaluator
)

evaluator = (
    Evaluator()
)

result = (
    evaluator.evaluate(
        confidence_score=0.91,
        citations_count=5
    )
)

print(result)