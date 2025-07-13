import Link from "next/link";

export default function Home() {
  return (
    <div>
      <nav className="w-full flex items-center justify-between py-4 px-8 bg-white shadow mb-8">
        <div className="text-lg font-bold">AI Investment</div>
        <div className="flex gap-6">
          <Link href="/portfolio" className="text-blue-600 hover:underline">Portfolio</Link>
        </div>
      </nav>
      <h1>Hello world</h1>
    </div>
  );
}
