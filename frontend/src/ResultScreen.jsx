import React, { useState } from 'react';
import { CheckCircle, Copy, ThumbsUp, ThumbsDown, RefreshCw, Sparkles } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// --- CONFIGURATION ---
const API_URL = import.meta.env.VITE_API_URL;

const ResultScreen = ({ prompt, initialPrompt, categoryLabel, onReset, currentUser, onToggleHistory }) => {
    const [copied, setCopied] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleCopy = () => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); };

    const openChatGPT = () => window.open(`https://chat.openai.com/?model=gpt-4`, '_blank');
    const openGemini = () => window.open(`https://gemini.google.com/app`, '_blank');

    const sendFeedback = async (rating) => {
        const safeCategory = categoryLabel || "general";

        try {
            await addDoc(collection(db, "feedback"), {
                input: initialPrompt, output: prompt, rating, uid: currentUser?.uid, timestamp: serverTimestamp()
            });
            setFeedback('sent');
        } catch (e) { console.error("Firebase Error:", e); }

        try {
            await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: initialPrompt, category_id: safeCategory, rating: rating })
            });
        } catch (e) { console.error("AI Learning Error:", e); }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-10">
                <button onClick={onReset} className="text-slate-500 font-medium hover:text-blue-600 transition">← Start Over</button>
                <button onClick={onToggleHistory} className="px-3 py-2 bg-white text-blue-700 rounded-lg shadow-sm border border-slate-200 text-sm font-bold">History</button>
            </div>

            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden mt-10 animate-fade-in-up">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white text-center relative">
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-100" />
                    <h2 className="text-2xl font-bold">Prompt Optimized!</h2>
                    <p className="text-emerald-100 text-sm opacity-90">Ready for your favorite AI model</p>
                </div>

                <div className="p-8">
                    <div className="group relative">
                        <div className="absolute -top-3 left-4 px-2 bg-white text-xs font-bold text-slate-400 uppercase tracking-wider">Final Output</div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner relative hover:border-blue-300 transition-colors">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">{prompt}</pre>
                            <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-400 transition">
                                {copied ? <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> <span className="text-xs font-bold">Copied</span></div> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button onClick={openChatGPT} className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition">
                            Run in ChatGPT
                        </button>
                        <button onClick={openGemini} className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            Run in Gemini
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                        <div className="text-sm font-semibold text-slate-500">Was this categorized correctly?</div>
                        <div className="flex gap-2">
                            {feedback === 'sent' ? (
                                <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">Thanks for teaching AI!</span>
                            ) : (
                                <>
                                    <button onClick={() => sendFeedback(1)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition group">
                                        <ThumbsUp className="w-4 h-4" /> <span className="text-xs font-bold">Yes</span>
                                    </button>
                                    <button onClick={() => sendFeedback(0)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition group">
                                        <ThumbsDown className="w-4 h-4" /> <span className="text-xs font-bold">No</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button onClick={onReset} className="px-6 py-3 text-slate-400 font-medium hover:text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition">
                            Generate Another Prompt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultScreen;