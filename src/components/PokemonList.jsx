import React, { useState, useEffect } from 'react';
import '../styles/PokemonList.css';

const ListadoPokemon = () => {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllPokemon();
      setPokemon(data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getAllPokemon = async () => {
    let allPokemon = [];

    for (let i = 0; i < 2; i++) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${i * 75}&limit=75`);
      const data = await res.json();
      const pokemonData = await Promise.all(data.results.map(async (poke) => {
        const response = await fetch(poke.url);
        const pokemonDetails = await response.json();
        return {
          name: poke.name,
          id: pokemonDetails.id,
          image: pokemonDetails.sprites.front_default // Obtener la URL de la imagen del Pokémon
        };
      }));
      allPokemon = allPokemon.concat(pokemonData);
    }

    return allPokemon;
  };

  return (
    <div className="pokemon-list">
      {pokemon.map((poke, index) => (
        <div className="pokemon-card" key={index}>
          <h2>{poke.name}</h2>
          <p>ID: {poke.id}</p>
          <img src={poke.image} alt={poke.name} />
        </div>
      ))}
    </div>
  );
};

export default ListadoPokemon;
