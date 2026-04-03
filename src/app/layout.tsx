import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Invitation Studio",
  description: "Design your perfect event stationery suite",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://theinvitationstudio.com'),
  openGraph: {
    title: 'The Invitation Studio',
    description: 'Design your perfect event stationery suite',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'The Invitation Studio',
    description: 'Design your perfect event stationery suite',
  },
  themeColor: '#44403c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Lora:wght@400;500;600;700&family=Great+Vibes&family=Josefin+Sans:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700&family=Italiana&family=Tangerine:wght@400;700&family=Raleway:wght@300;400;500;600;700&family=EB+Garamond:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900 font-sans">
        {children}
      </body>
    </html>
  );
}
