import { useEffect, useState } from "react";
import type { Question } from "../type/Question";


interface GameProps {
    mode: 'single' | 'all'
    onFinish: (score: number, total: number) => void;
}

export default function Game({ mode, onFinish }: GameProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [context, setContext] = useState<string | null>(null);
    const [guess, setGuess] = useState('');
    
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/quiz/start');
                let data: Question[] = await res.json();

                if (mode === 'single') {
                    const random = data[Math.floor(Math.random() * data.length)];
                    setQuestions([random]);
                } else {
                    setQuestions(data);
                }
            } catch (err) {
                console.error("Failed to fetch questions:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchQuestions();
    }, [mode]);

    // const submitAnswer = async () => {
        
    // }

    if (loading) return <div className="text-xl animate-pulse">Loading Questions...</div>;
    if (questions.length === 0) return <div className="text-red-500">Error: No questions found!</div>;

    const currentQ = questions[currentIndex];

    return (
        <div className="text-center space-y-6">
            <div className="text-sm text-slate-400 mb-4">
                Question {currentIndex + 1} of {questions.length}
            </div>

            {feedback ? (
                <div className={`text-2xl font-bold p-4 rounded-lg animate-bounce ${feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback}
                    <span>Context: {context}</span>
                </div>
            ) : (
                <div>
                    <input 
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                    />
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold">{currentQ.question}</h2>
            </div>
        </div>
    );
}