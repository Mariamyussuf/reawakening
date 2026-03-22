interface LoadingScreenProps {
    label?: string;
    detail?: string;
    fullScreen?: boolean;
}

export default function LoadingScreen({
    label = "Loading",
    detail = "Preparing your next step",
    fullScreen = true,
}: LoadingScreenProps) {
    return (
        <div className={`${fullScreen ? "min-h-screen" : "min-h-[280px]"} bg-cream flex items-center justify-center px-6`}>
            <div className="text-center max-w-sm">
                <div className="relative mx-auto mb-6 h-20 w-20">
                    <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping" />
                    <div className="absolute inset-1 rounded-full border border-gold/30" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold border-r-gold/70 animate-spin" />
                    <div className="absolute inset-4 rounded-full border border-mid/20 bg-warm-white shadow-sm" />
                    <div className="absolute inset-[26px] rounded-full bg-deep flex items-center justify-center shadow-glow-gold">
                        <span className="font-display text-sm text-gold">R</span>
                    </div>
                </div>

                <p className="font-display text-2xl text-deep mb-2">{label}</p>
                <p className="text-sm text-deep/60 leading-relaxed">{detail}</p>
            </div>
        </div>
    );
}
