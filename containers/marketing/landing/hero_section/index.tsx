import { Button } from "@/components/ui/button";

export default function HeroSection() {
    return (
        <section className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Background decoration */}
            <div className="hero-bg absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>

            <div className="section-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center relative z-10">
                <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Freireli
                    </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                    Giải pháp công nghệ hiện đại
                </p>
                <Button size="lg" className="text-lg px-8 py-4">
                    Khám phá ngay
                </Button>
            </div>
        </section>
    );
}
