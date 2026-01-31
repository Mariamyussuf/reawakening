import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Reawakening Ministry",
    description: "Get in touch with Reawakening Ministry. Stay connected and join our community.",
};

export default function ContactPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Stay Connected</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            We&apos;d love to hear from you and keep you updated on upcoming events
                        </p>
                    </div>
                </section>

                {/* Contact Options */}
                <section className="container-custom py-16">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {/* Email */}
                            <div className="card text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">Email Us</h3>
                                <p className="text-slate-600 text-sm mb-3">
                                    For inquiries and support
                                </p>
                                <a href="mailto:contact@reawakening.org" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                    contact@reawakening.org
                                </a>
                            </div>

                            {/* WhatsApp */}
                            <div className="card text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">WhatsApp Community</h3>
                                <p className="text-slate-600 text-sm mb-3">
                                    Join our community group
                                </p>
                                <a href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                                    Join Group
                                </a>
                            </div>

                            {/* Social */}
                            <div className="card text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">Social Media</h3>
                                <p className="text-slate-600 text-sm mb-3">
                                    Follow us for updates
                                </p>
                                <div className="flex justify-center space-x-3">
                                    <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                                        Instagram
                                    </a>
                                    <span className="text-slate-300">|</span>
                                    <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                                        Twitter
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="max-w-2xl mx-auto">
                            <div className="card">
                                <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Send Us a Message</h2>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="John"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="conference">Conference Question</option>
                                            <option value="resources">Resource Suggestion</option>
                                            <option value="testimony">Share a Testimony</option>
                                            <option value="prayer">Prayer Request</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Share your thoughts, questions, or prayer requests..."
                                        />
                                    </div>

                                    <button type="submit" className="btn-primary w-full">
                                        Send Message
                                    </button>

                                    <p className="text-sm text-slate-500 text-center">
                                        We typically respond within 24-48 hours
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Email Newsletter Signup */}
                <section className="bg-white/50 backdrop-blur-sm py-16">
                    <div className="container-custom">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="section-title mb-4">Stay Updated</h2>
                            <p className="text-slate-600 mb-8">
                                Subscribe to receive updates about upcoming conferences, new resources, and daily verse reminders.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                                <button type="submit" className="btn-primary whitespace-nowrap">
                                    Subscribe
                                </button>
                            </form>
                            <p className="text-xs text-slate-500 mt-4">
                                We respect your privacy. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Important Note */}
                <section className="container-custom py-16">
                    <div className="max-w-3xl mx-auto">
                        <div className="card bg-blue-50 border-2 border-blue-200">
                            <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                A Note on Fellowship
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                While we encourage you to stay connected with Reawakening, please remember that this platform is meant to
                                <strong> complement—not replace—your local church involvement</strong>. We strongly encourage you to be part of a
                                local church community where you can worship, serve, and grow alongside other believers.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
