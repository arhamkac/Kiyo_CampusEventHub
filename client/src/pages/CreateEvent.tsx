import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MOCK_CATEGORIES } from '../services/mockData';
import { CalendarDays } from 'lucide-react';

type FormValues = {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  capacity: number;
};

export default function CreateEvent() {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log("Submitting new event:", data);
    alert("Event created successfully! (Mock)");
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full w-fit mb-4">
            <CalendarDays className="w-8 h-8 text-[var(--color-primary-500)]" />
          </div>
          <CardTitle className="text-3xl">Host a New Event</CardTitle>
          <p className="text-gray-500">Fill out the details below to publish your event to the campus board.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input {...register('title')} placeholder="e.g. Annual Tech Symposium" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                {...register('description')} 
                className="flex min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                placeholder="What is this event about?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  {...register('category')}
                  className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  required
                >
                  <option value="" disabled className="dark:bg-slate-800">Select category</option>
                  {MOCK_CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c} className="dark:bg-slate-800">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input {...register('location')} placeholder="e.g. Main Auditorium" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date & Time</label>
                <Input type="datetime-local" {...register('date')} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <Input type="number" {...register('capacity')} placeholder="Maximum attendees" min="1" required />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" size="lg">
                Publish Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
