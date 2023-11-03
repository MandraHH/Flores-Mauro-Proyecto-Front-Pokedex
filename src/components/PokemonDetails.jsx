import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/PokemonDetails.css';

function PokemonDetails() {
  const { id } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id && !isNaN(id)) {
          const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
          const habitat = await axios.get(speciesResponse.data.habitat.url);

          const entries = speciesResponse.data.flavor_text_entries.filter(entry => entry.language.name === 'es');
          const spanishEntries = entries.slice(0, 2);

          setPokemonDetails({ 
            pokemon: pokemonResponse.data, 
            species: speciesResponse.data, 
            habitat: habitat.data.name, 
            flavor_text_entries: spanishEntries 
          });
        } else {
          throw new Error('ID de Pokémon no válido');
        }
      } catch (error) {
        console.error('Error al obtener los detalles del Pokémon:', error);
        setPokemonDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (!id || isNaN(id)) {
    return <div>El ID del Pokémon no es válido.</div>;
  }

  if (loading || !pokemonDetails) {
    return <div>Cargando...</div>;
  }

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
