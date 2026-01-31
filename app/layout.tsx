import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
    title: "Reawakening | Christian Student Ministry",
    description: "A faith-based student ministry focused on spiritual renewal and growth during post-exam periods. Join us for conferences, daily Bible verses, and curated Christian resources.",
    keywords: ["Christian ministry", "student ministry", "spiritual growth", "Bible study", "faith", "discipleship"],
    authors: [{ name: "Reawakening Ministry" }],
    openGraph: {
        title: "Reawakening | Christian Student Ministry",
        description: "A faith-based student ministry focused on spiritual renewal and growth",
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
            <body className="antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
