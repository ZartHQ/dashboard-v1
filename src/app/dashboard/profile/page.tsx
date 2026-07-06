"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/features/auth/auth";
import { AUTH_QUERY_KEY } from "@/features/auth/queries";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/PageLoader";
import { formatDate } from "@/lib/utils";
import { 
  UserIcon, 
  CameraIcon, 
  ActivityIcon, 
  CalendarIcon, 
  ShieldIcon, 
  MailIcon, 
  LockIcon, 
  PhoneIcon, 
  MapPinIcon, 
  AlertCircleIcon, 
  CheckIcon 
} from "@/components/ui/Icons";

export default function ProfilePage() {
  const { admin, loading } = useAdmin();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // UI state
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Sync state with admin details once loaded
  useEffect(() => {
    if (admin) {
      setFirstName(admin.firstName || "");
      setLastName(admin.lastName || "");
      setPhone(admin.phone || "");
      setHomeAddress(admin.homeAddress || "");
      setImage(admin.image || null);
    }
  }, [admin]);

  if (loading || !admin) {
    return <PageLoader />;
  }

  // Handle image upload and conversion to base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call delay for a premium interactive feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Update local react-query query cache so it is reflected in the sidebar immediately
      const currentQueryData = queryClient.getQueryData<any>(AUTH_QUERY_KEY);
      const updatedData = {
        ...currentQueryData,
        firstName,
        lastName,
        phone,
        homeAddress,
        image,
      };

      queryClient.setQueryData(AUTH_QUERY_KEY, updatedData);

      setToastMessage("Profile updated successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage("Failed to update profile.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "AD";
  const memberSince = admin.createdAt 
    ? formatDate(admin.createdAt)
    : "June 23, 2026";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa]">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#115746] text-white p-[12px_20px] rounded-[10px] shadow-lg flex items-center gap-2.5 z-[9999] transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white/20 rounded-full p-1">
            <CheckIcon className="w-4 h-4 text-white animate-scale-up" />
          </div>
          <span className="text-[13px] font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Topbar Header */}
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="text-[16px] font-bold text-[#115746] flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          <span>My Profile</span>
        </div>
        <Badge variant="vetted" className="text-[11px] px-2 py-1">
          {admin.role || "Administrator"}
        </Badge>
      </div>

      {/* Main Content Area */}
      <div className="p-6 overflow-y-auto flex-1 max-w-[1200px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Avatar & Overview */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="text-center p-6 flex flex-col items-center">
              {/* Avatar Uploader container */}
              <div className="relative group cursor-pointer mb-4" onClick={triggerFileInput}>
                {image ? (
                  <img
                    src={image}
                    alt={`${firstName} ${lastName}`}
                    className="w-28 h-28 rounded-full object-cover border-4 border-[#115746]/10 shadow-sm"
                  />
                ) : (
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center text-[32px] font-bold text-white shadow-sm"
                    style={{ background: "#FA4812" }}
                  >
                    {initials}
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CameraIcon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Change photo</span>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Basic Admin Info */}
              <h2 className="text-[18px] font-bold text-[#1a1a1a] mb-0.5 leading-snug">
                {firstName} {lastName}
              </h2>
              <p className="text-[12px] font-semibold text-[#FA4812] uppercase tracking-wider mb-3">
                {admin.role || "Admin"}
              </p>
              
              <div className="w-full h-[1px] bg-[#f0f0f0] my-4" />

              {/* Status details */}
              <div className="w-full flex flex-col gap-3 text-left text-[13px]">
                <div className="flex items-center justify-between text-[#888]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ActivityIcon className="w-4 h-4 text-[#115746]" /> Account Status
                  </span>
                  <Badge variant="vetted" className="font-semibold px-2 py-0.5 text-[10px]">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[#888]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CalendarIcon className="w-4 h-4 text-[#115746]" /> Registered
                  </span>
                  <span className="text-[#1a1a1a] font-medium">{memberSince}</span>
                </div>
              </div>
            </Card>

            {/* Permissions Summary Card */}
            <Card>
              <CardHeader className="border-b border-[#e8e8e8] p-[12px_16px]">
                <CardTitle className="text-[11px] flex items-center gap-1.5">
                  <ShieldIcon className="w-4 h-4 text-[#115746]" /> System Access & Role
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
                  Your account is assigned the <strong className="text-[#115746] font-semibold">{admin.role || "Admin"}</strong> role. Below are the specific backend operations you are authorized to run.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {admin.permissions && admin.permissions.length > 0 ? (
                    admin.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-[6px] bg-[#f0fff4] text-[#115746] border border-[#b2d8cc]"
                      >
                        {perm}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">No special permissions assigned.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b border-[#e8e8e8] p-[16px_20px]">
                <CardTitle className="text-[13px]">Personal Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-[20px_24px]">
                <form onSubmit={handleSave} className="flex flex-col gap-5">
                  
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                        First Name
                      </label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email address (readonly) */}
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      Email Address <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={admin.email || ""}
                        disabled
                        className="bg-gray-50 border-gray-200 text-gray-500 pl-10 cursor-not-allowed"
                      />
                      <MailIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Email address is managed by organization directories and cannot be modified.
                    </span>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="pl-10"
                      />
                      <PhoneIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Home Address */}
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                      Office / Residential Address
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        placeholder="12, Lagos Way, Ikoyi, Lagos"
                        className="pl-10"
                      />
                      <MapPinIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Notice Alert */}
                  <div className="bg-[#fff8f6] border border-[#fecaca] rounded-[10px] p-3.5 flex items-start gap-2.5 mt-2">
                    <AlertCircleIcon className="w-5 h-5 text-[#FA4812] shrink-0 mt-0.5" />
                    <div className="text-[12px] text-gray-600 leading-relaxed">
                      <strong className="text-[#FA4812] font-semibold">Important details:</strong> Modifications made to your profile details will reflect locally across your current browser session immediately. Any updates to authentication keys or permanent database credentials must be completed via your IAM manager.
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-[#f0f0f0] my-2" />

                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="px-6 py-2.5 h-10 text-[13px] font-bold"
                      isLoading={saving}
                    >
                      Save Changes
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
