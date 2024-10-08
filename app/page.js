'use client';
import { useState } from 'react';
import MainHead from '../comp/mainHead';
import SearchBar from '../comp/SearchBar';
import Sidebar from '../comp/sideBar';
import BookList from '../comp/BookList'; 
import classes from './page.module.css';

export default function Page() {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const handleFilteredBooksUpdate = (books) => {
    setFilteredBooks(books);
  };

  const handleSearchedBooksUpdate = (books) => {
    setSearchedBooks(books);
  };

  return (
    <div className={classes.bod}>
      <div className={classes.MainHead}><MainHead /></div>
      <header className={classes.search}>
        <SearchBar onSearchBooksUpdate={handleSearchedBooksUpdate} onNotFound={setNotFound} />
      </header>
      <main className={classes.main}>
        <div className={classes.SideBar}>
          <Sidebar onFilteredBooksUpdate={handleFilteredBooksUpdate} onNotFound={setNotFound} />
        </div>
        <div className={classes.booksList}>
          <BookList filteredBooks={filteredBooks} searchedBooks={searchedBooks} notFound={notFound} />
        </div>
      </main>
    </div>
  );
}
