import type { Metadata } from "next";
import { Cinzel, Inter, Poppins, Share_Tech_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/SmoothScroll";
import { OordhwaLogo } from "@/components/OordhwaLogo";
import "./globals.css";

const cinzel = Cinzel({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  display: "swap",
});

const blackOpsOne = localFont({
  src: "../assets/fonts/BlackOpsOne-Regular.ttf",
  variable: "--font-black-ops",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Oordhwa",
    template: "%s | Oordhwa",
  },
  description:
    "Building the future with technology 🚀 | Web & App Development | AI Solutions | Hardware Solutions | Oordhwa Tech Solutions — Your partner for smart digital transformation.",
  keywords: [
    "web development",
    "app development",
    "Ai product in kundapura",
    "karnataka",
    "Oordhwa",
    "oordhwa techsolutions",
    "tech company",
    "tech solution in kundapuar karntaka",
    "upudi",
    "best tech company in kundapura",
    "Oordhwa Tech Solutions",
    "AI solutions Kundapura",
    "Udupi tech company",
  ],
  authors: [{ name: "Oordhwa Tech Solutions" }],
  creator: "Oordhwa Tech Solutions",
  publisher: "Oordhwa Tech Solutions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/oordhwa-icon.png",
    shortcut: "/oordhwa-icon.png",
    apple: "/oordhwa-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oordhwa.com",
    title: "Oordhwa Tech Solutions",
    description:
      "Building the future with technology 🚀 | Web & App Development | AI Solutions | Hardware Solutions | Oordhwa Tech Solutions — Your partner for smart digital transformation.",
    siteName: "Oordhwa Tech Solutions",
    images: [
      {
        url: "/oordhwa-logo.png",
        width: 1200,
        height: 630,
        alt: "Oordhwa Tech Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oordhwa Tech Solutions",
    description:
      "Building the future with technology 🚀 | Web & App Development | AI Solutions | Hardware Solutions | Oordhwa Tech Solutions — Your partner for smart digital transformation.",
    images: ["/oordhwa-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${poppins.variable} ${inter.variable} ${shareTechMono.variable} ${blackOpsOne.variable}`}
    >
      <body className="font-body bg-black text-white antialiased">
        <SmoothScroll>
          <OordhwaLogo />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
