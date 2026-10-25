"use client";

import { useState } from "react";
import { Refund } from "@/types";
import { REASON_LABEL, toAmount } from "../../../../features/refunds/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/apiError";
import { Check, Copy, Info } from "lucide-react";

interface RefundCardProps {
  refund: Refund;
  onMarkSent: (id: number, note: string, onDone: () => void) => void;
  isMarking: boolean;
  markError: unknown;
}

export default function RefundCard({ refund, onMarkSent, isMarking, markError }: RefundCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const patron = refund.serviceRequest?.patron;
  const patronName = patron ? `${patron.firstName} ${patron.lastName}`.trim() : "Unknown patron";
  const hasBankDetails = !!(refund.bankName && refund.accountNumber && refund.accountName);
  const isPending = refund.status === "pending";

  function copyAccountNumber() {
    if (!refund.accountNumber) return;
    navigator.clipboard?.writeText(refund.accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card className="p-[16px_18px]">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Patron + request */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[14px] font-bold text-[#1a1a1a]">{patronName}</span>
            <Badge variant={refund.reason === "zart_cancelled" ? "invoiced" : "pending"}>
              {REASON_LABEL[refund.reason] ?? refund.reason}
            </Badge>
          </div>
          <div className="text-[12px] text-[#888]">
            {[patron?.phone, patron?.email].filter(Boolean).join(" · ") || "No contact details"}
          </div>
          <div className="text-[13px] text-[#1a1a1a] font-semibold mt-3">{refund.serviceRequest?.title || "Untitled request"}</div>
          <div className="text-[11px] text-[#aaa] mt-0.5">
            #{refund.serviceRequest?.referenceId || refund.serviceRequestId} · Created {formatDate(refund.createdAt)}
          </div>
        </div>

        {/* Amounts */}
        <div className="md:w-[200px] shrink-0">
          <div className="text-[11px] text-[#aaa] uppercase tracking-wider font-semibold">Refund amount</div>
          <div className="text-[26px] font-bold text-[#115746] leading-tight">{formatCurrency(toAmount(refund.refundAmount))}</div>
          <div className="text-[11px] text-[#888] mt-1">
            Paid {formatCurrency(toAmount(refund.amountPaid))}
            {" · "}
            <span className="text-[#FA4812] font-medium">
              Fee {toAmount(refund.feeAmount) > 0 ? formatCurrency(toAmount(refund.feeAmount)) : "—"}
            </span>
          </div>
        </div>

        {/* Bank details */}
        <div className="md:w-[240px] shrink-0">
          <div className="text-[11px] text-[#aaa] uppercase tracking-wider font-semibold mb-1">Send to</div>
          {hasBankDetails ? (
            <div>
              <div className="text-[13px] font-semibold text-[#1a1a1a]">{refund.accountName}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[14px] font-bold text-[#1a1a1a] tracking-wide">{refund.accountNumber}</span>
                <button
                  onClick={copyAccountNumber}
                  className="bg-transparent border-none cursor-pointer p-1 text-[#888] hover:text-[#115746] transition-colors flex items-center"
                  title="Copy account number"
                  aria-label="Copy account number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#115746]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {copied && <span className="text-[10px] text-[#115746] font-semibold">Copied</span>}
              </div>
              <div className="text-[12px] text-[#888]">{refund.bankName}</div>
            </div>
          ) : (
            <div className="flex items-start gap-1.5 bg-[#fff8e1] rounded-[6px] p-[6px_10px] text-[11px] text-[#8a6f00] font-semibold">
              <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
              Bank details needed — contact patron
            </div>
          )}
        </div>
      </div>

      {/* Action / sent info */}
      <div className="border-t border-[#f0f0f0] mt-4 pt-3">
        {isPending ? (
          !confirming ? (
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                className="text-[11px] font-bold uppercase tracking-wider"
                onClick={() => setConfirming(true)}
              >
                Mark as sent
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-[12px] text-[#1a1a1a]">
                Confirm you have transferred <span className="font-bold">{formatCurrency(toAmount(refund.refundAmount))}</span> to {patronName}.
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  className="h-8 text-[12px] flex-1"
                  placeholder="Note (optional), e.g. transfer reference"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isMarking}
                />
                <div className="flex gap-1.5">
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-[11px] font-bold uppercase tracking-wider"
                    onClick={() =>
                      onMarkSent(refund.id, note.trim(), () => {
                        setConfirming(false);
                        setNote("");
                      })
                    }
                    isLoading={isMarking}
                  >
                    Confirm sent
                  </Button>
                  <Button
                    variant="plain"
                    size="sm"
                    className="text-[11px] font-bold uppercase tracking-wider"
                    onClick={() => setConfirming(false)}
                    disabled={isMarking}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              {!!markError && (
                <div className="flex items-center gap-1.5 bg-[#fff5f2] border border-[#ffd4c7] rounded-[6px] p-[6px_10px] text-[11px] text-[#FA4812] font-semibold">
                  <Info className="w-3.5 h-3.5 text-[#FA4812] shrink-0" />
                  {getApiErrorMessage(markError, "Could not mark this refund as sent. Please try again.")}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[12px]">
            <Badge variant="paid" className="w-fit">Sent</Badge>
            <span className="text-[#888]">{refund.sentAt ? formatDateTime(refund.sentAt) : "—"}</span>
            {refund.note && <span className="text-[#1a1a1a]">“{refund.note}”</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
