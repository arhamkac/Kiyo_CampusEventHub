export const MOCK_EVENTS = [
  {
    id: "1",
    title: "AI & Machine Learning Symposium",
    description: "Join industry experts and student researchers for a day of talks on the future of AI. Features workshops on neural networks and LLMs.",
    category: "Technology",
    startTime: new Date("2026-10-15T09:00:00").toISOString(),
    endTime: new Date("2026-10-15T17:00:00").toISOString(),
    location: "Main Auditorium, CS Block",
    capacity: 200,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: {
      name: "Tech Club",
      avatarUrl: "https://i.pravatar.cc/150?u=tech"
    },
    attendeesCount: 142,
  },
  {
    id: "2",
    title: "Annual Campus Music Fest",
    description: "The biggest musical night of the semester! Local bands, DJ sets, and food stalls. Get ready to groove.",
    category: "Cultural",
    startTime: new Date("2026-10-20T18:00:00").toISOString(),
    endTime: new Date("2026-10-20T23:30:00").toISOString(),
    location: "Open Air Theatre",
    capacity: 1000,
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: {
      name: "Cultural Council",
      avatarUrl: "https://i.pravatar.cc/150?u=cultural"
    },
    attendeesCount: 856,
  },
  {
    id: "3",
    title: "Inter-College Basketball Tournament",
    description: "Cheer for our home team as they battle it out against rivals in the regional qualifiers.",
    category: "Sports",
    startTime: new Date("2026-10-25T14:00:00").toISOString(),
    endTime: new Date("2026-10-25T19:00:00").toISOString(),
    location: "Indoor Sports Complex",
    capacity: 500,
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: {
      name: "Sports Authority",
      avatarUrl: "https://i.pravatar.cc/150?u=sports"
    },
    attendeesCount: 310,
  }
];

export const MOCK_CATEGORIES = [
  "All", "Technology", "Cultural", "Sports", "Academic", "Workshop", "Social"
];
