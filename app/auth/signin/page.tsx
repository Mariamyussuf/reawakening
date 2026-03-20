"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Cross icon for branding
const CrossIcon = () => (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" className="text-gold">
        <rect x="20" y="8" width="8" height="32" rx="1" fill="currentColor"/>
        <rect x="8" y="20" width="32" height="8" rx="1" fill="currentColor"/>
    </svg>
);

export default function SignInPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                router.push("/hub");
                router.refresh();
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden font-body">

            {/* Left — decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center px-12 bg-deep">

                {/* Radial gradient glow */}
                <div className="absolute inset-0 bg-gradient-radial-gold opacity-20" />

                {/* Noise overlay */}
                <div className="noise-overlay" />

                {/* Gold top rule */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gold/40" />

                <div className="relative z-10 text-center max-w-sm">
                    {/* Logo */}
                    <Link href="/" className="inline-flex flex-col items-center mb-12 group">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-lg" />
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <CrossIcon />
                            </div>
                        </div>
                        <span className="font-display text-2xl font-semibold text-cream tracking-wide">Reawakening</span>
                        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold/80 mt-1">Ministry</span>
                    </Link>

                    <div className="w-16 h-px bg-gold/40 mx-auto mb-8" />

                    <h2 className="font-display text-3xl font-light italic text-cream leading-relaxed mb-4">
                        &ldquo;Be on fire for God&rdquo;
                    </h2>
                    <p className="font-sans text-sm text-cream/60 leading-relaxed">
                        A digital home for students pursuing a deeper walk with God — through devotion, community, and Scripture.
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-4">
                        {[["500+", "Members"], ["12", "Conferences"], ["24/7", "Access"]].map(([val, label]) => (
                            <div key={label} className="text-center">
                                <div className="font-display text-2xl font-semibold text-gold">{val}</div>
                                <div className="font-sans text-[10px] tracking-widest uppercase text-cream/40 mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — form panel */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-cream">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <Link href="/" className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <CrossIcon />
                        <span className="font-display text-xl font-semibold text-deep">Reawakening</span>
                    </Link>

                    {/* Heading */}
                    <div className="mb-10">
                        <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-gold mb-2">Welcome back</p>
                        <h1 className="font-display text-4xl font-medium text-deep mb-2">Sign In</h1>
                        <p className="font-sans text-sm text-deep/60">Continue your spiritual journey</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-sans text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block font-sans text-xs font-medium tracking-wide text-deep/70 mb-2 uppercase">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded border border-mid/30 bg-warm-white text-deep text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-mid/50"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block font-sans text-xs font-medium tracking-wide text-deep/70 uppercase">
                                    Password
                                </label>
                                <Link href="/auth/forgot-password" className="font-sans text-xs text-gold hover:text-gold-dark transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPass ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded border border-mid/30 bg-warm-white text-deep text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-mid/50 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mid/60 hover:text-deep transition-colors"
                                >
                                    {showPass ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-1">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-4 h-4 rounded border-mid/50 text-gold focus:ring-gold/30 accent-gold"
                            />
                            <label htmlFor="remember" className="font-sans text-sm text-deep/70">Remember me for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 text-sm font-semibold tracking-wide uppercase bg-gold text-deep rounded hover:bg-gold-light transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-mid/20" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-cream font-sans text-xs text-deep/50">New to Reawakening?</span>
                        </div>
                    </div>

                    <Link
                        href="/auth/signup"
                        className="w-full flex items-center justify-center py-3.5 text-sm font-semibold tracking-wide uppercase border border-gold text-gold rounded hover:bg-gold/10 transition-all"
                    >
                        Create an Account
                    </Link>

                    <div className="text-center mt-8">
                        <Link href="/" className="font-sans text-xs text-deep/40 hover:text-deep/70 transition-colors inline-flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
