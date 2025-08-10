interface InfoCardProps {
    title: string;
    description: string;
    className?: string;
}

export function InfoCard({ title, description, className = "" }: InfoCardProps) {
    return (
        <div className={`w-72 p-4 bg-white/10 rounded-lg border border-white/30 backdrop-blur-md flex flex-col justify-start items-start gap-3 ${className}`}>
            <div className="text-white text-sm font-semibold font-sans leading-tight">
                {title}
            </div>
            <div className="self-stretch text-white/90 text-xs font-normal font-sans leading-relaxed">
                {description}
            </div>
        </div>
    );
}
