interface SocialIconProps {
    className?: string;
    icon?: 'instagram' | 'twitter' | 'linkedin';
}

export function SocialIcon({ className = "" }: SocialIconProps) {
    return (
        <div className={`w-6 h-6 bg-white/5 rounded-full border border-white/20 backdrop-blur-sm flex justify-center items-center overflow-hidden hover:bg-white/10 transition-colors cursor-pointer ${className}`}>
            <div className="w-3 h-3 text-white/70">
                {/* Simple dot for now - can be replaced with actual icons later */}
                <div className="w-full h-full rounded-full bg-white/70" />
            </div>
        </div>
    );
}
