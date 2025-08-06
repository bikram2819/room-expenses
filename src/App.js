import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import ResetPassword from './ResetPassword'; // <-- NEW
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // <-- NEW

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !session ? (
              <Auth />
            ) : (
              <>
                <ExpenseForm session={session} />
                <ExpenseTable session={session} />
              </>
            )
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} /> {/* <-- NEW */}
      </Routes>
    </Router>
  );
}

export default App;
