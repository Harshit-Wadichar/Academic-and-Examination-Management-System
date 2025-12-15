import Card from '../../common/UI/Card.jsx'
import { useState } from 'react'

export default function StudentDashboard() {
  const [upcomingExams] = useState([
    { id: 1, subject: 'Data Structures', date: '2025-01-10', status: 'confirmed' },
    { id: 2, subject: 'Web Development', date: '2025-01-15', status: 'confirmed' },
  ])

  const [announcements] = useState([
    { id: 1, title: 'Exam Schedule Released', date: '2024-12-20' },
    { id: 2, title: 'Syllabus Update', date: '2024-12-18' },
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-3xl font-bold text-indigo-400">2</div>
          <p className="text-slate-400 text-sm mt-2">Upcoming Exams</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-cyan-400">8.5</div>
          <p className="text-slate-400 text-sm mt-2">GPA</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-green-400">95%</div>
          <p className="text-slate-400 text-sm mt-2">Attendance</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-orange-400">5</div>
          <p className="text-slate-400 text-sm mt-2">Credits Earned</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
          <div className="space-y-3">
            {upcomingExams.map(e => (
              <div key={e.id} className="p-3 bg-slate-800/40 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">{e.subject}</span>
                  <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded">{e.status}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">📅 {e.date}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.id} className="p-3 bg-slate-800/40 rounded-md">
                <p className="font-medium">{a.title}</p>
                <div className="text-sm text-slate-400 mt-1">{a.date}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
