import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 mt-20">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Reawakening</h3>
                        <p className="text-sm leading-relaxed">
                            A Christian student ministry focused on spiritual renewal and growth during post-exam periods.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About the Ministry
                                </Link>
                            </li>
                            <li>
                                <Link href="/conference" className="hover:text-white transition-colors">
                                    Upcoming Conference
                                </Link>
                            </li>
                            <li>
                                <Link href="/daily-verse" className="hover:text-white transition-colors">
                                    Daily Bible Verse
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="hover:text-white transition-colors">
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Stay Connected</h3>
                        <p className="text-sm mb-4">
                            Join our community and stay updated with upcoming events and resources.
                        </p>
                        <Link href="/contact" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Get in Touch
                        </Link>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {currentYear} Reawakening Ministry. All rights reserved.</p>
                    <p className="mt-2 text-slate-400">
                        &quot;For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.&quot; - John 3:16
                    </p>
                </div>
            </div>
        </footer>
    );
}
