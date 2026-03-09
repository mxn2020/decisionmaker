import { useState, useCallback } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

interface Option { name: string; prosScore: number; consScore: number; pros: string[]; cons: string[]; }
interface Decision { dilemma: string; options: Option[]; recommendation: string; reasoning: string; framework: string; }
const FRAMEWORKS = [
  { id: 'pros-cons', label: '⚖️ Pros & Cons' },
  { id: 'weighted', label: '📊 Weighted Matrix' },
  { id: 'regret-minimization', label: '🔮 Regret Minimization' },
];

function DecidePage() {
  const [dilemma, setDilemma] = useState('');
  const [fw, setFw] = useState('pros-cons');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Decision | null>(null);
  const analyze = useAction(api.ai.analyze);
  const save = useMutation(api.functions.saveDecision);

  const handleDecide = useCallback(async () => {
    if (!dilemma.trim()) return; setLoading(true); setResult(null);
    try {
      const r = await analyze({ dilemma: dilemma.trim(), framework: fw });
      setResult(r);
      await save({ dilemma: r.dilemma || dilemma, options: r.options || [], recommendation: r.recommendation || '', reasoning: r.reasoning || '', framework: r.framework || fw });
    } catch (e: any) { console.error(e); } finally { setLoading(false); }
  }, [dilemma, fw, analyze, save]);

  return (
    <div className="main-content"><div className="decide-page">
      <h1 className="decide-title">Make Better <span className="accent">Decisions</span></h1>
      <p className="decide-subtitle">Describe your dilemma and get a structured analysis with clear recommendations.</p>
      <div className="fw-chips">
        {FRAMEWORKS.map(f => (<button key={f.id} className={`fw-chip ${fw === f.id ? 'selected' : ''}`} onClick={() => setFw(f.id)}>{f.label}</button>))}
      </div>
      <textarea className="text-area" value={dilemma} onChange={e => setDilemma(e.target.value)} placeholder="e.g. Should I accept a remote job with higher pay or stay at my current office job with better growth opportunities?" rows={4} />
      <button className="btn-decide" disabled={!dilemma.trim() || loading} onClick={handleDecide}>{loading ? '⏳ Analyzing...' : '🎯 Decide'}</button>
      {loading && <div className="loading-dots"><span /><span /><span /></div>}
      {result && !loading && (
        <div className="result-card">
          <div className="result-header"><h2>⚖️ Analysis: {result.dilemma}</h2></div>
          <div className="result-body">
            {result.options.map((opt, i) => (
              <div key={i} className="option-card">
                <div className="option-name">{opt.name === result.recommendation ? '⭐' : '•'} <span className={opt.name === result.recommendation ? 'winner' : ''}>{opt.name}</span></div>
                <div className="pros-cons">
                  <div className="pros"><h4>✓ Pros ({opt.prosScore}/10)</h4><ul>{opt.pros.map((p, j) => <li key={j}>{p}</li>)}</ul></div>
                  <div className="cons"><h4>✗ Cons ({opt.consScore}/10)</h4><ul>{opt.cons.map((c, j) => <li key={j}>{c}</li>)}</ul></div>
                </div>
                <div className="score-bars">
                  <div className="score-bar"><div className="fill" style={{ width: `${opt.prosScore * 10}%`, background: 'var(--green)' }} /></div>
                  <div className="score-bar"><div className="fill" style={{ width: `${opt.consScore * 10}%`, background: 'var(--red)' }} /></div>
                </div>
              </div>
            ))}
            <div className="recommendation-box">
              <div className="recommendation-label">Recommendation</div>
              <div className="recommendation-text">→ {result.recommendation}</div>
              <div className="reasoning-text">{result.reasoning}</div>
            </div>
          </div>
        </div>
      )}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app-container">
    <header className="header"><a href="/" className="header-logo"><span style={{ fontSize: '1.5rem' }}>⚖️</span><div><h1>DecisionMaker</h1></div></a></header>
    <Routes><Route path="/" element={<DecidePage />} /></Routes>
    <footer className="footer">© {new Date().getFullYear()} DecisionMaker — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
