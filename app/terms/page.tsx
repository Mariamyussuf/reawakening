import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Terms of Service | Reawakening",
};

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="bg-cream text-deep">
                <section className="container-page py-20 md:py-24 max-w-4xl">
                    <p className="eyebrow">Legal</p>
                    <h1 className="section-heading mb-6">Terms of Service</h1>
                    <div className="space-y-5 text-deep/75 leading-relaxed font-light">
                        <p>
                            By using Reawakening, you agree to use the platform respectfully and in a way that
                            supports a safe, faith-centered community.
                        </p>
                        <p>
                            Do not misuse the site, upload harmful content, attempt unauthorized access, or submit
                            material that violates the rights of others.
                        </p>
                        <p>
                            Ministry resources, written content, and media remain the property of Reawakening or
                            their respective owners unless stated otherwise.
                        </p>
                        <p>
                            These terms may be updated as the platform grows. Continued use of the site means you
                            accept the latest version posted here.
                        </p>
                    </div>
                    <div className="mt-10">
                        <Link href="/contact" className="btn-primary">
                            Contact Us
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
