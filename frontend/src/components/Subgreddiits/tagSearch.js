import React, { useState } from "react";

const SubredditFilter = ({ tags, onFilter }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearClick = () => {
    setSelectedTags([]);
  };

  const handleApplyClick = () => {
    onFilter(selectedTags);
  };

  return (
    <div>
      <h2>Filter by tags:</h2>
      <ul>
        {tags?.map((tag) => (
          <li key={tag}>
            <button
              type="button"
              className={selectedTags.includes(tag) ? "selected" : ""}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
      <button className="btnsize" type="button" onClick={handleClearClick}>
        Clear
      </button>
      <button className="btnsize" type="button" onClick={handleApplyClick}>
        Apply
      </button>
    </div>
  );
};

export default SubredditFilter;
