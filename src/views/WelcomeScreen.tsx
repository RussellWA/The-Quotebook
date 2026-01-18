// import { useState } from "react";

type GameMode = 'single' | 'all';

interface WelcomeProps {
    onStart: (mode: GameMode) => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
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
            </div>
        </div>
    );
}