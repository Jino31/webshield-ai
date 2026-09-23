// backend/services/reportValidation.js
// Decides whether an incoming scam report is solid enough to count toward a
// domain's risk score (report gets stored either way, for admin review —
// this only gates the `verified` flag that feeds computeRiskScore).
//
// Duplicate-proof checking needs a DB lookup (persists across restarts/instances),
// so it's done by the caller — pass `isDuplicateProofUrl` after querying ScamReport.

function validateReport({ description, proofUrl, isDuplicateProofUrl = false }) {
  const issues = [];

  const hasDetail = description && description.trim().length >= 20;
  const hasProof = proofUrl && proofUrl.trim().length > 0;

  if (!hasDetail && !hasProof) {
    issues.push('Add either a detailed description (20+ chars) or a proof link — at least one is needed to verify this report');
  }

  if (hasProof && isDuplicateProofUrl) {
    issues.push('This proof link has already been submitted on another report — likely duplicate/reused');
  }

  return {
    // verified = counts toward the domain's public risk score
    verified: issues.length === 0,
    issues
  };
}

module.exports = { validateReport };
