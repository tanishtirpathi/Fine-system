import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins , Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { COLLEGE } from "@/lib/college-brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400", // required for serif
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fine.tanishtirpathi.me"),

  title: {
    default: `${COLLEGE.name}`,
    template: `%s | ${COLLEGE.name}`,
  },

  description: COLLEGE.systemName,

  applicationName: COLLEGE.name,
  authors: [{ name: "Fine Guard Team" }],
  creator: "Fine Guard",
  publisher: "Fine Guard",

  keywords: [
    "Fine Guard",
    "Fine System",
    "Fine Management System",
    "Student Fine Portal",
    "College Clearance",
    "Educational Management",
    "FGI",
    "Student Portal"
  ],

  icons: {
    icon: "/logo/logo-light.webp",
    shortcut: "/logo/logo-light.webp",
    apple: "/logo/logo-light.webp",
  },

  openGraph: {
    type: "website",
    url: "https://fine.tanishtirpathi.me/",
    title: `${COLLEGE.name}`,
    description: COLLEGE.systemName,
    siteName: `${COLLEGE.name}`,
    images: [
      {
        url: "/images/bg-main.png",
        width: 1200,
        height: 630,
        alt: "Fine Guard Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
     title: `${COLLEGE.name}`,
     description: COLLEGE.systemName,
    images: ["/images/bg-main.png"],
    creator: "@tanishtirpathi",
  },
  category: "technology",
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${instrument.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
