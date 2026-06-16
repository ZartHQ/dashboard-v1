import { cn } from "@/lib/utils";

export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center w-full h-full min-h-[200px] flex-1", className)}>
      <img 
        src="/zart-logo.png" 
        alt="Loading..." 
        className="w-12 h-12 object-contain animate-zoom-pulse" 
      />
    </div>
  );
}
