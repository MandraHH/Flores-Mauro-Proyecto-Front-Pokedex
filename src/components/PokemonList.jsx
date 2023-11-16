import React, { useState, useEffect } from 'react';
import FilterComponent from '../components/Filter';
import '../styles/PokemonList.css';
import { useNavigate } from 'react-router-dom';

const ListadoPokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBaby, setIsBaby] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [weightRange, setWeightRange] = useState({ min: 0, max: 100 });
  const [isMounted, setIsMounted] = useState(true); // Bandera para verificar montaje
  const navigate = useNavigate(); // Hook para navegar entre rutas

  useEffect(() => {
    fetchData();

    // Se desmonta el componente
    return () => {
      setIsMounted(false);
    };
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllPokemon();
      if (isMounted) {
        setPokemon(data);
        setFilteredPokemon(data);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getAllPokemon = async () => {
    let allPokemon = [];

    try {
      for (let i = 1; i <= 150; i++) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const pokeData = await res.json();

        // Fetch color
        const speciesRes = await fetch(pokeData.species.url);
        const speciesData = await speciesRes.json();
        const color = speciesData.color.name;

        // Fetch types
        const types = pokeData.types.map((type) => type.type.name);

        allPokemon.push({
          name: pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1),
          id: pokeData.id,
          image: pokeData.sprites.front_default,
          color,
          types,
        });
      }

      return allPokemon;
    } catch (error) {
      console.log('Error:', error);
    }
  };

  // Función para filtrar basada en los criterios seleccionados
  const applyFilters = () => {
    let filtered = pokemon.filter((poke) => {
      return (
        (isBaby ? poke.isBaby : true) &&
        (selectedColor ? poke.color === selectedColor : true) &&
        (poke.weight >= weightRange.min && poke.weight <= weightRange.max) &&
        (selectedTypes.length === 0 ? true : selectedTypes.some(type => poke.types.includes(type))) &&
        (searchQuery
          ? poke.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true)
      );
    });

    setFilteredPokemon(filtered);
  };

  useEffect(() => {
    if (isMounted) {
      applyFilters();
    }
  }, [isBaby, selectedColor, selectedTypes, weightRange, searchQuery, isMounted]);

  const handlePokemonClick = (id) => {
    
    navigate(`/pokemon/${id}`);
  };

  return (
    <div>
      <FilterComponent
        onSearchChange={(value) => setSearchQuery(value)}
        onIsBabyChange={(value) => setIsBaby(value)}
        onColorChange={(value) => setSelectedColor(value)}
        onTypeChange={(value) => setSelectedTypes(value)}
        onWeightChange={(value) =>
          setWeightRange({ min: value - 10, max: value + 10 })
        }
        colorOptions={['Red', 'Blue', 'Green']}
        typeOptions={['Grass', 'Fire', 'Water']}
      />

      <div className="pokemon-list">
        {filteredPokemon.map((poke, index) => (
          <div
            className="pokemon-card"
            key={index}
            onClick={() => handlePokemonClick(poke.id)}
          >
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
