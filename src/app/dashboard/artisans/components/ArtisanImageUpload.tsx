"use client";

import React, { useRef } from "react";
import { CameraIcon } from "@/components/ui/Icons";

interface ArtisanImageUploadProps {
  value: string | null;
  onChange: (base64: string | null) => void;
  firstName?: string;
  lastName?: string;
}

export function ArtisanImageUpload({ value, onChange, firstName = "", lastName = "" }: ArtisanImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "A";

  return (
    <div className="flex flex-col items-center gap-2 mb-4 font-outfit">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-[#115746]/30 hover:border-[#115746] flex items-center justify-center transition-all bg-[#fafafa] shadow-inner"
      >
        {value ? (
          <img
            src={value}
            alt="Artisan profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="text-[18px] font-bold text-[#115746]">{initials}</span>
            <span className="text-[8px] text-[#aaa] font-semibold tracking-wider mt-0.5">ADD PHOTO</span>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#115746]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white">
          <CameraIcon className="w-5 h-5 text-white" />
          <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Upload</span>
        </div>
      </div>
      
      {value && (
        <button
          type="button"
          onClick={handleRemove}
          className="text-[10px] font-bold text-[#c41c1c] hover:underline bg-transparent border-none cursor-pointer p-1"
        >
          Remove Image
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
