import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/PokemonDetails.css';

function PokemonDetails() {
  const { id } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moves, setMoves] = useState([]);
  const formatFirstLetterToUpper = (text) => {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  };
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemonDetails(id);
  }, [id]);

  const fetchPokemonDetails = async (id) => {
    try {
      // Obtener detalles del Pokémon
      const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      setPokemonDetails(pokemonResponse.data);
      setLoading(false);

      // Obtener imagen y movimientos desde el nuevo endpoint
      const additionalInfoResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      
      // Verificar datos adicionales en la consola
      console.log('Datos adicionales del Pokémon:', additionalInfoResponse.data);

      // Verificar si la imagen está presente y actualizar el estado
      if (additionalInfoResponse.data.sprites && additionalInfoResponse.data.sprites.front_default) {
        setPokemonDetails(prevDetails => ({
          ...prevDetails,
          sprites: additionalInfoResponse.data.sprites,
        }));
      }
      if (additionalInfoResponse.data.moves && additionalInfoResponse.data.moves.length > 0) {
        setMoves(additionalInfoResponse.data.moves.slice(0, 4));
      }

    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!isNaN(searchId) && parseInt(searchId) > 0) {
      navigate(`/pokemon/${searchId}`);
    } else {
      console.log('ID de Pokémon no válido');
    }
  };

  const handleEvolutionsClick = async () => {
    if (pokemonDetails && pokemonDetails.species && pokemonDetails.species.url) {
      try {
        const speciesResponse = await axios.get(pokemonDetails.species.url);
        const evolutionChain = await axios.get(speciesResponse.data.evolution_chain.url);
  
        console.log('Datos de la cadena de evolución:', evolutionChain.data);
  
        navigate(`/evolutions/${pokemonDetails.id}/${pokemonDetails.name}`, { state: evolutionChain.data });
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      }
    }
  };

  return (
    <div className="poke-card">
  <h1>Detalles del Pokémon</h1>
      <div className="poke-details-container">
        <div className="poke-img-container">
          {pokemonDetails && pokemonDetails.sprites && pokemonDetails.sprites.front_default && (
            <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} className="poke-img" />
          )}
          {!pokemonDetails && <p>Cargando...</p>}
          {pokemonDetails && !pokemonDetails.sprites && <p>Imagen no disponible</p>}
        </div>
        <div className="poke-info">
  <h2>{pokemonDetails?.name && formatFirstLetterToUpper(pokemonDetails.name)}</h2>
  <p>ID: {pokemonDetails?.id}</p>

  <h3>Descripcion:</h3>
  {pokemonDetails?.flavor_text_entries
    .filter((entry) => entry.language.name === 'es')
    .reduce((longestDescription, entry) => {
      if (entry.flavor_text.length > longestDescription.length) {
        return entry.flavor_text;
      }
      return longestDescription;
    }, '')
    .split('\n')
    .map((description, index) => (
      <p key={index}>{description}</p>
    ))}

  <h3>Movimientos:</h3>
  <ul>
    {moves.map((move, index) => (
      <li key={index}>{formatFirstLetterToUpper(move.move.name)}</li>
    ))}
  </ul>

  <div className="info-section">
    <h3>Habitat:</h3>
    <p>{formatFirstLetterToUpper(pokemonDetails?.habitat?.name)}</p>
  </div>

  <div className="info-section">
    <h3>Is Baby:</h3>
    <p>{formatFirstLetterToUpper(pokemonDetails?.is_baby ? 'Sí' : 'No')}</p>
  </div>

  <div className="info-section">
    <h3>Is Legendary:</h3>
    <p>{formatFirstLetterToUpper(pokemonDetails?.is_legendary ? 'Sí' : 'No')}</p>
  </div>

  <div className="info-section">
    <h3>Is Mythical:</h3>
    <p>{formatFirstLetterToUpper(pokemonDetails?.is_mythical ? 'Sí' : 'No')}</p>
  </div>

  <div className="search-container">
  <input
    type="text"
    placeholder="Buscar por ID"
    value={searchId}
    onChange={(e) => setSearchId(e.target.value)}
  />
  <button onClick={handleSearch}>Buscar</button>
</div>
<button className="button-view-evolutions" onClick={handleEvolutionsClick}>
  Ver Evoluciones
</button>
  <Link to="/PokemonList" className="back-button">
    Volver
  </Link>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;
