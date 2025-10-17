import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cicero Institute Policy Map",
  description: "Explore policy bills enacted or sent to governors across the United States. Interactive map showing Cicero Institute's policy achievements by state.",
  keywords: ["policy", "legislation", "Cicero Institute", "bills", "state policy", "government"], 
  authors: [{ name: "Cicero Institute" }],
  openGraph: {
    title: "Cicero Institute Policy Map",
    description: "Explore bills we have enacted across the United States",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
