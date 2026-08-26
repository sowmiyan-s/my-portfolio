import React from 'react';

interface MarqueeSectionProps {
    font?: 'audiowide' | 'monsieur' | 'ruthie' | 'sacramento' | 'waterfall';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

const fontMap: Record<string, string> = {
    audiowide: "'Audiowide', cursive, sans-serif",
    monsieur: "'Monsieur La Doulaise', cursive",
    ruthie: "'Ruthie', cursive",
    sacramento: "'Sacramento', cursive",
    waterfall: "'Waterfall', cursive",
};

const sizeMap = {
    xs: 'text-[10px] sm:text-xs md:text-sm font-bold',
    sm: 'text-xs sm:text-sm md:text-base font-bold',
    md: 'text-sm sm:text-base md:text-lg lg:text-xl font-bold',
    lg: 'text-base sm:text-lg md:text-xl lg:text-2xl font-bold',
};

const createText = (text: string, times: number) => Array(times).fill(text).join(' ✦ ');

const MarqueeSection: React.FC<MarqueeSectionProps> = ({ font = 'audiowide', size = 'sm', className = '' }) => {
    const text = createText('Sowmiyan S', 8);

    const selectedFontFamily = fontMap[font] || fontMap.audiowide;
    const selectedSizeClass = sizeMap[size] || sizeMap.sm;

    return (
        <section className={`relative py-1 md:py-1.5 overflow-hidden bg-white border-t border-b border-slate-200/60 z-10 select-none ${className}`}>
            <div className="relative overflow-hidden w-full flex">
                <div
                    className={`animate-marquee-left flex shrink-0 items-center whitespace-nowrap ${selectedSizeClass} text-red-600 leading-tight pointer-events-none`}
                    style={{
                        fontFamily: selectedFontFamily,
                        lineHeight: 1.2,
                        letterSpacing: font === 'audiowide' ? '0.08em' : 'normal',
                        '--marquee-speed': '25s',
                    } as React.CSSProperties}
                >
                    <span className="mx-4">{text}</span>
                    <span className="mx-4 text-red-500">✦</span>
                    <span className="mx-4">{text}</span>
                    <span className="mx-4 text-red-500">✦</span>
                </div>
                <div
                    className={`animate-marquee-left flex shrink-0 items-center whitespace-nowrap ${selectedSizeClass} text-red-600 leading-tight pointer-events-none`}
                    aria-hidden="true"
                    style={{
                        fontFamily: selectedFontFamily,
                        lineHeight: 1.2,
                        letterSpacing: font === 'audiowide' ? '0.08em' : 'normal',
                        '--marquee-speed': '25s',
                    } as React.CSSProperties}
                >
                    <span className="mx-4">{text}</span>
                    <span className="mx-4 text-red-500">✦</span>
                    <span className="mx-4">{text}</span>
                    <span className="mx-4 text-red-500">✦</span>
                </div>
            </div>
        </section>
    );
};

export default MarqueeSection;
