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


def generate_domain_aware_schedule(participants, participant_to_category):
    """
    participants: list of Participant objects or participant IDs.
    participant_to_category: dict mapping participant_id -> category_id.

    Groups participants by category_id, generates a schedule for each group,
    and merges them round-by-round. Pads any group with fewer rounds using byes.
    """
    from collections import defaultdict

    # Extract sorted participant IDs
    p_ids = sorted([getattr(p, "id", p) for p in participants])
    domain_groups = defaultdict(list)
    for p_id in p_ids:
        cat_id = participant_to_category.get(p_id)
        domain_groups[cat_id].append(p_id)

    # Generate schedule for each domain group
    group_schedules = {}
    for cat_id, group_p_ids in domain_groups.items():
        side_a, side_b = assign_sides(group_p_ids)
        group_schedules[cat_id] = generate_round_robin(side_a, side_b)

    # Find the maximum number of rounds across all groups
    max_rounds = 0
    if group_schedules:
        max_rounds = max(len(sch) for sch in group_schedules.values())

    # Merge schedules round-by-round, padding shorter groups with byes
    merged_schedule = []
    for r_idx in range(max_rounds):
        round_pairings = []
        for cat_id, group_p_ids in domain_groups.items():
            sch = group_schedules[cat_id]
            if r_idx < len(sch):
                # Add pairings from the group's schedule for this round
                for a_id, b_id in sch[r_idx]:
                    if a_id is not None or b_id is not None:
                        round_pairings.append((a_id, b_id))
            else:
                # Group finished its matchmaking rounds early. Give everyone a bye.
                for p_id in group_p_ids:
                    round_pairings.append((p_id, None))
        merged_schedule.append(round_pairings)

    return merged_schedule