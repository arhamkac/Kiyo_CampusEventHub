import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, Trash2, Edit2 } from 'lucide-react';

import { MOCK_EVENTS, MOCK_CATEGORIES } from '../services/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { format } from 'date-fns';

export default function EventsBrowser() {
  const token = localStorage.getItem('token');
  const dbUser = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [events, setEvents] = useState<any[]>(MOCK_EVENTS);
  const [toastMsg, setToastMsg] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setEvents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchEvents();
        showToast("Event deleted successfully");
      } else {
        showToast("Failed to delete event.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title: editTitle, capacity: editCapacity, imageUrl: editImageUrl })
      });
      if (res.ok) {
        setEditingEventId(null);
        fetchEvents();
        showToast("Event updated successfully");
      } else {
        showToast("Failed to update event.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRSVP = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Successfully RSVP'd! Check your Calendars tab.");
      } else {
        showToast("Failed to RSVP. You might already be registered.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Discover Events</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Find out what's happening on campus today.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input 
            placeholder="Search events..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {MOCK_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === category 
                  ? 'bg-[var(--foreground)] text-[var(--background)] shadow-sm' 
                  : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-4">
          {toastMsg}
        </div>
      )}

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full flex flex-col hover:border-[var(--color-primary-500)] transition-colors overflow-hidden group">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                  alt={event.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-black shadow-sm backdrop-blur-sm">
                    {event.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="text-xs font-semibold text-[var(--color-primary-500)] mb-1">
                  {format(new Date(event.startTime), 'MMM d, yyyy • h:mm a')}
                </div>
                {editingEventId === event.id ? (
                  <div className="space-y-2">
                    <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="font-bold text-xl h-8" placeholder="Event Title" />
                    <Input value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} className="h-6 text-xs" placeholder="Image Banner URL (optional)" />
                  </div>
                ) : (
                  <CardTitle className="line-clamp-2 text-xl">{event.title}</CardTitle>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {editingEventId === event.id ? (
                    <div className="flex items-center gap-2">
                      <Input type="number" value={editCapacity} onChange={e => setEditCapacity(e.target.value)} className="w-20 h-6 text-xs" /> 
                      <span>capacity</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900 dark:text-gray-100 mr-1">{event.attendeesCount}</span> attendees
                      <span className="mx-2">•</span>
                      {event.capacity - event.attendeesCount} spots left
                    </>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-[var(--border)] pt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={event.organizer.avatarUrl || `https://ui-avatars.com/api/?name=${event.organizer.name}`} alt="org" className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-[var(--muted-foreground)]">{event.organizer.fullName || event.organizer.name}</span>
                </div>
                <div className="flex gap-2">
                  {(dbUser?.id === event.organizer.id || dbUser?.role === 'ADMIN') && (
                    <>
                      {editingEventId === event.id ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setEditingEventId(null)}>Cancel</Button>
                          <Button size="sm" onClick={() => handleEditEvent(event.id)}>Save</Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => {
                            setEditingEventId(event.id);
                            setEditTitle(event.title);
                            setEditCapacity(event.capacity.toString());
                            setEditImageUrl(event.imageUrl || '');
                          }}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  {editingEventId !== event.id && (
                    <Button size="sm" onClick={() => handleRSVP(event.id)}>RSVP Now</Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500">
            No events found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
