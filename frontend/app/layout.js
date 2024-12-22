"use client";

import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
};

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const isAuthPages = pathName.includes("/auth");

  return (
    <html lang="en" className={roboto.className}>
      <body>
        <AuthProvider>
          {isAuthPages ? children : <MainLayout>{children}</MainLayout>}
        </AuthProvider>
      </body>
    </html>
  );
}
