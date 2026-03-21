import Link from "next/link";

export const metadata = {
    title: "Forgot Password | Reawakening",
};

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-cream px-6 py-12 text-deep">
            <div className="mx-auto flex min-h-[80vh] max-w-xl items-center">
                <div className="w-full rounded-2xl border border-mid/20 bg-warm-white p-8 shadow-sm">
                    <p className="eyebrow">Account Help</p>
                    <h1 className="font-display text-4xl text-deep mb-4">Forgot Password?</h1>
                    <div className="space-y-4 text-deep/70 font-light leading-relaxed">
                        <p>
                            Password reset is not fully automated yet on this version of Reawakening.
                        </p>
                        <p>
                            For now, please contact the ministry team so your account can be assisted manually.
                        </p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link href="/contact" className="btn-primary">
                            Contact Support
                        </Link>
                        <Link href="/auth/signin" className="btn-outline">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
