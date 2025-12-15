import { Link } from 'react-router-dom'
import Card from '../components/common/UI/Card.jsx'
import Button from '../components/common/UI/Button.jsx'

export default function Home() {
  return (
    <div className="mt-12 space-y-12">
      <section className="text-center space-y-4 animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          AEMS
        </h1>
        <p className="text-xl text-slate-300">Integrated Academic & Examination Management System</p>
        <div className="flex gap-4 justify-center">
          <Link to="/login"><Button>Login</Button></Link>
          <Link to="/register"><Button className="bg-slate-700 hover:bg-slate-600">Register</Button></Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card><h3 className="font-semibold text-lg">📚 Syllabus</h3><p className="text-sm text-slate-400 mt-2">Access course materials and syllabi</p></Card>
        <Card><h3 className="font-semibold text-lg">🎫 Hall Tickets</h3><p className="text-sm text-slate-400 mt-2">Download your exam hall tickets</p></Card>
        <Card><h3 className="font-semibold text-lg">🪑 Seating</h3><p className="text-sm text-slate-400 mt-2">View exam seating arrangements</p></Card>
        <Card><h3 className="font-semibold text-lg">🎉 Events</h3><p className="text-sm text-slate-400 mt-2">Manage and attend events</p></Card>
      </section>
    </div>
  )
}
