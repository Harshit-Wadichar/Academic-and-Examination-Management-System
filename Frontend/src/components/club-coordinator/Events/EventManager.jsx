import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Button from '../../common/UI/Button.jsx'

export default function EventManager() {
  const [events] = useState([
    { id: 1, title: 'Tech Talk on AI', club: 'AI Club', date: '2025-01-20', attendees: 45, status: 'pending' },
    { id: 2, title: 'Sports Day', club: 'Sports', date: '2025-01-25', attendees: 120, status: 'approved' },
    { id: 3, title: 'Cultural Fest', club: 'Cultural', date: '2025-02-10', attendees: 200, status: 'pending' },
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button>Create Event</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map(e => (
          <Card key={e.id} className={`border-l-4 ${e.status === 'approved' ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{e.title}</h3>
                <p className="text-sm text-slate-400">{e.club}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${e.status === 'approved' ? 'bg-green-900/40 text-green-300' : 'bg-yellow-900/40 text-yellow-300'}`}>
                {e.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-400">
              <div>📅 {e.date}</div>
              <div>👥 {e.attendees} attendees</div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 px-2 py-1 text-sm">Edit</Button>
              <Button className={`flex-1 px-2 py-1 text-sm ${e.status === 'approved' ? 'bg-rose-600' : 'bg-green-600'}`}>
                {e.status === 'approved' ? 'Reject' : 'Approve'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
