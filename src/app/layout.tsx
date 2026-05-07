import "./global.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template:"%s | CineVault",
    default: "CineVault"
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}