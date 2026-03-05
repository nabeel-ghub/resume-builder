import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, DM_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "An app by Nabeellatheef",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cn(geist.variable, dmSans.variable)} min-h-dvh`}>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></meta>
      <body className="min-h-dvh bg-gray-900">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
