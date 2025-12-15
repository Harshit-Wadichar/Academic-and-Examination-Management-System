import Card from '../../common/UI/Card.jsx'

export default function HallTicketCard({ ticket }) {
  return (
    <Card className="border-l-4 border-l-indigo-500 transform hover:scale-105 transition-transform">
      <h3 className="text-lg font-semibold">{ticket.examName}</h3>
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div><span className="text-slate-400">Date:</span> <span>{ticket.date}</span></div>
        <div><span className="text-slate-400">Time:</span> <span>{ticket.time}</span></div>
        <div><span className="text-slate-400">Room:</span> <span>{ticket.room}</span></div>
        <div><span className="text-slate-400">Seat:</span> <span>{ticket.seat}</span></div>
      </div>
    </Card>
  )
}
