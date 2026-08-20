import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardAPI, tokenStore, roundAPI, swipeAPI, eventAPI } from '../../services/api';
import HeroBackground from '../../components/heroBackground';

// ─── Icon helper ──────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, strokeWidth = 2, className = '' }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d={d} />
  </svg>
);

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    id: 'event',
    label: 'Event Details',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    id: 'live',
    label: 'Live Matching',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    id: 'connections',
    label: 'My Connections',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

// ─── Sign-out Confirmation Modal ──────────────────────────────────────────────
const SignOutModal = ({ onConfirm, onCancel }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
  >
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    />
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
      className="
      relative z-10 w-full max-w-sm
      rounded-2xl p-6 sm:p-7
      bg-[rgba(5,10,30,0.95)] backdrop-blur-2xl
      border border-red-500/20
      shadow-[0_0_50px_rgba(239,68,68,0.1)]
    ">
      <div className="
        w-12 h-12 rounded-full mx-auto mb-4
        bg-red-500/10 border border-red-500/25
        flex items-center justify-center
      ">
        <Icon
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          size={22}
          strokeWidth={2}
          className="text-red-400"
        />
      </div>

      <h3
        className="text-center text-lg font-black italic tracking-tight text-white mb-1"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        Sign Out?
      </h3>
      <p className="text-center text-sm text-slate-400 mb-6 leading-relaxed">
        You'll be logged out of your account. You can always log back in.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="
            flex-1 py-2.5 rounded-xl text-sm font-semibold
            bg-slate-800/80 text-slate-300
            hover:bg-slate-700 hover:text-white
            border border-slate-700/50
            transition-all duration-200 cursor-pointer
          "
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          id="signout-confirm"
          className="
            flex-1 py-2.5 rounded-xl text-sm font-bold
            bg-red-600/80 text-white
            hover:bg-red-500
            border border-red-500/40
            shadow-[0_0_15px_rgba(239,68,68,0.2)]
            transition-all duration-200 cursor-pointer
          "
        >
          Yes, Sign Out
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Glassmorphism card ───────────────────────────────────────────────────────
const Card = ({ children, className = '', glow = true }) => (
  <div className={`
    rounded-2xl p-5 sm:p-6
    bg-[rgba(5,12,35,0.65)] backdrop-blur-xl
    border border-cyan-500/15
    ${glow ? 'shadow-[0_0_25px_rgba(8,145,178,0.1)]' : ''}
    transition-all duration-300
    ${className}
  `}>
    {children}
  </div>
);

// ─── Section title ────────────────────────────────────────────────────────────
const SectionTitle = ({ label }) => (
  <div className="flex items-center gap-3 mb-6">
    <h2
      className="text-xl sm:text-2xl font-black italic tracking-tight text-white"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {label}
    </h2>
    <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/40 to-transparent" />
  </div>
);

// ─── Data row inside profile card ─────────────────────────────────────────────
const DataRow = ({ label, value, highlight = false }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-cyan-500/10 last:border-0">
    <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold sm:w-36 shrink-0">
      {label}
    </span>
    <span className={`text-sm font-medium ${highlight ? 'text-cyan-300' : 'text-slate-200'}`}>
      {value || <span className="italic text-slate-600">—</span>}
    </span>
  </div>
);

// ─── Circular Timer ───────────────────────────────────────────────────────────
const CircularTimer = ({ secondsRemaining, totalSeconds = 180 }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsRemaining / totalSeconds) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="rgba(8,145,178,0.2)" strokeWidth="8" fill="none" />
        <motion.circle 
          cx="50" cy="50" r={radius} 
          stroke="currentColor" 
          strokeWidth="8" fill="none" 
          className="text-cyan-400"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "linear" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <motion.div 
        key={secondsRemaining}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute text-2xl font-black italic text-white"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {Math.max(0, secondsRemaining)}s
      </motion.div>
    </div>
  );
};

// ─── Profile view ─────────────────────────────────────────────────────────────
const ProfileView = ({ participant }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <SectionTitle label="My Profile" />

      {/* Avatar + name hero */}
      <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div
          className="
            w-16 h-16 rounded-full shrink-0
            bg-gradient-to-br from-cyan-500 to-teal-600
            flex items-center justify-center
            text-2xl font-black text-white select-none
            shadow-[0_0_20px_rgba(8,145,178,0.4)]
          "
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {participant?.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p
            className="text-2xl font-black italic tracking-tight text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {participant?.name}
          </p>
          <p className="text-sm text-cyan-400 mt-0.5">{participant?.email}</p>
          <span className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-700/50 border border-slate-600/50 text-slate-300">
            <Icon
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              size={13}
              strokeWidth={2}
            />
            Participant
          </span>
        </div>
      </Card>

      {/* Registration data */}
      <Card>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
          Registered Info
        </p>
        <DataRow label="Full Name" value={participant?.name} />
        <DataRow label="Email" value={participant?.email} highlight />
        <DataRow label="Phone" value={participant?.phone} />
        <DataRow label="Participant ID" value={participant?.id ? `#${participant.id}` : null} highlight />
        <DataRow label="Room Assigned" value={participant?.room_id ? `Room ${participant.room_id}` : 'Not yet assigned'} />
      </Card>

    </motion.div>
  );
};

// ─── Event Details view ───────────────────────────────────────────────────────
const EventView = () => {
  const details = [
    {
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      label: 'Venue',
      value: 'To be announced',
    },
    {
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      label: 'Date',
      value: 'Coming Soon',
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      label: 'Time',
      value: 'TBA',
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      label: 'Format',
      value: 'Structured co-founder speed networking',
    },
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      label: 'Capacity',
      value: 'Limited seats — register early!',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <SectionTitle label="Event Details" />

      {/* Hero card */}
      <div className="
        rounded-2xl overflow-hidden
        border border-cyan-500/20
        bg-gradient-to-br from-[rgba(8,145,178,0.12)] to-[rgba(5,12,35,0.7)]
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(8,145,178,0.15)]
        p-6 sm:p-8
      ">
        <p className="text-xs uppercase tracking-widest text-cyan-400/80 font-semibold mb-2">
          Event — Meet Your Co-Founder
        </p>
        <h3
          className="text-2xl sm:text-3xl font-black italic tracking-tight text-white mb-3"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Network. Collaborate. Pitch.
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
          A high-energy, structured networking experience designed to help you find the right
          co-founder — someone whose skills, vision, and drive complement yours.
        </p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {details.map((d) => (
          <Card key={d.label} className="flex items-start gap-4 hover:border-cyan-500/30 transition-colors">
            <div className="
              w-9 h-9 rounded-lg shrink-0
              bg-cyan-500/10 border border-cyan-500/20
              flex items-center justify-center
            ">
              <Icon d={d.icon} size={16} strokeWidth={1.75} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">{d.label}</p>
              <p className="text-sm text-slate-200 mt-0.5 font-medium">{d.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-cyan-500/20">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">What to Expect</p>
        <ul className="space-y-2.5">
          {[
            'Speed-round co-founder matching sessions',
            'Domain-specific breakout rooms',
            'Pitch practice with mentors',
            'Networking with like-minded builders',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
              <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
};

// ─── Live Matching View ───────────────────────────────────────────────────────
const LiveMatchingView = ({ participant, setActiveTab }) => {
  const [round, setRound] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, waiting, no_room, error, active
  const [errorMsg, setErrorMsg] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [decision, setDecision] = useState(null); // 'accept' or 'reject'
  const pollingIntervalRef = useRef(null);
  const navigate = useNavigate();

  const fetchRound = useCallback(async () => {
    if (!participant?.room_id) {
      setStatus('no_room');
      return;
    }
    try {
      const token = tokenStore.get();
      const res = await roundAPI.getCurrentRound(participant.room_id, token);
      setRound(res);
      setStatus('active');
      if (res.round?.seconds_remaining !== undefined) {
         setSecondsRemaining(Math.max(0, res.round.seconds_remaining));
      }
      return res;
    } catch (err) {
      if (err.status === 409) {
        setStatus('waiting');
      } else if (err.status === 401) {
        navigate('/auth?tab=login');
      } else if (err.status === 403) {
        setStatus('error');
        setErrorMsg("You're not checked into this room");
      } else {
        setStatus('error');
        setErrorMsg('Failed to load round info');
      }
    }
  }, [participant?.room_id, navigate]);

  useEffect(() => {
    fetchRound();
    pollingIntervalRef.current = setInterval(fetchRound, 5000);
    return () => {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    };
  }, [fetchRound]);

  useEffect(() => {
    if (round?.phase === 'completed' && pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, [round?.phase]);

  useEffect(() => {
    if (status !== 'active' || round?.phase === 'completed') return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [status, round?.phase]);

  const handleStartEvent = async () => {
    try {
      const token = tokenStore.get();
      await eventAPI.startEvent(participant.room_id, token);
      fetchRound();
    } catch (err) {
      if (err.status === 403) {
        alert("Only the event admin can start the event");
      } else {
        alert("Failed to start event");
      }
    }
  };

  const handleSwipe = async (type) => {
    try {
      const token = tokenStore.get();
      await swipeAPI.saveSwipe(round.pairing.id, type, token);
      setDecision(type);
    } catch (err) {
      console.error('Swipe error', err);
    }
  };

  useEffect(() => {
    setDecision(null);
  }, [round?.pairing?.id]);

  if (status === 'no_room') {
    return (
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
         <SectionTitle label="Live Matching" />
         <Card className="text-center py-8">
           <p className="text-slate-300">Check into a room first to participate in live matching.</p>
         </Card>
       </motion.div>
    );
  }

  if (status === 'loading') {
    return <div className="text-center text-slate-400 py-10">Loading live matching...</div>;
  }

  if (status === 'error') {
     return <div className="text-center text-red-400 py-10">{errorMsg}</div>;
  }

  if (status === 'waiting') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <SectionTitle label="Live Matching" />
        <Card className="text-center py-10 flex flex-col items-center">
           <motion.div 
             animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
             transition={{ repeat: Infinity, duration: 2 }}
             className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50 mb-6 flex items-center justify-center text-cyan-400"
           >
             <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={24} />
           </motion.div>
           <h3 className="text-xl font-black italic text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
             Waiting for the host to start the event...
           </h3>
           {participant?.is_admin && (
             <button onClick={handleStartEvent} className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold cursor-pointer transition-all hover:scale-105">
               Start Event
             </button>
           )}
        </Card>
      </motion.div>
    );
  }

  if (round?.phase === 'completed') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <SectionTitle label="Event Complete" />
        <Card className="text-center py-10">
           <h3 className="text-2xl font-black italic text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
             Event Complete!
           </h3>
           <p className="text-slate-300 mb-6">Great job! Check your connections to see who you matched with.</p>
           <button onClick={() => setActiveTab('connections')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold cursor-pointer transition-all hover:scale-105">
             Go to My Connections
           </button>
        </Card>
      </motion.div>
    );
  }

  if (round?.phase === 'transition') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <SectionTitle label="Transition" />
        <Card className="text-center py-10">
           <CircularTimer secondsRemaining={secondsRemaining} totalSeconds={15} />
           <h3 className="text-xl font-black italic text-white mt-6 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
             Please move to your next match
           </h3>
           <p className="text-slate-400">Next round starts soon...</p>
        </Card>
      </motion.div>
    );
  }

  // Active Phase
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <SectionTitle label={`Live Matching - Round ${round.round?.number}`} />
      
      {round.pairing?.is_bye ? (
        <Card className="text-center py-10">
           <CircularTimer secondsRemaining={secondsRemaining} totalSeconds={180} />
           <h3 className="text-xl font-black italic text-white mt-6 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
             Sitting this round out
           </h3>
           <p className="text-slate-400">Take a breather. You have a bye this round.</p>
        </Card>
      ) : (
        <Card className="text-center py-8">
           <CircularTimer secondsRemaining={secondsRemaining} totalSeconds={180} />
           
           <div className="mt-8 flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-3xl font-black text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {round.pairing?.opponent?.name?.charAt(0)?.toUpperCase() ?? '?'}
             </div>
             <h3 className="text-2xl font-black italic text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
               {round.pairing?.opponent?.name}
             </h3>
             <p className="text-cyan-400 mt-1">Opponent</p>
           </div>

           <div className="mt-8 flex justify-center gap-4">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSwipe('reject')}
                className={`flex-1 max-w-[140px] py-3 rounded-xl font-bold border transition-colors cursor-pointer ${decision === 'reject' ? 'bg-red-600 text-white border-red-500' : 'bg-[rgba(5,12,35,0.6)] text-slate-300 border-slate-700 hover:bg-red-500/20 hover:border-red-500/50'}`}
              >
                Reject
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSwipe('accept')}
                className={`flex-1 max-w-[140px] py-3 rounded-xl font-bold border transition-colors cursor-pointer ${decision === 'accept' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-[rgba(5,12,35,0.6)] text-slate-300 border-slate-700 hover:bg-cyan-500/20 hover:border-cyan-500/50'}`}
              >
                Accept
              </motion.button>
           </div>
        </Card>
      )}
    </motion.div>
  );
};

// ─── My Connections View ──────────────────────────────────────────────────────
const ConnectionsView = () => {
  const [swipes, setSwipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSwipes = async () => {
      try {
         const token = tokenStore.get();
         const res = await swipeAPI.getMySwipes(token);
         setSwipes(res.decisions || []);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
    };
    fetchSwipes();
  }, []);

  if (loading) return <div className="text-slate-400 text-center py-10">Loading connections...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
       <SectionTitle label="My Connections" />
       
       {swipes.length === 0 ? (
          <Card className="text-center py-10">
             <p className="text-slate-400">No connections yet - join a live event to start meeting people!</p>
          </Card>
       ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {swipes.map((swipe, idx) => (
                <motion.div 
                   key={swipe.pairing_id} 
                   initial={{ opacity: 0, y: 20 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   transition={{ delay: idx * 0.1 }}
                >
                   <Card className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-xl font-black text-white shrink-0 shadow-[0_0_15px_rgba(8,145,178,0.3)]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                         {swipe.opponent?.name?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-lg font-black italic text-white truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{swipe.opponent?.name}</h4>
                         <span className="text-xs text-slate-300 font-medium bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full inline-block mt-1">Round {swipe.round_number}</span>
                      </div>
                      <div className="shrink-0">
                         {swipe.decision === 'accept' ? (
                            <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                               <Icon d="M5 13l4 4L19 7" size={16} strokeWidth={3} />
                            </div>
                         ) : (
                            <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                               <Icon d="M6 18L18 6M6 6l12 12" size={16} strokeWidth={3} />
                            </div>
                         )}
                      </div>
                   </Card>
                </motion.div>
             ))}
          </div>
       )}
    </motion.div>
  );
};

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, participant, onSignOutClick }) => (
  <aside className="
    hidden lg:flex lg:flex-col w-64 h-screen sticky top-0
    bg-[rgba(3,8,25,0.92)] backdrop-blur-2xl
    border-r border-cyan-500/15
  ">
    {/* Logo / header */}
    <div className="px-5 py-5 border-b border-cyan-500/10 flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-cyan-400/70 font-semibold">Dashboard</p>
        <p
          className="text-base font-black italic tracking-tight text-white mt-0.5"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Meet Your<br />Co-Founder
        </p>
      </div>
    </div>

    {/* User mini-profile */}
    <div className="px-5 py-4 border-b border-cyan-500/10">
      <div className="flex items-center gap-3">
        <div
          className="
            w-9 h-9 rounded-full shrink-0
            bg-gradient-to-br from-cyan-500 to-teal-600
            flex items-center justify-center
            text-sm font-black text-white
          "
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {participant?.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{participant?.name ?? 'Loading…'}</p>
          <p className="text-xs text-slate-500 truncate">{participant?.email ?? ''}</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            id={`dash-nav-${item.id}`}
            onClick={() => setActive(item.id)}
            className={`
              w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 cursor-pointer text-left
              ${isActive
                ? 'bg-gradient-to-r from-cyan-600/20 to-teal-600/10 text-cyan-300 border border-cyan-500/25 shadow-[inset_0_0_10px_rgba(8,145,178,0.1)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Icon d={item.icon} size={18} strokeWidth={isActive ? 2.5 : 2} />
            {item.label}
          </button>
        );
      })}
    </nav>

    {/* Sign Out */}
    <div className="px-3 py-4 border-t border-cyan-500/10">
      <button
        onClick={onSignOutClick}
        id="dash-logout"
        className="
          w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
          text-slate-400 hover:text-red-400 hover:bg-red-500/5
          border border-transparent hover:border-red-500/15
          transition-all duration-200 cursor-pointer
        "
      >
        <Icon
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          size={18}
        />
        Sign Out
      </button>
    </div>
  </aside>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('profile');
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const logout = useCallback(() => {
    tokenStore.clear();
    localStorage.removeItem('founder_profile');
    navigate('/auth?tab=login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token || token === 'undefined' || token === 'null') {
      tokenStore.clear();
      navigate('/auth?tab=login', { replace: true });
      return;
    }

    dashboardAPI.getProfile(token)
      .then((data) => setParticipant(data.participant))
      .catch((err) => {
        if (err.status === 401 || err.status === 403 || err.status === 422) {
          logout();
          return;
        }
        setError('Failed to load profile. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [navigate, logout]);

  const renderView = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4">
        <svg className="animate-spin h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-slate-400 text-sm">Loading your dashboard…</p>
      </div>
    );

    if (error) return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto">
          <Icon
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            size={24}
            className="text-red-400"
          />
        </div>
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-5 py-2 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );

    switch (active) {
      case 'profile':     return <ProfileView participant={participant} />;
      case 'event':       return <EventView />;
      case 'live':        return <LiveMatchingView participant={participant} setActiveTab={setActive} />;
      case 'connections': return <ConnectionsView />;
      default:            return null;
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[#030819]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <HeroBackground />

      {/* Sign-out confirmation modal */}
      <AnimatePresence>
        {showSignOutModal && (
          <SignOutModal
            onConfirm={logout}
            onCancel={() => setShowSignOutModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
        participant={participant}
        onSignOutClick={() => setShowSignOutModal(true)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 pb-20 lg:pb-0">
        
        {/* Mobile Header */}
        <header className="
          lg:hidden flex items-center justify-between
          px-4 py-4
          bg-[rgba(3,8,25,0.85)] backdrop-blur-xl
          border-b border-cyan-500/15 sticky top-0 z-20
        ">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-xs font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {participant?.name?.charAt(0)?.toUpperCase() ?? '?'}
             </div>
             <p className="text-sm font-bold italic tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
               {NAV_ITEMS.find((n) => n.id === active)?.label}
             </p>
          </div>
          <button
            onClick={() => setShowSignOutModal(true)}
            className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer p-2"
          >
            <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={18} />
          </button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-3xl w-full mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[rgba(5,10,30,0.95)] backdrop-blur-xl border-t border-cyan-500/15 flex items-center justify-around px-2 py-2 z-40 pb-safe">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
             <button 
               key={item.id}
               onClick={() => setActive(item.id)}
               className="relative flex flex-col items-center justify-center w-16 h-14 cursor-pointer"
             >
               {isActive && (
                 <motion.div 
                   layoutId="bottomNavIndicator"
                   className="absolute inset-0 bg-cyan-500/10 rounded-xl"
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 />
               )}
               <div className={`relative z-10 ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                 <Icon d={item.icon} size={20} strokeWidth={isActive ? 2.5 : 2} />
               </div>
               <span className={`relative z-10 text-[10px] mt-1 font-medium ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                 {item.label.split(' ')[0]}
               </span>
             </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardPage;
