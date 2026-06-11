import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventsBrowser from './pages/EventsBrowser';
import CreateEvent from './pages/CreateEvent';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--color-primary-500)] selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsBrowser />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <footer className="border-t border-[var(--border)] py-8 mt-auto bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Campus Event Hub. Engineered by Kiyo.
        </div>
      </footer>
    </div>
  );
}

export default App;
