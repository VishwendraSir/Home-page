# EXAM BRAHMASTRA V6 — QUESTION BANK QUALITY UPGRADE
**Date:** 2026-11-19  
**Repository:** VishwendraSir/Home-page  
**Scope:** Additive quality policy and initial audit of the 24-record embedded core bank.

## Quality Standard
Use the user's Question Bank Quality Upgrade policy:
- Source types: OFFICIAL_PYQ, TEXTBOOK_BASED, SYLLABUS_BASED, ORIGINAL_PRACTICE, SOURCE_VERIFICATION_PENDING.
- Never invent PYQ provenance.
- Difficulty levels: BASIC, EASY, MODERATE, ADVANCED, EXAM_CHALLENGE.
- Require bilingual question/options/explanations, answer verification, duplicate checking, concept tags, source reference, and verification status.
- Question quality score: accuracy 30, relevance 20, clarity 15, explanation 15, difficulty 10, language 5, originality 5. APPROVED requires >=85.
- Preserve existing data. No deletion or replacement without audit and merge record.

## Initial Core Bank Audit
Source file: `questions-core.json` (24 records)
- Records: 24
- Exact Hindi duplicates: 0
- Structural field checks: passed for all 24 (question, English question, options, English options, explanation fields, valid answer index)
- Topic: all 24 currently `Unclassified`
- Verification: all 24 are `existing_question_not_independently_verified`
- Source field points to the app file, not a specific official publication; authenticity is pending.
- Content/answer audit: not yet completed question-by-question.
- No question is promoted to VERIFIED or APPROVED by this structural audit.

## Required Next Actions
1. Classify every core question by subject/topic/subtopic and difficulty.
2. Independently solve and verify answers.
3. Review distractors and ambiguity.
4. Review bilingual wording and explanations.
5. Assign source type honestly; absent provenance defaults to SOURCE_VERIFICATION_PENDING or ORIGINAL_PRACTICE only when authorship is established.
6. Run exact, translated, concept, and numerical-variation duplicate checks against the full bank.
7. Add quality scores and review statuses.
8. Only then consider UI integration.

## Audit Status
This is a data audit, not a live UI/deployment verification. The 3 MB app source remains too large for the current GitHub file retrieval path; UI integration is not inspected or changed in this commit.
