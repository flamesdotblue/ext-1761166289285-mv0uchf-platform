import React, { useMemo, useState } from 'react';
import { Clock, MapPin, Search } from 'lucide-react';

export default function QueueMapJoin({ services, onJoin }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    return services.filter(s => (filter==='All' || s.type===filter) && (s.name.toLowerCase().includes(query.toLowerCase()) || s.type.toLowerCase().includes(query.toLowerCase())));
  }, [services, query, filter]);

  const types = ['All', ...Array.from(new Set(services.map(s=>s.type)))];

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search hospital, salon, bank..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-sky-500"/>
        </div>
        <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none">
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-950 p-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><MapPin className="w-4 h-4"/> Nearby Queues</div>
          <MiniMap services={filtered} />
        </div>
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{s.type} • {s.location}</div>
                <div className="mt-1 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-sky-600"/> {s.wait}m</span>
                  <span>Pos: {s.pos}</span>
                </div>
              </div>
              <button onClick={()=>onJoin(s)} className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700">Join Queue</button>
            </div>
          ))}
          {filtered.length===0 && (
            <div className="text-sm text-slate-500 dark:text-slate-400">No results. Try widening your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniMap({ services }) {
  // Render a simple grid map with markers
  return (
    <div className="mt-3 h-64 rounded-xl overflow-hidden border border-sky-100 dark:border-slate-800 bg-[linear-gradient(0deg,rgba(2,132,199,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(2,132,199,0.06)_1px,transparent_1px)] bg-[size:20px_20px] relative">
      {services.map((s, idx) => {
        const x = 50 + (Math.sin(idx+1) * 30);
        const y = 50 + (Math.cos(idx+1) * 30);
        return (
          <div key={s.id} style={{ left: `${x}%`, top: `${y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
            <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow text-xs whitespace-nowrap">
              {s.name}
            </div>
            <div className="mt-1 w-3 h-3 rounded-full bg-sky-500 border-2 border-white dark:border-slate-900"/>
          </div>
        );
      })}
    </div>
  );
}
