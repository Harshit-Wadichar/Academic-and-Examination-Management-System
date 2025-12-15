import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Table from '../../common/UI/Table.jsx'

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 1250,
    totalExams: 24,
    totalEvents: 15,
    avgAttendance: '87%',
  })

  const [recentUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@college.edu', role: 'student', joined: '2024-12-20' },
    { id: 2, name: 'Jane Smith', email: 'jane@college.edu', role: 'student', joined: '2024-12-19' },
    { id: 3, name: 'Bob Admin', email: 'bob@college.edu', role: 'admin', joined: '2024-12-18' },
  ])

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role', render: (r) => <span className="capitalize">{r.role}</span> },
    { key: 'joined', title: 'Joined' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-3xl font-bold text-indigo-400">{stats.totalUsers}</div>
          <p className="text-slate-400 text-sm mt-2">Total Users</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-cyan-400">{stats.totalExams}</div>
          <p className="text-slate-400 text-sm mt-2">Total Exams</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-green-400">{stats.totalEvents}</div>
          <p className="text-slate-400 text-sm mt-2">Total Events</p>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-orange-400">{stats.avgAttendance}</div>
          <p className="text-slate-400 text-sm mt-2">Avg Attendance</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
        <Table columns={columns} data={recentUsers} />
      </Card>
    </div>
  )
}
