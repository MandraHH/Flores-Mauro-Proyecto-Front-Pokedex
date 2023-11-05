import React, { useState, useEffect } from 'react';
import FilterComponent from '../components/Filter';
import '../styles/PokemonList.css';

const ListadoPokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBaby, setIsBaby] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [weightRange, setWeightRange] = useState({ min: 0, max: 100 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllPokemon();
      setPokemon(data);
      setFilteredPokemon(data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getAllPokemonDetails = async () => {
    let allPokemonDetails = [];
  
    for (let i = 0; i < 2; i++) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}`);
      const data = await res.json();
      const pokemonDetails = {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1), 
        id: data.id,
        isBaby: data.isBaby,
        color: data.color,
        // Otras propiedades relevantes para el filtrado
      };
  
      allPokemonDetails.push(pokemonDetails);
    }
  
    return allPokemonDetails;
  };
  
  // Función para obtener una lista de Pokémon para mostrar en la interfaz
  const getAllPokemon = async () => {
    let allPokemon = [];
  
    for (let i = 0; i < 2; i++) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${i * 75}&limit=75`);
      const data = await res.json();
      const pokemonData = await Promise.all(data.results.map(async (poke) => {
        const response = await fetch(poke.url);
        const pokemonDetails = await response.json();
        return {
          name: poke.name.charAt(0).toUpperCase() + poke.name.slice(1), 
          id: pokemonDetails.id,
          image: pokemonDetails.sprites.front_default,
        };
      }));
      allPokemon = allPokemon.concat(pokemonData);
    }
  
    return allPokemon;
  };

  // Función para filtrar basada en los criterios seleccionados
  const applyFilters = () => {
    let filtered = pokemon.filter(poke => {
      return (
        (isBaby ? poke.isBaby : true) &&
        (selectedColor ? poke.color === selectedColor : true) &&
        (poke.weight >= weightRange.min && poke.weight <= weightRange.max) &&
        (selectedTypes.length === 0 ? true : selectedTypes.includes(poke.type)) &&
        (searchQuery
          ? poke.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true)
      );
    });

    setFilteredPokemon(filtered);
  };


  
  useEffect(() => {
    applyFilters();
  }, [isBaby, selectedColor, selectedTypes, weightRange, searchQuery]);

  return (
    <div>
    <FilterComponent
  onSearchChange={setSearchQuery}
  onIsBabyChange={setIsBaby}
  onColorChange={setSelectedColor}
  onTypeChange={setSelectedTypes}
  onWeightChange={value => setWeightRange({ min: value - 10, max: value + 10 })}
  colorOptions={['Red', 'Blue', 'Green']} // Suponiendo colores estáticos
  typeOptions={['Grass', 'Fire', 'Water']} // Suponiendo tipos estáticos
/>
      {/* Mostrar la lista filtrada de pokemones */}
      <div className="pokemon-list">
        {filteredPokemon.map((poke, index) => (
          <div className="pokemon-card" key={index}>
            <h2>{poke.name}</h2>
            <p>ID: {poke.id}</p>
            <img src={poke.image} alt={poke.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListadoPokemon;
