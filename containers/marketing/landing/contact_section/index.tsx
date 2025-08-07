import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
    const contactInfo = [
        {
            title: "Email",
            value: "hello@freireli.com",
            icon: "📧",
        },
        {
            title: "Điện thoại",
            value: "+84 123 456 789",
            icon: "📞",
        },
        {
            title: "Địa chỉ",
            value: "123 Đường ABC, TP.HCM",
            icon: "📍",
        }
    ];

    return (
        <section className="scroll-section min-h-screen flex items-center py-16 bg-white dark:bg-gray-900">
            <div className="section-content max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-12">
                    <div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Liên hệ với chúng tôi
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Sẵn sàng bắt đầu dự án của bạn
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactInfo.map((info, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader>
                                    <div className="text-3xl mb-2">{info.icon}</div>
                                    <CardTitle className="text-lg">{info.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">{info.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="pt-8">
                        <Button size="lg" className="text-lg px-8 py-4">
                            Gửi tin nhắn
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
