import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CalendarDays, Users, Zap } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-16">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-8 max-w-4xl"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-xs font-semibold tracking-wide mb-4">
          <span className="flex w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
          v2.0 is live
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-[var(--foreground)]">
          Campus Life, <br />
          <span className="text-gradient">Orchestrated.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover, create, and manage your college events seamlessly. The definitive hub for students and organizers.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Button size="lg" onClick={() => navigate('/events')} className="w-full sm:w-auto shadow-xl shadow-indigo-500/20">
            Explore Events
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/create')} className="w-full sm:w-auto">
            Host an Event
          </Button>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4"
      >
        {[
          {
            icon: <CalendarDays className="w-8 h-8 text-indigo-500" />,
            title: "Smart Calendar",
            desc: "Never miss a beat. Sync campus events directly to your personal agenda."
          },
          {
            icon: <Users className="w-8 h-8 text-teal-500" />,
            title: "RSVP & Networking",
            desc: "See who's going. Connect with peers who share your academic or social interests."
          },
          {
            icon: <Zap className="w-8 h-8 text-amber-500" />,
            title: "Instant Analytics",
            desc: "Organizers get real-time attendee counts, capacity management, and insights."
          }
        ].map((feature, i) => (
          <div key={i} className="glass-card p-8 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">{feature.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
