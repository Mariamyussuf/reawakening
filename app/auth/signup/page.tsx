"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Cross icon for branding
const CrossIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" className="text-gold">
        <rect x="20" y="8" width="8" height="32" rx="1" fill="currentColor"/>
        <rect x="8" y="20" width="32" height="8" rx="1" fill="currentColor"/>
    </svg>
);

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed");
                setLoading(false);
                return;
            }

            router.push("/auth/signin?registered=true");
        } catch (err) {
            setError("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden font-body">
            {/* Left — decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center px-12 bg-deep">
                {/* Radial gradients */}
                <div className="absolute inset-0 bg-gradient-radial-gold opacity-20" />
                <div className="noise-overlay" />

                {/* Gold top rule */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

                <div className="relative z-10 text-center max-w-sm">
                    {/* Logo */}
                    <Link href="/" className="inline-flex flex-col items-center mb-12 group">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-lg" />
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <CrossIcon />
                            </div>
                        </div>
                        <span className="font-display text-2xl font-semibold text-cream">Reawakening</span>
                        <span className="text-xs tracking-[0.3em] uppercase text-gold/60 mt-1">Ministry</span>
                    </Link>

                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />

                    <h2 className="font-display text-3xl font-light italic text-cream leading-relaxed mb-4">
                        &ldquo;A meeting set out to equip students&rdquo;
                    </h2>
                    <p className="text-sm text-cream/70 leading-relaxed">
                        Join a community of believers focused on preserving their fire and zeal for God both on campus and off campus.
                    </p>

                    <div className="mt-12 flex justify-center gap-8">
                        <div className="text-center">
                            <div className="font-display text-2xl font-semibold text-gold">500+</div>
                            <div className="text-xs tracking-widest uppercase text-cream/50 mt-1">Members</div>
                        </div>
                        <div className="text-center">
                            <div className="font-display text-2xl font-semibold text-gold">24/7</div>
                            <div className="text-xs tracking-widest uppercase text-cream/50 mt-1">Access</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — form panel */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-cream overflow-y-auto">
                <div className="w-full max-w-md my-auto">
                    {/* Mobile logo */}
                    <Link href="/" className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <div className="w-9 h-9 flex items-center justify-center">
                            <CrossIcon />
                        </div>
                        <span className="font-display text-xl font-semibold text-deep">Reawakening</span>
                    </Link>

                    {/* Heading */}
                    <div className="mb-10">
                        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-2">Start your journey</p>
                        <h1 className="font-display text-4xl font-semibold text-deep mb-2">Create Account</h1>
                        <p className="text-sm text-deep/60">Join our spiritual community today</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-xs font-semibold tracking-wide text-deep/70 mb-1.5 uppercase">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-warm-white border border-mid/30 rounded-lg text-deep placeholder-deep/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-deep/70 mb-1.5 uppercase">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-warm-white border border-mid/30 rounded-lg text-deep placeholder-deep/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-deep/70 mb-1.5 uppercase">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type={showPass ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-warm-white border border-mid/30 rounded-lg text-deep placeholder-deep/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-semibold tracking-wide text-deep/70 mb-1.5 uppercase">
                                    Confirm
                                </label>
                                <input
                                    id="confirmPassword"
                                    type={showPass ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-warm-white border border-mid/30 rounded-lg text-deep placeholder-deep/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="text-xs text-deep/40 hover:text-gold transition-colors flex items-center gap-1.5"
                            >
                                {showPass ? "Hide Passwords" : "Show Passwords"}
                            </button>
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="w-4 h-4 rounded border-mid/30 text-gold focus:ring-gold/50 mt-0.5"
                            />
                            <label htmlFor="terms" className="text-xs text-deep/60 leading-relaxed">
                                I agree to the <Link href="/terms" className="text-gold hover:text-gold-dark">Terms of Service</Link> and <Link href="/privacy" className="text-gold hover:text-gold-dark">Privacy Policy</Link>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold text-deep py-4 px-6 rounded-lg font-semibold hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                            <span className="px-4 bg-cream text-xs text-deep/40">Already a member?</span>
                        </div>
                    </div>

                    <Link
                        href="/auth/signin"
                        className="w-full flex items-center justify-center py-4 px-6 border border-mid/30 text-deep rounded-lg font-semibold hover:border-gold hover:bg-gold/5 transition-all"
                    >
                        Sign In
                    </Link>

                    <div className="text-center mt-8">
                        <Link href="/" className="text-xs text-deep/40 hover:text-deep transition-colors inline-flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
