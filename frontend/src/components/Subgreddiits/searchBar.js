import React, { useState } from "react";

const SubgreddiitSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm.toLowerCase());
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        placeholder="Search subgreddiits by name"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {" "}
      <button type="submit" disabled={searchTerm===""}>Search</button>
    </form>
  );
};

export default SubgreddiitSearchBar;
