// src/ResetPassword.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useEffect } from 'react';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // This ensures the session is recovered from the URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("Invalid or expired session. Please request a new reset link.");
      }
    });
  }, []);

  const handleSubmit = async () => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
      setMessage('');
    } else {
      setMessage('✅ Password updated! You can now log in.');
      setError('');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      <h2>Reset Your Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ padding: 8, width: '100%', marginBottom: 10 }}
      />
      <button onClick={handleSubmit} style={{ padding: 10, width: '100%' }}>
        Update Password
      </button>
    </div>
  );
}

export default ResetPassword;
