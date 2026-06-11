import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface UserCalendar {
  id: string;
  name: string;
  color: string;
  events: CalendarEvent[];
}

export default function Calendars() {
  const [calendars, setCalendars] = useState<UserCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddingCalendar, setIsAddingCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  
  const [addingEventTo, setAddingEventTo] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', startTime: '', endTime: '' });

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await fetch('http://localhost:5000/api/calendars', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCalendars(data);
      }
    } catch (err) {
      console.error('Failed to fetch calendars', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalendarName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/calendars', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newCalendarName, color: '#4f46e5' })
      });
      
      if (res.ok) {
        setNewCalendarName('');
        setIsAddingCalendar(false);
        fetchCalendars();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvent = async (e: React.FormEvent, calendarId: string) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/calendars/${calendarId}/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: newEvent.title,
          description: '',
          startTime: new Date(newEvent.startTime).toISOString(),
          endTime: new Date(newEvent.endTime).toISOString()
        })
      });
      
      if (res.ok) {
        setAddingEventTo(null);
        setNewEvent({ title: '', startTime: '', endTime: '' });
        fetchCalendars();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-[var(--muted-foreground)]">Loading calendars...</div>;
  }

  return (
    <div className="py-12 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">My Calendars</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Create and manage your personal event schedules.</p>
        </div>
        <Button onClick={() => setIsAddingCalendar(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Calendar
        </Button>
      </div>

      <AnimatePresence>
        {isAddingCalendar && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 border border-[var(--border)] overflow-hidden"
          >
            <form onSubmit={handleCreateCalendar} className="flex gap-4 items-end">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">Calendar Name</label>
                <Input 
                  value={newCalendarName} 
                  onChange={e => setNewCalendarName(e.target.value)} 
                  placeholder="e.g. Study Group" 
                  autoFocus 
                  required 
                />
              </div>
              <Button type="submit">Create</Button>
              <Button type="button" variant="ghost" onClick={() => setIsAddingCalendar(false)}>Cancel</Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {calendars.length === 0 && !isAddingCalendar ? (
        <div className="text-center py-20 glass-card">
          <Calendar className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--foreground)]">No calendars yet</h3>
          <p className="text-[var(--muted-foreground)] mt-1">Create your first calendar to start organizing.</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {calendars.map(calendar => (
            <Card key={calendar.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-2 w-full" style={{ backgroundColor: calendar.color }} />
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--muted-foreground)]" />
                  {calendar.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {calendar.events.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No upcoming events.</p>
                ) : (
                  calendar.events.map(event => (
                    <div key={event.id} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50">
                      <p className="font-semibold text-[var(--foreground)] text-sm">{event.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-[var(--muted-foreground)]">
                    <Clock className="w-3 h-3" />
                    {new Date(event.startTime).toLocaleDateString()} at {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))
            )}

            {calendar.id !== 'registered-events' && (
              <>
                {addingEventTo === calendar.id ? (
                  <form onSubmit={(e) => handleAddEvent(e, calendar.id)} className="space-y-3 pt-4 border-t border-[var(--border)] mt-4">
                    <Input 
                      placeholder="Event Title" 
                      value={newEvent.title} 
                      onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                      required 
                    />
                    <Input 
                      type="datetime-local" 
                      value={newEvent.startTime} 
                      onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} 
                      required 
                    />
                    <Input 
                      type="datetime-local" 
                      value={newEvent.endTime} 
                      onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} 
                      required 
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" className="w-full">Save</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setAddingEventTo(null)} className="w-full">Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <Button variant="outline" size="sm" className="w-full mt-4 text-xs font-semibold" onClick={() => setAddingEventTo(calendar.id)}>
                    <Plus className="w-3 h-3 mr-1" /> Add Custom Event
                  </Button>
                )}
              </>
            )}
          </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}
