import "./globals.css";

export const metadata = {
  title: "MyW – Meine Lieblingsbars",
  description:
    "318 fiktive Bars. Jede ein Universum. Von Abbaubar bis Zuweisbar – das vollständige Bar-Universum auf -bar.",
  openGraph: {
    title: "MyW – Meine Lieblingsbars",
    description: "318 fiktive Bars. Jede ein Universum.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
