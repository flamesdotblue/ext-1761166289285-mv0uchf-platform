import React, { useMemo, useState } from 'react';
import { Clock, QrCode, CheckCircle2 } from 'lucide-react';

export default function QueueTracker({ ticket, setTicket, onDone }) {
  const [feedback, setFeedback] = useState('');

  const progress = useMemo(() => {
    if (!ticket) return 0;
    const initial = Math.max(ticket.position, 1);
    const total = initial + 1; // include your turn
    const done = total - (ticket.position + 1);
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="mt-6 text-slate-500 dark:text-slate-400">You haven\'t joined a queue yet. Visit Home to get started.</div>
    );
  }

  const handleCancel = () => {
    setTicket(null);
  };

  const handleSubmitFeedback = () => {
    setFeedback('');
    onDone?.();
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-sky-50 to-white dark:from-slate-900 dark:to-slate-950 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Virtual Ticket</div>
            <div className="text-2xl font-semibold tracking-tight">#{ticket.number}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{ticket.service} • {ticket.displayName} • {ticket.location}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Clock className="w-4 h-4 text-sky-600"/> ETA</div>
              <div className="text-xl font-semibold">{ticket.eta}m</div>
            </div>
            <div className="w-24 h-24 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <QRVisual seed={ticket.number} />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-sky-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Position: {ticket.position} • Progress: {progress}%</div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={handleCancel} className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100">Leave Queue</button>
          <button onClick={onDone} className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700">Done</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
        <div className="font-semibold">Notifications</div>
        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">We\'ll alert you when it\'s nearly your turn or when there are delays.</div>
        <div className="mt-3 grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm">Turn reminder: 2 spots left.</div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm">Delay update: Staff changeover (5m).</div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm">Tip: Keep phone nearby for alerts.</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
        <div className="font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Feedback</div>
        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">How was your experience?</div>
        <div className="mt-3 flex items-center gap-2">
          <input value={feedback} onChange={(e)=>setFeedback(e.target.value)} placeholder="Quick note (optional)" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-sky-500"/>
          <button onClick={handleSubmitFeedback} className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700">Submit</button>
        </div>
      </div>
    </div>
  );
}

function QRVisual({ seed }) {
  // simple deterministic pattern based on seed
  const size = 21;
  const rand = (i,j) => {
    const x = Math.sin((seed + i*13 + j*7) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const grid = Array.from({ length: size }, (_, i) => (
    Array.from({ length: size }, (_, j) => rand(i,j) > 0.5)
  ));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      <rect width={size} height={size} fill="white"/>
      {grid.map((row, i) => row.map((val, j) => (
        val ? <rect key={`${i}-${j}`} x={i} y={j} width="1" height="1" fill="#0ea5e9"/> : null
      )))}
    </svg>
  );
}
