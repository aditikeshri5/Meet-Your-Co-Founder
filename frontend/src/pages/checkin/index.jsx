/**
 * checkin/index.jsx — QR Code Check-in Flow
 * Handles: https://yourapp.com/checkin?room_id=<id>
 * Matches dashboard aesthetic.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { roomsAPI, tokenStore } from '../../services/api';
import HeroBackground from '../../components/heroBackground';

const CheckinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const roomId = searchParams.get('room_id');

  useEffect(() => {
    if (!roomId) {
      setStatus('error');
      setErrorMsg('Invalid QR Code: No room ID found in URL.');
      return;
    }

    const token = tokenStore.get();
    if (!token || token === 'undefined' || token === 'null') {
      // Not logged in -> save intent and redirect to auth
      sessionStorage.setItem('pending_checkin_room', roomId);
      navigate('/auth?tab=login', { replace: true });
      return;
    }

    // Process check-in
    roomsAPI.updateRoom(roomId, token)
      .then(() => {
        setStatus('success');
        // Clean up pending if any
        sessionStorage.removeItem('pending_checkin_room');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err.message || err.error || 'Check-in failed. Please try again.');
        if (err.status === 401 || err.status === 422) {
          // Token expired/invalid, force re-login
          sessionStorage.setItem('pending_checkin_room', roomId);
          tokenStore.clear();
          navigate('/auth?tab=login', { replace: true });
        }
      });
  }, [roomId, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <HeroBackground />
      
      <div className="relative z-10 w-full max-w-md animate-fadeIn">
        <div className="
          rounded-2xl p-6 sm:p-8 text-center
          bg-[rgba(5,12,35,0.7)] backdrop-blur-xl
          border border-cyan-500/20
          shadow-[0_0_30px_rgba(8,145,178,0.15)]
        ">
          
          {status === 'loading' && (
            <div className="py-6">
              <svg className="animate-spin h-10 w-10 text-cyan-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <h3 className="text-xl font-black italic text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Checking you into Room {roomId}...
              </h3>
            </div>
          )}

          {status === 'success' && (
            <div className="py-2">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black italic text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Check-in Successful!
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                You've been successfully assigned to Room {roomId}.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="
                  w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider
                  bg-gradient-to-r from-cyan-600 to-teal-600 text-white
                  hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all duration-300
                "
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="py-2">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black italic text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Check-in Failed
              </h3>
              <p className="text-sm text-red-400 mb-6">{errorMsg}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="
                  w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider
                  bg-slate-800 text-white hover:bg-slate-700
                  transition-all duration-300
                "
              >
                Return to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CheckinPage;
