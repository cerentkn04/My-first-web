import React from 'react';
import fetchBookData from '../../pages/api/fetchBookdata'
import MainHead from '../../comp/mainHead';
import classes from './page.module.css'
import CommentForm from '../../comp/comments/CommentSection'
import CommentList from '../../comp/comments/CommentList'
import Rating from '../../comp/Ratecomp'; 
import FavButton from '../../comp/favButton'

const BookDetailPage= async ({ params }: { params: { book: string } }) => {

  try{
    const bookData = await fetchBookData(params.book);
    console.log("book is:",bookData);

    return (
      <div className={classes.ppage}>
         <div > <MainHead  /> </div>
         <div className={classes.main}>
          {bookData ? (
            <>
            <div className={classes.firstRow}>
              <div className={classes.sub0}>
                <img src={bookData.image} alt={bookData.title}  className={classes.img}style={{ maxWidth: '300px', maxHeight: '450px', objectFit: 'cover' }} />
                <div className={classes.Rate}> <Rating book_Id={bookData._id.toString()} /> </div>
               
              </div>
              <div className={classes.sub1}>
                <h1>{bookData.title}</h1>
                <p className={classes.text}>Author: {bookData.author}</p>
                <p className={classes.text}>Page: {bookData.page}</p>
                <p className={classes.text}>Published Year: {bookData.published_Year}</p>
                <p className={classes.text}>
                  Tags: {bookData.tags.map((tag, index) => (
                    <span key={index} className={classes.tag}>{tag}</span>
                  ))}
                </p>
                <p className={classes.text}>Literary Type: {bookData.literary_type}</p>
                <FavButton book = {bookData}/>
                
             
              </div> 
            </div>
           <div className={classes.secondRow}>
            <div className={classes.CommentButton}> <CommentForm postId={bookData._id.toString()} /> </div>
            <div className={classes.Comments}>  <CommentList postId={bookData._id.toString()} /> </div>  
           </div>
          </>
        ) : (
          <div>Book not found</div>
        )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching book:', error.message);
    return <div>Error fetching book details.</div>;
  }
}
export default BookDetailPage