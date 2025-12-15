import { useState } from 'react'
import Card from '../../common/UI/Card.jsx'
import Table from '../../common/UI/Table.jsx'
import Button from '../../common/UI/Button.jsx'

export default function UserManagement() {
  const [users] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@college.edu', role: 'student', status: 'active' },
    { id: 2, name: 'Bob Smith', email: 'bob@college.edu', role: 'admin', status: 'active' },
    { id: 3, name: 'Carol White', email: 'carol@college.edu', role: 'seating_manager', status: 'inactive' },
  ])

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role', render: (r) => <span className="capitalize">{r.role?.replace('_', ' ')}</span> },
    { key: 'status', title: 'Status', render: (r) => <span className={r.status === 'active' ? 'text-green-400' : 'text-red-400'}>{r.status}</span> },
    { title: 'Actions', render: () => <Button className="px-3 py-1 text-sm">Edit</Button> },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button>Add User</Button>
      </div>
      <Card>
        <Table columns={columns} data={users} />
      </Card>
    </div>
  )
}
