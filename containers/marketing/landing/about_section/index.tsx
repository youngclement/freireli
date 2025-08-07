import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection() {
    return (
        <section className="scroll-section min-h-screen flex items-center py-16 bg-white dark:bg-gray-900">
            <div className="section-content max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-8">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                        Về chúng tôi
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Đội ngũ chuyên gia với hơn 5 năm kinh nghiệm phát triển phần mềm
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <Card className="text-center">
                            <CardContent className="pt-8">
                                <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                                <div className="text-gray-600 dark:text-gray-300">Dự án</div>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="pt-8">
                                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                                <div className="text-gray-600 dark:text-gray-300">Khách hàng</div>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="pt-8">
                                <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
                                <div className="text-gray-600 dark:text-gray-300">Năm kinh nghiệm</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
