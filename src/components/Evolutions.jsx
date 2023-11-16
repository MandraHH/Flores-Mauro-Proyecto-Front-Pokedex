import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import '../styles/Evolutions.css';

const Evolutions = () => {
  const { id, name } = useParams();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const pokemonDetails = location.state && location.state.pokemonDetails;

  const handleSearch = async () => {
    if (search) {
      setLoading(true);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
        const speciesResponse = await axios.get(response.data.species.url);
        const evolutionChain = await axios.get(speciesResponse.data.evolution_chain.url);

        const chain = await getEvolutionChain(evolutionChain.data.chain);

        setLoading(false);
        setSearchResults(chain);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
  };

  const getEvolutionChain = async (chain) => {
    const chainDetails = [];
  
    let currentPokemon = chain.species.name;
  
    do {
      const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${currentPokemon}`);
      console.log('Pokemon Response:', pokemonResponse.data);
  
      chainDetails.push({
        id: pokemonResponse.data.id,
        title: pokemonResponse.data.name.charAt(0).toUpperCase() + pokemonResponse.data.name.slice(1),
        description: `ID: ${pokemonResponse.data.id}`,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonResponse.data.id}.png`,
      });
  
      if (chain.evolves_to.length > 0) {
        chain = chain.evolves_to[0];
        currentPokemon = chain.species.name;
      } else {
        chain = null;
      }
    } while (chain !== null);
  
    console.log('Chain Details:', chainDetails);
  
    return chainDetails;
  };

  
  return (
    <div>
      <div>
        <Link to={`/pokemon/${id}/${name}`}>&larr; Volver</Link>
        <Link to="/">Ir a Pokedex</Link>
        <input
          type="text"
          placeholder="Buscar evolución..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <ul className="evolutions-list">
          {searchResults.map((item) => (
            <li key={item.id}>
              <img src={item.imageUrl} alt={item.title} />
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Evolutions;
