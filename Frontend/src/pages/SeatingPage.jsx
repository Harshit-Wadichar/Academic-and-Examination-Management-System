import Card from '../components/common/UI/Card.jsx'

export default function SeatingPage() {
  const seatingData = [
    { exam: 'Data Structures', hall: 'A-Hall', capacity: 60, filled: 45 },
    { exam: 'Web Development', hall: 'B-Hall', capacity: 80, filled: 72 },
    { exam: 'Database Systems', hall: 'C-Hall', capacity: 50, filled: 38 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Seating Arrangements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seatingData.map((s, i) => {
          const percent = (s.filled / s.capacity) * 100
          return (
            <Card key={i}>
              <h3 className="font-semibold">{s.exam}</h3>
              <p className="text-sm text-slate-400 mt-2">{s.hall}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{s.filled}/{s.capacity}</span>
                  <span>{Math.round(percent)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full" style={{ width: percent + '%' }} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
