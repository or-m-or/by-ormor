import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import "./styles/prosemirror.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/sonner";


const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const dunggeunmo = localFont({
  src: "./fonts/DungGeunMo.woff2",
  display: "swap",
  variable: "--font-dunggeunmo",
});

export const metadata: Metadata = {
  title: "ormor | 태식이의 개인블로그",
  description: "태식이의 개인블로그",
  // 브라우저 확장 프로그램 충돌 방지태
  other: {
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": "frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; object-src 'none';",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${dunggeunmo.variable}`}>
      <head>
        {/* 브라우저 확장 프로그램 충돌 방지 */}
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; object-src 'none';" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body
        className={`${pretendard.variable} antialiased bg-gray-900 text-gray-100`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="bottom-center"
          closeButton
          style={{
            "--normal-border": "none",
          } as React.CSSProperties}
          toastOptions={{
            style: {
              background: 'rgba(10, 15, 25, 0.99)',
              color: 'white',
              border: 'none',
              backdropFilter: 'blur(12px)',
              marginBottom: '100px',
            },
          }}
        />
      </body>
    </html>
  );
}
