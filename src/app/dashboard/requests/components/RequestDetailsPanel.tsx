"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import { ServiceRequestDetail, ServiceRequestStatus, Artisan, Invoice, InvoiceItem } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/PageLoader";
import { STATUS_LABELS } from "../../../../features/requests/constants";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  FileText, 
  Send, 
  Check, 
  Printer, 
  Phone, 
  MessageSquare,
  Lock,
  Folder,
  Info
} from "lucide-react";

interface RequestDetailsPanelProps {
  selected: ServiceRequestDetail;
  isDetailLoading: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  reqStatus: ServiceRequestStatus;
  handleUpdateStatus: (status: ServiceRequestStatus) => void;
  updateStatusMutation: { isPending: boolean };
  showAssignDropdown: boolean;
  setShowAssignDropdown: (show: boolean) => void;
  selectedArtisanId: string;
  setSelectedArtisanId: (id: string) => void;
  artisansList: Artisan[];
  handleAssign: () => void;
  assignArtisanMutation: { isPending: boolean };
  invoice: Invoice | null | undefined;
  isInvoiceLoading: boolean;
  createInvoiceMutation: any;
  updateInvoiceMutation: any;
  sendInvoiceMutation: any;
  markInvoicePaidMutation: any;
  note: string;
  setNote: (note: string) => void;
  handleAddNote: () => void;
  addNoteMutation: { isPending: boolean };
}

export function RequestDetailsPanel({
  selected,
  isDetailLoading,
  selectedId,
  setSelectedId,
  reqStatus,
  handleUpdateStatus,
  updateStatusMutation,
  showAssignDropdown,
  setShowAssignDropdown,
  selectedArtisanId,
  setSelectedArtisanId,
  artisansList,
  handleAssign,
  assignArtisanMutation,
  invoice,
  isInvoiceLoading,
  createInvoiceMutation,
  updateInvoiceMutation,
  sendInvoiceMutation,
  markInvoicePaidMutation,
  note,
  setNote,
  handleAddNote,
  addNoteMutation,
}: RequestDetailsPanelProps) {
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", qty: 1, unitPrice: 0 }
  ]);

  useEffect(() => {
    if (invoice) {
      setDescription(invoice.description || "");
      const parsedDiscount = typeof invoice.discount === 'number'
        ? invoice.discount
        : parseInt(invoice.discount as string) || 0;
      setDiscount(invoice.discountAmount ?? parsedDiscount);
      setItems(invoice.items && invoice.items.length > 0 ? invoice.items : [{ description: "", qty: 1, unitPrice: 0 }]);
    } else {
      setDescription(selected?.title || "");
      setDiscount(0);
      setItems([{ description: selected?.title ? `${selected.title} - labour & materials` : "", qty: 1, unitPrice: 0 }]);
    }
  }, [invoice, selected?.id]);

  const handleAddItem = () => {
    setItems([...items, { description: "", qty: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      setItems([{ description: "", qty: 1, unitPrice: 0 }]);
    } else {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, key: keyof InvoiceItem, val: string | number) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [key]: val
    } as InvoiceItem;
    setItems(updated);
  };

  const subtotal = items.reduce((acc, it) => acc + (it.qty * it.unitPrice), 0);
  const feePercent = subtotal >= 400000 ? 0.08 : 0.1;
  const fee = Math.round(subtotal * feePercent);
  const total = Math.max(0, subtotal + fee - discount);
  return (
    <div className={cn(
      "flex-1 flex flex-col overflow-hidden bg-[#f9f9f9] min-h-0 relative",
      selectedId === null ? "hidden md:flex" : "flex"
    )}>
      {isDetailLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <PageLoader />
        </div>
      )}
      <div className="bg-white border-b border-[#e8e8e8] p-[16px_20px] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 shrink-0">
        <div>
          <button
            onClick={() => setSelectedId(null)}
            className="md:hidden flex items-center gap-1 text-[13px] font-semibold text-[#115746] bg-transparent border-none cursor-pointer mb-2.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to requests
          </button>
          <div className="text-[17px] font-bold text-[#115746] mb-1">{selected.title}</div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#aaa]">#{selected.id}</span>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-[6px] font-semibold", `cat-${selected.artisanType?.name?.toLowerCase().substring(0, 5)}`,
              selected.artisanType?.name?.toLowerCase().includes('plumb') && "bg-[#e0f0ff] text-[#1e5a8e]",
              selected.artisanType?.name?.toLowerCase().includes('elec') && "bg-[#fff3cc] text-[#8a5f00]",
              selected.artisanType?.name?.toLowerCase().includes('carp') && "bg-[#e8f5e8] text-[#2a6b2a]",
              selected.artisanType?.name?.toLowerCase().includes('paint') && "bg-[#f0eaff] text-[#5a3d8a]",
              selected.artisanType?.name?.toLowerCase().includes('ac') && "bg-[#e0f8f8] text-[#1a6a6a]",
              selected.artisanType?.name?.toLowerCase().includes('clean') && "bg-[#ffe8e8] text-[#8a2020]"
            )}>{selected.artisanType?.name}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <span className={cn(
            "text-[10px] font-bold px-3 py-1.5 rounded-[12px] border uppercase tracking-wider shrink-0",
            reqStatus === 'pending' && "bg-[#FDF4D7] text-[#8a6f00] border-[#e8d98a]",
            reqStatus === 'assigned' && "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]",
            reqStatus === 'in_progress' && "bg-[#fff5f2] text-[#FA4812] border-[#ffd4c7]",
            reqStatus === 'completed' && "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]",
            reqStatus === 'cancelled' && "bg-[#f5f5f5] text-[#737373] border-[#e5e5e5]",
            reqStatus === 'disputed' && "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]"
          )}>
            {STATUS_LABELS[reqStatus] || reqStatus}
          </span>

          {/* Action Buttons */}
          {reqStatus === 'pending' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                variant="outline"
                className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider border-[#c41c1c] text-[#c41c1c] hover:bg-[#c41c1c] hover:text-white transition-all duration-200"
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={updateStatusMutation.isPending}
              >
                Cancel
              </Button>

              {!showAssignDropdown ? (
                <Button
                  variant="primary"
                  className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider"
                  onClick={() => setShowAssignDropdown(true)}
                >
                  Assign
                </Button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Select
                    className="h-8 text-[11px] py-0 w-[180px]"
                    value={selectedArtisanId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedArtisanId(e.target.value)}
                  >
                    <option value="">Select artisan...</option>
                    {artisansList?.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.user.firstName} {a.user.lastName} ({a.artisanType.name})
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="primary"
                    className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider"
                    onClick={() => {
                      handleAssign();
                      setShowAssignDropdown(false);
                    }}
                    disabled={assignArtisanMutation.isPending || !selectedArtisanId}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 text-[11px] font-bold px-2.5 uppercase tracking-wider"
                    onClick={() => setShowAssignDropdown(false)}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          )}

          {(reqStatus === 'assigned' || reqStatus === 'in_progress') && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider border-[#c41c1c] text-[#c41c1c] hover:bg-[#c41c1c] hover:text-white transition-all duration-200"
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={updateStatusMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider"
                onClick={() => handleUpdateStatus('completed')}
                disabled={updateStatusMutation.isPending}
              >
                Complete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5 min-h-0">
        {/* Patron */}
        <Card className="shrink-0">
          <CardHeader><CardTitle>Patron details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-[#aaa] font-medium">Name</div>
                <div className="text-[13px] text-[#1a1a1a] font-semibold">{selected.patron?.firstName} {selected.patron?.lastName}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-[#aaa] font-medium">Phone</div>
                <div className="text-[13px] text-[#115746] font-semibold underline cursor-pointer">{selected.patron?.phone || "N/A"}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-[#aaa] font-medium">Location</div>
                <div className="text-[13px] text-[#1a1a1a] font-semibold">{selected.address}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-[#aaa] font-medium font-outfit">Requested</div>
                <div className="text-[13px] text-[#1a1a1a] font-semibold">{formatDate(selected.createdAt || new Date())}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-[#aaa] font-medium font-outfit">Scheduled For</div>
                <div className="text-[13px] text-[#1e5a8e] font-semibold">
                  {selected.scheduledAt ? formatDateTime(selected.scheduledAt) : "Not scheduled"}
                </div>
              </div>
            </div>
            <p className="text-[13px] text-[#555] leading-relaxed mb-3">
              {selected.description}
            </p>
            <div className="flex gap-2 mb-3.5 flex-wrap">
              {selected.media && selected.media.length > 0 ? (
                selected.media.map((m: any) => (
                  <a key={m.id} href={m.mediaUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-[#f5f5f5] rounded-lg border-[1.5px] border-[#e8e8e8] flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-90 transition-opacity">
                    {m.mediaType === 'image' ? (
                      <img src={m.mediaUrl} alt="Request media" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#115746] flex items-center justify-center w-full h-full bg-[#f0fcf9]"><Folder className="w-6 h-6" /></div>
                    )}
                  </a>
                ))
              ) : (
                <div className="text-[12px] text-[#aaa] italic py-2">No media attached</div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold" onClick={() => selected.patron?.phone && window.open(`tel:${selected.patron.phone}`)}>
                <Phone className="w-4 h-4" /> Call patron
              </Button>
              <Button variant="wa" className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold" onClick={() => selected.patron?.phone && window.open(`https://wa.me/${selected.patron.phone.replace(/[^0-9]/g, "")}`)}>
                <MessageSquare className="w-4 h-4" /> Notify patron in app
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assign */}
        <Card className="shrink-0">
          <CardHeader><CardTitle>Assign artisan</CardTitle></CardHeader>
          <CardContent>
            {reqStatus === 'pending' ? (
              <div className="flex flex-col gap-2.5">
                <Select
                  className="w-full"
                  value={selectedArtisanId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedArtisanId(e.target.value)}
                >
                  <option value="">Select an artisan...</option>
                  {artisansList?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.user?.firstName} {a.user?.lastName} — {a.artisanType.name} · {a.operatingArea.join(', ')} · ★ {a.rating ?? "—"} ({a.jobsDone} jobs)
                    </option>
                  ))}
                </Select>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleAssign}
                  disabled={assignArtisanMutation.isPending || !selectedArtisanId}
                >
                  {assignArtisanMutation.isPending ? "Assigning..." : "Assign artisan & notify patron via app"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] text-[#aaa] font-medium">Assigned Artisan</div>
                {selected.artisan ? (
                  <div className="bg-[#e8f5f0] border border-[#b2d8cc] rounded-[8px] p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[13px] text-[#115746] font-bold">{`${selected.artisan.firstName} ${selected.artisan.lastName}`}</div>
                      <div className="text-[11px] text-[#888] mt-0.5">{selected.artisan.phone || "No phone"}</div>
                    </div>
                    <span className="text-[10px] bg-[#115746] text-white font-bold px-2.5 py-0.5 rounded-[10px] uppercase">Assigned</span>
                  </div>
                ) : (
                  <div className="text-[12px] text-[#888] italic">No artisan assigned.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice */}
        <Card className="shrink-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#115746]" />
              <span>Invoice generator</span>
              {invoice && (
                <span className="text-[10px] font-extrabold bg-[#e8f5f0] text-[#115746] border border-[#b2d8cc] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Generated Previously
                </span>
              )}
            </CardTitle>
            <span className="text-[11px] text-[#aaa]">Auto-sends to patron in app on completion</span>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {isInvoiceLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-6 h-6 border-2 border-[#115746] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="min-w-[380px] bg-[#fff] border-[1.5px] border-[#e8e8e8] rounded-[12px] p-5 shadow-sm relative overflow-hidden">
                {/* Generated previously banner */}
                {invoice ? (
                  <div className="bg-[#e8f5f0] border border-[#b2d8cc] rounded-lg p-[10px_12px] text-[12.5px] text-[#115746] font-semibold mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#115746]" />
                    <span>This invoice was generated previously. Status: <strong className="uppercase">{invoice.status}</strong></span>
                  </div>
                ) : (
                  <div className="bg-[#fff8e1] border border-[#ffe082] rounded-lg p-[10px_12px] text-[12.5px] text-[#8a6f00] font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#8a6f00]" />
                    <span>No invoice generated previously. Ready to create a draft.</span>
                  </div>
                )}

                {/* Status Header */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#f0f0f0]">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#115746] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Invoice details
                    </span>
                    <span className={cn(
                      "text-[9px] font-bold px-2.5 py-0.5 rounded-[10px] border uppercase tracking-wider",
                      !invoice && "bg-[#f5f5f5] text-[#737373] border-[#e5e5e5]",
                      invoice?.status === 'draft' && "bg-[#fff5f2] text-[#FA4812] border-[#ffd4c7]",
                      invoice?.status === 'sent' && "bg-[#fff9e6] text-[#b27b00] border-[#ffe082]",
                      invoice?.status === 'paid' && "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]"
                    )}>
                      {invoice ? invoice.status : 'no invoice'}
                    </span>
                  </div>
                  {invoice?.status === 'paid' && (
                    <div className="text-[11px] text-[#115746] font-bold flex items-center gap-1 bg-[#e8f5f0] px-2.5 py-1 rounded-[6px]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> PAID
                    </div>
                  )}
                </div>

                {/* Form: Editable for No Invoice or Draft */}
                {(!invoice || invoice.status === 'draft') ? (
                  <div className="flex flex-col gap-4">
                    {/* Invoice General Description */}
                    <div>
                      <label className="text-[10px] text-[#888] font-bold uppercase tracking-wider block mb-1">
                        Invoice Description / Scope
                      </label>
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Repair of 1 Unit Rechargeable Fan"
                        className="h-9 text-[13px] border-[#d1d5db] focus:border-[#115746] w-full"
                      />
                    </div>

                    {/* Dynamic Items list */}
                    <div>
                      <label className="text-[10px] text-[#888] font-bold uppercase tracking-wider block mb-2">
                        Line Items
                      </label>
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-[1fr_50px_90px_30px] gap-1.5 text-[10px] text-[#aaa] font-bold uppercase tracking-wider">
                          <span>Description</span>
                          <span className="text-center">Qty</span>
                          <span className="text-right">Unit Price</span>
                          <span></span>
                        </div>

                        {items.map((item, idx) => (
                          <div key={idx} className="grid grid-cols-[1fr_50px_90px_30px] gap-1.5 items-center">
                            <Input
                              value={item.description}
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                              placeholder="e.g. Sink leak repair"
                              className="h-8 text-[12px] border-[#e5e7eb]"
                            />
                            <Input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)}
                              className="h-8 text-[12px] border-[#e5e7eb] text-center"
                            />
                            <div className="relative">
                              <Input
                                value={item.unitPrice === 0 ? "" : item.unitPrice}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
                                  handleItemChange(idx, 'unitPrice', val);
                                }}
                                placeholder="₦0"
                                className="h-8 text-[12px] border-[#e5e7eb] pl-4 text-right"
                              />
                              <span className="absolute left-1.5 top-2 text-[11px] text-[#aaa]">₦</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-[#c41c1c] hover:bg-red-50 h-8 w-8 flex items-center justify-center rounded-md border-none bg-transparent cursor-pointer text-sm"
                            >
                              <Trash2 className="w-4 h-4 text-[#c41c1c]" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="text-[12px] font-bold text-[#115746] border border-dashed border-[#115746]/30 hover:border-[#115746] rounded-lg py-1.5 text-center bg-transparent cursor-pointer hover:bg-[#115746]/5 transition-all mt-1 flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Item Row
                        </button>
                      </div>
                    </div>

                    {/* Discount input */}
                    <div className="w-[180px] self-end">
                      <label className="text-[10px] text-[#888] font-bold uppercase tracking-wider block mb-1 text-right">
                        Discount (₦)
                      </label>
                      <div className="relative">
                        <Input
                          value={discount === 0 ? "" : discount}
                          onChange={(e) => setDiscount(parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                          placeholder="₦0"
                          className="h-8 text-[12px] border-[#e5e7eb] pl-4 text-right"
                        />
                        <span className="absolute left-1.5 top-2 text-[11px] text-[#aaa]">₦</span>
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-[#f0f0f0] pt-3.5 mt-2 flex flex-col gap-2">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#666]">Subtotal</span>
                        <span className="font-semibold text-[#1a1a1a]">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#666]">Zart Service Fee ({subtotal >= 400000 ? "8%" : "10%"})</span>
                        <span className="font-semibold text-[#FA4812]">{formatCurrency(fee)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-[13px] text-green-600">
                          <span>Discount</span>
                          <span className="font-semibold">-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t-2 border-[#115746]/10 pt-2.5 mt-1">
                        <span className="text-[14px] font-bold text-[#1a1a1a]">Total due</span>
                        <span className="text-[18px] font-bold text-[#115746]">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* Form actions */}
                    <div className="flex gap-2.5 mt-3 border-t border-[#f0f0f0] pt-4">
                      <Button
                        variant="outline"
                        className="flex-1 text-[11px] font-bold px-3 uppercase tracking-wider flex items-center justify-center gap-2"
                        onClick={() => {
                          const payload = {
                            description,
                            discount,
                            items: items.filter(it => it.description.trim() !== "")
                          };
                          if (invoice) {
                            updateInvoiceMutation.mutate({ requestId: selected.id.toString(), data: payload });
                          } else {
                            createInvoiceMutation.mutate({ requestId: selected.id.toString(), data: payload });
                          }
                        }}
                        disabled={
                          createInvoiceMutation.isPending ||
                          updateInvoiceMutation.isPending ||
                          items.filter(it => it.description.trim() !== "").length === 0
                        }
                      >
                        <FileText className="w-4 h-4" /> {createInvoiceMutation.isPending || updateInvoiceMutation.isPending ? "Saving..." : invoice ? "Update Draft" : "Create Draft"}
                      </Button>

                      {invoice && (
                        <Button
                          variant="primary"
                          className="flex-1 text-[11px] font-bold px-3 uppercase tracking-wider flex items-center justify-center gap-2"
                          onClick={() => {
                            sendInvoiceMutation.mutate(selected.id.toString());
                          }}
                          disabled={sendInvoiceMutation.isPending}
                        >
                          <Send className="w-4 h-4" /> {sendInvoiceMutation.isPending ? "Sending..." : "Send to Patron"}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Read-Only State: Sent or Paid */
                  <div className="flex flex-col gap-4">
                    {invoice.status === 'paid' && (
                      <div className="absolute right-[-30px] top-[15px] bg-[#115746] text-[#FDF4D7] text-[8px] font-bold py-1 px-8 rotate-[45deg] uppercase tracking-widest shadow-sm">
                        Paid
                      </div>
                    )}

                    <div>
                      <div className="text-[10px] text-[#aaa] font-bold uppercase tracking-wider">Main Description</div>
                      <div className="text-[14px] text-[#1a1a1a] font-bold mt-0.5">{invoice.description}</div>
                    </div>

                    {/* Read-Only Items Table */}
                    <div className="flex flex-col gap-1.5">
                      <div className="grid grid-cols-[1fr_50px_90px] gap-1.5 text-[10px] text-[#aaa] font-bold uppercase tracking-wider border-b border-[#f0f0f0] pb-1">
                        <span>Description</span>
                        <span className="text-center">Qty</span>
                        <span className="text-right">Price</span>
                      </div>
                      {(invoice?.items || []).map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_50px_90px] gap-1.5 text-[12px] text-[#333] items-center">
                          <span className="truncate">{item.description}</span>
                          <span className="text-center">{item.qty}</span>
                          <span className="text-right font-medium">{formatCurrency(item.unitPrice)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-[#f0f0f0] pt-3 flex flex-col gap-1.5">
                      <div className="flex justify-between text-[12px]">
                        <span className="text-[#888]">Subtotal</span>
                        <span className="font-medium text-[#1a1a1a]">{formatCurrency(invoice.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="text-[#888]">Zart Service Fee</span>
                        <span className="font-medium text-[#FA4812]">
                          {formatCurrency(invoice.serviceFeeAmount ?? invoice.fee ?? 0)}
                        </span>
                      </div>
                      {((invoice.discountAmount ?? 0) > 0 || parseFloat(invoice.discount as any) > 0) && (
                        <div className="flex justify-between text-[12px] text-green-600">
                          <span>Discount</span>
                          <span className="font-medium">
                            -{formatCurrency(invoice.discountAmount ?? parseFloat(invoice.discount as any))}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t-2 border-[#115746]/10 pt-2 mt-1">
                        <span className="text-[13px] font-bold text-[#1a1a1a]">Total due</span>
                        <span className="text-[16px] font-extrabold text-[#115746]">{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2.5 mt-3 border-t border-[#f0f0f0] pt-4">
                      {invoice.status === 'sent' && (
                        <>
                          <Button
                            variant="outline"
                            className="flex-1 text-[11px] font-bold px-3 uppercase tracking-wider flex items-center justify-center gap-2"
                            onClick={() => sendInvoiceMutation.mutate(selected.id.toString())}
                            disabled={sendInvoiceMutation.isPending}
                          >
                            <Send className="w-4 h-4" /> {sendInvoiceMutation.isPending ? "Resending..." : "Resend to Patron"}
                          </Button>
                          <Button
                            variant="primary"
                            className="flex-1 text-[11px] font-bold px-3 uppercase tracking-wider flex items-center justify-center gap-2"
                            onClick={() => markInvoicePaidMutation.mutate(selected.id.toString())}
                            disabled={markInvoicePaidMutation.isPending}
                          >
                            <Check className="w-4 h-4" /> {markInvoicePaidMutation.isPending ? "Mark Paid" : "Mark as Paid"}
                          </Button>
                        </>
                      )}

                      {invoice.status === 'paid' && (
                        <Button
                          variant="outline"
                          className="w-full text-[11px] font-bold px-3 uppercase tracking-wider border-[#115746] text-[#115746] hover:bg-[#e8f5f0] flex items-center justify-center gap-2"
                          onClick={() => {
                            window.print();
                          }}
                        >
                          <Printer className="w-4 h-4" /> Print Invoice Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="shrink-0 mb-5">
          <CardHeader><CardTitle>Internal notes</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 bg-[#fff8e1] border border-[#ffe082] rounded-[6px] p-[6px_10px] text-[11px] text-[#8a6f00] font-semibold mb-2">
              <Lock className="w-3.5 h-3.5 text-[#8a6f00]" /> Internal only — patron cannot see these notes
            </div>
            <div className="flex flex-col gap-2">
              {((selected as ServiceRequestDetail).notes || []).map((n: any, i: number) => (
                <div key={n.id || i} className={cn("bg-[#f9f9f9] rounded-lg p-[10px_12px] border-l-[3px] border-[#115746] transition-opacity", n.sending && "opacity-70")}>
                  <div className="text-[12px] text-[#555] leading-relaxed">{n.note}</div>
                  <div className="text-[10px] text-[#aaa] mt-1 flex justify-between items-center">
                    <span>By {n.admin ? `${n.admin.firstName} ${n.admin.lastName}` : "Admin"}</span>
                    <span>{n.sending ? "" : `${(n.createdAt ? new Date(n.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "Just now")}`}</span>
                  </div>
                </div>
              ))}
              {((selected as ServiceRequestDetail).notes || []).length === 0 && (
                <div className="text-[12px] text-[#aaa] italic py-2 text-center">No internal notes yet.</div>
              )}
            </div>
            <textarea
              value={note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="Add an internal note (e.g. 'called patron, no answer')..."
              className="w-full bg-[#f9f9f9] border-[1.5px] border-[#e0e0e0] rounded-lg p-[10px_12px] text-[13px] text-[#333] font-outfit resize-none h-[72px] mt-2.5 focus:outline-none focus:border-[#115746]"
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="primary"
                className="text-[12px] h-8"
                onClick={handleAddNote}
                disabled={addNoteMutation.isPending}
              >
                {addNoteMutation.isPending ? "Adding..." : "Add note"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
