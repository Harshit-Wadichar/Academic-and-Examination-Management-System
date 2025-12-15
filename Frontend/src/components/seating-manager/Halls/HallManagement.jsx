import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Button from '../../common/UI/Button.jsx'

export default function HallManagement() {
  const [halls] = useState([
    { id: 1, name: 'Hall A', location: 'Building 1', capacity: 150, incharge: 'Mr. Smith' },
    { id: 2, name: 'Hall B', location: 'Building 2', capacity: 200, incharge: 'Ms. Johnson' },
    { id: 3, name: 'Hall C', location: 'Building 1', capacity: 100, incharge: 'Dr. Patel' },
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hall Management</h2>
        <Button>Add Hall</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map(h => (
          <Card key={h.id} className="border-l-4 border-l-purple-500">
            <h3 className="font-semibold text-lg">{h.name}</h3>
            <div className="space-y-2 mt-3 text-sm">
              <div><span className="text-slate-400">Location:</span> {h.location}</div>
              <div><span className="text-slate-400">Capacity:</span> {h.capacity}</div>
              <div><span className="text-slate-400">In-Charge:</span> {h.incharge}</div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 px-2 py-1 text-sm">Edit</Button>
              <Button className="flex-1 px-2 py-1 text-sm bg-rose-600">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
