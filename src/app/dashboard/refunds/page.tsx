"use client";

import { useState } from "react";
import { useRefunds } from "../../../features/refunds/queries";
import { useMarkRefundSentMutation } from "../../../features/refunds/mutations";
import { toAmount } from "../../../features/refunds/constants";
import { RefundStatus } from "@/types";
import RefundCard from "./components/RefundCard";
import { Card } from "@/components/ui/Card";
import { cn, formatCurrency } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/apiError";
import { PageLoader } from "@/components/ui/PageLoader";
import { CheckIcon } from "@/components/ui/Icons";
import { Info } from "lucide-react";

const TABS: { key: RefundStatus; label: string }[] = [
  { key: "pending", label: "Refunds to send" },
  { key: "sent", label: "Sent" },
];

export default function RefundsPage() {
  const [tab, setTab] = useState<RefundStatus>("pending");
  const [toastMessage, setToastMessage] = useState("");

  const { data: pending, isLoading: pendingLoading, error: pendingError } = useRefunds("pending");
  const { data: sent, isLoading: sentLoading, error: sentError } = useRefunds("sent");
  const markSentMutation = useMarkRefundSentMutation();

  if (pendingLoading || sentLoading) {
    return <PageLoader />;
  }

  const pendingList = pending || [];
  const sentList = sent || [];
  const list = tab === "pending" ? pendingList : sentList;
  const listError = tab === "pending" ? pendingError : sentError;
  const pendingTotal = pendingList.reduce((sum, r) => sum + toAmount(r.refundAmount), 0);
  const sentTotal = sentList.reduce((sum, r) => sum + toAmount(r.refundAmount), 0);
  const missingDetails = pendingList.filter((r) => !r.accountNumber).length;

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  }

  function handleMarkSent(id: number, note: string, onDone: () => void) {
    markSentMutation.mutate(
      { id, note: note || undefined },
      {
        onSuccess: () => {
          onDone();
          showToast("Refund marked as sent");
        },
      }
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#115746] text-white p-[12px_20px] rounded-[10px] shadow-lg flex items-center gap-2.5 z-[9999] transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white/20 rounded-full p-1">
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-[13px] font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="text-[16px] font-bold text-[#115746]">Refunds</div>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {[
            { label: "To send", val: formatCurrency(pendingTotal), sub: `${pendingList.length} refunds pending`, warn: pendingList.length > 0 },
            { label: "Missing bank details", val: missingDetails.toString(), sub: "Contact patron first", warn: missingDetails > 0 },
            { label: "Sent", val: formatCurrency(sentTotal), sub: `${sentList.length} refunds sent`, warn: false },
          ].map((m) => (
            <Card key={m.label} className="p-[14px_16px]">
              <div className="text-[11px] text-[#aaa] mb-1.5 uppercase tracking-wider font-semibold">{m.label}</div>
              <div className={cn("text-[26px] font-bold", m.warn && m.label === "Missing bank details" ? "text-[#FA4812]" : "text-[#115746]")}>{m.val}</div>
              <div className={cn("text-[11px] mt-1 font-medium", m.warn ? "text-[#c2410c]" : "text-[#166534]")}>{m.sub}</div>
            </Card>
          ))}
        </div>

        {/* Policy reminder */}
        <div className="flex items-start gap-2 bg-[#fff8e1] rounded-[8px] p-[10px_14px] text-[12px] text-[#8a6f00] mb-4">
          <Info className="w-4 h-4 shrink-0 mt-px" />
          <span>
            Patron cancelled after paying: 90% back (10% fee, max ₦5,000). Zart cancelled: 100% back.
            Send refunds by bank transfer within 3 business days.
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "text-[12px] p-[5px_14px] rounded-[20px] border-[1.5px] border-[#e0e0e0] text-[#888] font-medium transition-all hover:border-[#115746] hover:text-[#115746]",
                tab === t.key && "bg-[#115746] text-white border-[#115746] hover:text-white"
              )}
            >
              {t.label} ({t.key === "pending" ? pendingList.length : sentList.length})
            </button>
          ))}
        </div>

        {listError ? (
          <div className="flex items-center gap-1.5 bg-[#fff5f2] border border-[#ffd4c7] rounded-[6px] p-[8px_12px] text-[12px] text-[#FA4812] font-semibold">
            <Info className="w-3.5 h-3.5 text-[#FA4812] shrink-0" />
            {getApiErrorMessage(listError, "Could not load refunds. Please try again.")}
          </div>
        ) : list.length === 0 ? (
          <Card className="p-[32px_16px] text-center text-[13px] text-[#aaa]">
            {tab === "pending" ? "No refunds waiting to be sent." : "No refunds sent yet."}
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((r) => (
              <RefundCard
                key={r.id}
                refund={r}
                onMarkSent={handleMarkSent}
                isMarking={markSentMutation.isPending && markSentMutation.variables?.id === r.id}
                markError={markSentMutation.variables?.id === r.id ? markSentMutation.error : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
