import React, { useState } from 'react';

/**
 * SearchEmployee Component
 * Allows looking up a specific employee by their unique ID.
 */
function SearchEmployee({ onSearch, onClear, isSearching }) {
  const [searchId, setSearchId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    onSearch(searchId.trim());
  };

  const handleReset = () => {
    setSearchId('');
    onClear();
  };

  return (
    <div className="search-card">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <label htmlFor="searchId" className="search-label">
            Search Employee by ID:
          </label>
          <div className="search-controls">
            <input
              id="searchId"
              type="number"
              placeholder="Enter Employee ID (e.g. 101)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="form-control search-input"
              min="1"
            />
            <button type="submit" className="btn btn-primary" disabled={!searchId.trim()}>
              🔍 Search
            </button>
            {isSearching && (
              <button type="button" onClick={handleReset} className="btn btn-secondary">
                ✕ Show All
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchEmployee;
