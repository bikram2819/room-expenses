import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://room-expenses.vercel.app/', // ✅ important in production
    });

    if (error) {
      setMessage('❌ Error sending reset email: ' + error.message);
    } else {
      setMessage('✅ Password reset email sent. Please check your inbox.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <br /><br />
      <button onClick={handleReset} style={{ padding: '0.5rem 1rem' }}>
        Send Reset Email
      </button>
      <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>
    </div>
  );
}
