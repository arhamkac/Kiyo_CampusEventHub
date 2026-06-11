import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MOCK_EVENTS } from '../services/mockData';
import { format } from 'date-fns';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export default function Dashboard() {
  const upcomingRSVPs = MOCK_EVENTS.slice(0, 2); // Mock: user is attending first two
  const [usersList, setUsersList] = useState<any[]>([]);

  const token = localStorage.getItem('token');
  const dbUser = token ? JSON.parse(atob(token.split('.')[1])) : null;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsersList(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-12 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Your Dashboard</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">Manage your schedule and organized events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Personal Calendar (Upcoming) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[var(--color-primary-500)]" />
            Upcoming RSVPs
          </h2>
          <div className="space-y-4">
            {upcomingRSVPs.map(event => (
              <Card key={event.id} className="flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-full sm:w-48 h-32 sm:h-auto bg-slate-100 dark:bg-slate-800">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-primary-500)] mb-1">
                        {format(new Date(event.startTime), 'EEEE, MMM d • h:mm a')}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" /> {event.location}
                      </div>
                    </div>
                    <Badge variant="secondary">Going</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Stats / Managed Events */}
          <h2 className="text-2xl font-semibold">Quick Stats</h2>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">Events Organized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[var(--foreground)]">0</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">You haven't organized any events yet.</p>
            </CardContent>
          </Card>

          {/* Role Management for Organizers */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-[var(--color-primary-500)]" />
              Role Management
            </h2>
            <Card className="glass-card">
              <CardContent className="p-0">
                <div className="divide-y divide-[var(--border)]">
                  {usersList.map(u => (
                    <div key={u.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{u.fullName}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{u.email}</p>
                      </div>
                      {u.id !== dbUser?.id && (
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-[var(--background)] border border-[var(--border)] text-xs rounded p-1"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="ORGANIZER">Organizer</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      )}
                      {u.id === dbUser?.id && <Badge className="text-xs">{u.role}</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
