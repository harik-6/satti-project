import "./globals.css";
import Sidebar from "../components/Sidebar";



export const metadata = {
  title: "Personal Finance Genie",
  description: "Investment and Expense Planner using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <div className="flex max-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="w-full s flex items-center bg-white-900 px-8 py-4">
              <h1 className="text-xl font-bold text-gray-800">{metadata.title}</h1>
            </header>
            <div>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
