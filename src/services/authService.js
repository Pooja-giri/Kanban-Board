const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export const beginSocialLogin = (provider) => {
  window.location.assign(`${API_BASE}/api/auth/${provider}`);
};

export const completeSocialLogin = async (code, signal) => {
  const response = await fetch(`${API_BASE}/api/auth/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
    signal,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Unable to complete sign-in.');
  return data.user;
};
