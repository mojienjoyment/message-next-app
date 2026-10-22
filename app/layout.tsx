import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin Panel Access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main id="root">{children}</main>
      </body>
    </html>
  );
}