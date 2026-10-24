"""
Content-Based Recommendation Engine & Skill-Gap Analysis Module
Implements explainable multi-factor scoring with cosine similarity:
Overall Score = w1 * Skill_Match + w2 * Interest_Match + w3 * Career_Match + w4 * Academic_Match
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any, Optional

def normalize_text_list(items: List[str]) -> List[str]:
    """Clean and standardize a list of tokens/strings."""
    if not items:
        return []
    clean = []
    for item in items:
        if isinstance(item, str):
            val = item.strip().lower()
            if val and val not in clean:
                clean.append(val)
    return clean

def compute_cosine_sim(query_tokens: List[str], target_tokens: List[str]) -> float:
    """
    Computes cosine similarity between token sets using TF-IDF representation.
    Returns a normalized float between 0.0 and 1.0.
    """
    if not query_tokens or not target_tokens:
        return 0.0
    
    query_str = " ".join(query_tokens)
    target_str = " ".join(target_tokens)
    
    # If exact token overlap exists, compute token Jaccard + TF-IDF blend
    set_q = set(query_tokens)
    set_t = set(target_tokens)
    overlap = len(set_q.intersection(set_t))
    jaccard = overlap / max(len(set_q.union(set_t)), 1)
    
    try:
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([query_str, target_str])
        sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        # Blend cosine similarity with direct token overlap
        blended = (0.7 * sim) + (0.3 * jaccard)
        return min(max(blended, 0.0), 1.0)
    except Exception:
        return float(jaccard)

class RecommendationEngine:
    def __init__(self):
        # Default configurable weights
        self.course_weights = {"w1": 0.40, "w2": 0.30, "w3": 0.20, "w4": 0.10}
        self.skill_weights = {"w1": 0.25, "w2": 0.35, "w3": 0.40, "w4": 0.00}
        self.project_weights = {"w1": 0.35, "w2": 0.35, "w3": 0.20, "w4": 0.10}
        self.career_weights = {"w1": 0.40, "w2": 0.35, "w3": 0.25, "w4": 0.00}

    def recommend_courses(
        self,
        student_profile: Dict[str, Any],
        courses: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recommends courses using the explainable multi-factor formula:
        Overall Score = w1 * Skill_Match + w2 * Interest_Match + w3 * Career_Match + w4 * Academic_Match
        """
        user_skills = normalize_text_list(
            student_profile.get("skills", []) + student_profile.get("programming_languages", [])
        )
        user_interests = normalize_text_list(student_profile.get("interests", []))
        user_careers = normalize_text_list(
            student_profile.get("preferred_roles", []) + [student_profile.get("target_role", "")]
        )
        user_cgpa = float(student_profile.get("cgpa", 7.0))
        user_sem = int(student_profile.get("semester", 5))

        scored_courses = []
        w = self.course_weights

        for course in courses:
            c_skills = normalize_text_list(course.get("skills_covered", []) + course.get("skills", []))
            c_domain = normalize_text_list([course.get("domain", "")] + course.get("tags", []))
            c_target_roles = normalize_text_list(course.get("target_roles", []))
            c_min_cgpa = float(course.get("min_cgpa", 0.0))
            c_difficulty = course.get("difficulty", "Intermediate").lower()

            # 1. Skill Match (Are user skills complementary to or ready for this course?)
            skill_sim = compute_cosine_sim(user_skills, c_skills)
            
            # 2. Interest Match (Does course domain align with student interests?)
            interest_sim = compute_cosine_sim(user_interests, c_domain)

            # 3. Career Match (Does this course train for student's target career?)
            career_sim = compute_cosine_sim(user_careers, c_target_roles if c_target_roles else c_domain)

            # 4. Academic Match (CGPA eligibility & semester suitability)
            academic_score = 1.0 if user_cgpa >= c_min_cgpa else max(0.2, user_cgpa / max(c_min_cgpa, 0.1))
            if c_difficulty == "advanced" and user_sem < 5:
                academic_score *= 0.85

            overall_score = (
                (w["w1"] * skill_sim) +
                (w["w2"] * interest_sim) +
                (w["w3"] * career_sim) +
                (w["w4"] * academic_score)
            )

            # Generate explainable justification
            matching_skills = list(set(user_skills).intersection(set(c_skills)))
            reasons = []
            if interest_sim > 0.4:
                reasons.append(f"Strongly aligns with your interest in {course.get('domain', 'this domain')}")
            if skill_sim > 0.3:
                reasons.append(f"Builds upon your background in {', '.join(matching_skills[:2]) if matching_skills else 'related topics'}")
            if career_sim > 0.3:
                reasons.append(f"Recommended for your target career path ({student_profile.get('target_role', 'Engineering')})")
            if not reasons:
                reasons.append("Broadens foundational competencies in your branch curriculum")

            scored_courses.append({
                **course,
                "relevance_score": round(overall_score * 100, 1),
                "component_scores": {
                    "skill_match": round(skill_sim * 100, 1),
                    "interest_match": round(interest_sim * 100, 1),
                    "career_match": round(career_sim * 100, 1),
                    "academic_match": round(academic_score * 100, 1),
                },
                "matching_skills": matching_skills,
                "explanation": ". ".join(reasons) + "."
            })

        # Deterministic sorting: overall_score DESC, then course name ASC
        scored_courses.sort(key=lambda x: (-x["relevance_score"], str(x.get("title", ""))))
        return scored_courses[:top_k]

    def recommend_skills(
        self,
        student_profile: Dict[str, Any],
        skills: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recommends high-priority missing or complementary skills based on career goal and interests.
        """
        user_skills = normalize_text_list(
            student_profile.get("skills", []) + student_profile.get("programming_languages", [])
        )
        user_interests = normalize_text_list(student_profile.get("interests", []))
        user_careers = normalize_text_list(
            student_profile.get("preferred_roles", []) + [student_profile.get("target_role", "")]
        )

        w = self.skill_weights
        scored_skills = []

        for skill in skills:
            s_name = skill.get("name", "").strip().lower()
            # If student already possesses this skill, lower priority or skip
            already_acquired = s_name in user_skills
            
            s_domain = normalize_text_list([skill.get("domain", "")] + skill.get("tags", []))
            s_careers = normalize_text_list(skill.get("target_roles", []))
            s_prereqs = normalize_text_list(skill.get("prerequisites", []))

            # Complementary prerequisite match
            prereq_match = compute_cosine_sim(user_skills, s_prereqs) if s_prereqs else 0.8
            interest_match = compute_cosine_sim(user_interests, s_domain)
            career_match = compute_cosine_sim(user_careers, s_careers if s_careers else s_domain)

            # Priority boost if skill is essential for chosen career and not yet acquired
            base_score = (
                (w["w1"] * prereq_match) +
                (w["w2"] * interest_match) +
                (w["w3"] * career_match)
            )

            if already_acquired:
                # Still show as mastery skill or lower priority
                overall_score = base_score * 0.35
                status = "Acquired"
                priority = "Low (Proficiency Refresh)"
            else:
                overall_score = base_score
                status = "Missing (Recommended)"
                priority = "High" if career_match > 0.4 else "Medium"

            reason = f"Essential for {student_profile.get('target_role', 'your chosen role')}" if career_match > 0.3 \
                else f"Matches your interest in {skill.get('domain', 'technology')}"

            scored_skills.append({
                **skill,
                "status": status,
                "priority": priority,
                "relevance_score": round(overall_score * 100, 1),
                "component_scores": {
                    "prereq_match": round(prereq_match * 100, 1),
                    "interest_match": round(interest_match * 100, 1),
                    "career_match": round(career_match * 100, 1)
                },
                "reason": reason
            })

        scored_skills.sort(key=lambda x: (-x["relevance_score"], str(x.get("name", ""))))
        return scored_skills[:top_k]

    def recommend_projects(
        self,
        student_profile: Dict[str, Any],
        projects: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recommends capstone projects aligning with student skills, interests, and target role.
        """
        user_skills = normalize_text_list(
            student_profile.get("skills", []) + student_profile.get("programming_languages", [])
        )
        user_interests = normalize_text_list(student_profile.get("interests", []))
        user_careers = normalize_text_list(
            student_profile.get("preferred_roles", []) + [student_profile.get("target_role", "")]
        )
        user_sem = int(student_profile.get("semester", 6))

        w = self.project_weights
        scored_projects = []

        for proj in projects:
            p_skills = normalize_text_list(proj.get("required_skills", []) + proj.get("tech_stack", []))
            p_domain = normalize_text_list([proj.get("domain", "")] + proj.get("tags", []))
            p_careers = normalize_text_list(proj.get("target_roles", []))
            p_diff = proj.get("difficulty", "Medium").lower()

            skill_match = compute_cosine_sim(user_skills, p_skills)
            interest_match = compute_cosine_sim(user_interests, p_domain)
            career_match = compute_cosine_sim(user_careers, p_careers if p_careers else p_domain)

            academic_match = 1.0
            if p_diff == "hard" and user_sem < 6:
                academic_match = 0.75

            overall_score = (
                (w["w1"] * skill_match) +
                (w["w2"] * interest_match) +
                (w["w3"] * career_match) +
                (w["w4"] * academic_match)
            )

            matching_skills = list(set(user_skills).intersection(set(p_skills)))
            reason = f"Applies your skills in {', '.join(matching_skills[:2]) if matching_skills else 'modern tech'} towards a practical portfolio capstone for {student_profile.get('target_role', 'industry roles')}."

            scored_projects.append({
                **proj,
                "relevance_score": round(overall_score * 100, 1),
                "component_scores": {
                    "skill_match": round(skill_match * 100, 1),
                    "interest_match": round(interest_match * 100, 1),
                    "career_match": round(career_match * 100, 1),
                    "academic_match": round(academic_match * 100, 1)
                },
                "matching_skills": matching_skills,
                "reason": reason
            })

        scored_projects.sort(key=lambda x: (-x["relevance_score"], str(x.get("title", ""))))
        return scored_projects[:top_k]

    def recommend_careers(
        self,
        student_profile: Dict[str, Any],
        careers: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recommends best-fit career paths with comprehensive skill-gap analysis and roadmap.
        """
        user_skills = normalize_text_list(
            student_profile.get("skills", []) + student_profile.get("programming_languages", [])
        )
        user_interests = normalize_text_list(student_profile.get("interests", []))
        user_careers = normalize_text_list(
            student_profile.get("preferred_roles", []) + [student_profile.get("target_role", "")]
        )

        w = self.career_weights
        scored_careers = []

        for car in careers:
            c_skills = normalize_text_list(car.get("required_skills", []))
            c_domain = normalize_text_list([car.get("domain", "")] + car.get("tags", []))
            c_title = normalize_text_list([car.get("title", "")])

            skill_match = compute_cosine_sim(user_skills, c_skills)
            interest_match = compute_cosine_sim(user_interests, c_domain)
            career_match = compute_cosine_sim(user_careers, c_title)

            overall_score = (
                (w["w1"] * skill_match) +
                (w["w2"] * interest_match) +
                (w["w3"] * career_match)
            )

            # Categorize matching vs missing skills
            set_user = set(user_skills)
            matching_skills = [s for s in car.get("required_skills", []) if s.strip().lower() in set_user]
            missing_skills = [s for s in car.get("required_skills", []) if s.strip().lower() not in set_user]

            scored_careers.append({
                **car,
                "relevance_score": round(overall_score * 100, 1),
                "component_scores": {
                    "skill_match": round(skill_match * 100, 1),
                    "interest_match": round(interest_match * 100, 1),
                    "career_match": round(career_match * 100, 1)
                },
                "matching_skills": matching_skills,
                "missing_skills": missing_skills,
                "match_percentage": round((len(matching_skills) / max(len(car.get("required_skills", [1])), 1)) * 100, 1)
            })

        scored_careers.sort(key=lambda x: (-x["relevance_score"], str(x.get("title", ""))))
        return scored_careers[:top_k]

    def analyze_skill_gap(
        self,
        student_profile: Dict[str, Any],
        career: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Detailed skill-gap evaluation for a specific career path.
        """
        user_skills = normalize_text_list(
            student_profile.get("skills", []) + student_profile.get("programming_languages", [])
        )
        req_skills = career.get("required_skills", [])
        req_clean = [s.strip() for s in req_skills if s.strip()]

        set_user = set(user_skills)
        matching = []
        missing = []

        for s in req_clean:
            if s.lower() in set_user:
                matching.append(s)
            else:
                missing.append(s)

        match_pct = round((len(matching) / max(len(req_clean), 1)) * 100, 1)

        # Categorize missing skills into priority tiers
        high_priority = missing[:3]
        medium_priority = missing[3:6]
        low_priority = missing[6:]

        # Suggested sequential learning roadmap
        roadmap = [
            {
                "phase": "Phase 1: Core Fundamentals & Immediate Gaps",
                "duration": "Weeks 1 - 4",
                "focus_skills": high_priority,
                "action": f"Master fundamental concepts and syntax for {', '.join(high_priority) if high_priority else 'core frameworks'} through hands-on coding exercises."
            },
            {
                "phase": "Phase 2: Applied Tooling & Frameworks",
                "duration": "Weeks 5 - 8",
                "focus_skills": medium_priority if medium_priority else ["System Architecture", "Integration Testing"],
                "action": "Build end-to-end mini projects integrating data persistence, APIs, and modern toolchains."
            },
            {
                "phase": "Phase 3: Capstone Portfolio & Production Readiness",
                "duration": "Weeks 9 - 12",
                "focus_skills": low_priority if low_priority else ["CI/CD", "Cloud Deployment", "Performance Optimization"],
                "action": "Complete a full capstone project addressing realistic industry scenarios and publish to GitHub."
            }
        ]

        return {
            "career_title": career.get("title", "Target Role"),
            "match_percentage": match_pct,
            "acquired_count": len(matching),
            "missing_count": len(missing),
            "total_required": len(req_clean),
            "matching_skills": matching,
            "missing_skills": missing,
            "priority_breakdown": {
                "high": high_priority,
                "medium": medium_priority,
                "recommended": low_priority
            },
            "learning_roadmap": roadmap,
            "disclaimer": "Recommendations are advisory to support academic and career preparation; they do not guarantee admission or employment."
        }
