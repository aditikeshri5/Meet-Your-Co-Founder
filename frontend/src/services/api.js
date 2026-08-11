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

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  /**
   * Register a new participant.
   * @param {{ name: string, email: string, phone: string, password: string }} data
   */
  register: (data) => postJSON('/auth/register', data),

  /**
   * Log in and receive a JWT.
   * @param {{ email: string, password: string }} data
   */
  login: (data) => postJSON('/auth/login', data),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardAPI = {
  /**
   * Get the logged-in participant's info. Requires auth token.
   * @param {string} token
   */
  getProfile: (token) => getJSON('/dashboard', token),
};

// ─── Rooms ────────────────────────────────────────────────────────────────────

export const roomsAPI = {
  /**
   * Update the logged-in participant's assigned room. Requires auth token.
   * @param {number} roomId
   * @param {string} token
   */
  updateRoom: (roomId, token) => patchJSON('/room', { room_id: roomId }, token),
};

// ─── Token helpers ────────────────────────────────────────────────────────────

export const tokenStore = {
  get: () => localStorage.getItem('token'),
  set: (token) => localStorage.setItem('token', token),
  clear: () => localStorage.removeItem('token'),
};
