import { RefundReason } from "@/types";

export const REASON_LABEL: Record<RefundReason, string> = {
  patron_cancelled: "Patron cancelled",
  zart_cancelled: "Zart cancelled",
};

// Decimal amounts can come back from the API as strings
export function toAmount(value: number | string | null | undefined): number {
  return Number(value) || 0;
}
