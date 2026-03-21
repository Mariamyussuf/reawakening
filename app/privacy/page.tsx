import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Privacy Policy | Reawakening",
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="bg-cream text-deep">
                <section className="container-page py-20 md:py-24 max-w-4xl">
                    <p className="eyebrow">Legal</p>
                    <h1 className="section-heading mb-6">Privacy Policy</h1>
                    <div className="space-y-5 text-deep/75 leading-relaxed font-light">
                        <p>
                            Reawakening collects only the information needed to provide accounts, member features,
                            and ministry communication.
                        </p>
                        <p>
                            We do not sell your personal information. Data is used to support authentication,
                            community features, and site improvement.
                        </p>
                        <p>
                            Reasonable steps are taken to protect your information, but no online platform can
                            guarantee absolute security.
                        </p>
                        <p>
                            If you would like your information updated or removed, please reach out through our
                            contact page.
                        </p>
                    </div>
                    <div className="mt-10">
                        <Link href="/contact" className="btn-primary">
                            Privacy Questions
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
