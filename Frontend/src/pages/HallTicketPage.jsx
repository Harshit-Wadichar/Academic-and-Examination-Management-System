import Card from '../components/common/UI/Card.jsx'
import Button from '../components/common/UI/Button.jsx'

export default function HallTicketPage() {
  const hallTickets = [
    { id: 1, examName: 'Data Structures Midterm', date: '2025-01-10', time: '10:00 AM', room: 'A-101', seat: '23' },
    { id: 2, examName: 'Web Dev Final', date: '2025-01-15', time: '2:00 PM', room: 'B-205', seat: '15' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Hall Tickets</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hallTickets.map(ticket => (
          <Card key={ticket.id} className="border-l-4 border-l-indigo-500">
            <h3 className="text-lg font-semibold">{ticket.examName}</h3>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div><span className="text-slate-400">Date:</span> <span className="font-medium">{ticket.date}</span></div>
              <div><span className="text-slate-400">Time:</span> <span className="font-medium">{ticket.time}</span></div>
              <div><span className="text-slate-400">Room:</span> <span className="font-medium">{ticket.room}</span></div>
              <div><span className="text-slate-400">Seat:</span> <span className="font-medium">{ticket.seat}</span></div>
            </div>
            <Button className="mt-4 w-full">Download Ticket</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
