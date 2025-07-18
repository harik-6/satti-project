"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Rules", href: "/rules" },
  { label: "New Flow", href: "/start" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-48 bg-white flex flex-col py-8">
      <nav className="flex flex-col gap-4 mt-14">
        {tabs.map(tab => {
          const isActive = (pathname === tab.href || (pathname === "/recommend" && tab.href === "/start"));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-2 px-4 rounded font-bold transition-colors hover:bg-blue-50 ${isActive ? "border-r-4 border-blue-600 bg-blue-50 text-blue-700" : "text-gray-700 opacity-60"}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 