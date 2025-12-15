import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Button from '../../common/UI/Button.jsx'

export default function SyllabusManager() {
  const [syllabi] = useState([
    { id: 1, code: 'CS101', title: 'Data Structures', semester: 'I', credits: 4, status: 'active' },
    { id: 2, code: 'CS102', title: 'Web Development', semester: 'I', credits: 3, status: 'active' },
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Syllabus Manager</h2>
        <Button>Upload Syllabus</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {syllabi.map(s => (
          <Card key={s.id} className="border-l-4 border-l-indigo-500">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{s.code}</h3>
                <p className="text-slate-400 text-sm">{s.title}</p>
              </div>
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded">{s.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mt-3">
              <div>Semester {s.semester}</div>
              <div>{s.credits} credits</div>
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
