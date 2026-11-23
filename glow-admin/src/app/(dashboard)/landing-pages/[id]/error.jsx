'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error('Landing Page Error Boundary caught:', error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 max-w-md mb-6">
                {error?.message || "Failed to load landing page data."}
            </p>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition cursor-pointer shadow-sm"
                >
                    <RotateCcw size={14} />
                    <span>Try Again</span>
                </button>
                <Link
                    href="/landing-pages"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                >
                    <ArrowLeft size={14} />
                    <span>Back to List</span>
                </Link>
            </div>
        </div>
    );
}
