'use client';

import { Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { contentSlides, clientImages } from '../mockdata';

export default function ContentSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % contentSlides.length);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev - 1 + contentSlides.length) % contentSlides.length);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const goToSlide = (index: number) => {
        if (isTransitioning || index === currentSlide) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    return (
        <div className="grid lg:grid-cols-10 gap-12 items-stretch">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6 flex flex-col">
                <div className="space-y-4 flex-1 min-h-[200px] relative overflow-hidden">
                    <div className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {contentSlides.map((slide, index) => (
                            <div key={index} className="w-full flex-shrink-0 space-y-4">
                                <h2 className="text-3xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
                                    {slide.title}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-1 bg-lime-400 rounded-full" />
                                    <h2 className="text-3xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
                                        {slide.subtitle}
                                    </h2>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                    {slide.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Indicator */}
                <div className="flex items-center gap-4">
                    {/* Left Arrow */}
                    <div
                        className="cursor-pointer hover:scale-110 transition-transform duration-200 select-none"
                        onClick={prevSlide}
                    >
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-2">
                        {contentSlides.map((_, index) => (
                            <div
                                key={index}
                                className={`w-6 h-0.5 transition-all duration-300 cursor-pointer select-none ${index === currentSlide
                                    ? 'bg-gray-700 dark:bg-gray-300'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <div
                        className="cursor-pointer hover:scale-110 transition-transform duration-200 select-none"
                        onClick={nextSlide}
                    >
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right Column - Static Content */}
            <div className="lg:col-span-6 space-y-6 flex flex-col">
                <div className="flex-1 space-y-6 min-h-[300px]">
                    <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                        Our blockchain logistics platform leverages smart contracts, IoT sensors, and distributed
                        ledger technology to create an immutable record of every shipment. From origin to destination,
                        every transaction is verified, transparent, and secure.
                    </p>

                    {/* Client Avatars */}
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {clientImages.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Client ${index + 1}`}
                                    className={`w-6 h-6 rounded-full object-cover border-2 border-white dark:border-gray-800 ${index === 0 ? 'ring-2 ring-lime-400' : ''
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">5K+</span><br />
                            verified partners
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-base text-gray-700 dark:text-gray-300">
                            Experience seamless blockchain logistics with complete visibility and security.
                        </p>

                        {/* Rating */}
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300/50">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">4.5</span>
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300/50">
                                <span className="text-sm text-gray-900 dark:text-white">Network Status</span>
                                <ArrowRight className="w-3 h-2 text-gray-700 dark:text-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
