import { useState } from 'react'
import { supabase } from './supabaseClient'
import { Link } from 'react-router-dom'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else alert('Login successful ✅')
  }

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Signup successful ✅')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Roommate Login / Sign Up</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} /><br /><br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup} style={{ marginLeft: '1rem' }}>Sign Up</button>
<p style={{ marginTop: '8px' }}>
    <a href="/reset-password">Forgot Password?</a>
  </p>
    </div>
  )
}
