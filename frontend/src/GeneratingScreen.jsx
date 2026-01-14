// src/GeneratingScreen.jsx
import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Zap, Brain, CheckCircle } from 'lucide-react';

const GeneratingScreen = () => {
    const [step, setStep] = useState(0);

    // Optional: Cycle through "loading" messages to keep the user entertained
    const messages = [
        "Analyzing your inputs...",
        "Consulting the AI Expert...",
        "Polishing the grammar...",
        "Optimizing for clarity...",
        "Finalizing your perfect prompt..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % messages.length);
        }, 1500); // Change message every 1.5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full text-center relative overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-loading-bar"></div>

                {/* Animated Icon */}
                <div className="mb-6 relative inline-block">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-gradient-to-tr from-blue-600 to-violet-600 p-4 rounded-full text-white shadow-lg">
                        <RefreshCw className="w-10 h-10 animate-spin" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Crafting Magic</h2>

                {/* Dynamic Text */}
                <div className="h-6 mb-8">
                    <p className="text-slate-500 font-medium animate-pulse transition-all duration-300">
                        {messages[step]}
                    </p>
                </div>

                {/* Steps Visualizer */}
                <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GeneratingScreen;