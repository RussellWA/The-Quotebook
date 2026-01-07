
interface ScoreProps {
    score: number;
    total: number;
    onRestart: () => void;
    onMenu: () => void;
}

export default function Score({score, total, onRestart, onMenu}: ScoreProps) {
    return (
        <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Game Over!</h2>
            <p className="text-5xl font-black text-yellow-400">
                {score} / {total}
            </p>
            <div className="flex gap-3">
                <button onClick={onMenu} className="flex-1 py-3 bg-slate-700 rounded-lg">
                    Menu
                </button>
                <button onClick={onRestart} className="flex-1 py-3 bg-blue-600 rounded-lg">
                    Play Again
                </button>
            </div>
        </div>
    )
}