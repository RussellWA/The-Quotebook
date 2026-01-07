import { useState } from "react";
import Score from "./views/ScoreScreen";
import Welcome from "./views/WelcomeScreen";

type Screen = 'menu' | 'game' | 'score';
type GameMode = 'single' | 'all';

function App() {
    const [screen, setScreen] = useState<Screen>('menu')
    const [mode, setMode] = useState<GameMode>('single');
    const [finalScore, setFinalScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const startGame = (selectedMode: GameMode) => {
        setMode(selectedMode);
        setScreen('game');
    }

    const backToMenu = () => {
        setScreen('menu');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
                {screen === 'menu' && (
                    <Welcome onStart={startGame} />
                )}
                {screen === 'game' && (
                    <div className="text-center">Game Screen (Coming Soon)</div>
                )}
                {screen === 'score' && (
                    <Score score={finalScore} total={totalQuestions} onRestart={() => startGame(mode)} onMenu={backToMenu}/>
                )}
            </div>
        </div>
    )
}

export default App
