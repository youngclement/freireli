import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Chào mừng đến với{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Freireli
                        </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        Giải pháp công nghệ hiện đại cho doanh nghiệp của bạn
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Bắt đầu ngay
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                            Tìm hiểu thêm
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
