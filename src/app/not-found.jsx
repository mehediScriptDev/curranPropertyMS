import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-3xl mx-auto text-center px-6 py-20">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary-600 text-white text-4xl font-extrabold mb-8 shadow-xl">
          404
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mb-4">Page not found</h1>
        <p className="text-lg text-slate-600 mb-8">We couldn't find the page you're looking for. It may have been moved or removed.</p>

        <div className="flex items-center justify-center">
          <Link href="/" className="px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700">Go Home</Link>
        </div>
      </div>
    </main>
  );
}
