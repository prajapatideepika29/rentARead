"""Seed the RentARead book catalog. Idempotent: upserts by fixed string id.

Run: cd /app/backend && python seed.py
"""

import asyncio

from lib.db import db, ensure_indexes

COVER = "https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"

BOOKS = [
    ("book-midnight-library", "The Midnight Library", "Matt Haig", "Literary Fiction", "9780525559474", 304, "Between life and death lies a library where every book is a life you could have lived."),
    ("book-gentleman-moscow", "A Gentleman in Moscow", "Amor Towles", "Literary Fiction", "9780670026197", 462, "A Russian aristocrat is sentenced to house arrest in a grand hotel — and finds a wider world inside."),
    ("book-normal-people", "Normal People", "Sally Rooney", "Literary Fiction", "9781984822178", 273, "Connell and Marianne orbit each other through school and university, never quite in step."),
    ("book-klara-sun", "Klara and the Sun", "Kazuo Ishiguro", "Literary Fiction", "9780593318171", 303, "An Artificial Friend watches the world from a shop window, hoping to be chosen."),
    ("book-silent-patient", "The Silent Patient", "Alex Michaelides", "Mystery & Thriller", "9781250301697", 325, "A painter shoots her husband and never speaks again. A therapist is determined to find out why."),
    ("book-gone-girl", "Gone Girl", "Gillian Flynn", "Mystery & Thriller", "9780307588371", 415, "Amy disappears on her fifth anniversary. Her husband's story doesn't add up."),
    ("book-dragon-tattoo", "The Girl with the Dragon Tattoo", "Stieg Larsson", "Mystery & Thriller", "9780307454546", 590, "A disgraced journalist and a brilliant hacker dig into a forty-year-old disappearance."),
    ("book-dune", "Dune", "Frank Herbert", "Sci-Fi & Fantasy", "9780441172719", 412, "Paul Atreides inherits the desert planet Arrakis — and a destiny spanning empires."),
    ("book-hail-mary", "Project Hail Mary", "Andy Weir", "Sci-Fi & Fantasy", "9780593135204", 476, "A lone astronaut wakes with no memory, on a ship that is humanity's last hope."),
    ("book-circe", "Circe", "Madeline Miller", "Sci-Fi & Fantasy", "9780316556347", 393, "The witch of Aiaia tells her own story — gods, mortals, and the cost of power."),
    ("book-name-wind", "The Name of the Wind", "Patrick Rothfuss", "Sci-Fi & Fantasy", "9780756404741", 662, "Kvothe recounts how a gifted boy became the most notorious wizard of his age."),
    ("book-night-circus", "The Night Circus", "Erin Morgenstern", "Sci-Fi & Fantasy", "9780385534635", 387, "A circus that arrives without warning hosts a duel between two young magicians."),
    ("book-1984", "1984", "George Orwell", "Classics", "9780451524935", 328, "Winston Smith rewrites history for the Party — until he begins to think for himself."),
    ("book-pride-prejudice", "Pride and Prejudice", "Jane Austen", "Classics", "9780141439518", 432, "Elizabeth Bennet spars with the proud Mr Darcy in Austen's sharpest comedy of manners."),
    ("book-mockingbird", "To Kill a Mockingbird", "Harper Lee", "Classics", "9780061120084", 324, "Scout Finch watches her father defend a Black man in Depression-era Alabama."),
    ("book-great-gatsby", "The Great Gatsby", "F. Scott Fitzgerald", "Classics", "9780743273565", 180, "Jay Gatsby's glittering parties hide a single, impossible longing across the bay."),
    ("book-atomic-habits", "Atomic Habits", "James Clear", "Non-Fiction", "9780735211292", 320, "Tiny changes, remarkable results — a practical system for building good habits."),
    ("book-sapiens", "Sapiens", "Yuval Noah Harari", "Non-Fiction", "9780062316097", 443, "How an unremarkable ape came to rule the planet — a brief history of humankind."),
    ("book-educated", "Educated", "Tara Westover", "Non-Fiction", "9780399590504", 334, "A memoir of growing up off the grid in Idaho and the transformative power of learning."),
    ("book-ikigai", "Ikigai", "Héctor García & Francesc Miralles", "Non-Fiction", "9780143130727", 208, "The Japanese secret to a long and happy life, from the island of Okinawa."),
    ("book-becoming", "Becoming", "Michelle Obama", "Biography", "9781524763138", 448, "From the South Side of Chicago to the White House — Michelle Obama in her own words."),
    ("book-wings-fire", "Wings of Fire", "A.P.J. Abdul Kalam", "Biography", "9788173711466", 180, "The autobiography of India's Missile Man, from Rameswaram to Rashtrapati Bhavan."),
    ("book-god-small-things", "The God of Small Things", "Arundhati Roy", "Indian Writing", "9780060977498", 321, "Twins Estha and Rahel navigate love, loss, and the laws of Ayemenem."),
    ("book-palace-illusions", "The Palace of Illusions", "Chitra Banerjee Divakaruni", "Indian Writing", "9781400096206", 360, "The Mahabharata retold through Draupadi's eyes — fire-born and unforgettable."),
    ("book-white-tiger", "The White Tiger", "Aravind Adiga", "Indian Writing", "9781416562603", 276, "Balram Halwai's darkly comic climb from village servant to Bangalore entrepreneur."),
    ("book-fault-stars", "The Fault in Our Stars", "John Green", "Romance", "9780525478812", 313, "Hazel and Augustus meet at a cancer support group and fall devastatingly in love."),
]


async def main() -> None:
    for book_id, title, author, genre, isbn, pages, synopsis in BOOKS:
        doc = {
            "id": book_id,
            "title": title,
            "author": author,
            "genre": genre,
            "isbn": isbn,
            "cover_url": COVER.format(isbn=isbn),
            "pages": pages,
            "synopsis": synopsis,
            "copies_total": 3,
        }
        # Never touch copies_available on reseed — live rentals own it. Set it only on first insert.
        await db.books.update_one(
            {"id": book_id},
            {"$set": doc, "$setOnInsert": {"copies_available": 3}},
            upsert=True,
        )
    await ensure_indexes()
    count = await db.books.count_documents({})
    print(f"seeded catalog: {count} books")


if __name__ == "__main__":
    asyncio.run(main())
