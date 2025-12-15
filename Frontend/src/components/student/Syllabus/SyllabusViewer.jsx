import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Button from '../../common/UI/Button.jsx'

export default function SyllabusViewer() {
  const [selected, setSelected] = useState(null)
  const syllabi = [
    { id: 1, code: 'CS101', title: 'Data Structures', pdf: '/syllabi/cs101.pdf' },
    { id: 2, code: 'CS102', title: 'Web Development', pdf: '/syllabi/cs102.pdf' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {syllabi.map(s => (
          <Card key={s.id} className="cursor-pointer hover:border-l-4 hover:border-l-cyan-500" onClick={() => setSelected(s.id)}>
            <h3 className="font-semibold">{s.code}</h3>
            <p className="text-slate-400 text-sm mt-2">{s.title}</p>
          </Card>
        ))}
      </div>
      {selected && <Card><p>Viewer for selected syllabus (PDF integration here)</p></Card>}
    </div>
  )
}
