export const REFUND_STATUS = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  DECLINED: "Declined",
} as const;
export type RefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS];
