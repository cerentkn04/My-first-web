'use client';
import classes from './sideBar.module.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import useFilter from '../hooks/useFilter';

import { useState } from 'react';

const Sidebar = ({ onFilteredBooksUpdate, onNotFound}) => {
  const {
    openDropdown,
    checkedTypes,
    checkedTags,
    checkedAuthors,
    tags,
    types,
    authors,
    pageRange,
    filteredBooks,
    handleClick,
    handleTagClick,
    handleCheckboxChange,
    handleSliderChange,
    handleAuhorClick,
  }  = useFilter();
  const [showFiltered, setShowFiltered] = useState(false);
  const applyFilters = () => {
    setShowFiltered(true);
    if (filteredBooks.length > 0) {
      onFilteredBooksUpdate(filteredBooks);
      onNotFound(false); 
    } else {
      onFilteredBooksUpdate([]);
      onNotFound(true); 
    }
  };

  return (
    <div className={classes.sideBar}>
      <div className={classes.filterbar}> 
        <nav className={classes.AuthandType}>
          <header onClick={() => handleClick('type')}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 19V16H7C5.34315 16 4 17.3431 4 19M8.8 22H16.8C17.9201 22 18.4802 22 18.908 21.782C19.2843 21.5903 19.5903 21.2843 19.782 20.908C20 20.4802 20 19.9201 20 18.8V5.2C20 4.07989 20 3.51984 19.782 3.09202C19.5903 2.71569 19.2843 2.40973 18.908 2.21799C18.4802 2 17.9201 2 16.8 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Type
          </header>
          {openDropdown['type'] && (
            <div className={classes.subsection}>
              <ul className={classes.scrollableList}>
                {types.map(type => (
                  <li key={type.type} className={classes.listItem}>
                    * {type.type} ({type.count})
                    <input 
                      type="checkbox"
                      checked={checkedTypes[type.type] || false}
                      onChange={() => handleCheckboxChange(type.type)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
        <nav className={classes.AuthandType}>
          <header onClick={() => handleClick('Authors')}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5ZM11 21L14.1014 20.1139C14.2499 20.0715 14.3241 20.0502 14.3934 20.0184C14.4549 19.9902 14.5134 19.9558 14.5679 19.9158C14.6293 19.8707 14.6839 19.8161 14.7932 19.7068L21.25 13.25C21.9404 12.5597 21.9404 11.4403 21.25 10.75C20.5597 10.0596 19.4404 10.0596 18.75 10.75L12.2932 17.2068C12.1839 17.3161 12.1293 17.3707 12.0842 17.4321C12.0442 17.4866 12.0098 17.5451 11.9816 17.6066C11.9497 17.6759 11.9285 17.7501 11.8861 17.8987L11 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Authors
          </header>
          {openDropdown['Authors'] && (
            <div className={classes.subsection}>
              <ul className={classes.scrollableList}>
                {authors.map(author => (
                   <li key={author.author} className={classes.listItem} onClick={() => handleAuhorClick(author.author)}>
                   * {author.author} ({author.count})
                   <input 
                     type="checkbox"
                     checked={checkedAuthors[author.author] || false} 
                     onChange={() => handleAuhorClick(author.author)} 
                   />
                 </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
        
        <nav className={classes.tags}>
          <header onClick={() => handleClick('tags')}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11L13.4059 3.40589C12.887 2.88703 12.6276 2.6276 12.3249 2.44208C12.0564 2.27759 11.7638 2.15638 11.4577 2.08289C11.1124 2 10.7455 2 10.0118 2L6 2M3 8.7L3 10.6745C3 11.1637 3 11.4083 3.05526 11.6385C3.10425 11.8425 3.18506 12.0376 3.29472 12.2166C3.4184 12.4184 3.59136 12.5914 3.93726 12.9373L11.7373 20.7373C12.5293 21.5293 12.9253 21.9253 13.382 22.0737C13.7837 22.2042 14.2163 22.2042 14.7551 22.2042H17.8266C19.2376 22.2042 20.5298 21.8266 21.6759 20.6806L21.6 20.6041C22.8266 19.5378 23.2432 18.2122 23.0547 16.8542C22.947 16.4614 22.8214 16.1139 22.7064 15.8481C22.5916 15.5791 22.4088 15.3184 22.1384 14.9469L16.3839 9.19243L17.9688 7.98635L21.3333 8.82843C21.4804 8.8975 21.6415 8.94255 21.8255 8.96703C22.066 8.98428 22.3085 9.01614 22.5664 9.08589C22.7191 9.12111 22.832 9.22857 22.874 9.35988C22.8938 9.41628 22.8848 9.47272 22.8475 9.5248C22.7918 9.57913 22.727 9.64086 22.6535 9.69154C22.4072 10.0801 22.0212 10.3478 21.6901 10.5894C21.3068 10.9476 20.974 11.2544 20.6318 11.5968L19.5984 12.6302L21 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tags
          </header>
          {openDropdown['tags'] && (
            <div className={classes.subsection}>
              <ul className={classes.scrollableList}>
                {tags.map(tag => (
                  <li key={tag.tag} className={classes.listItem}  onClick={() => handleTagClick(tag.tag)}>
                    * {tag.tag} ({tag.count})
                    <input 
                      type="checkbox"
                      checked={checkedTags[tag.tag] || false}
                      onChange={() => handleTagClick(tag.tag)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
        
        <nav className={classes.pageRange}>
          <header onClick={() => handleClick('pageRange')}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 18H4V6H20V18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 8H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 8H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Page Range
          </header>
          {openDropdown['pageRange'] && (
            
            <div className={classes.subsectionn}>
               <div>
                  <span>Min: {pageRange[0]}</span> - <span>Max: {pageRange[1]}</span>
               </div>
              <Slider
                range
                min={0}
                max={1000}
                value={pageRange}
                onChange={handleSliderChange}
                allowCross={false} 
              />
            </div>
          )}
        </nav>
        
        <button onClick={applyFilters} className={classes.FilterButton}>Apply Filters</button>
      </div>

    </div>
  );
};

export default Sidebar;
