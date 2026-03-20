import Link from "next/link";

const links = [
    { name: "About the Ministry", href: "/about" },
    { name: "Upcoming Conference", href: "/conference" },
    { name: "Daily Bible Verse", href: "/daily-verse" },
    { name: "Resources", href: "/resources" },
    { name: "Archive", href: "/archive" },
    { name: "Contact Us", href: "/contact" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden bg-navy-950 mt-24">
            {/* Gold top line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }}
            />

            <div className="container-custom relative z-10 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Brand */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <img src="/images/logo.png" alt="Reawakening" className="w-10 h-10 object-contain opacity-90" />
                            <div>
                                <span className="font-display text-xl font-semibold text-cream-50 block leading-none">Reawakening</span>
                                <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-gold-500/80">Ministry</span>
                            </div>
                        </Link>
                        <p className="font-sans text-sm text-navy-300 leading-relaxed max-w-xs mb-8">
                            A Christian student ministry focused on spiritual renewal, equipping students to remain on fire for God — on campus and beyond.
                        </p>
                        <blockquote className="border-l-2 border-gold-500/40 pl-4">
                            <p className="font-display italic text-base text-gold-400/90 leading-relaxed">
                                &ldquo;For God so loved the world that he gave his one and only Son&rdquo;
                            </p>
                            <cite className="text-xs font-sans text-navy-400 not-italic mt-1 block">— John 3:16</cite>
                        </blockquote>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold-500/80 mb-5">Quick Links</h3>
                        <ul className="space-y-3">
                            {links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="font-sans text-sm text-navy-300 hover:text-cream-50 transition-colors duration-200 inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-gold-500 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Stay Connected */}
                    <div className="md:col-span-4">
                        <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold-500/80 mb-5">Stay Connected</h3>
                        <p className="font-sans text-sm text-navy-300 leading-relaxed mb-6">
                            Join our community and stay updated with upcoming events, devotionals, and resources.
                        </p>
                        <Link
                            href="/contact"
                            className="btn-primary text-xs px-6 py-3 inline-flex"
                        >
                            Get in Touch
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>

                        <div className="mt-8 pt-6 border-t border-navy-800">
                            <p className="font-sans text-xs text-navy-500">Convener</p>
                            <p className="font-display text-base text-cream-200 mt-0.5">P. Igbagboyemi Oluwatofunmi Ojo</p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-14 pt-6 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-sans text-xs text-navy-500">
                        &copy; {year} Reawakening Ministry. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1">
                        <span className="gold-dot w-1.5 h-1.5" />
                        <p className="font-sans text-xs text-navy-500 italic">"Thoroughly equipped to be on fire for God"</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
