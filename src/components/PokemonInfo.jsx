import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';

const Info = () => {
  const [searchText, setSearchText] = useState('');
  const [babyFilter, setBabyFilter] = useState(false);
  const [colorFilter, setColorFilter] = useState('');
  const [weightFilter, setWeightFilter] = useState([0, 100]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon')
      .then(response => {
        
        const simulatedData = response.data.results.map((pokemon, index) => ({
            id: index + 1, 
            name: pokemon.name,
            type: 'Grass',
            weight: Math.floor(Math.random() * 100),
            isBaby: Math.random() < 0.5,
            color: 'Green'
          }));
          
          setPokemonData(simulatedData);
          
      })
      .catch(error => {
        console.error('Error fetching Pokemon data: ', error);
      });
  }, []);

  const filteredPokemons = pokemonData.filter(pokemon => {
    return (
      (!searchText || pokemon.name.toLowerCase().includes(searchText.toLowerCase())) &&
      (!babyFilter || pokemon.isBaby === babyFilter) &&
      (!colorFilter || pokemon.color === colorFilter) &&
      (pokemon.weight >= weightFilter[0] && pokemon.weight <= weightFilter[1]) &&
      (typeFilter.length === 0 || typeFilter.includes(pokemon.type))
    );
  });

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'weight', headerName: 'Weight', width: 120 },
  ];

  return (
    <div>
      <Checkbox
        checked={babyFilter}
        onChange={(e) => setBabyFilter(e.target.checked)}
        color="primary"
        inputProps={{ 'aria-label': 'baby checkbox' }}
      />
      <Select
        value={colorFilter}
        onChange={(e) => setColorFilter(e.target.value)}
      >
        <MenuItem value="">All Colors</MenuItem>
        <MenuItem value="Red">Red</MenuItem>
        <MenuItem value="Blue">Blue</MenuItem>
    
      </Select>
      <Slider
        value={weightFilter}
        onChange={(_, newValue) => setWeightFilter(newValue)}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        min={0}
        max={150} 
      />
      <Select
        multiple
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        renderValue={(selected) => selected.join(', ')}
      >
        <MenuItem value="Fire">Fire</MenuItem>
        <MenuItem value="Water">Water</MenuItem>
      
      </Select>
      <TextField
        label="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={filteredPokemons} columns={columns} pageSize={5} />
      </div>
    </div>
  );
};

export default Info;
