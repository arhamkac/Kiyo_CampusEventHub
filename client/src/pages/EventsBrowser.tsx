import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users } from 'lucide-react';
import { MOCK_EVENTS, MOCK_CATEGORIES } from '../services/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { format } from 'date-fns';

export default function EventsBrowser() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = MOCK_EVENTS.filter(event => {
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

      {/* Category Pills */}
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
                  src={event.imageUrl} 
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
                <CardTitle className="line-clamp-2 text-xl">{event.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-gray-100 mr-1">{event.attendeesCount}</span> attendees
                  <span className="mx-2">•</span>
                  {event.capacity - event.attendeesCount} spots left
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-[var(--border)] pt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={event.organizer.avatarUrl} alt="org" className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-gray-500">{event.organizer.name}</span>
                </div>
                <Button size="sm">RSVP Now</Button>
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
