"use client";

import { useEffect, useRef } from "react";

export const useMultiParallax = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;

      if (backgroundRef.current) {
        const bgParallax = scrolled * 0.5;
        backgroundRef.current.style.transform = `translateY(${bgParallax}px)`;
      }

      if (contentRef.current) {
        const contentParallax = scrolled * 0.2;
        contentRef.current.style.transform = `translateY(${contentParallax}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { backgroundRef, contentRef };
};
