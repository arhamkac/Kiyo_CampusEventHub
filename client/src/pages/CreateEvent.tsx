import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MOCK_CATEGORIES } from '../services/mockData';
import { CalendarDays, CheckCircle2 } from 'lucide-react';

type FormValues = {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  capacity: number;
  imageUrl: string;
};

export default function CreateEvent() {
  const { register, handleSubmit } = useForm<FormValues>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: FormValues) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          capacity: parseInt(data.capacity.toString()),
          startTime: new Date(data.date).toISOString(),
          endTime: new Date(new Date(data.date).getTime() + 2 * 60 * 60 * 1000).toISOString() // default 2 hours
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/events'), 1500);
      } else {
        setErrorMsg("Failed to publish event. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Could not connect to server.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto bg-[var(--muted)] border border-[var(--border)] p-3 rounded-xl w-fit mb-4">
            <CalendarDays className="w-6 h-6 text-[var(--foreground)]" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Host a New Event</CardTitle>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Fill out the details below to publish your event.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">Event Title</label>
              <Input {...register('title')} placeholder="e.g. Annual Tech Symposium" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">Description</label>
              <textarea 
                {...register('description')} 
                className="flex min-h-[120px] w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--foreground)] transition-shadow"
                placeholder="What is this event about?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">Image Banner URL</label>
                <Input {...register('imageUrl')} placeholder="https://example.com/banner.jpg" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">Category</label>
                <select 
                  {...register('category')}
                  className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--foreground)] transition-shadow"
                  required
                >
                  <option value="" disabled className="bg-[var(--background)]">Select category</option>
                  {MOCK_CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c} className="bg-[var(--background)] text-[var(--foreground)]">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">Location</label>
                <Input {...register('location')} placeholder="e.g. Main Auditorium" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">Date & Time</label>
                <Input type="datetime-local" {...register('date')} required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">Capacity</label>
                <Input type="number" {...register('capacity')} placeholder="Maximum attendees" min="1" required />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
                {errorMsg}
              </div>
            )}

            {success ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center gap-2 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Event Published! Redirecting to events...</span>
              </div>
            ) : (
              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg">
                  Publish Event
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
