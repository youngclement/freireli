"use client";

import { useEffect, useRef } from "react";

export const useParallax = (speed: number = 0.5) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const scrolled = window.pageYOffset;
      const parallax = scrolled * speed;

      elementRef.current.style.transform = `translateY(${parallax}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return elementRef;
};
