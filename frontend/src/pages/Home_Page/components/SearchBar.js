import "./SearchBar.css"
import React, { useState } from 'react';
import axios from 'axios'; // If using Axios for HTTP requests

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get( 
        `https://cors-anywhere.herokuapp.com/https://cse.google.com/cse.js?&cx=47eb1c97d0a474034q/${query}`,
          // 'https://www.google.com/search='+query
    

 {
            params: {
              key: 'AIzaSyDXIG-4CXfivQ2giz4wpnPpPk4HahIfjjw',
              cx: '47eb1c97d0a474034q',
              q: query
            },
            headers: {
              'origin': 'https://www.google.com' // Replace with the actual origin of your request
            }
          })
          



      setSearchResults(response.data.items);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        openNewPage()
    //   handleSearch();
    }
  };
  function openNewPage() {
    window.open('https://www.google.com', '_blank');
}

  return (
    // <div className="gcse-search">
    <div className='gcse-search' onClick={openNewPage}>
    </div>
  );
};

export default SearchBar;
