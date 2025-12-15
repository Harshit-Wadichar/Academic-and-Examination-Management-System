import { useState } from 'react'
import Card from '../components/common/UI/Card.jsx'
import Button from '../components/common/UI/Button.jsx'

export default function EventsPage() {
  const [events] = useState([
    { id: 1, title: 'Tech Talk on AI', date: '2025-01-20', club: 'AI Club', status: 'upcoming' },
    { id: 2, title: 'Sports Day', date: '2025-01-25', club: 'Sports', status: 'upcoming' },
    { id: 3, title: 'Cultural Fest', date: '2025-02-10', club: 'Cultural', status: 'upcoming' },
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(e => (
          <Card key={e.id} className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">{e.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{e.club}</p>
              <p className="text-sm text-slate-300 mt-1">📅 {e.date}</p>
            </div>
            <Button className="mt-4 w-full">Register</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
