import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AppHeader({title}) {
  return (
    <header className="w-full flex items-center bg-white-900 px-8 py-4">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
    </header>
  );
}

export const metadata = {
  title: "Personal Finance Genie",
  description: "Investment and Expense Planner using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex max-h-screen">
          <Sidebar />
          <div  className="flex-1 flex flex-col">
            <AppHeader title={metadata.title} />
            <div style={{ backgroundColor: '#e7e7e7', maxHeight: '98vh', minHeight: '98vh' }} >
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
