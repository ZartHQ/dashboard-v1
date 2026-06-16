"use client";

import { useLoginForm } from "../features/auth/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { form, onSubmit, isLoading, error } = useLoginForm();
  const { register, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Brand side */}
      <div className="bg-[#115746] flex-col justify-between p-12 relative overflow-hidden hidden md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/zart-logo.png" alt="Zart" className="w-11 h-11 object-contain" />
          <span className="text-[28px] font-bold text-[#FDF4D7] tracking-tight">Zart</span>
        </div>

        {/* Tagline */}
        <div>
          <h1 className="text-[40px] font-bold text-[#FDF4D7] leading-tight mb-4">
            Operations<br />
            <span className="text-[#FFC92A]">Dashboard</span>
          </h1>
          <p className="text-[15px] text-[#FDF4D7]/70 leading-relaxed max-w-[360px]">
            Manage requests, artisans, patrons, and every job from one place. Built for the Zart team.
          </p>
        </div>

        <p className="text-[12px] text-[#FDF4D7]/40">
          © 2026 Zart Technology Limited
        </p>
      </div>

      {/* Login form side */}
      <div className="bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-[420px]">
          <h2 className="text-[28px] font-bold text-[#115746] mb-2">
            Welcome back
          </h2>
          <p className="text-[14px] text-gray-400 mb-9">
            Sign in to the Zart admin dashboard
          </p>

          {(error || Object.keys(errors).length > 0) && (
            <div className="bg-[#fff0ec] border border-[#FA4812] rounded-lg p-[10px_14px] text-[13px] text-[#FA4812] mb-4">
              {error || "Please check your credentials"}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <Input
                type="email"
                {...register("email")}
                placeholder="you@zart.ng"
                disabled={isLoading}
                className={cn(errors.email && "border-[#FA4812]")}
              />
              {errors.email && <p className="text-[#FA4812] text-[12px] mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                disabled={isLoading}
                className={cn(errors.password && "border-[#FA4812]")}
              />
              {errors.password && <p className="text-[#FA4812] text-[12px] mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 text-[15px]"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <hr className="border-none border-t border-gray-100 my-7" />
        </div>
      </div>
    </div>
  );
}
