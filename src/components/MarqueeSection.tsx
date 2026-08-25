import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring, useAnimationFrame } from 'framer-motion';

const createText = (text: string, times: number) => Array(times).fill(text).join(' ✦ ');

const MarqueeSection = () => {
    const text = createText('Sowmiyan S', 6);
    const text2 = createText('Sowmiyan S', 6);

    const baseVelocity = -0.04;
    const baseX = useRef(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 6], {
        clamp: false,
    });

    const [x1, setX1] = useState(0);

    useAnimationFrame((_, delta) => {
        let moveBy = baseVelocity * (delta / 20);
        moveBy += moveBy * velocityFactor.get();
        baseX.current += moveBy;

        if (baseX.current <= -50) {
            baseX.current = 0;
        } else if (baseX.current > 0) {
            baseX.current = -50;
        }

        setX1(baseX.current);
    });

    return (
        <section className="relative py-2 md:py-3 overflow-hidden bg-white border-t border-b border-slate-200/60 z-10 select-none">
            <div className="relative overflow-hidden w-full">
                <motion.div
                    className="flex flex-nowrap whitespace-nowrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-red-600 leading-tight pointer-events-none"
                    style={{ transform: `translateX(${x1}%)`, fontFamily: "'Waterfall', cursive", lineHeight: 1 }}
                >
                    <span className="mx-4">{text}</span>
                    <span className="mx-4">✦</span>
                    <span className="mx-4">{text2}</span>
                </motion.div>
            </div>
        </section>
    );
};

export default MarqueeSection;
