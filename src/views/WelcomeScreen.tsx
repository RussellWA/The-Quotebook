import { useState } from "react";

type GameMode = 'single' | 'all';

interface WelcomeProps {
    onStart: (mode: GameMode) => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);

        try {
            const res = await fetch('https://quotebook-be.vercel.app/api/quiz/refresh', {
                method: 'POST' 
            });

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const data = await res.json();
            console.log("Refresh successful:", data);

        } catch (err) {
            console.error("Failed to refresh quiz data:", err);
            alert("Failed to refresh data. Check console.");
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="text-center space-y-6">
            <h1>The Quotebook</h1>
            <div className="space-y-5">
                <button
                    onClick={() => onStart('single')}
                    className="w-full py-3 px-6 bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                    Single Random Question
                </button>
                <button
                    onClick={() => onStart('all')}
                    className="w-full py-3 px-6 bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                    Answer All
                </button>
                <button 
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors
                        ${isRefreshing 
                            ? 'bg-green-800 text-green-200 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-500'
                        }`}
                >
                    {isRefreshing ? 'Refreshing...' : 'Refresh Questions'}
                </button>
            </div>
        </div>
    );
}