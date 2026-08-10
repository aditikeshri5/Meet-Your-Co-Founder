/**
 * dashboard/index.jsx — User Dashboard
 * Four views: Profile · Event Details · Waiting Room · Join Event
 * No emojis — SVG icons only. Sign-out has a confirmation modal.
 * ──────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, tokenStore } from '../../services/api';
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
    id: 'waiting',
    label: 'Waiting Room',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 'join',
    label: 'Join Event',
    icon: 'M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

// ─── Sign-out Confirmation Modal ──────────────────────────────────────────────
const SignOutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Modal card */}
    <div className="
      relative z-10 w-full max-w-sm
      rounded-2xl p-6 sm:p-7
      bg-[rgba(5,10,30,0.95)] backdrop-blur-2xl
      border border-red-500/20
      shadow-[0_0_50px_rgba(239,68,68,0.1)]
      animate-fadeIn
    ">
      {/* Warning icon */}
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
    </div>
  </div>
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

// ─── Profile view ─────────────────────────────────────────────────────────────
const ProfileView = ({ participant, founderProfile }) => {
  const isFounder = founderProfile?.role === 'founder';

  return (
    <div className="space-y-5 animate-fadeIn">
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
          <span className={`
            inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
            ${isFounder
              ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
              : 'bg-slate-700/50 border border-slate-600/50 text-slate-300'
            }
          `}>
            <Icon
              d={isFounder
                ? 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                : 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              }
              size={13}
              strokeWidth={2}
            />
            {isFounder ? 'Founder' : 'Participant'}
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

      {/* Founder section */}
      {isFounder && (
        <Card className="border-cyan-500/25 shadow-[0_0_30px_rgba(8,145,178,0.15)]">
          <div className="flex items-center gap-2.5 mb-4">
            <Icon
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              size={16}
              strokeWidth={2}
              className="text-cyan-400"
            />
            <p className="text-xs uppercase tracking-widest text-cyan-400/80 font-semibold">
              Founder Details
            </p>
          </div>
          <DataRow label="Startup / Company" value={founderProfile?.company_name} highlight />
          <div className="pt-3 border-t border-cyan-500/10">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-2">
              Brief Description
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {founderProfile?.brief_description || <span className="italic text-slate-600">—</span>}
            </p>
          </div>
        </Card>
      )}
    </div>
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
    <div className="space-y-5 animate-fadeIn">
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
    </div>
  );
};

// ─── Waiting Room view ────────────────────────────────────────────────────────
const WaitingRoomView = ({ participant }) => {
  const hasRoom = participant?.room_id != null;

  return (
    <div className="space-y-5 animate-fadeIn">
      <SectionTitle label="Waiting Room" />

      {/* Status card */}
      <Card className={`text-center py-8 ${hasRoom ? 'border-cyan-500/30' : 'border-slate-600/30'}`}>
        <div className={`
          w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center
          ${hasRoom
            ? 'bg-cyan-500/15 border border-cyan-500/30'
            : 'bg-slate-700/40 border border-slate-600/40'
          }
        `}>
          <Icon
            d={hasRoom
              ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            }
            size={28}
            strokeWidth={1.75}
            className={hasRoom ? 'text-cyan-400' : 'text-slate-400'}
          />
        </div>
        <h3
          className="text-xl font-black italic text-white mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {hasRoom ? `Room ${participant.room_id} Assigned!` : 'Awaiting Room Assignment'}
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          {hasRoom
            ? `You've been assigned to Room ${participant.room_id}. Head to the venue and look for your room number.`
            : 'Your room will be assigned on the day of the event. Check back here or scan the QR code at the venue.'
          }
        </p>
        {hasRoom && (
          <div
            className="
              mt-5 mx-auto w-fit px-6 py-3 rounded-full
              bg-gradient-to-r from-cyan-600 to-teal-600
              text-white text-sm font-bold uppercase tracking-wider
              shadow-[0_0_20px_rgba(8,145,178,0.4)]
            "
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Room {participant.room_id}
          </div>
        )}
      </Card>

      {/* QR flow explainer */}
      <Card>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">
          How Room Check-in Works
        </p>
        <ol className="space-y-4">
          {[
            { step: '1', text: 'Arrive at the event venue' },
            { step: '2', text: 'Find the QR code at your assigned room entrance' },
            { step: '3', text: 'Scan the QR code with your phone camera' },
            { step: '4', text: "You'll be automatically checked into your room" },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-4">
              <span className="
                w-7 h-7 rounded-full shrink-0
                bg-gradient-to-br from-cyan-600 to-teal-700
                flex items-center justify-center
                text-xs font-black text-white
              ">
                {item.step}
              </span>
              <p className="text-sm text-slate-300 pt-1">{item.text}</p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
};

// ─── Join Event view ──────────────────────────────────────────────────────────
const JoinEventView = ({ participant }) => (
  <div className="space-y-5 animate-fadeIn">
    <SectionTitle label="Join Event" />

    {/* Registration status */}
    <Card className="text-center py-8 border-cyan-500/25 shadow-[0_0_30px_rgba(8,145,178,0.15)]">
      <div className="
        w-16 h-16 rounded-full mx-auto mb-5
        bg-gradient-to-br from-cyan-500/20 to-teal-600/20
        border border-cyan-500/30
        flex items-center justify-center
      ">
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3
        className="text-xl font-black italic text-white mb-2"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        You're Registered!
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mx-auto">
        Welcome to Meet Your Co-Founder,{' '}
        <span className="text-cyan-300 font-semibold">{participant?.name}</span>.
        Your spot is confirmed — we'll see you at the event!
      </p>
    </Card>

    {/* Next steps */}
    <Card>
      <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Your Next Steps</p>
      <div className="space-y-3">
        {[
          {
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            title: 'Complete your profile',
            desc: 'Make sure your profile info is accurate',
          },
          {
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            title: 'Note the event date',
            desc: 'Add it to your calendar — details coming soon',
          },
          {
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            title: 'Think about your goals',
            desc: 'What skills are you looking for in a co-founder?',
          },
          {
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
            title: 'Come prepared',
            desc: 'Bring your ideas, energy, and business cards!',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="
              flex items-start gap-4 p-3.5 rounded-xl
              bg-slate-950/40 border border-cyan-500/10
              hover:border-cyan-500/25 transition-all duration-200
            "
          >
            <div className="
              w-8 h-8 rounded-lg shrink-0
              bg-cyan-500/10 border border-cyan-500/20
              flex items-center justify-center
            ">
              <Icon d={item.icon} size={15} strokeWidth={1.75} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, participant, onSignOutClick, sidebarOpen, setSidebarOpen }) => (
  <>
    {/* Mobile overlay */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    <aside className={`
      fixed top-0 left-0 h-screen z-40
      w-64 flex flex-col min-h-0
      bg-[rgba(3,8,25,0.92)] backdrop-blur-2xl
      border-r border-cyan-500/15
      transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:sticky lg:top-0 lg:translate-x-0 lg:flex lg:h-screen
    `}>
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
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Icon d="M6 18L18 6M6 6l12 12" size={20} />
        </button>
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

      {/* Nav — flex-1 so it fills remaining space, pushing Sign Out to bottom */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              id={`dash-nav-${item.id}`}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
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

      {/* Sign Out — triggers confirmation modal */}
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
  </>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('profile');
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const founderProfile = (() => {
    try { return JSON.parse(localStorage.getItem('founder_profile') || '{}'); }
    catch { return {}; }
  })();

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
      case 'profile':  return <ProfileView participant={participant} founderProfile={founderProfile} />;
      case 'event':    return <EventView />;
      case 'waiting':  return <WaitingRoomView participant={participant} />;
      case 'join':     return <JoinEventView participant={participant} />;
      default:         return null;
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <HeroBackground />

      {/* Sign-out confirmation modal */}
      {showSignOutModal && (
        <SignOutModal
          onConfirm={logout}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
        participant={participant}
        onSignOutClick={() => setShowSignOutModal(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top bar (mobile) */}
        <header className="
          lg:hidden flex items-center justify-between
          px-4 py-3
          bg-[rgba(3,8,25,0.85)] backdrop-blur-xl
          border-b border-cyan-500/15 sticky top-0 z-20
        ">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Icon d="M4 6h16M4 12h16M4 18h16" size={24} />
          </button>
          <p
            className="text-sm font-bold italic tracking-tight text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {NAV_ITEMS.find((n) => n.id === active)?.label}
          </p>
          <div className="w-6" />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-3xl w-full mx-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
