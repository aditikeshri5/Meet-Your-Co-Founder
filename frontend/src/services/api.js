/**
 * api.js — Clean API service layer
 * All calls to the Flask backend go through here.
 * Base URL: http://127.0.0.1:5000/api
 */

const BASE_URL = 'http://127.0.0.1:5000/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const postJSON = async (path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
};

const getJSON = async (path, token) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
};

const patchJSON = async (path, body, token) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
};

const postJSONAuth = async (path, body, token) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => postJSON('/auth/register', data),
  login: (data) => postJSON('/auth/login', data),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardAPI = {
  getProfile: (token) => getJSON('/dashboard', token),
};

// ─── Rooms ────────────────────────────────────────────────────────────────────

export const roomsAPI = {
  updateRoom: (roomId, token) => patchJSON('/room', { room_id: roomId }, token),
};

// ─── Ideas ────────────────────────────────────────────────────────────────────

export const ideaAPI = {
  /** Submit a startup idea. One per participant. */
  submit: (data, token) => postJSONAuth('/idea', data, token),
};

// ─── Event Management ─────────────────────────────────────────────────────────

export const eventAPI = {
  /** Admin-only: start the speed-dating event for a room. */
  startEvent: (roomId, token) => postJSONAuth(`/room/${roomId}/start-event`, {}, token),
};

// ─── Live Rounds ──────────────────────────────────────────────────────────────

export const roundAPI = {
  /** Poll the current round state for a room. */
  getCurrentRound: (roomId, token) => getJSON(`/room/${roomId}/current-round`, token),
};

// ─── Swipe Decisions ──────────────────────────────────────────────────────────

export const swipeAPI = {
  /** Save or update accept/reject decision for a pairing. */
  saveSwipe: (pairingId, decision, token) =>
    postJSONAuth(`/pairings/${pairingId}/swipe`, { decision }, token),
  /** Get all the participant's swipe decisions (post-event review). */
  getMySwipes: (token) => getJSON('/swipes', token),
};

// ─── Token helpers ────────────────────────────────────────────────────────────

export const tokenStore = {
  get: () => localStorage.getItem('token'),
  set: (token) => localStorage.setItem('token', token),
  clear: () => localStorage.removeItem('token'),
};
