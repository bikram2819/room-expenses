import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function ExpenseForm({ user }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  const getPersonFromEmail = (email) => {
    if (email.includes('rahul')) return 'Rahul'
    if (email.includes('priya')) return 'Priya'
    if (email.includes('aman')) return 'Aman'
    if (email.includes('neha')) return 'Neha'
    return 'Unknown'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const person = getPersonFromEmail(user.email)

    const { error } = await supabase.from('expenses').insert([
      {
        date,
        description,
        amount: parseFloat(amount),
        person,
        user_id: user.id,
      },
    ])

    if (error) {
      alert('Error adding expense: ' + error.message)
    } else {
      alert('✅ Expense added!')
      setDescription('')
      setAmount('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
      <h3>Add Expense</h3>
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <br /><br />
      <label>
        Description:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <br /><br />
      <label>
        Amount (₹):
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <br /><br />
      <button type="submit">Add Expense</button>
    </form>
  )
}
