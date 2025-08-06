
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import * as XLSX from 'xlsx'

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState([])
  const [personFilter, setPersonFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [keyword, setKeyword] = useState('')
  const [total, setTotal] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ date: '', description: '', amount: '' })

  const fetchExpenses = async () => {
    let query = supabase.from('expenses').select('*').order('date', { ascending: false })

    if (personFilter) query = query.eq('person', personFilter)
    if (dateFilter) query = query.eq('date', dateFilter)
    if (keyword) query = query.ilike('description', `%${keyword}%`)

    const { data, error } = await query
    if (!error) {
      setExpenses(data)
      const sum = data.reduce((acc, row) => acc + parseFloat(row.amount || 0), 0)
      setTotal(sum)
    }
  }

  const startEdit = (exp) => {
    setEditingId(exp.id)
    setEditForm({ date: exp.date, description: exp.description, amount: exp.amount })
  }

  const updateExpense = async () => {
    await supabase.from('expenses').update({
      date: editForm.date,
      description: editForm.description,
      amount: parseFloat(editForm.amount)
    }).eq('id', editingId)

    setEditingId(null)
    setEditForm({ date: '', description: '', amount: '' })
    fetchExpenses()
  }

  const deleteExpense = async (id) => {
    await supabase.from('expenses').delete().eq('id', id)
    fetchExpenses()
  }

  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses')
    XLSX.writeFile(workbook, 'expenses.xlsx')
  }

  const roommateTotals = ['BIKRAM', 'ABHISHEK', 'ELINA', 'MILLAN'].reduce((acc, name) => {
    const total = expenses
      .filter((e) => e.person === name)
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
    acc[name] = total.toFixed(2)
    return acc
  }, {})

  useEffect(() => {
    fetchExpenses()
    const channel = supabase
      .channel('realtime-expenses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        fetchExpenses()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [personFilter, dateFilter, keyword])

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>All Expenses</h3>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Person:
          <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)}>
            <option value="">All</option>
            <option value="BIKRAM">BIKRAM</option>
            <option value="ABHISHEK">ABHISHEK</option>
            <option value="ELINA">ELINA</option>
            <option value="MILLAN">MILLAN</option>
          </select>
        </label>
        <label style={{ marginLeft: '1rem' }}>
          Date:
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          Keyword:
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. milk" />
        </label>
        <button onClick={downloadAsExcel} style={{ marginLeft: '1rem' }}>Download as Excel</button>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Person</th>
            <th>Description</th>
            <th>Amount (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>
                {editingId === exp.id ? (
                  <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                ) : exp.date}
              </td>
              <td>{exp.person}</td>
              <td>
                {editingId === exp.id ? (
                  <input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                ) : exp.description}
              </td>
              <td>
                {editingId === exp.id ? (
                  <input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} />
                ) : `₹${exp.amount}`}
              </td>
              <td>
                {editingId === exp.id ? (
                  <>
                    <button onClick={updateExpense}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(exp)}>Edit</button>
                    <button onClick={() => deleteExpense(exp.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>Total:</strong> ₹{total.toFixed(2)}</p>

      <h3>Summary:</h3>
      <ul>
        {Object.entries(roommateTotals).map(([name, total]) => (
          <li key={name}>{name}: ₹{total}</li>
        ))}
      </ul>
    </div>
  )
}
