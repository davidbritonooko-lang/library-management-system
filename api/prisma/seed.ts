import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be configured");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const genres = [
  {
    name: "Fiction",
    slug: "fiction",
    books: [
      { title: "The Silent Library", author: "James Carter", isbn: "9780000000001" },
      { title: "Beyond the Horizon", author: "Mary Wilson", isbn: "9780000000002" },
      { title: "The Last Journey", author: "Daniel Brooks", isbn: "9780000000003" },
      { title: "Shadows of Yesterday", author: "Sarah Mitchell", isbn: "9780000000004" },
    ],
  },
  {
    name: "Science",
    slug: "science",
    books: [
      { title: "Understanding the Universe", author: "David Morgan", isbn: "9780000000005" },
      { title: "The Science of Tomorrow", author: "Emily Parker", isbn: "9780000000006" },
      { title: "Discovering Physics", author: "Robert Lewis", isbn: "9780000000007" },
      { title: "Introduction to Biology", author: "Linda Adams", isbn: "9780000000008" },
    ],
  },
  {
    name: "Technology",
    slug: "technology",
    books: [
      { title: "Programming Fundamentals", author: "Michael Scott", isbn: "9780000000009" },
      { title: "The Digital World", author: "Grace Turner", isbn: "9780000000010" },
      { title: "Introduction to Computing", author: "Peter Hall", isbn: "9780000000011" },
      { title: "Building Modern Applications", author: "Alice Cooper", isbn: "9780000000012" },
    ],
  },
  {
    name: "History",
    slug: "history",
    books: [
      { title: "Civilizations of the Past", author: "Thomas Reed", isbn: "9780000000013" },
      { title: "A Brief World History", author: "Helen Wright", isbn: "9780000000014" },
      { title: "The Ancient Kingdoms", author: "George Allen", isbn: "9780000000015" },
      { title: "Stories from History", author: "Rachel Young", isbn: "9780000000016" },
    ],
  },
];

async function main() {
  for (const genreData of genres) {
    const genre = await prisma.genre.upsert({
      where: { slug: genreData.slug },
      update: { name: genreData.name },
      create: {
        name: genreData.name,
        slug: genreData.slug,
      },
    });

    for (const bookData of genreData.books) {
      await prisma.book.upsert({
        where: { isbn: bookData.isbn },
        update: {
          title: bookData.title,
          author: bookData.author,
          genreId: genre.id,
        },
        create: {
          ...bookData,
          totalCopies: 5,
          availableCopies: 5,
          genreId: genre.id,
        },
      });
    }
  }

  const genreCount = await prisma.genre.count();
  const bookCount = await prisma.book.count();

  console.log(`Genres in database: ${genreCount}`);
  console.log(`Books in database: ${bookCount}`);
  console.log("Seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });