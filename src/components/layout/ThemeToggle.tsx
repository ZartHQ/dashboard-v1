"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme | null) ??
      "light";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("zart-theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex items-center gap-[10px] w-full p-[9px_16px] text-[13px] text-[#FDF4D7]/75",
        "cursor-pointer border-l-[3px] border-transparent transition-all",
        "hover:bg-white/5 hover:text-[#FDF4D7] bg-transparent",
      )}
    >
      {/* keep layout stable before hydration */}
      {mounted && isDark ? (
        <Sun className="w-4 h-4 text-[#FDF4D7]/65 shrink-0" />
      ) : (
        <Moon className="w-4 h-4 text-[#FDF4D7]/65 shrink-0" />
      )}
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
