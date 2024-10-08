import { useState, useEffect } from 'react';

const useFilter = () => {
  const [openDropdown, setOpenDropdown] = useState({});
  const [checkedTypes, setCheckedTypes] = useState({});
  const [checkedTags, setCheckedTags] = useState({});
  const [checkedAuthors, setCheckedAuthors] = useState({});
  const [tags, setTags] = useState([]);
  const [types, setTypes] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [pageRange, setPageRange] = useState([0, 1000]);
  const [filter, setFilter] = useState({ types: [], tags: [], authors: [], pageRange: [0, 1000] });
  const [filteredBooks, setFilteredBooks] = useState([]);

  const handleClick = (filterName) => {
    setOpenDropdown((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleTagClick = (tag) => {
    setCheckedTags((prev) => {
      const newCheckedTags = { ...prev, [tag]: !prev[tag] };
      const selectedTags = Object.keys(newCheckedTags).filter(t => newCheckedTags[t]);
      setFilter(prev => ({ ...prev, tags: selectedTags }));
      console.log("tag click filter: " ,filter);
      return newCheckedTags;
    });
  };

  const handleAuhorClick = (author) => {
    setCheckedAuthors((prev) => {
      const newCheckedAuthors = { ...prev, [author]: !prev[author] };
      const selectedAuthors = Object.keys(newCheckedAuthors).filter(t => newCheckedAuthors[t]);
      setFilter(prev => ({ ...prev, authors: selectedAuthors }));
      

      console.log("author click filter: ", { ...prev, authors: selectedAuthors });
  
      return newCheckedAuthors;
    });
  };

  const handleCheckboxChange = (type) => {
    setCheckedTypes((prev) => {
      const newCheckedTypes = { ...prev, [type]: !prev[type] };
      const selectedTypes = Object.keys(newCheckedTypes).filter(t => newCheckedTypes[t]);
      setFilter(prev => ({ ...prev, types: selectedTypes }));
      console.log("handleChecboxChange filter: " ,filter);
      return newCheckedTypes;
    });
  };

  const handleSliderChange = (value) => {
    console.log('Slider changed value:', value);
    setPageRange(value);
    setFilter(prev => {
      console.log('Updated filter in handleSliderChange:', { ...prev, pageRange: value });
      return { ...prev, pageRange: value };
    });
  
  };

  useEffect(() => {
    const fetchFilteredBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const books = await response.json();

        const query = books.filter(book => {
          const typeMatch = filter.types.length === 0 || filter.types.includes(book.literary_type);
          const authorMatch = filter.authors.length === 0 || filter.authors.includes(book.author);
          const tagMatch = filter.tags.length === 0 || (book.tags || []).some(tag => filter.tags.includes(tag));
          const pageMatch = book.page >= filter.pageRange[0] && book.page <= filter.pageRange[1];
          return typeMatch && authorMatch && tagMatch && pageMatch;
        });

        setFilteredBooks(query);
      } catch (error) {
        console.error('Error fetching filtered books:', error);
      }
    };

    fetchFilteredBooks();
  }, [filter]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const books = await response.json();

        const typeCounts = books.reduce((acc, book) => {
          const type = book.literary_type || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        setTypes(Object.keys(typeCounts).map(type => ({ type, count: typeCounts[type] })));

        const authorCounts = books.reduce((acc, book) => {
          const author = book.author || 'Unknown';
          acc[author] = (acc[author] || 0) + 1;
          return acc;
        }, {});
        setAuthors(Object.keys(authorCounts).map(author => ({ author, count: authorCounts[author] })));

        const tagCounts = books.reduce((acc, book) => {
          (book.tags || []).forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
          return acc;
        }, {});
        setTags(Object.keys(tagCounts).map(tag => ({ tag, count: tagCounts[tag] })));
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return {
    openDropdown,
    checkedTypes,
    checkedTags,
    checkedAuthors,
    tags,
    types,
    authors,
    pageRange,
    filter,
    filteredBooks,
    handleClick,
    handleTagClick,
    handleCheckboxChange,
    handleSliderChange,
    handleAuhorClick,
  };
};

export default useFilter;
