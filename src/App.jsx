import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderNav from './components/HeaderNav';
import QueueMapJoin from './components/QueueMapJoin';
import QueueTracker from './components/QueueTracker';
import AdminDashboard from './components/AdminDashboard';

const Splash = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-600 to-sky-800 text-white">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
          <span className="text-2xl font-bold">QB</span>
        </div>
        <div className="mt-4 text-2xl font-semibold">Queue Buddy</div>
        <div className="text-white/80">Skip the wait, save your time.</div>
      </motion.div>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const canLogin = name.trim().length > 1 && phone.trim().length >= 6;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sky-50 dark:from-slate-950 dark:to-slate-900 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-6 border border-sky-100/60 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">QB</div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Queue Buddy</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Sign in to save time</div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Full name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Alex Johnson" className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"/>
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Phone</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="(555) 000-1234" className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"/>
          </div>
          <button disabled={!canLogin} onClick={()=>onLogin({ name, phone })} className={`w-full rounded-lg py-2.5 text-white font-medium transition ${canLogin ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-300 dark:bg-slate-700 cursor-not-allowed'}`}>Continue</button>
        </div>
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">By continuing you agree to our Terms and Privacy Policy.</div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // home, track, admin, profile
  const [ticket, setTicket] = useState(null); // { id, service, location, number, position, eta, createdAt }
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  // Simulate queue progression
  useEffect(() => {
    if (!ticket) return;
    const id = setInterval(() => {
      setTicket((t) => {
        if (!t) return t;
        const newPos = Math.max(0, t.position - 1);
        const newEta = Math.max(0, t.eta - Math.floor(Math.random()*2 + 1));
        if (newPos <= 2 && t.position > 2) {
          pushNotification('Heads up! Your turn is coming soon.');
        }
        if (newPos === 0 && t.position !== 0) {
          pushNotification('It\'s your turn now. Please proceed.');
        }
        return { ...t, position: newPos, eta: newEta };
      });
    }, 4000);
    return () => clearInterval(id);
  }, [ticket]);

  const pushNotification = (msg) => {
    const item = { id: Date.now(), msg };
    setNotifications((n) => [item, ...n].slice(0, 3));
    setTimeout(() => {
      setNotifications((n) => n.filter((x) => x.id !== item.id));
    }, 4000);
  };

  const services = useMemo(() => ([
    { id: 'hsp-1', type: 'Hospital', name: 'CityCare Hospital', location: 'Downtown', wait: 38, pos: 12, lat: 37.78, lng: -122.41 },
    { id: 'sal-1', type: 'Salon', name: 'BlueWave Salon', location: 'Market St.', wait: 18, pos: 5, lat: 37.784, lng: -122.406 },
    { id: 'bnk-1', type: 'Bank', name: 'SecureBank', location: 'Union Sq.', wait: 25, pos: 8, lat: 37.787, lng: -122.42 },
    { id: 'dmv-1', type: 'DMV', name: 'DMV Center', location: 'Civic Center', wait: 52, pos: 20, lat: 37.779, lng: -122.416 },
  ]), []);

  const joinQueue = (svc) => {
    const number = Math.floor(Math.random() * 900) + 100;
    const newTicket = {
      id: `${svc.id}-${Date.now()}`,
      service: svc.type,
      displayName: svc.name,
      location: svc.location,
      number,
      position: svc.pos,
      eta: svc.wait,
      createdAt: Date.now(),
    };
    setTicket(newTicket);
    setActiveTab('track');
    pushNotification('You joined the queue successfully.');
  };

  if (showSplash) return <Splash onDone={() => setShowSplash(false)} />;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <HeaderNav activeTab={activeTab} onTabChange={setActiveTab} dark={dark} setDark={setDark} notifications={notifications} />

      <main className="px-4 pb-24 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.section key="home" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <QueueMapJoin services={services} onJoin={joinQueue} />
            </motion.section>
          )}
          {activeTab === 'track' && (
            <motion.section key="track" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <QueueTracker ticket={ticket} setTicket={setTicket} onDone={() => setActiveTab('home')} />
            </motion.section>
          )}
          {activeTab === 'admin' && (
            <motion.section key="admin" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <AdminDashboard services={services} />
            </motion.section>
          )}
          {activeTab === 'profile' && (
            <motion.section key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="mt-4">
                <div className="bg-gradient-to-br from-sky-50 to-white dark:from-slate-900 dark:to-slate-900/60 border border-sky-100 dark:border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-sky-600/10 text-sky-700 dark:text-sky-300 flex items-center justify-center font-semibold">
                      {user.name?.slice(0,1) || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{user.phone}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">Past queue history</div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your recent queues will appear here after completion.</div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={()=>setActiveTab('home')} className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">Find queues</button>
                  <button onClick={()=>{ setUser(null); setTicket(null); }} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100">Sign out</button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="max-w-5xl mx-auto grid grid-cols-4">
          {[
            { key: 'home', label: 'Home' },
            { key: 'track', label: 'Track' },
            { key: 'admin', label: 'Admin' },
            { key: 'profile', label: 'Profile' },
          ].map((tab) => (
            <button key={tab.key} onClick={()=>setActiveTab(tab.key)} className={`py-3 text-sm ${activeTab===tab.key ? 'text-sky-600 dark:text-sky-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>{tab.label}</button>
          ))}
        </div>
      </nav>
    </div>
  );
}
