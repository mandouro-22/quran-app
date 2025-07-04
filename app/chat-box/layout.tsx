import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Nav } from "@/components/nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16">
        <div className="w-full container flex justify-between items-center p-3 px-5 text-sm">
          <div className="!sm:flex-grow w-full">
            <Nav />
          </div>
          <div className="max-sm:!flex-grow max-sm:!w-full">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col gap-20 container p-5">
        {children}
      </div>
    </main>
  );
}
