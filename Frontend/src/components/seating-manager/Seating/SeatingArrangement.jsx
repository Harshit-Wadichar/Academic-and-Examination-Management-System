import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Button from '../../common/UI/Button.jsx'

export default function SeatingArrangement() {
  const [halls] = useState([
    { id: 1, name: 'Hall A', capacity: 150, rows: 10, cols: 15 },
    { id: 2, name: 'Hall B', capacity: 200, rows: 10, cols: 20 },
    { id: 3, name: 'Hall C', capacity: 100, rows: 10, cols: 10 },
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Seating Arrangements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {halls.map(h => (
          <Card key={h.id} className="border-t-4 border-t-blue-500">
            <h3 className="font-semibold text-lg">{h.name}</h3>
            <div className="space-y-2 mt-4 text-sm text-slate-400">
              <div>Capacity: <span className="text-white font-medium">{h.capacity}</span></div>
              <div>Layout: <span className="text-white font-medium">{h.rows}x{h.cols}</span></div>
            </div>
            <Button className="w-full mt-4">Configure Seating</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
