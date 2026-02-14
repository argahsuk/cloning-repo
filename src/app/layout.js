import { Poppins } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins", 
});

export const metadata = {
  title: "CivicBridge – Transparent Community-Government Feedback",
  description: "Report civic issues, track status, and hold government accountable.",
};
export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 1. added poppins.variable to register the CSS variable
          2. added font-sans to apply Poppins as the primary font 
      */}
      <body className={`${poppins.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <Nav />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      </body>
    </html>
  );
}