import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/PokemonDetails.css';

function PokemonDetails() {
  const { id } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getAllPokemon = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=150`);
      const data = response.data.results;
      const pokemonDetails = await Promise.all(data.map(async (poke) => {
        const pokeData = await axios.get(poke.url);
        return {
          name: pokeData.data.name,
          id: pokeData.data.id,
          image: pokeData.data.sprites.front_default,
          // Otros detalles que puedas obtener
        };
      }));
      return pokemonDetails;
    } catch (error) {
      console.log('Error fetching Pokemon data:', error);
    }
  };

  return (
    <div className="poke-card">
      <h1>Detalles del Pokémon</h1>
      <div className="poke-details-container">
        <div className="poke-img-container">
          <img src={pokemonDetails.pokemon.sprites?.front_default} alt={pokemonDetails.pokemon.name} className="poke-img" />
        </div>
        <div className="poke-info">
          <h2>{pokemonDetails.pokemon.name}</h2>
          <p>ID: {pokemonDetails.pokemon.id}</p>

          <h3>Descripciones en Español:</h3>
          {pokemonDetails.flavor_text_entries.map((entry, index) => (
            <p key={index}>{entry.flavor_text}</p>
          ))}

          <h3>Hábitat:</h3>
          <p>{pokemonDetails.habitat}</p>

          <h3>Is Baby:</h3>
          <p>{pokemonDetails.species.is_baby ? 'Sí' : 'No'}</p>

          <h3>Is Legendary:</h3>
          <p>{pokemonDetails.species.is_legendary ? 'Sí' : 'No'}</p>

          <h3>Is Mythical:</h3>
          <p>{pokemonDetails.species.is_mythical ? 'Sí' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;
