import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Professional Headshot Maker - AI-Powered ID Photos",
    description: "Generate professional headshots from your selfies using advanced AI. Perfect for LinkedIn, resumes, and ID cards.",
    keywords: ["headshot", "AI", "professional photo", "ID card", "portrait generator"],
    authors: [{ name: "Headshot Maker AI" }],
    openGraph: {
        title: "Professional Headshot Maker - AI-Powered ID Photos",
        description: "Generate professional headshots from your selfies using advanced AI",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
