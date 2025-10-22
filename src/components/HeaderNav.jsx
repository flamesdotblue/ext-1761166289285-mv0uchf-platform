import React from 'react';
import { Bell, Clock, MapPin, Moon, Sun } from 'lucide-react';

export default function HeaderNav({ activeTab, onTabChange, dark, setDark, notifications }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">QB</div>
          <div className="font-semibold">Queue Buddy</div>
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
            <MapPin className="w-4 h-4"/>
            <span>Find & Join</span>
            <Clock className="w-4 h-4 ml-3"/>
            <span>Real-time</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setDark(!dark)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            {dark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
          </button>
          <div className="relative">
            <button onClick={()=>onTabChange('track')} className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Bell className="w-5 h-5"/>
            </button>
            {notifications?.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-sky-500 rounded-full"/>
            )}
          </div>
        </div>
      </div>
      {notifications?.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-2">
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="text-sm bg-sky-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-sky-800 dark:text-sky-300 rounded-lg px-3 py-2">
                {n.msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
