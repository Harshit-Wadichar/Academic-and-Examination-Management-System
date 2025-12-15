import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'

export default function ExamSchedule() {
  const [schedule] = useState([
    { id: 1, subject: 'Data Structures', date: '2025-01-10', time: '10:00-12:00', hall: 'A-101' },
    { id: 2, subject: 'Web Dev', date: '2025-01-15', time: '14:00-16:00', hall: 'B-102' },
    { id: 3, subject: 'Database', date: '2025-01-20', time: '10:00-12:00', hall: 'C-103' },
  ])

  return (
    <div>
      <div className="space-y-3">
        {schedule.map(s => (
          <Card key={s.id} className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{s.subject}</h4>
              <p className="text-sm text-slate-400">{s.date} • {s.time}</p>
            </div>
            <span className="bg-slate-800 px-3 py-1 rounded text-sm">{s.hall}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
