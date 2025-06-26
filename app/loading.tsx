import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <LoaderCircle
        size={30}
        className="animate-spin transition-all duration-1000 text-primary"
      />
    </div>
  );
}
