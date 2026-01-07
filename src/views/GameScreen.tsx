import { useEffect, useState } from "react";
import type { Question } from "../type/Question";


interface GameProps {
    mode: 'single' | 'all'
    onFinish: (score: number, total: number) => void;
}

const FIXED_OPTIONS = ["Frank", "Russ", "Will"];

export default function Game({ mode, onFinish }: GameProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false); // API loading state
    const [isAnswered, setIsAnswered] = useState(false);     // Did we check the answer?
    const [feedback, setFeedback] = useState<{ text: string, isCorrect: boolean } | null>(null);
    
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/quiz/start', {
                    method: 'POST'
                });

                const result = await res.json();

                const data = result.questions;

                if (mode === 'single') {
                    const random = data[Math.floor(Math.random() * data.length)];
                    setQuestions([random]);
                } else {
                    setQuestions(data);
                }
            } catch (err) {
                console.error("Failed to fetch questions:", err);
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        }

        fetchQuestions();
    }, [mode]);

    const handleSubmit = async () => {
        if (!selectedOption || isSubmitting) return;
        setIsSubmitting(true);

        const currQuestion = questions[currentIndex];

        const res = await fetch('http://localhost:8080/api/quiz/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question_id: currQuestion.id, answer: selectedOption })
        })

        const result = await res.json();

        if (result.correct) {
            setScore(s => s + 1)
        }

        setFeedback({
            text: result.correct ? "✅ Correct!" : "❌ Incorrect",
            isCorrect: result.correct
        });
        setIsAnswered(true);
        setIsSubmitting(false);
    }

    const handleNext = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        setFeedback(null);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onFinish(score, questions.length);
        }
    }

    if (loading) return <div className="text-xl animate-pulse">Loading Questions...</div>;
    if (questions.length === 0) return <div className="text-red-500">Error: No questions found!</div>;

    return (
        <div className="space-y-8 w-full max-w-md">

            <div className="flex justify-between items-end px-1">
                <span className="text-slate-400 font-medium">
                    Question <span className="text-white text-lg font-bold">{currentIndex + 1}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    {questions.length}
                </span>
                
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>
        
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 min-h-30 flex items-center justify-center text-center shadow-lg">
                <h2 className="text-2xl font-bold text-white">
                    {questions[currentIndex].text}
                </h2>
            </div>

            <div className="space-y-3">
                {FIXED_OPTIONS.map((option) => (
                <label 
                    key={option}
                    className={`
                    relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${selectedOption === option 
                        ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50' 
                        : 'border-slate-700 bg-slate-800 hover:bg-slate-750'}
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <input 
                        type="radio" 
                        name="quiz-option" 
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => !isSubmitting && setSelectedOption(option)}
                        className="sr-only"
                    />
                    
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                        ${selectedOption === option ? 'border-blue-500' : 'border-slate-500'}
                    `}>
                        {selectedOption === option && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        )}
                    </div>

                    <span className="text-lg font-medium text-slate-200">{option}</span>
                </label>
                ))}
            </div>

            {isAnswered && feedback && (
                <div className={`text-center text-2xl font-bold animate-bounce ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback.text}
                </div>
            )}

            <button
                onClick={isAnswered ? handleNext : handleSubmit}
                disabled={(!selectedOption && !isAnswered) || isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg
                    ${isAnswered
                        ? 'bg-blue-600 hover:bg-blue-500'
                        : 'bg-emerald-600 hover:bg-emerald-500'
                    }
                    disabled:bg-slate-700 disabled:text-slate-500
                `}
            >
                {isSubmitting 
                    ? 'Checking...' 
                    : isAnswered 
                        ? currentIndex < questions.length - 1
                            ? 'Next Question'
                            : 'Finish Quiz'
                        : 'Confirm Answer'
                }
            </button>

        </div>
    );
}