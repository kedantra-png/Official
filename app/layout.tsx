import type { Metadata } from "next";
import { Cinzel, Inter, Poppins, Share_Tech_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/SmoothScroll";
import { OordhwaLogo } from "@/components/OordhwaLogo";
import "@/lib/sync-icons-server";
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
  metadataBase: new URL("https://oordhwa.com"),
  title: {
    default: "Oordhwa Tech Solutions (Urdhva Tech) | Software, Web & AI Solutions",
    template: "%s | Oordhwa Tech Solutions",
  },
  description:
    "Oordhwa Tech Solutions (also searched as Urdhva Tech) delivers end-to-end digital solutions, including web development, mobile apps, AI integration, hardware IoT systems, and cloud services in Kundapura, Udupi, Karnataka.",
  keywords: [
    "Oordhwa",
    "Oordhwa Tech Solutions",
    "oordhwa techsolutions",
    "Oordhva",
    "Urdhva",
    "urdhva",
    "Urdhva Tech",
    "urdhva tech",
    "Urdhva Tech Solutions",
    "urdhva tech solutions",
    "Urdhva software",
    "Oordhwa Kundapura",
    "Urdhva Kundapura",
    "web development",
    "app development",
    "Ai product in kundapura",
    "karnataka",
    "tech company",
    "tech solution in kundapuar karntaka",
    "udupi",
    "upudi",
    "best tech company in kundapura",
    "AI solutions Kundapura",
    "Udupi tech company",
    "IT services software consulting",
  ],
  authors: [{ name: "Oordhwa Tech Solutions", url: "https://oordhwa.com" }],
  creator: "Oordhwa Tech Solutions",
  publisher: "Oordhwa Tech Solutions",
  alternates: {
    canonical: "https://oordhwa.com",
  },
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
    icon: [
      { url: "/oordhwa-icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/oordhwa-icon.png",
    apple: [
      { url: "/oordhwa-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "image_src",
        url: "https://oordhwa.com/oordhwa-icon.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oordhwa.com",
    title: "Oordhwa Tech Solutions (Urdhva Tech)",
    description:
      "Oordhwa Tech Solutions (Urdhva Tech) delivers end-to-end digital solutions, including web development, mobile apps, AI integration, cloud services, and UI/UX design.",
    siteName: "Oordhwa Tech Solutions",
    images: [
      {
        url: "https://oordhwa.com/oordhwa-icon.png",
        width: 512,
        height: 512,
        alt: "Oordhwa Tech Solutions Search Logo",
      },
      {
        url: "https://oordhwa.com/oordhwa-logo.png",
        width: 1200,
        height: 630,
        alt: "Oordhwa Tech Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oordhwa Tech Solutions (Urdhva Tech)",
    description:
      "Oordhwa Tech Solutions (Urdhva Tech) delivers end-to-end digital solutions, including web development, mobile apps, AI integration, and UI/UX design.",
    images: ["https://oordhwa.com/oordhwa-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Oordhwa Tech Solutions",
    alternateName: [
      "Oordhwa",
      "Oordhva",
      "Urdhva",
      "urdhva",
      "Urdhva Tech",
      "Urdhva Tech Solutions",
      "Oordhwa Tech",
      "Oordhwa Solutions",
    ],
    url: "https://oordhwa.com",
    logo: "https://oordhwa.com/oordhwa-icon.png",
    image: "https://oordhwa.com/oordhwa-icon.png",
    description:
      "Oordhwa Tech Solutions (Urdhva Tech) is an IT services and software consulting company specializing in web development, mobile apps, AI solutions, and hardware IoT integrations.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kundapura",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  };

  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${poppins.variable} ${inter.variable} ${shareTechMono.variable} ${blackOpsOne.variable}`}
    >
      <head>
        <link rel="icon" href="/oordhwa-icon.png" type="image/png" sizes="any" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/oordhwa-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/oordhwa-icon.png" sizes="180x180" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-black text-white antialiased">
        <SmoothScroll>
          <OordhwaLogo />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
