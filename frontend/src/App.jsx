import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { FileText, LogOut, Clock, X, Sparkles, Send, Info, Moon, Sun } from 'lucide-react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

// IMPORTS
import { CATEGORIES } from './Categories';
import ResultScreen from './ResultScreen';
import GeneratingScreen from './GeneratingScreen';

// --- CONFIGURATION ---
const API_URL = import.meta.env.VITE_API_URL;
import StarBackground from './StarBackground';

// --- COMPONENTS ---

const HistorySidebar = ({ isOpen, onClose, historyItems, onLoadItem }) => (
  <>
    <div className={`fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
    <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center gap-2 font-bold text-slate-200"><Clock className="w-5 h-5 text-cyan-500" />History</div>
        <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-full transition text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-3 custom-scrollbar">
        {historyItems.length === 0 ? <div className="text-center text-slate-500 mt-10 text-sm">No history found.</div> : historyItems.map((item) => (
          <div key={item.id} onClick={() => onLoadItem(item)} className="group p-3 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-700/50 cursor-pointer transition relative">
            <div className="text-xs font-bold text-cyan-500 mb-1 uppercase tracking-wider">{CATEGORIES[item.category_id?.toUpperCase()]?.label || 'General'}</div>
            <p className="text-sm text-slate-300 line-clamp-2 font-medium group-hover:text-white transition-colors">{item.original_input}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleGoogle = async () => { try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (err) { setError(err.message); } };
  const handleSubmit = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { isLogin ? await signInWithEmailAndPassword(auth, email, password) : await createUserWithEmailAndPassword(auth, email, password); } catch (err) { setError(err.message); } finally { setLoading(false); } };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans selection:bg-cyan-500/30">
      {/* Global StarBackground is handled in App wrapper */}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative group w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden p-8 text-center"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(6, 182, 212, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-6 border border-slate-700 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <FileText className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </motion.div>

          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]">PromptMinds</h1>
          <p className="text-slate-400 mb-8 text-sm tracking-wide">Unlock the power of AI prompts</p>

          <div className="flex mb-8 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50 relative">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 relative z-10 ${isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              Log In
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 relative z-10 ${!isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              Sign Up
            </button>
            <motion.div
              layout
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-gradient-to-r from-cyan-600 to-blue-600 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              animate={{ x: isLogin ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300"
                  placeholder="Email Address"
                  required
                />
              </motion.div>
              <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300"
                  placeholder="Password"
                  required
                />
              </motion.div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <span className="animate-pulse">Processing...</span> : (isLogin ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogle}
              className="w-full bg-white text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors"
            >
              <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
              Sign in with Google
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputScreen = ({ onSubmit, username, onLogout, isAnalyzing, onToggleHistory, theme, toggleTheme }) => {
  const [text, setText] = useState('');
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <header className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-700/50 p-4 flex justify-between items-center z-10 transition-colors duration-500">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xl drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]"><FileText className="w-6 h-6" /> PromptMinds</div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-400">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </button>
          <span className="text-slate-600 dark:text-slate-400 text-sm hidden sm:inline">{username}</span>
          <button onClick={onToggleHistory} className="px-3 py-2 bg-slate-100 dark:bg-slate-800/80 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">History</button>
          <button onClick={onLogout}><LogOut className="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-red-400 transition" /></button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-shadow-lg transition-colors duration-500">What's your goal?</h2>
          <textarea value={text} onChange={(e) => setText(e.target.value)} disabled={isAnalyzing} className="w-full h-40 p-5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-lg resize-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] focus:outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500" placeholder="e.g., I want to lose weight in 3 months..." />
          <button onClick={() => text.trim() && onSubmit(text)} disabled={!text.trim() || isAnalyzing} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95">{isAnalyzing ? 'Analyzing...' : 'Analyze & Optimize'}</button>
        </div>
      </main>
    </div>
  );
};

const QuestionnaireScreen = ({ initialPrompt, category, questions, prefilledAnswers, confidence, onComplete, onBack, onChangeCategory, allCategories }) => {
  const [answers, setAnswers] = useState(prefilledAnswers || {});
  useEffect(() => { setAnswers(pre => ({ ...pre, ...prefilledAnswers })); }, [prefilledAnswers]);
  useEffect(() => { setAnswers({}); }, [questions]);
  const handleInputChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));
  const getConfColor = (score) => score >= 0.8 ? "bg-green-500/20 text-green-100 border-green-500/50" : (score >= 0.6 ? "bg-yellow-500/20 text-yellow-100 border-yellow-500/50" : "bg-red-500/20 text-red-100 border-red-500/50");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-3xl bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-fade-in-up">
        <div className={`${category.color} p-8 text-white transition-colors duration-500 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <button onClick={onBack} className="text-white/80 hover:text-white font-medium text-sm transition">← Back</button>
            <div className="flex gap-3 items-center">
              {confidence > 0 && <div className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1 ${getConfColor(confidence)}`}><Sparkles className="w-3 h-3" />{Math.round(confidence * 100)}% Match</div>}
              <select value={category.id} onChange={(e) => onChangeCategory(e.target.value)} className="bg-black/30 border border-white/30 text-white py-1 px-3 rounded-full text-xs font-bold uppercase cursor-pointer outline-none hover:bg-black/50 transition">{Object.values(allCategories).map((cat) => <option key={cat.id} value={cat.id} className="text-slate-200 bg-slate-800">{cat.label}</option>)}</select>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10"><div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">{category.icon}</div><div><h2 className="text-2xl font-bold text-shadow">{category.label}</h2><p className="text-white/80 text-sm font-medium">{category.persona}</p></div></div>
        </div>
        <div className="p-8">
          <div className="mb-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50"><p className="text-xs font-bold text-slate-400 uppercase">Original Prompt</p><p className="text-slate-300 italic text-sm">"{initialPrompt}"</p></div>
          <form onSubmit={(e) => { e.preventDefault(); onComplete(answers); }} className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2 group">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-slate-300">{q.label}</label>
                  {q.reason && <div className="relative group/tooltip"><Info className="w-4 h-4 text-slate-500 hover:text-cyan-500 cursor-help transition" /><div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 p-3 bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-20">{q.reason}<div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-t border-slate-700 rotate-45"></div></div></div>}
                </div>
                <input type="text" required value={answers[q.id] || ''} className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition" placeholder={q.placeholder} onChange={(e) => handleInputChange(q.id, e.target.value)} />
              </div>
            ))}
            <button type="submit" className={`w-full text-white py-3 rounded-lg font-semibold shadow-lg ${category.color} brightness-110 hover:brightness-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all transform active:scale-[0.98]`}>Generate <Send className="w-4 h-4 inline ml-2" /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('auth');
  const [data, setData] = useState({ initial: '', category: null, final: '', questions: [], prefills: {}, confidence: 0 });
  const [history, setHistory] = useState({ open: false, items: [] });
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => { const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); if (u) { setView('input'); loadHistory(u.uid); } else { setView('auth'); } }); return unsub; }, []);

  const loadHistory = async (uid) => {
    try {
      const q = query(collection(db, "history"), where("uid", "==", uid), orderBy("timestamp", "desc"));
      const s = await getDocs(q);
      setHistory(h => ({ ...h, items: s.docs.map(d => ({ id: d.id, ...d.data() })) }));
    } catch (e) {
      console.error("Error loading history:", e);
      if (e.message.includes("index")) {
        alert("Firestore Index Missing! Open the browser console (F12) to see the link to create it.");
      }
    }
  };
  const saveHistory = async (orig, final, catId) => { if (!user) return; try { const doc = await addDoc(collection(db, "history"), { uid: user.uid, original_input: orig, optimized_prompt: final, category_id: catId, timestamp: serverTimestamp() }); setHistory(h => ({ ...h, items: [{ id: doc.id, original_input: orig, optimized_prompt: final, category_id: catId, timestamp: { seconds: Date.now() / 1000 } }, ...h.items] })); } catch (e) { console.error(e); } };
  const handleLogout = async () => { await signOut(auth); setData({ initial: '', category: null, final: '', questions: [], prefills: {}, confidence: 0 }); };

  const fetchQuestions = async (text, categoryId) => {
    try {
      const res = await fetch(`${API_URL}/generate_questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, category_id: categoryId })
      });
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      return data.questions;
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Fallback handled by backend, but if network fails completely, return empty to trigger default generation
      return [];
    }
  };

  const handleAnalyze = async (text) => {
    setAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error("API Error");
      const resData = await res.json();
      const cat = Object.values(CATEGORIES).find(c => c.id === resData.category_id) || CATEGORIES.GENERAL;

      if (resData.questions.length === 0) {
        // ... (existing auto-optimize logic)
        const draft = cat.generate(text, resData.prefilled_answers);
        const optRes = await fetch(`${API_URL}/optimize`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ draft_prompt: draft }) });
        const optData = await optRes.json();
        setData({ ...data, initial: text, final: optData.optimized_prompt, category: cat, confidence: resData.confidence });
        saveHistory(text, optData.optimized_prompt, cat.id);
        setView('result');
      } else {
        setData({ ...data, initial: text, category: cat, questions: resData.questions, prefills: resData.prefilled_answers, confidence: resData.confidence });
        setView('questions');
      }
    } catch (e) { alert("Backend Offline (Ensure backend is running at " + API_URL + ")"); } finally { setAnalyzing(false); }
  };

  const handleFinalize = async (answers) => {
    const draft = data.category.generate(data.initial, answers);
    setAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/optimize`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ draft_prompt: draft }) });
      const resData = await res.json();
      const finalPrompt = resData.optimized_prompt;
      setData({ ...data, final: finalPrompt });
      saveHistory(data.initial, finalPrompt, data.category.id);
      setView('result');
    } catch (e) {
      setData({ ...data, final: draft });
      saveHistory(data.initial, draft, data.category.id);
      setView('result');
    } finally { setAnalyzing(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-500 bg-[#0f172a]">Loading...</div>;

  return (
    <div className={`${theme} min-h-screen`}>
      <div className="bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 min-h-screen relative overflow-hidden transition-colors duration-500">
        <StarBackground theme={theme} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/10 dark:bg-purple-500/5 blur-[120px] transition-colors duration-500" />
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-400/10 dark:bg-cyan-500/5 blur-[120px] transition-colors duration-500" />
        </div>

        {analyzing && <GeneratingScreen customMessage={loadingMessage} />}

        <HistorySidebar isOpen={history.open} onClose={() => setHistory({ ...history, open: false })} historyItems={history.items} onLoadItem={(item) => { setData({ ...data, initial: item.original_input, final: item.optimized_prompt, category: Object.values(CATEGORIES).find(c => c.id === item.category_id), confidence: 0 }); setView('result'); setHistory({ ...history, open: false }); }} />
        {!user ? <AuthScreen /> : view === 'input' ? <InputScreen username={user.email} onSubmit={handleAnalyze} onLogout={handleLogout} isAnalyzing={analyzing} onToggleHistory={() => setHistory({ ...history, open: true })} theme={theme} toggleTheme={toggleTheme} /> : view === 'questions' ?
          <QuestionnaireScreen
            initialPrompt={data.initial}
            category={data.category}
            questions={data.questions}
            prefilledAnswers={data.prefills}
            confidence={data.confidence}
            onComplete={handleFinalize}
            onBack={() => setView('input')}
            onChangeCategory={async (id) => {
              const c = Object.values(CATEGORIES).find(cat => cat.id === id);
              if (c) {
                setLoadingMessage("Updating Questions...");
                setAnalyzing(true);
                // Optimistic update
                setData(prev => ({ ...prev, category: c, confidence: 0 }));
                // Fetch new questions based on the new category and original text
                const newQuestions = await fetchQuestions(data.initial, c.id);
                setData(prev => ({ ...prev, category: c, questions: newQuestions.length > 0 ? newQuestions : c.defaults || [], confidence: 0 }));
                setAnalyzing(false);
                setLoadingMessage(null);
              }
            }}
            allCategories={CATEGORIES}
          /> :
          <ResultScreen prompt={data.final} initialPrompt={data.initial} categoryLabel={data.category?.id} onReset={() => { setData({ initial: '', category: null, final: '', questions: [], prefills: {}, confidence: 0 }); setView('input'); }} currentUser={user} onToggleHistory={() => setHistory({ ...history, open: true })} />}
      </div>
    </div>
  );
}