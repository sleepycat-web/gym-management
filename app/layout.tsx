import type { Metadata } from "next"
 import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"

 
export const metadata: Metadata = {
  title: "Gym Management System",
  description: "Manage gym members, fees, and payments",
  manifest: "manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-poppins" >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

