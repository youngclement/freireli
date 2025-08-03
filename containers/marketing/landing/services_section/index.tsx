import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ServicesSection() {
    const services = [
        {
            title: "Phát triển Web",
            description: "Tạo ra các website hiện đại, responsive và tối ưu SEO",
            icon: "🌐",
            features: ["React/Next.js", "Node.js", "Database Design", "API Development"]
        },
        {
            title: "Ứng dụng Mobile",
            description: "Phát triển ứng dụng di động cho iOS và Android",
            icon: "📱",
            features: ["React Native", "Flutter", "Native Apps", "Cross-platform"]
        },
        {
            title: "Hệ thống ERP",
            description: "Giải pháp quản lý doanh nghiệp toàn diện",
            icon: "💼",
            features: ["Inventory Management", "CRM", "Finance", "Reporting"]
        },
        {
            title: "Tư vấn IT",
            description: "Tư vấn chiến lược công nghệ thông tin",
            icon: "🎯",
            features: ["Digital Strategy", "Tech Assessment", "Solution Design", "Implementation"]
        }
    ];

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Dịch vụ của chúng tôi
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Chúng tôi cung cấp đa dạng các dịch vụ công nghệ để đáp ứng mọi nhu cầu của doanh nghiệp
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <CardTitle className="text-xl">{service.title}</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {service.features.map((feature, featureIndex) => (
                                        <Badge key={featureIndex} variant="secondary" className="text-xs">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
