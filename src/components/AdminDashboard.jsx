import React, { useMemo, useState } from 'react';
import { BarChart3, Play, SkipForward, Users } from 'lucide-react';

export default function AdminDashboard({ services }) {
  const [selected, setSelected] = useState(services[0]?.id);
  const [queues, setQueues] = useState(() => Object.fromEntries(services.map(s => [s.id, { current: 100, waiting: s.pos, avgWait: s.wait }])));

  const svc = useMemo(() => services.find(s => s.id === selected), [selected, services]);

  const callNext = () => {
    setQueues((q) => {
      const cur = q[selected];
      return { ...q, [selected]: { ...cur, current: cur.current + 1, waiting: Math.max(0, cur.waiting - 1) } };
    });
  };
  const skip = () => {
    setQueues((q) => {
      const cur = q[selected];
      return { ...q, [selected]: { ...cur, current: cur.current + 1 } };
    });
  };

  return (
    <div className="mt-4 grid md:grid-cols-3 gap-4">
      <div className="md:col-span-1 space-y-3">
        {services.map((s)=> (
          <button key={s.id} onClick={()=>setSelected(s.id)} className={`w-full text-left rounded-xl p-4 border ${selected===s.id ? 'border-sky-500 bg-sky-50 dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'}`}>
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.type} • {s.location}</div>
          </button>
        ))}
      </div>
      <div className="md:col-span-2 space-y-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Queue Controls</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Manage entries for {svc?.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={callNext} className="px-3 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-1"><Play className="w-4 h-4"/> Call next</button>
              <button onClick={skip} className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center gap-1"><SkipForward className="w-4 h-4"/> Skip</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat label="Current" value={`#${queues[selected]?.current ?? 0}`} />
            <Stat label="Waiting" value={queues[selected]?.waiting ?? 0} />
            <Stat label="Avg wait" value={`${queues[selected]?.avgWait ?? 0}m`} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-sky-50 to-white dark:from-slate-900 dark:to-slate-950 p-4">
          <div className="flex items-center gap-2 font-semibold"><BarChart3 className="w-5 h-5 text-sky-600"/> Analytics (Demo)</div>
          <div className="mt-3 flex items-end gap-2 h-36">
            {Array.from({ length: 12 }).map((_, i) => {
              const h = 20 + Math.floor((Math.sin(i*1.5)+1)*30);
              return <div key={i} className="flex-1 bg-sky-200/60 dark:bg-sky-900/40 rounded-t" style={{ height: `${h}%` }} />;
            })}
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Monthly throughput, wait volatility.</div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
          <div className="flex items-center gap-2 font-semibold"><Users className="w-5 h-5 text-sky-600"/> Recent Check-ins</div>
          <div className="mt-2 grid sm:grid-cols-2 gap-2 text-sm">
            {Array.from({ length: 6 }).map((_,i)=> (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">Guest #{100+i}</div>
                  <div className="text-slate-500 dark:text-slate-400">Joined 0{i+2}:1{i} am</div>
                </div>
                <div className="text-slate-600 dark:text-slate-300">Pos: {Math.floor(Math.random()*10)+1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-950">
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
