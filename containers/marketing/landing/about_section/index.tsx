import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutSection() {
    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Về chúng tôi
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Freireli là một công ty công nghệ hàng đầu chuyên phát triển các giải pháp
                            phần mềm hiện đại và sáng tạo. Chúng tôi cam kết mang đến những sản phẩm
                            chất lượng cao nhất cho khách hàng.
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ tiên tiến, chúng tôi
                            đã phục vụ hàng trăm khách hàng trên toàn thế giới.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <Badge variant="secondary" className="text-2xl font-bold mb-2 px-4 py-2">
                                        100+
                                    </Badge>
                                    <div className="text-gray-600 dark:text-gray-300">Dự án hoàn thành</div>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <Badge variant="secondary" className="text-2xl font-bold mb-2 px-4 py-2">
                                        50+
                                    </Badge>
                                    <div className="text-gray-600 dark:text-gray-300">Khách hàng hài lòng</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="relative">
                        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 border-none">
                            <CardContent className="p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">Tầm nhìn của chúng tôi</h3>
                                <p className="text-lg">
                                    Trở thành đối tác công nghệ đáng tin cậy nhất cho các doanh nghiệp
                                    muốn chuyển đổi số và phát triển bền vững.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
