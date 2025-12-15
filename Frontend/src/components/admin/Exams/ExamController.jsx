import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Button from '../../common/UI/Button.jsx'

export default function ExamController() {
  const [exams] = useState([
    { id: 1, name: 'Data Structures Midterm', date: '2025-01-10', students: 150, status: 'scheduled' },
    { id: 2, name: 'Web Development Final', date: '2025-01-15', students: 120, status: 'scheduled' },
    { id: 3, name: 'Database Systems Midterm', date: '2025-01-20', students: 140, status: 'draft' },
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exam Control</h2>
        <Button>Create Exam</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exams.map(e => (
          <Card key={e.id} className="border-l-4 border-l-orange-500">
            <h3 className="font-semibold text-lg">{e.name}</h3>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <span className="text-slate-400">Date</span>
                <p className="font-medium">{e.date}</p>
              </div>
              <div>
                <span className="text-slate-400">Students</span>
                <p className="font-medium">{e.students}</p>
              </div>
              <div>
                <span className="text-slate-400">Status</span>
                <p className="font-medium capitalize">{e.status}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 px-2 py-1 text-sm">Configure</Button>
              <Button className="flex-1 px-2 py-1 text-sm bg-slate-700">View Results</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
