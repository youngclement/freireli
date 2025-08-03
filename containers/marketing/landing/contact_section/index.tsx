import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactSection() {
    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Liên hệ với chúng tôi
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Sẵn sàng bắt đầu dự án của bạn? Hãy liên hệ với chúng tôi ngay hôm nay!
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Gửi tin nhắn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Họ và tên</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        placeholder="example@email.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        type="tel"
                                        id="phone"
                                        placeholder="0123 456 789"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Tin nhắn</Label>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Mô tả dự án hoặc yêu cầu của bạn..."
                                    />
                                </div>
                                <Button type="submit" className="w-full" size="lg">
                                    Gửi tin nhắn
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin liên hệ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-blue-600 dark:text-blue-400 text-xl">📍</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">Địa chỉ</div>
                                        <div className="text-gray-600 dark:text-gray-300">123 Đường ABC, Quận XYZ, TP.HCM</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-blue-600 dark:text-blue-400 text-xl">📞</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">Điện thoại</div>
                                        <div className="text-gray-600 dark:text-gray-300">+84 123 456 789</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-blue-600 dark:text-blue-400 text-xl">✉️</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">Email</div>
                                        <div className="text-gray-600 dark:text-gray-300">contact@freireli.com</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Giờ làm việc</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <div>Thứ 2 - Thứ 6: 8:00 - 18:00</div>
                                    <div>Thứ 7: 9:00 - 17:00</div>
                                    <div>Chủ nhật: Nghỉ</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
