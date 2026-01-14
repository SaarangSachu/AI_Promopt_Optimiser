import React from 'react';
import {
    Code, BarChart, Dumbbell, Utensils, Heart, GraduationCap,
    BookOpen, ShoppingBag, Plane, PenTool, Sparkles
} from 'lucide-react';

// --- ADVANCED PROMPT BUILDER ---
const buildPrompt = (role, context, details, task) => {
    return `### ROLE
Act as a world-class ${role}.

### CONTEXT
The user has the following request: "${context}"

### DETAILS & REQUIREMENTS
${Object.entries(details).map(([k, v]) => `- ${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n')}

### TASK
${task}

### OUTPUT FORMAT
- Structured, clear, and professional.
- Use Markdown formatting (bolding, lists) where appropriate.
- Maintain a consistent tone suited for the persona.`;
};

export const CATEGORIES = {
    CODING: {
        id: 'coding',
        label: 'Coding & Dev',
        persona: "Senior Software Architect",
        icon: <Code className="w-8 h-8 text-white" />,
        color: 'bg-blue-600',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Senior Software Architect",
            initial,
            answers,
            "Provide a robust, clean, and optimized code solution. Explain your logic, handle edge cases, and ensure best practices."
        )
    },
    DATA_ANALYSIS: {
        id: 'data_analysis',
        label: 'Data Analysis',
        persona: "Lead Data Scientist",
        icon: <BarChart className="w-8 h-8 text-white" />,
        color: 'bg-cyan-600',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Lead Data Scientist",
            initial,
            answers,
            "Analyze the request to provide actionable insights. Suggest specific charts, statistical tests, or Python/Pandas code to derive meaning from the data."
        )
    },
    FITNESS: {
        id: 'fitness',
        label: 'Health & Fitness',
        persona: "Elite Personal Trainer (CSCS)",
        icon: <Dumbbell className="w-8 h-8 text-white" />,
        color: 'bg-orange-500',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Elite Personal Trainer",
            initial,
            answers,
            "Create a detailed, science-based workout or nutrition plan. Focus on progressive overload, safety, and sustainability."
        )
    },
    COOKING: {
        id: 'cooking',
        label: 'Culinary Arts',
        persona: "Michelin Star Chef",
        icon: <Utensils className="w-8 h-8 text-white" />,
        color: 'bg-red-500',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Michelin Star Chef",
            initial,
            answers,
            "Provide a recipe with precise measurements. Include a 'Chef's Tip' for elevating the flavor and explain the technique used."
        )
    },
    EMOTIONAL: {
        id: 'emotional',
        label: 'Emotional IQ',
        persona: "Empathetic Psychologist",
        icon: <Heart className="w-8 h-8 text-white" />,
        color: 'bg-pink-600',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Compassionate Psychologist",
            initial,
            answers,
            "Provide empathetic, non-judgmental advice. Validate the user's feelings first, then offer constructive coping mechanisms or perspective."
        )
    },
    ACADEMIC: {
        id: 'academic',
        label: 'Academic Research',
        persona: "University Professor",
        icon: <GraduationCap className="w-8 h-8 text-white" />,
        color: 'bg-indigo-700',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Distinguished Professor",
            initial,
            answers,
            "Assist with research or writing. detailed academic rigor, proper citations, and logical argumentation."
        )
    },
    LITERATURE: {
        id: 'literature',
        label: 'Literature',
        persona: "Best-Selling Author",
        icon: <BookOpen className="w-8 h-8 text-white" />,
        color: 'bg-purple-600',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Best-Selling Novelist",
            initial,
            answers,
            "Write a creative piece with evocative language. Focus on showing not telling, character depth, and narrative pacing."
        )
    },
    MARKETING: {
        id: 'marketing',
        label: 'Marketing',
        persona: "Chief Marketing Officer",
        icon: <ShoppingBag className="w-8 h-8 text-white" />,
        color: 'bg-green-600',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Chief Marketing Officer",
            initial,
            answers,
            "Draft high-converting copy. Focus on the unique selling proposition (USP), emotional hooks, and a clear call to action (CTA)."
        )
    },
    TRAVEL: {
        id: 'travel',
        label: 'Travel',
        persona: "Luxury Travel Concierge",
        icon: <Plane className="w-8 h-8 text-white" />,
        color: 'bg-sky-500',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Luxury Travel Concierge",
            initial,
            answers,
            "Create a day-by-day itinerary. Include hidden gems, logistics, and varied activities matching the user's vibe."
        )
    },
    DESIGN: {
        id: 'design',
        label: 'Design',
        persona: "Creative Director",
        icon: <PenTool className="w-8 h-8 text-white" />,
        color: 'bg-fuchsia-600',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Creative Director",
            initial,
            answers,
            "Provide visual direction. Discuss color theory, typography, composition, and user experience (UX) principles."
        )
    },
    GENERAL: {
        id: 'general',
        label: 'General',
        persona: "Helpful Expert",
        icon: <Sparkles className="w-8 h-8 text-white" />,
        color: 'bg-slate-600',
        defaults: [],
        generate: (initial, answers) => buildPrompt(
            "Helpful Expert",
            initial,
            answers,
            "Provide a comprehensive and accurate answer. Break down complex topics and use examples."
        )
    }
};