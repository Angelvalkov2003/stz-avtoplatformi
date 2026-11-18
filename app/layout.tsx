import type { Metadata } from "next";
import { JetBrains_Mono, Onest, Unbounded } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/cookie-consent";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const shareImage = {
  url: "/images/logo-photo.jpg",
  width: 1200,
  height: 630,
  alt: siteConfig.name,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — наем на автомобилни платформи`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "bg_BG",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [shareImage.url],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bg"
      data-scroll-behavior="smooth"
      className={`${unbounded.variable} ${onest.variable} ${jetbrains.variable} h-full`}
    >
      <head>
        {gaId ? (
          <script
            dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
          />
        ) : null}
      </head>
      <body className="flex min-h-full flex-col bg-white text-graphite antialiased">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1 pb-24">{children}</main>
        <Footer />
        <MobileBookingBar />
        <CookieBanner />
      </body>
    </html>
  );
}
