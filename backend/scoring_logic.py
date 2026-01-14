from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


def calculate_category_scores(user_text, model, categories_config, category_ids, category_embeddings, learned_memory, negative_memory):
    """
    Calculates the best category by combining:
    1. Keyword Matches (+)
    2. Base Vector Similarity (+)
    3. Positive Memory Matches (+)
    4. Negative Memory Matches (-) [NEW FEATURE]
    """

    # --- 1. KEYWORD BOOST ---
    keyword_scores = {cid: 0.0 for cid in category_ids}
    for cid, data in categories_config.items():
        for word in data["keywords"]:
            if word in user_text:
                keyword_scores[cid] += 0.3  # 30% Boost

    # --- 2. BASE VECTOR SEARCH ---
    user_embedding = model.encode([user_text])
    base_similarities = cosine_similarity(
        user_embedding, category_embeddings)[0]

    # --- 3. POSITIVE MEMORY SEARCH ---
    # "Has the user liked a similar prompt for this category before?"
    positive_scores = {cid: 0.0 for cid in category_ids}
    for cid in category_ids:
        if learned_memory.get(cid):
            learned_embeddings = model.encode(learned_memory[cid])
            if len(learned_embeddings) > 0:
                sims = cosine_similarity(user_embedding, learned_embeddings)[0]
                positive_scores[cid] = max(sims)

    # --- 4. NEGATIVE MEMORY SEARCH (THE PUNISHER) ---
    # "Has the user DISLIKED a similar prompt for this category?"
    penalty_scores = {cid: 0.0 for cid in category_ids}
    for cid in category_ids:
        if negative_memory.get(cid):
            neg_embeddings = model.encode(negative_memory[cid])
            if len(neg_embeddings) > 0:
                sims = cosine_similarity(user_embedding, neg_embeddings)[0]
                # If highly similar to a mistake, apply a heavy penalty
                best_match = max(sims)
                if best_match > 0.85:  # High certainty it's the same mistake
                    penalty_scores[cid] = 0.5  # Huge 50% penalty
                elif best_match > 0.7:
                    penalty_scores[cid] = 0.2  # Moderate penalty

    # --- 5. COMBINE SCORES ---
    final_scores = []
    for i, base_score in enumerate(base_similarities):
        cid = category_ids[i]

        # LOGIC: Max(Base, Memory) + Keywords - Penalty
        best_positive_match = max(base_score, positive_scores[cid])
        total_score = best_positive_match + \
            keyword_scores[cid] - penalty_scores[cid]

        final_scores.append((cid, total_score))

    # Sort by highest score
    final_scores.sort(key=lambda x: x[1], reverse=True)
    best_category, final_score = final_scores[0]

    # Thresholds
    if final_score < 0.15:
        best_category = "general"
        confidence = 0.0
    else:
        confidence = min(0.99, final_score)

    return best_category, confidence
