import './index.css';
import {useState,useEffect} from 'react';
import { MagnifyingGlass } from "@phosphor-icons/react";

// const SORT_ORDER = {
//   NONE: 'none',
//   ASC: 'asc',
//   DESC: 'desc'
// };

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [searchItem, setSearchItem] = useState(''); 
  const [filteredComments, setFilteredComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_limit=${pageSize}&_page=${currentPage}`);
      if (response.ok) {
         const totalCount = response.headers.get('x-total-count') || 0;
        setTotalComments(Number(totalCount));
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to fetch comments. Please try again later.');
    } finally {
      setLoading(false);

    }
  };
    fetchComments();
  }, [currentPage, pageSize]);

  

  useEffect(() => {
    if (searchItem) {
      const filtered = comments.filter(comment =>
        comment.name.toLowerCase().includes(searchItem.toLowerCase()) ||
        comment.email.toLowerCase().includes(searchItem.toLowerCase()) ||
        comment.body.toLowerCase().includes(searchItem.toLowerCase())
      );
      setFilteredComments(filtered);
    } else {
      setFilteredComments(comments);
    }
  }, [searchItem, comments]);

  useEffect(() => {
    const savedState = localStorage.getItem('commentsDashboard');
    if (savedState) {
      const { searchItem, sortConfig, currentPage, pageSize } = JSON.parse(savedState);
      setSearchItem(searchItem);
      setSortConfig(sortConfig);
      setCurrentPage(currentPage);
      setPageSize(pageSize);
    }
  }, []);

  useEffect(() => {
    const stateToSave = { searchItem, sortConfig, currentPage, pageSize };
    localStorage.setItem('commentsDashboard', JSON.stringify(stateToSave));
  }, [searchItem, sortConfig, currentPage, pageSize]);

  if (sortConfig.key && sortConfig.direction) {
    filteredComments.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key: '', direction: '' };
      return { key, direction: 'asc' };
    });
  };

  const onSearchItem = (e) => {
    setSearchItem(e.target.value);
  };


  const goToPage = (page) => {
    if (page >= 1 && page <= Math.ceil(totalComments / pageSize)) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); 
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalComments);



  const renderSearchSort = () => {
    return(
      <div className="sort-container">
        <div className="sort-buttons">
          <button onClick={() => handleSort('postId')} className='button' type="button">
          Sort Post ID {sortConfig.key === 'postId' ? (sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : '') : ''}
          </button>
          <button onClick={() => handleSort('name')} style={{ marginLeft: '10px' }} className='button' type="button">
            Sort Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : '') : ''}
          </button>
          <button onClick={() => handleSort('email')} style={{ marginLeft: '10px' }} className='button' type="button">
            Sort Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : '') : ''}
          </button>
        </div>
        <div className="search-input-container">
          <MagnifyingGlass size={18} color='#bbbbbb'/>
          <input className='search-input' type="text" placeholder="Search name email comment..." onChange={onSearchItem} value={searchItem} /> 
        </div>
      </div>
    )
  }

  const renderPagination = () => {
    return(
      <div className="pagination">
      <div>
      {totalComments > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            {startIndex}-{endIndex} of {totalComments} items
          </div>
          
          <div className="pagination-controls">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button prev-next"
            >
              &lt;
            </button>
            
            <button
              onClick={() => goToPage(currentPage)}
              className="pagination-button active"
            >
              {currentPage}
            </button>
            
            {currentPage < Math.ceil(totalComments/ pageSize) && (
              <button
                onClick={() => goToPage(currentPage + 1)}
                className="pagination-button"
              >
                {currentPage + 1}
              </button>
            )}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalComments/ pageSize)}
              className="pagination-button prev-next"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
      </div>
      <div className="page-size-selector">
          <select 
            value={pageSize} 
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="page-size-select"
          >
            
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className='page-size-span'>items per page</span>
      </div>
      </div>   
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="comments">
      {renderSearchSort()}
      {loading && <p>Loading comments...</p>}
      {!loading && comments.length === 0 && <p>No comments available.</p>}
      <div className="comments-table-container">
        <table className="comments-table">
          <thead>
            <tr>
              <th>Post Id</th>
              <th>Name</th>
            <th>Email</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.postId}</td>
                <td>{comment.name}</td>
                <td>{comment.email}</td>
                <td>{comment.body}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No comments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {renderPagination()}
  </div>
);

}

export default Comments;

