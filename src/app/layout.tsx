import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanse Nova - Roguelike Handelssimulation",
  description: "Werde zum mächtigsten Kaufmann der Hanse. Ein Roguelike-Handelsspiel im mittelalterlichen Ostseeraum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
