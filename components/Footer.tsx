import Link from "next/link";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Hub", href: "/hub" },
    { name: "Conference", href: "/conference" },
    { name: "Resources", href: "/resources" },
];

const connectLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Prayer Requests", href: "/hub/prayer" },
    { name: "Newsletter", href: "#" },
    { name: "Partner With Us", href: "#partner" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-deep border-t-[1px] border-gold/40">
            <div className="container-page py-12 md:py-16">
                {/* Three columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                    {/* Brand column */}
                    <div>
                        <Link href="/" className="font-display text-xl font-semibold text-gold tracking-wide">
                            REAWAKENING
                        </Link>
                        <p className="text-sm text-cream/40 mt-4 max-w-xs font-light leading-relaxed">
                            Equipping students to grow in faith, purpose, and community.
                        </p>
                    </div>

                    {/* Navigation column */}
                    <div>
                        <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-cream/60 mb-4">
                            Navigation
                        </h3>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-cream/40 hover:text-gold transition-colors font-light"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect column */}
                    <div>
                        <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-cream/60 mb-4">
                            Connect
                        </h3>
                        <ul className="space-y-3">
                            {connectLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-cream/40 hover:text-gold transition-colors font-light"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-cream/30">
                        &copy; {year} Reawakening Ministry. All rights reserved.
                    </p>
                    <p className="text-sm text-cream/30">
                        Convener: <span className="text-cream/40">P. Igbagboyemi Oluwatofunmi Ojo</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
