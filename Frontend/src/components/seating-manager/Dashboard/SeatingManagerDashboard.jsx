import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'

export default function SeatingManagerDashboard() {
  const [stats] = useState({
    totalHalls: 8,
    seatsAvailable: 320,
    seatsBooked: 645,
    examsScheduled: 12,
  })
  const [exams] = useState([
    { id: 1, name: 'CS101', date: '2025-01-10', halls: 3, capacity: 180 },
    { id: 2, name: 'CS102', date: '2025-01-15', halls: 2, capacity: 140 },
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Seating Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-3xl font-bold text-blue-400">{stats.totalHalls}</div>
          <p className="text-slate-400 text-sm mt-2">Total Halls</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-green-400">{stats.seatsAvailable}</div>
          <p className="text-slate-400 text-sm mt-2">Available Seats</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-orange-400">{stats.seatsBooked}</div>
          <p className="text-slate-400 text-sm mt-2">Booked Seats</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-purple-400">{stats.examsScheduled}</div>
          <p className="text-slate-400 text-sm mt-2">Exams Scheduled</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
        <div className="space-y-3">
          {exams.map(e => (
            <div key={e.id} className="p-4 bg-slate-800/40 rounded-md flex justify-between items-center hover:bg-slate-800/60 transition">
              <div>
                <h4 className="font-semibold">{e.name}</h4>
                <p className="text-sm text-slate-400">{e.date} • {e.halls} halls • {e.capacity} capacity</p>
              </div>
              <button className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-sm">Configure</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}