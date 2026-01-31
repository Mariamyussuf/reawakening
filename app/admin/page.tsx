"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple password check (in production, use proper authentication)
        if (password === "reawakening2026") {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                <div className="card max-w-md w-full">
                    <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full">
                            Login
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="container-custom py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
                    <Link href="/" className="btn-secondary">
                        View Site
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Daily Verses */}
                    <div className="card hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Daily Verses</h2>
                        <p className="text-slate-600 mb-4 text-sm">
                            Add and manage daily Bible verses with reflections
                        </p>
                        <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                            Manage Verses →
                        </button>
                    </div>

                    {/* Conferences */}
                    <div className="card hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Conferences</h2>
                        <p className="text-slate-600 mb-4 text-sm">
                            Create and edit conference details and registrations
                        </p>
                        <button className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                            Manage Conferences →
                        </button>
                    </div>

                    {/* Resources */}
                    <div className="card hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Resources</h2>
                        <p className="text-slate-600 mb-4 text-sm">
                            Upload materials, courses, and books
                        </p>
                        <button className="text-pink-600 font-medium hover:text-pink-700 transition-colors">
                            Manage Resources →
                        </button>
                    </div>

                    {/* Archive */}
                    <div className="card hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Archive</h2>
                        <p className="text-slate-600 mb-4 text-sm">
                            Add past conferences to the archive
                        </p>
                        <button className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                            Manage Archive →
                        </button>
                    </div>

                    {/* Registrations */}
                    <div className="card hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Registrations</h2>
                        <p className="text-slate-600 mb-4 text-sm">
                            View conference and contact form submissions
                        </p>
                        <button className="text-green-600 font-medium hover:text-green-700 transition-colors">
                            View Submissions →
                        </button>
                    </div>

                    {/* Settings */}
                    <div className="card hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Settings</h2>
                        <p className="text-slate-600 mb-4 text-sm">
                            Configure site settings and preferences
                        </p>
                        <button className="text-slate-600 font-medium hover:text-slate-700 transition-colors">
                            Open Settings →
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
                            <div className="text-sm text-slate-600">Conference Registrations</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-1">0</div>
                            <div className="text-sm text-slate-600">Resources Published</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-pink-600 mb-1">0</div>
                            <div className="text-sm text-slate-600">Contact Messages</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">0</div>
                            <div className="text-sm text-slate-600">Email Subscribers</div>
                        </div>
                    </div>
                </div>

                {/* Important Note */}
                <div className="mt-12 card bg-yellow-50 border-2 border-yellow-200">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Development Note
                    </h3>
                    <p className="text-slate-700 text-sm">
                        This is a basic admin interface. In production, you should implement:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        <li>• Proper authentication (e.g., NextAuth.js)</li>
                        <li>• Database integration (e.g., PostgreSQL, MongoDB)</li>
                        <li>• File upload handling (e.g., AWS S3, Cloudinary)</li>
                        <li>• Form validation and error handling</li>
                        <li>• Role-based access control</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
