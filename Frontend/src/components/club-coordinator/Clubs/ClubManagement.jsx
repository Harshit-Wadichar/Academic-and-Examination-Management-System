import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Button from '../../common/UI/Button.jsx'

export default function ClubManagement() {
  const [clubs] = useState([
    { id: 1, name: 'AI Club', president: 'Alice Johnson', members: 45, founded: '2023' },
    { id: 2, name: 'Sports Club', president: 'Bob Smith', members: 120, founded: '2022' },
    { id: 3, name: 'Cultural Club', president: 'Carol White', members: 80, founded: '2023' },
    { id: 4, name: 'Coding Club', president: 'Dave Lee', members: 60, founded: '2024' },
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Club Management</h2>
        <Button>Register Club</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubs.map(c => (
          <Card key={c.id} className="border-t-4 border-t-cyan-500 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <div className="space-y-2 mt-3 text-sm">
              <div><span className="text-slate-400">President:</span> {c.president}</div>
              <div><span className="text-slate-400">Members:</span> {c.members}</div>
              <div><span className="text-slate-400">Founded:</span> {c.founded}</div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 px-2 py-1 text-sm">Edit</Button>
              <Button className="flex-1 px-2 py-1 text-sm bg-slate-700">View</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
