from datetime import (
    datetime
)


def calculate_latency(
    trace: list
) -> dict:
    """
    Calculate agent timings.
    """

    timings = {}

    timestamps = []

    for step in trace:

        ts = datetime.fromisoformat(
            step["timestamp"]
            .replace(" ", "T")
        )

        timestamps.append(
            (
                step["agent"],
                ts
            )
        )

    for i in range(
        len(timestamps) - 1
    ):

        current_agent = (
            timestamps[i][0]
        )

        current_time = (
            timestamps[i][1]
        )

        next_time = (
            timestamps[i + 1][1]
        )

        latency = (
            next_time
            - current_time
        ).total_seconds() * 1000

        timings[
            current_agent
        ] = round(
            latency,
            2
        )

    return timings