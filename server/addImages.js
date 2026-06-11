const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateImages() {
  const events = await prisma.event.findMany();
  
  if (events.length >= 2) {
    await prisma.event.update({
      where: { id: events[0].id },
      data: { imageUrl: "https://images.unsplash.com/photo-1513151233888-cb9af614920a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" } // Pizza image
    });
    
    await prisma.event.update({
      where: { id: events[1].id },
      data: { imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" } // Conference/Test event image
    });
    console.log("Successfully added images to both events!");
  } else {
    console.log("Not enough events found to update.");
  }
}

updateImages().finally(() => prisma.$disconnect());
