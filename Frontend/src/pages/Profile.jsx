import useAuth from '../hooks/useAuth'
import Card from '../components/common/UI/Card.jsx'
import Button from '../components/common/UI/Button.jsx'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card className="max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-2xl font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 space-y-3">
            <div>
              <label className="text-sm text-slate-400">Email</label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">User ID</label>
              <p className="font-medium">{user?.id}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Role</label>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 flex gap-4">
            <Button>Edit Profile</Button>
            <Button className="bg-slate-700 hover:bg-slate-600">Change Password</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
