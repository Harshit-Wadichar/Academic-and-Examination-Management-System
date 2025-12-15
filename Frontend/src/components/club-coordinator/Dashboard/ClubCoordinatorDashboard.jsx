import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'

export default function ClubCoordinatorDashboard() {
  const [stats] = useState({
    totalClubs: 15,
    totalMembers: 450,
    upcomingEvents: 8,
    completedEvents: 23,
  })

  const [clubs] = useState([
    { id: 1, name: 'AI Club', members: 45, events: 3, status: 'active' },
    { id: 2, name: 'Sports Club', members: 120, events: 5, status: 'active' },
    { id: 3, name: 'Cultural Club', members: 80, events: 4, status: 'active' },
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Club Coordinator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-3xl font-bold text-indigo-400">{stats.totalClubs}</div>
          <p className="text-slate-400 text-sm mt-2">Total Clubs</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-cyan-400">{stats.totalMembers}</div>
          <p className="text-slate-400 text-sm mt-2">Total Members</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-green-400">{stats.upcomingEvents}</div>
          <p className="text-slate-400 text-sm mt-2">Upcoming Events</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-orange-400">{stats.completedEvents}</div>
          <p className="text-slate-400 text-sm mt-2">Completed Events</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clubs.map(c => (
          <Card key={c.id} className="border-l-4 border-l-cyan-500">
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <span className="text-slate-400">Members</span>
                <p className="font-medium text-lg">{c.members}</p>
              </div>
              <div>
                <span className="text-slate-400">Events</span>
                <p className="font-medium text-lg">{c.events}</p>
              </div>
              <div>
                <span className="text-slate-400">Status</span>
                <p className="font-medium text-green-400 capitalize">{c.status}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
