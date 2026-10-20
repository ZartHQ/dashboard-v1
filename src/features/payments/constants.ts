export const BADGE: Record<string, { label: string; cls: string }> = {
  paid:     { label: "Paid",         cls: "badge-paid" },
  pending:  { label: "Pending",      cls: "badge-pending" },
  disputed: { label: "Disputed",     cls: "badge-disputed" },
  invoiced: { label: "Invoice sent", cls: "badge-invoiced" },
  refunded: { label: "Refunded",     cls: "badge-refunded" },
};
