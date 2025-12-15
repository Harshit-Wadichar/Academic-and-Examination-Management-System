import { useState } from 'react'
import Card from '../components/common/UI/Card.jsx'

export default function SyllabusPage() {
  const [syllabi] = useState([
    { id: 1, code: 'CS101', title: 'Data Structures', credits: 4, semester: 'I' },
    { id: 2, code: 'CS102', title: 'Web Development', credits: 3, semester: 'I' },
    { id: 3, code: 'CS201', title: 'Database Systems', credits: 4, semester: 'II' },
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Syllabus</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {syllabi.map(s => (
          <Card key={s.id} className="hover:scale-105 transition-transform">
            <h3 className="font-semibold">{s.code}</h3>
            <p className="text-slate-300 mt-2">{s.title}</p>
            <div className="flex justify-between mt-4 text-sm text-slate-400">
              <span>{s.credits} credits</span>
              <span>Sem {s.semester}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
