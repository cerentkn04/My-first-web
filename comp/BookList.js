'use client';
import { useState, useEffect } from 'react';
import classes from './BookList.module.css';
import Link from 'next/link';

const BookList = ({ filteredBooks = [], searchedBooks = [], notFound }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (notFound) {
    return <div>No Such Book</div>;
  }

  const booksToDisplay = filteredBooks.length > 0 ? filteredBooks
    : searchedBooks.length > 0 ? searchedBooks
    : books;

  return (
    <div className={classes.books}>
      {booksToDisplay.slice(0, 30).map((book) => (
        <div key={book._id} className={classes.Abook}>
          <img src={book.image} style={{ maxWidth: '120px', maxHeight: '180px', objectFit: 'cover' }} alt={book.title} />
          <div className={classes.AbookInfo}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Literary Type:</strong> {book.literary_type}</p>
            <p><strong>Rate:</strong> {book.averageRating?.toFixed(1)}</p>
          </div>
            <div className={classes.link}><Link href={`/${book.title}`}>View Book</Link></div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
