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

    const openChatGPT = () => {
        navigator.clipboard.writeText(prompt);
        window.open(`https://chat.openai.com/?model=gpt-4`, '_blank');
    };
    const openGemini = () => {
        navigator.clipboard.writeText(prompt);
        window.open(`https://gemini.google.com/app`, '_blank');
    };

    const [showNotification, setShowNotification] = useState(false);

    const sendFeedback = async (rating) => {
        const safeCategory = categoryLabel || "general";

        try {
            await addDoc(collection(db, "feedback"), {
                input: initialPrompt, output: prompt, rating, uid: currentUser?.uid, timestamp: serverTimestamp()
            });
            setFeedback('sent');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
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
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
            {/* Notification Toast */}
            <div className={`fixed top-20 right-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-2xl skew-x-[-10deg] border border-white/20 z-50 transition-all duration-500 transform ${showNotification ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
                <div className="skew-x-[10deg] flex items-center gap-2 font-bold">
                    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                    Thank you for review
                </div>
            </div>

            <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-10">
                <button onClick={onReset} className="text-slate-400 font-medium hover:text-cyan-400 transition">← Start Over</button>
                <button onClick={onToggleHistory} className="px-3 py-2 bg-slate-800/80 text-cyan-400 rounded-lg shadow-sm border border-slate-700 text-sm font-bold backdrop-blur-md hover:bg-slate-700 transition">History</button>
            </div>

            <div className="w-full max-w-4xl bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden mt-10 animate-fade-in-up">
                <div className="bg-gradient-to-r from-emerald-600/80 to-teal-600/80 p-6 text-white text-center relative border-b border-emerald-500/30">
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-100 drop-shadow-md" />
                    <h2 className="text-2xl font-bold text-shadow">Prompt Optimized!</h2>
                    <p className="text-emerald-100 text-sm opacity-90">Ready for your favorite AI model</p>
                </div>

                <div className="p-8">
                    <div className="group relative">
                        <div className="absolute -top-3 left-4 px-2 bg-slate-800 text-xs font-bold text-cyan-400 uppercase tracking-wider border border-slate-700 rounded shadow-sm z-10">Final Output</div>
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 shadow-inner relative hover:border-cyan-500/50 transition-colors group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed selection:bg-cyan-500/30">{prompt}</pre>
                            <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg shadow-sm border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition">
                                {copied ? <div className="flex items-center gap-1 text-green-400"><CheckCircle className="w-4 h-4" /> <span className="text-xs font-bold">Copied</span></div> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button onClick={openChatGPT} className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700 font-semibold text-slate-300 hover:text-white transition">
                            Run in ChatGPT
                        </button>
                        <button onClick={openGemini} className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700 font-semibold text-slate-300 hover:text-white transition">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            Run in Gemini
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
                        <div className="text-sm font-semibold text-slate-500">Was this categorized correctly?</div>
                        <div className="flex gap-2">
                            {feedback === 'sent' ? (
                                <span className="text-green-400 font-bold text-sm bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">Thanks for review!</span>
                            ) : (
                                <>
                                    <button onClick={() => sendFeedback(1)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/50 transition group text-slate-400">
                                        <ThumbsUp className="w-4 h-4" /> <span className="text-xs font-bold">Yes</span>
                                    </button>
                                    <button onClick={() => sendFeedback(0)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition group text-slate-400">
                                        <ThumbsDown className="w-4 h-4" /> <span className="text-xs font-bold">No</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button onClick={onReset} className="px-6 py-3 text-slate-500 font-medium hover:text-slate-300 hover:bg-slate-800 rounded-lg text-sm transition">
                            Generate Another Prompt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultScreen;