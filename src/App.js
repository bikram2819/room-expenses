import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import ExpenseForm from './ExpenseForm'
import ExpenseTable from './ExpenseTable'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div>
      {!session ? (
        <Auth />
      ) : (
        <div style={{ padding: '2rem' }}>
          <h2>Welcome Roommate 🎉</h2>
          <ExpenseForm user={session.user} />
<ExpenseTable />
<br />
<button onClick={() => supabase.auth.signOut()}>Logout</button>

        </div>
      )}
    </div>
  )
}

export default App
