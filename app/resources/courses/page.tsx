import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courses | Reawakening Resources",
    description: "Free lesson-based teachings on key Christian topics with progress tracking.",
};

export default function CoursesPage() {
    const courses = [
        {
            id: 1,
            title: "Foundations of Faith",
            lessons: 7,
            description: "Core beliefs of Christianity and how to live them out in daily life.",
            topics: ["Salvation", "The Bible", "Prayer", "The Church", "Holy Spirit", "Mission", "Eternal Life"],
        },
        {
            id: 2,
            title: "Prayer 101",
            lessons: 5,
            description: "Learn to develop a consistent and meaningful prayer life.",
            topics: ["What is Prayer?", "Types of Prayer", "Overcoming Barriers", "Listening to God", "Prayer Habits"],
        },
        {
            id: 3,
            title: "Understanding the Gospel",
            lessons: 6,
            description: "Deep dive into the good news of Jesus Christ and its implications.",
            topics: ["Creation", "Fall", "Redemption", "Grace", "Faith", "New Life"],
        },
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Courses</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Free, text-based teachings to deepen your understanding of faith
                        </p>
                    </div>
                </section>

                {/* Courses Grid */}
                <section className="container-custom py-16">
                    <div className="space-y-8">
                        {courses.map((course) => (
                            <div key={course.id} className="card hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-bold text-slate-800 mb-2">{course.title}</h2>
                                        <p className="text-slate-600 mb-4">{course.description}</p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
                                            <div className="text-2xl font-bold">{course.lessons}</div>
                                            <div className="text-sm">Lessons</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-bold text-slate-800 mb-3">Course Topics:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {course.topics.map((topic, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button className="btn-primary">
                                    Start Course
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="bg-white/50 backdrop-blur-sm py-16">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="section-title text-center mb-12">Course Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">100% Free</h3>
                                    <p className="text-slate-600 text-sm">All courses are completely free with no hidden costs</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">Track Progress</h3>
                                    <p className="text-slate-600 text-sm">Your progress is saved as you complete each lesson</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">Self-Paced</h3>
                                    <p className="text-slate-600 text-sm">Learn at your own speed with no deadlines</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
