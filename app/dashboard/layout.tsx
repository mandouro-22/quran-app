import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Nav } from "@/components/nav";
// import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      {/* <div className="flex items-center justify-end my-6 container mx-5 p-5">
        <Link
          href={"/chat-box"}
          className="bg-purple-500  dark:bg-purple-700 hover:bg-purple-600 py-2.5 px-6 rounded-md text-white"
        >
          أستخدم الذكاء الأصطناعى فى اٍنشاء الخطة
        </Link>
      </div> */}
    </main>
  );
}
