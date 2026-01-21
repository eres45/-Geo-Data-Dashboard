import { useState, useEffect } from 'react';
import { Map, Layers, Layout, AlertCircle } from 'lucide-react';
import './App.css'; // We'll assume specific styles here or just rely on index.css

// Components (We will create these next)
import Dashboard from './components/Dashboard';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/mockData.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between z-10 shrink-0 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <Layout size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient tracking-tight">
              Geo Data Dashboard
            </h1>
            <p className="text-sm text-secondary font-medium tracking-wide opacity-80">Spatial Intelligence & Analytics platform</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Stats / Actions */}
          <div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">Total Projects</span>
              <span className="text-sm font-bold text-white leading-none">
                {loading ? '...' : data.length.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-slate-700/50"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">System Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></span>
                <span className="text-xs font-medium text-emerald-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center text-blue-400">
            Loading Data...
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-red-400 gap-2">
            <AlertCircle /> {error}
          </div>
        ) : (
          <Dashboard data={data} />
        )}
      </main>
    </div>
  );
}

export default App;
