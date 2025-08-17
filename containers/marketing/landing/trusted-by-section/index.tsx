'use client';

import Image from "next/image";

const trustedCompanies = [
    {
        name: "hackerone",
        logo: "/images/logos/hackerone.svg",
        width: 120,
        height: 40
    },
    {
        name: "shippable",
        logo: "/images/logos/shippable.svg",
        width: 120,
        height: 40
    },
    {
        name: "transport",
        logo: "/images/logos/transport.svg",
        width: 120,
        height: 40
    },
    {
        name: "kaggle",
        logo: "/images/logos/kaggle.svg",
        width: 100,
        height: 40
    },
    {
        name: "brado",
        logo: "/images/logos/brado.svg",
        width: 100,
        height: 40
    }
];

export default function TrustedBySection() {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                        TRUSTED BY
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
                    {trustedCompanies.map((company) => (
                        <div
                            key={company.name}
                            className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
                        >
                            <div className="text-muted-foreground font-medium text-lg">
                                {company.name}
                            </div>
                            {/* 
                            Placeholder for company logos - replace with actual logos when available
                            <Image
                                src={company.logo}
                                alt={`${company.name} logo`}
                                width={company.width}
                                height={company.height}
                                className="object-contain"
                            />
                            */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
