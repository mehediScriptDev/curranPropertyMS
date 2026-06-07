"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-2xl mx-auto text-center px-6 py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600 text-white text-2xl font-bold mb-6 shadow-lg">!</div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3">Something went wrong</h1>
        <p className="text-base text-slate-600 mb-6">An unexpected error occurred. Try refreshing the page or return home. If the issue persists, contact support.</p>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => reset()} className="px-5 py-2.5 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700">Try again</button>
          <Link href="/" className="px-5 py-2.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">Go home</Link>
        </div>

        <details className="mt-6 text-left text-xs text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-100">
          <summary className="cursor-pointer font-medium">Error details</summary>
          <pre className="whitespace-pre-wrap mt-2">{error?.message}</pre>
        </details>
      </div>
    </main>
  );
}
