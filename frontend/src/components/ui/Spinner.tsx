import { cn } from "@/lib/utils";

export function Spinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div
      className={cn(
        "border-2 border-accent/20 border-t-accent rounded-full animate-spin",
        sizes[size],
        className
      )}
    />
  );
}
