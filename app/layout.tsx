import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { PlanProvider } from "@/context/plan";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "قرأنى",
  description: "هذا التطبيق يساعدك علي وضع خطه لحفظ القران الكريم",
};

const geistSans = Cairo({
  variable: "--font-cairo-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* light mode background */}
          <div className="block dark:hidden pointer-events-none">
            <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-pink-200 via-purple-200 to-yellow-100 opacity-50 blur-[100px] rounded-full top-0 left-1/4"></div>
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-sky-200 via-indigo-100 to-pink-100 opacity-40 blur-[120px] rounded-full bottom-0 right-1/3"></div>
          </div>

          {/* dark mode background */}
          <div className="hidden dark:block pointer-events-none">
            <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-purple-700 via-indigo-500 to-pink-400 opacity-30 blur-[100px] rounded-full top-0 left-1/4"></div>
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-500 opacity-30 blur-[120px] rounded-full bottom-0 right-1/3"></div>
          </div>
        </div>

        <PlanProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="relative z-10">{children}</main>
          </ThemeProvider>
        </PlanProvider>
      </body>
    </html>
  );
}
