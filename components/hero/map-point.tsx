"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MapPointProps {
    className?: string;
    quote?: {
        title: string;
        description: string;
        direction?: "left" | "right" | "top" | "bottom";
    };
    lineConfig?: {
        path: string;
        width: number;
        height: number;
        quotePosition?: { x: number; y: number }; // Vị trí của quote ở cuối đường
    };
}

export function MapPoint({
    className = "",
    quote = {
        title: "COSCO Shipping Universe",
        description: "As one of the largest container vessel fleets in the world, COSCO Shipping Universe is a flagship of COSCO's ultra-large vessel.",
        direction: "right"
    },
    lineConfig = {
        path: "M 6 6 L 60 60 L 350 60", // Bắt đầu từ góc dưới phải mappoint
        width: 370,
        height: 80,
        quotePosition: { x: 350, y: 60 } // Vị trí cuối đường
    }
}: MapPointProps) {
    const [isHovered, setIsHovered] = useState(false);
    const pointRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGPathElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const pulseRingRef = useRef<HTMLDivElement>(null);

    // Generate unique ID for this component instance
    const filterId = `glow-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        if (isHovered) {
            // Animate the pulse ring
            if (pulseRingRef.current) {
                gsap.fromTo(pulseRingRef.current,
                    { scale: 1, opacity: 0.8 },
                    {
                        scale: 3,
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.out",
                        repeat: -1
                    }
                );
            }

            // Animate the line drawing
            if (lineRef.current) {
                const path = lineRef.current;
                const length = path.getTotalLength();

                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length
                });

                gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: 1.2,
                    ease: "power2.inOut"
                });
            }

            // Animate the quote appearance - only after line is drawn
            if (quoteRef.current) {
                gsap.fromTo(quoteRef.current,
                    { opacity: 0, y: 10, scale: 0.8 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.4,
                        delay: 1.2, // Hiện sau khi đường vẽ xong
                        ease: "back.out(1.7)"
                    }
                );
            }
        } else {
            // Reset animations when not hovered
            if (pulseRingRef.current) {
                gsap.killTweensOf(pulseRingRef.current);
                gsap.set(pulseRingRef.current, { scale: 1, opacity: 0 });
            }

            if (lineRef.current) {
                gsap.set(lineRef.current, { strokeDashoffset: lineRef.current.getTotalLength() });
            }

            if (quoteRef.current) {
                gsap.set(quoteRef.current, { opacity: 0, y: 10, scale: 0.8 });
            }
        }
    }, [isHovered]);

    const getQuotePositionAtLineEnd = () => {
        const { x, y } = lineConfig.quotePosition || { x: 380, y: 60 };
        // Quote bắt đầu chính xác từ điểm cuối của line, với một khoảng cách nhỏ để không đè lên
        return {
            left: `${x + 5}px`, // Thêm 5px khoảng cách từ điểm cuối line
            top: `${y - 25}px`, // Đặt quote phía trên line một chút để không đè
            transform: 'translate(0, 0)' // Không center, bắt đầu từ điểm được chỉ định
        };
    };

    const getLineStartPosition = () => {
        // Line bắt đầu từ góc dưới phải của mappoint (6px từ center = 3px radius + 3px offset)
        return "left-3 top-3"; // Từ center của mappoint
    };

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Point */}
            <div
                ref={pointRef}
                className="relative w-3 h-3 bg-white rounded-full border-2 border-white/40 cursor-pointer transition-all duration-300 hover:scale-125 hover:border-white/90 hover:shadow-lg hover:shadow-white/30"
            >
                {/* Pulse Ring */}
                <div
                    ref={pulseRingRef}
                    className="absolute inset-0 w-3 h-3 bg-white/30 rounded-full pointer-events-none"
                />

                {/* Inner Glow */}
                <div className="absolute inset-0.5 w-2 h-2 bg-white rounded-full opacity-90" />
            </div>

            {/* Animated Connection Line */}
            {isHovered && (
                <svg
                    className={`absolute ${getLineStartPosition()} hidden md:block pointer-events-none`}
                    width={lineConfig.width}
                    height={lineConfig.height}
                    viewBox={`0 0 ${lineConfig.width} ${lineConfig.height}`}
                >
                    <defs>
                        <filter id={filterId}>
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <path
                        ref={lineRef}
                        d={lineConfig.path}
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.9"
                        filter={`url(#${filterId})`}
                        className="drop-shadow-lg"
                    />
                </svg>
            )}

            {/* Quote Card - Positioned at end of line */}
            {isHovered && (
                <div
                    ref={quoteRef}
                    className="absolute z-10 pointer-events-none"
                    style={getQuotePositionAtLineEnd()}
                >
                    <div className="w-72 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-md inline-flex flex-col justify-start items-start gap-[3px] overflow-hidden shadow-2xl shadow-black/20">
                        <div className="justify-center text-white text-[14px] font-semibold font-['Instrument_Sans'] leading-[18px]">
                            {quote.title}
                        </div>
                        <div className="self-stretch justify-center text-white/80 text-[11px] font-normal font-['Instrument_Sans'] leading-[14px]">
                            {quote.description}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
