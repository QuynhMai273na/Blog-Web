import { cn } from "../../lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "rose" | "ghost" | "sage" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "rose",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full font-nunito font-medium transition-all cursor-pointer inline-flex items-center justify-center gap-2",
        {
          "bg-rose text-white hover:bg-rose/90": variant === "rose",
          "bg-transparent text-rose border-[1.5px] border-rose-light hover:bg-rose-pale":
            variant === "ghost",
          "bg-sage text-white hover:bg-sage/90": variant === "sage",
          "bg-transparent text-ink-warm border border-petal hover:bg-rose-pale":
            variant === "outline",
          "text-xs px-4 py-1.5": size === "sm",
          "text-base px-5 py-2": size === "md",
          "text-sm px-6 py-2.5": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
