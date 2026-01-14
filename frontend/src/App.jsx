import React, { useState, useEffect } from 'react';
import { FileText, LogOut, Clock, X, Sparkles, Send, Info } from 'lucide-react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

// IMPORTS
import { CATEGORIES } from './Categories';
import ResultScreen from './ResultScreen';
import GeneratingScreen from './GeneratingScreen';

// --- CONFIGURATION ---
const API_URL = import.meta.env.VITE_API_URL;

// --- COMPONENTS ---

const HistorySidebar = ({ isOpen, onClose, historyItems, onLoadItem }) => (
  <>
    <div className={`fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50"><div className="flex items-center gap-2 font-bold text-slate-700"><Clock className="w-5 h-5 text-blue-600" />History</div><button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="w-5 h-5 text-slate-500" /></button></div>
      <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-3">
        {historyItems.length === 0 ? <div className="text-center text-slate-400 mt-10 text-sm">No history found.</div> : historyItems.map((item) => (
          <div key={item.id} onClick={() => onLoadItem(item)} className="group p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition relative">
            <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">{CATEGORIES[item.category_id?.toUpperCase()]?.label || 'General'}</div>
            <p className="text-sm text-slate-700 line-clamp-2 font-medium">{item.original_input}</p>
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

  const handleGoogle = async () => { try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (err) { setError(err.message); } };
  const handleSubmit = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { isLogin ? await signInWithEmailAndPassword(auth, email, password) : await createUserWithEmailAndPassword(auth, email, password); } catch (err) { setError(err.message); } finally { setLoading(false); } };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
        <FileText className="w-12 h-12 text-white mx-auto mb-3" /><h1 className="text-3xl font-bold text-white">PromptMinds</h1>
        <div className="flex mb-6 mt-6 border-b border-slate-600"><button onClick={() => setIsLogin(true)} className={`flex-1 pb-3 ${isLogin ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400'}`}>Log In</button><button onClick={() => setIsLogin(false)} className={`flex-1 pb-3 ${!isLogin ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400'}`}>Sign Up</button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white" placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white" placeholder="Password" required />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50">{loading ? '...' : (isLogin ? 'Sign In' : 'Create Account')}</button>
        </form>
        <button onClick={handleGoogle} className="w-full bg-white text-slate-700 py-3 rounded font-semibold mt-4 hover:bg-slate-100">Sign in with Google</button>
      </div>
    </div>
  );
};

const InputScreen = ({ onSubmit, username, onLogout, isAnalyzing, onToggleHistory }) => {
  const [text, setText] = useState('');
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl"><FileText className="w-6 h-6" /> PromptMinds</div>
        <div className="flex items-center gap-3"><span className="text-gray-600 text-sm hidden sm:inline">{username}</span><button onClick={onToggleHistory} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">History</button><button onClick={onLogout}><LogOut className="w-5 h-5 text-slate-400" /></button></div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">What's your goal?</h2>
          <textarea value={text} onChange={(e) => setText(e.target.value)} disabled={isAnalyzing} className="w-full h-40 p-5 rounded-xl border-2 border-slate-200 text-lg resize-none" placeholder="e.g., I want to lose weight in 3 months..." />
          <button onClick={() => text.trim() && onSubmit(text)} disabled={!text.trim() || isAnalyzing} className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 disabled:opacity-50">{isAnalyzing ? 'Analyzing...' : 'Analyze & Optimize'}</button>
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className={`${category.color} p-8 text-white transition-colors duration-500`}>
          <div className="flex justify-between items-start mb-4">
            <button onClick={onBack} className="text-white/80 hover:text-white font-medium text-sm">← Back</button>
            <div className="flex gap-3 items-center">
              {confidence > 0 && <div className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1 ${getConfColor(confidence)}`}><Sparkles className="w-3 h-3" />{Math.round(confidence * 100)}% Match</div>}
              <select value={category.id} onChange={(e) => onChangeCategory(e.target.value)} className="bg-white/20 border border-white/30 text-white py-1 px-3 rounded-full text-xs font-bold uppercase cursor-pointer outline-none hover:bg-white/30 transition">{Object.values(allCategories).map((cat) => <option key={cat.id} value={cat.id} className="text-slate-800 bg-white">{cat.label}</option>)}</select>
            </div>
          </div>
          <div className="flex items-center gap-4"><div className="p-3 bg-white/20 rounded-lg">{category.icon}</div><div><h2 className="text-2xl font-bold">{category.label}</h2><p className="text-white/80 text-sm">{category.persona}</p></div></div>
        </div>
        <div className="p-8">
          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase">Original Prompt</p><p className="text-slate-700 italic text-sm">"{initialPrompt}"</p></div>
          <form onSubmit={(e) => { e.preventDefault(); onComplete(answers); }} className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2 group">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-slate-700">{q.label}</label>
                  {q.reason && <div className="relative group/tooltip"><Info className="w-4 h-4 text-slate-300 hover:text-blue-500 cursor-help transition" /><div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10">{q.reason}<div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div></div></div>}
                </div>
                <input type="text" required value={answers[q.id] || ''} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder={q.placeholder} onChange={(e) => handleInputChange(q.id, e.target.value)} />
              </div>
            ))}
            <button type="submit" className={`w-full text-white py-3 rounded-lg font-semibold shadow-md ${category.color} brightness-110 hover:brightness-105 transition-all transform active:scale-[0.98]`}>Generate <Send className="w-4 h-4 inline ml-2" /></button>
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

  useEffect(() => { const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); if (u) { setView('input'); loadHistory(u.uid); } else { setView('auth'); } }); return unsub; }, []);

  const loadHistory = async (uid) => { try { const q = query(collection(db, "history"), where("uid", "==", uid), orderBy("timestamp", "desc")); const s = await getDocs(q); setHistory(h => ({ ...h, items: s.docs.map(d => ({ id: d.id, ...d.data() })) })); } catch (e) { console.error(e); } };
  const saveHistory = async (orig, final, catId) => { if (!user) return; try { const doc = await addDoc(collection(db, "history"), { uid: user.uid, original_input: orig, optimized_prompt: final, category_id: catId, timestamp: serverTimestamp() }); setHistory(h => ({ ...h, items: [{ id: doc.id, original_input: orig, optimized_prompt: final, category_id: catId, timestamp: { seconds: Date.now() / 1000 } }, ...h.items] })); } catch (e) { console.error(e); } };
  const handleLogout = async () => { await signOut(auth); setData({ initial: '', category: null, final: '', questions: [], prefills: {}, confidence: 0 }); };

  const handleAnalyze = async (text) => {
    setAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error("API Error");
      const resData = await res.json();
      const cat = Object.values(CATEGORIES).find(c => c.id === resData.category_id) || CATEGORIES.GENERAL;

      if (resData.questions.length === 0) {
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

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <>
      {analyzing && <GeneratingScreen />}

      <HistorySidebar isOpen={history.open} onClose={() => setHistory({ ...history, open: false })} historyItems={history.items} onLoadItem={(item) => { setData({ ...data, initial: item.original_input, final: item.optimized_prompt, category: Object.values(CATEGORIES).find(c => c.id === item.category_id), confidence: 0 }); setView('result'); setHistory({ ...history, open: false }); }} />
      {!user ? <AuthScreen /> : view === 'input' ? <InputScreen username={user.email} onSubmit={handleAnalyze} onLogout={handleLogout} isAnalyzing={analyzing} onToggleHistory={() => setHistory({ ...history, open: true })} /> : view === 'questions' ?
        <QuestionnaireScreen
          initialPrompt={data.initial}
          category={data.category}
          questions={data.questions}
          prefilledAnswers={data.prefills}
          confidence={data.confidence}
          onComplete={handleFinalize}
          onBack={() => setView('input')}
          onChangeCategory={(id) => {
            const c = Object.values(CATEGORIES).find(cat => cat.id === id);
            if (c) setData(prev => ({ ...prev, category: c, questions: c.defaults || [], confidence: 0 }));
          }}
          allCategories={CATEGORIES}
        /> :
        <ResultScreen prompt={data.final} initialPrompt={data.initial} categoryLabel={data.category?.id} onReset={() => { setData({ initial: '', category: null, final: '', questions: [], prefills: {}, confidence: 0 }); setView('input'); }} currentUser={user} onToggleHistory={() => setHistory({ ...history, open: true })} />}
    </>
  );
}