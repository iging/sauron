# COMMIT MESSAGE RULES (read before running):
# NOTE: This script is for backdating commits only.
# 1. The -m message MUST come from progress-report-result.md, Section 2 (Commit Message).
# 2. Do not invent or rephrase. Copy it verbatim from the report.
# 3. Paste the report message into the MESSAGE slot below.
# 4. Replace YYYY-MM-DD with the actual date before running.
GIT_AUTHOR_DATE="YYYY-MM-DDT12:00:00Z" GIT_COMMITTER_DATE="YYYY-MM-DDT12:00:00Z" git commit -m "PASTE_FULL_MESSAGE_FROM_progress-report-result.md_SECTION_2_HERE"
