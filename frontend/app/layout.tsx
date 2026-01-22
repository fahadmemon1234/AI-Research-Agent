'use client';

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "../lib/auth-context";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Yeh logic check karega agar path "/chat" se start hota hai (e.g. /chat, /chat/, /chat/123)
  const isChatPage = pathname?.startsWith('/chat');
  
  // Optional: Auth pages (login/register) par bhi hide karna chahte hain toh:
  const isAuthPage = pathname?.startsWith('/auth');
  
  const hideLayout = isChatPage || isAuthPage;

  return (
    <html lang="en" style={{ backgroundColor: "#020408" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <title>Genius AI | Knowledge Assistant</title>
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AuthProvider>
          {/* Agar chat ya auth page nahi hai, tabhi Navbar dikhao */}
          {!hideLayout && <Navbar />}

          <main
            style={{
              flex: "1 0 auto",
              display: "flex",
              flexDirection: "column",
              // Chat page par overflow hide karne ke liye
              height: hideLayout ? "100vh" : "auto", 
            }}
          >
            {children}
          </main>

          {!hideLayout && <Footer />}
        </AuthProvider>

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}