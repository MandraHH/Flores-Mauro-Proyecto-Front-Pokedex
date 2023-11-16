import React from 'react';

const FilterComponent = ({
  onSearchChange,
  onIsBabyChange,
  onColorChange,
  onTypeChange,
  onWeightChange,
  onSearchSubmit,
  colorOptions,
  typeOptions,
}) => {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <label>
        Is Baby:
        <input type="checkbox" onChange={(e) => onIsBabyChange(e.target.checked)} />
      </label>
      <select onChange={(e) => onColorChange(e.target.value)}>
        <option value="">Select Color</option>
        {colorOptions.map((color, index) => (
          <option key={index} value={color}>
            {color}
          </option>
        ))}
      </select>
      <select onChange={(e) => onTypeChange(e.target.value)}>
        <option value="">Select Type</option>
        {typeOptions.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
    
      
      <button onClick={onSearchSubmit}>Buscar</button> 
    </div>
  );
};

export default FilterComponent;
