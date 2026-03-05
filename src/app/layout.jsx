import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata = {
  title: "McCann & Curran | Professional Property Management",
  description:
    "Comprehensive property management with secure digital reporting, RTB compliance, and transparent financial services in Ireland.",
};

export default function RootLayout({ children }) {
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
