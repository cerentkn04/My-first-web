'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import classes from './library.module.css';

const Library = ({ user, onBackToAccount}) => {
  const [User, setUser] = useState(null);
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [showBookList, setShowBookList] = useState(false);
  const [activeBookList, setActiveBookList] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/ListToBooks`, {
          params: { userId: user._id }
        });

        setUser(response.data.data);
        setList(response.data.data.bookLists);
        setLoading(false); 
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleFormSubmit = async (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const listName = formData.get('listName');

    try {
      const response = await axios.post(`/api/createList`, {
        user: user,
        listName: listName
      });
      setList([...list, response.data.newBookList]);
    } catch (error) {
      console.error('Error creating list:', error);
    }

    setShowForm(false);
  };

  const handleListClick = (bookList) => {
    setShowBookList(true);
    setActiveBookList(bookList); 
  };

  const handleBackToList = () => {
    setShowBookList(false);
    setActiveBookList(null); 
  };
  const handleVisibilityClick=async(type)=>{
    console.log(`Visibility changed to: ${type}`);

    try {
      const response = await axios.patch('/api/changeVisibility', {
        userId: user._id, 
        listName: activeBookList.name, 
        visibility: type, 
      });
  
     
      const updatedList = response.data.updatedList;
      setActiveBookList(updatedList);
  
      
      setList(prevList => prevList.map(list => 
        list.name === updatedList.name ? updatedList : list
      ));
  
    } catch (error) {
      console.error('Error updating visibility:', error);
    }

  } 

  const handleContextMenu = (event) => {
    event.preventDefault(); 
    setMenuPosition({
      x: event.pageX,
      y: event.pageY,
    });
    setShowMenu(true);
  };
  const handleClick = () => {
    setShowMenu(false); 
  };
  useEffect(() => {
    
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!User) {
    return <p>User not found</p>;
  }

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <button onClick={onBackToAccount} className={classes.Backbutton}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8L8 12M8 12L12 16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>  
        </button>
        <h2>Library</h2>
      </div>
      <div>
        <div className={classes.main}>
          {showBookList ? (
            < div className={classes.listWrapper}>
              <button onClick={handleBackToList} className={classes.backButton}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8L8 12M8 12L12 16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>  
              </button>
              <div className={classes.bookListDetails}>
                <div className={classes.listinfo}>
                  <h3 onContextMenu={handleContextMenu}>{activeBookList?.name || 'Unnamed List'}</h3>
                  {showMenu && (
                    <ul
                      className={classes.contextMenu}
                      style={{ top: menuPosition.y, left: menuPosition.x, position: 'absolute' }}
                    >
                      <li onClick={() => handleVisibilityClick("public")}>public</li>
                      <li onClick={() => handleVisibilityClick("private")}>private</li>
                      <li onClick={() => handleVisibilityClick("locked")}>lock</li>
                     
                    </ul>
                  )} 
                  <span>{activeBookList?.books?.length || 0} books</span>
                </div>
                <div className={classes.booksinList}>
                  {activeBookList?.books && activeBookList.books.length > 0 ? (
                    activeBookList.books.map((book, index) => (
                      <button
                        onClick={() => router.push(`/${book.title}`)}
                        key={index}
                        className={classes.bookDetail}
                      >
                        <img
                          src={book.image}
                          alt={book.title}
                          className={classes.bookImageLarge}
                        />
                        <p>{book.title}</p>
                      </button>
                    ))
                  ) : (
                  <p>No books in this list</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
             <div className={classes.defaultMain}>
              
              <div className={classes.addList}>
                <button onClick={() => setShowForm(true)}>Add List</button>
              </div>
              {showForm && (
                <div className={classes.popupForm}>
                  <form onSubmit={handleFormSubmit}>
                    <h3> New Book List</h3>
                    <label>
                      List Name:
                      <input type="text" name="listName" />
                    </label>
                    <button type="submit">Submit</button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                    >
                      Close
                    </button>
                  </form>
                </div>
              )}

              <div className={classes.bookLists}>
                {list && list.length > 0 ? (
                  list.map((bookList, index) => (
                    <button
                      key={index}
                      className={classes.bookList}
                      onClick={() => handleListClick(bookList)}
                    >
                      <p>{bookList?.name || 'Unnamed List'}</p>
                      <span>Books: {bookList?.books ? bookList.books.length : 0}</span>
                      {bookList?.books && bookList.books.length > 0 ? (
                        <div className={classes.books}>
                          {bookList.books.slice(0, 3).map((book, bookIndex) => (
                            <img
                              key={bookIndex}
                              src={book.image}
                              alt={book.title}
                              className={`${classes.bookImage} ${classes[`bookImage${bookIndex}`]}`}
                            />
                          ))}
                        </div>
                      ) : (
                        <p>No books in this list</p>
                      )}
                    </button>
                  ))
                ) : (
                  <div className={classes.errmes}>
                    <p>No book lists available</p>
                  </div>
                )}
              </div>
             </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
