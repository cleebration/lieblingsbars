import "./globals.css";

export const metadata = {
  title: "Lieblingsbars — Fiktive Bars für echte Träumer",
  description: "299 fiktive Bars, jede mit einem Namen, der eine Möglichkeit beschreibt.",
  openGraph: {
    title: "Lieblingsbars",
    description: "Fiktive Bars für echte Träumer",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
