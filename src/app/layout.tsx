import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/state/store";

export const metadata: Metadata = {
  title: "Dermashop LB — Premium Hair & Skin",
  description:
    "Luxury clinical hair & skin solutions in Lebanon. Fast WhatsApp checkout. Pay via Wish Money."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

