def assign_sides(participant_ids):
    """
    Auto-split a list of participant IDs into Side A / Side B.
    First half = A, second half = B (A gets the extra one if odd total).
    """
    n = len(participant_ids)
    mid = (n + 1) // 2
    side_a = participant_ids[:mid]
    side_b = participant_ids[mid:]
    return side_a, side_b


def generate_round_robin(side_a, side_b):
    """
    side_a, side_b: lists of participant IDs (can be different lengths).
    Pads the shorter side with None (= bye, that person sits out that round).
    Returns: list of rounds, each round is a list of (a_id, b_id) tuples.
    """
    a = side_a[:]
    b = side_b[:]

    n = max(len(a), len(b))
    a += [None] * (n - len(a))
    b += [None] * (n - len(b))

    rounds = []
    b_rotating = b[:]

    for _ in range(n):
        pairings = list(zip(a, b_rotating))
        rounds.append(pairings)
        b_rotating = [b_rotating[-1]] + b_rotating[:-1]

    return rounds