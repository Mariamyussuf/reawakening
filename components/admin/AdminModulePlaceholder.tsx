import Image from "next/image";
import Link from "next/link";

interface AdminModulePlaceholderProps {
    eyebrow: string;
    title: string;
    description: string;
    highlights: string[];
    primaryAction: {
        href: string;
        label: string;
    };
    secondaryAction: {
        href: string;
        label: string;
    };
    note: string;
}

export default function AdminModulePlaceholder({
    eyebrow,
    title,
    description,
    highlights,
    primaryAction,
    secondaryAction,
    note,
}: AdminModulePlaceholderProps) {
    return (
        <div className="min-h-screen bg-cream font-body">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-2xl border border-gold/20 bg-warm-white overflow-hidden">
                            <Image
                                src="/images/logo.png"
                                alt="Reawakening"
                                fill
                                className="object-contain p-2"
                                sizes="48px"
                            />
                        </div>
                        <div>
                            <p className="eyebrow mb-1">Admin Workspace</p>
                            <h1 className="font-display text-3xl text-deep">{title}</h1>
                        </div>
                    </div>

                    <Link href="/admin" className="btn-outline">
                        Back to Admin
                    </Link>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">{eyebrow}</p>
                            <h2 className="font-display text-2xl sm:text-4xl text-deep mb-3">
                                This admin area is now available
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Current State</p>
                            <p className="font-display text-xl text-cream">Module ready</p>
                            <p className="text-sm text-cream/60 mt-1">
                                Linked from the admin dashboard
                            </p>
                            <p className="text-xs text-cream/50 mt-3">
                                {note}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                        <p className="eyebrow mb-2">Next Steps</p>
                        <h3 className="font-display text-2xl text-deep mb-4">What this module should support</h3>

                        <div className="space-y-3">
                            {highlights.map((item) => (
                                <div key={item} className="rounded-2xl bg-cream border border-mid/15 px-4 py-3 text-deep/75">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-deep rounded-3xl p-6 border border-gold/20 shadow-sm">
                            <p className="eyebrow mb-3 text-gold/80">Quick Actions</p>
                            <h3 className="font-display text-2xl text-cream mb-3">Continue serving</h3>
                            <p className="text-sm text-cream/70 leading-relaxed mb-5">
                                Use the links below while we build out the full management flow for this section.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link href={primaryAction.href} className="btn-primary text-center">
                                    {primaryAction.label}
                                </Link>
                                <Link href={secondaryAction.href} className="btn-outline border-cream/20 text-cream hover:bg-cream/10">
                                    {secondaryAction.label}
                                </Link>
                            </div>
                        </div>

                        <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                            <p className="eyebrow mb-3">Workspace Note</p>
                            <p className="text-sm text-deep/70 leading-relaxed">
                                The 404 is gone now, so the admin dashboard no longer sends you to a missing route here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
