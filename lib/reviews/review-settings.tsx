export const REVIEW_AUTO_APPROVE_KEY =
  "royal-chins-review-auto-approve";

export function getAutoApproveReviews(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    localStorage.getItem(
      REVIEW_AUTO_APPROVE_KEY
    ) === "true"
  );
}

export function saveAutoApproveReviews(
  enabled: boolean
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    REVIEW_AUTO_APPROVE_KEY,
    String(enabled)
  );
}