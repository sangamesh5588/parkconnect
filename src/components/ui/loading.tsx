import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Loading = ({ size = "md", className }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-primary border-t-transparent",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({ message = "Loading...", className }: LoadingOverlayProps) => {
  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <Loading size="lg" />
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  onClick?: () => void;
}

export const LoadingButton = ({
  loading,
  children,
  loadingText = "Loading...",
  className,
  onClick
}: LoadingButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2",
        loading && "cursor-not-allowed opacity-70",
        className
      )}
      disabled={loading}
      onClick={onClick}
    >
      {loading && <Loading size="sm" />}
      {loading ? loadingText : children}
    </button>
  );
};
