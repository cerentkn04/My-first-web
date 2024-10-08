'use client';

import  { useEffect, useState } from 'react';
import classes from './SearchBar.module.css';


export default function SearchBar({onSearchBooksUpdate,onNotFound}  ) {
  const [books,setBooks] = useState([])
  useEffect(()=>{
    const fetchBooks = async()=>{
      try{
        const response = await fetch('/api/books');
        setBooks(await response.json());
  
      }catch(error)
      {
        console.error('Error fetching books for searchbar:', error);
      }
    };
    fetchBooks();
  },[])
  const [searchData, setSearchData] = useState([]);

  const handleFilter = (event) => {
    const inWord = event.target.value;
    const newFilter = books.filter((value) =>
      value.title.toLowerCase().includes(inWord.toLowerCase())
    );
    if (newFilter.length === 0) {
      onNotFound(true);
    }
    if (inWord === "") {
      setSearchData([]);
    } else {
      setSearchData(newFilter);
      onSearchBooksUpdate(searchData);
    }
  };


  return (
    <div className={classes.searchBar}>
      <form className={classes.searchInput}>
        <input type='text' placeholder="search" onChange={handleFilter} />
        <div className={classes.searchIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill="none"
          >
            <path
              d="M14 14L16.5 16.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M16.4333 18.5252C15.8556 17.9475 15.8556 17.0109 16.4333 16.4333C17.0109 15.8556 17.9475 15.8556 18.5252 16.4333L21.5667 19.4748C22.1444 20.0525 22.1444 20.9891 21.5667 21.5667C20.9891 22.1444 20.0525 22.1444 19.4748 21.5667L16.4333 18.5252Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          </div>
      </form>
      
    </div>
  );
}
