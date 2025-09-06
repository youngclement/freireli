import { LogisticsManagement } from "@/components/logistics/logistics-management";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Logistics Management | FreiReli",
    description: "Quản lý logistics, workflow, actors và events trong một giao diện tập trung",
};

export default function ManagementPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            Logistics Management Center
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Trung tâm quản lý toàn bộ logistics - từ workflow, actors đến events 
                            trong một giao diện thống nhất và dễ sử dụng
                        </p>
                    </div>
                    
                    <LogisticsManagement />
                </div>
            </div>
        </div>
    );
}
