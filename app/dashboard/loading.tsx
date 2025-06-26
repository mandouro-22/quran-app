import { LoaderCircle } from "lucide-react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex items-center justify-center">
      <LoaderCircle
        size={30}
        className="animate-spin transition-all duration-1000"
      />
    </div>
  );
}
