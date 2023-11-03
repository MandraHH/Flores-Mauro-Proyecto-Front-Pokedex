import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../components/Evolutions';
import '../styles/Pokedex.css';
import '../components/PokemonList'

const Pokedex = () => {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [characteristics, setCharacteristics] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [pokemonId, setPokemonId] = useState(1);
  const totalPokemonLimit = 151;
  const [temporaryPokemon, setTemporaryPokemon] = useState(null);
  const [isTemporary, setIsTemporary] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [encounterLocations, setEncounterLocations] = useState(null);
  const [showEvolutionChainModal, setShowEvolutionChainModal] = useState(false);
  const [showPokemonImage, setShowPokemonImage] = useState(false);
  const [showEncounterLocationsModal, setShowEncounterLocationsModal] = useState(false);

  const handleShowPokemonImage = () => {
    setShowPokemonImage(true);
    setTimeout(() => {
      setShowPokemonImage(false);
    }, 2000);
  };

  const fetchTemporaryPokemon = async () => {
    try {
    
      setTemporaryPokemon(process.env.PUBLIC_URL + '/8bit.jpg');

      setIsTemporary(true);

      setTimeout(() => {
        setTemporaryPokemon(null);
        setIsTemporary(false);
      }, 3000);
    } catch (error) {
      console.error('Error fetching temporary Pokemon data:', error);
    }
  };

  const fetchEvolutionChain = async (pokemonId) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      const evolutionChainId = response.data.evolution_chain.url.split('/').pop();
      const evolutionResponse = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}`);
      setEvolutionChain(evolutionResponse.data);
      setShowEvolutionChainModal(true);
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
    }
  };

  const fetchEncounterLocations = async (pokemonId) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`);
      setEncounterLocations(response.data);
      setShowEncounterLocationsModal(true);
    } catch (error) {
      console.error('Error fetching encounter locations:', error);
    }
  };
  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
   const fetchPokemonData = async (id) => {
    if (id > totalPokemonLimit || id < 1) return;

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      setPokemon(response.data);

      const pokemonType = response.data.types[0].type.name;
      const responseEsp = await axios.get(`https://pokeapi.co/api/v2/type/${pokemonType}`);
      const spanishType = responseEsp.data.names.find(name => name.language.name === 'es').name;
      setType(capitalizeFirstLetter(spanishType));

      fetchCharacteristics(id);
      fetchEvolutionChain(id);
      fetchEncounterLocations(id);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  };

  const fetchCharacteristics = async (id) => {
    if (id > totalPokemonLimit || id < 1) return;

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/characteristic/${id}`);
      setCharacteristics(response.data);
      const spanishDescription = response.data.descriptions.find(desc => desc.language.name === 'es');
      if (spanishDescription) {
        setDescription(spanishDescription.description);
      }
    } catch (error) {
      console.error('Error fetching Pokemon characteristics:', error);
    }
  };

  useEffect(() => {
    fetchPokemonData(pokemonId);
  }, [pokemonId]);

  const goToFirstPokemon = () => {
    setCharacteristics(null);
    setPokemonId(1); 
  };

  const goToLastPokemon = () => {
    setCharacteristics(null);
    setPokemonId(totalPokemonLimit); 
  };

  const nextPokemon = () => {
    setCharacteristics(null);
    if (pokemonId < totalPokemonLimit) {
      setPokemonId(pokemonId + 1);
    }
  };

  const previousPokemon = () => {
    setCharacteristics(null);
    if (pokemonId > 1) {
      setPokemonId(pokemonId - 1);
    }
  };


  return (
    <div className="pokedex-container">
      <div id="container">
      {/*<!------ LEFT SIDE ------>*/}
    <div id="left-side">
        
        <div id="round-bordure-left-side"></div>
        <div id="round-bordure-left-side2"></div>
       
        <div id="big-blue-light-background" className="light">
            <div id="big-blue-light" className="light"></div>
            <div id="big-blue-light-glint" className="light"></div>
        </div>
        <div id="little-lights">
            <div className="light little-light red-light"></div>
            <div className="light little-light yellow-light"></div>
            <div className="light little-light green-light"></div>
        </div>
        
        <div id="screen-left-background">
            <div id="screen-left-little-lights">
                <div className="screen-left-little-red-light light"></div>
                <div className="screen-left-little-red-light light"></div>
            </div>
       
            <div id="screen-left">
              
          {pokemon && (
            <img id="screen-left-image" src={pokemon.sprites.front_default} alt={pokemon.name} />
             )}
           </div>
            <div id="screen-left-big-red-light" className="light"></div>
             < div id="screen-left-burger">
                <div id="screen-left-burger-inside"></div>
            </div>
        </div>
    
        <div id="elongated-buttons">
            <div className="elongated-button elongated-button1 clickable"></div>
            <div className="elongated-button elongated-button2 clickable"></div>
        </div>


        <div id="rounded-button" className="clickable" > </div>
        
        <div id="screen-left-little">
          
    <p>Altura: <span id="pokemon-height">{pokemon && `${(pokemon.height / 10).toFixed(1)}m`}</span></p>
    <p>Peso: <span id="pokemon-weight">{pokemon && `${parseFloat(pokemon.weight) / 10}kg`}</span></p>
    </div>
       
        <div id="cross">
        <div className="cross cross-top clickable" onClick={goToFirstPokemon}>
  <div className="arrow arrow-top"></div>
</div>
<div className="cross cross-bottom clickable" onClick={goToLastPokemon}>
  <div className="arrow arrow-bottom"></div>
</div>
<div className="cross cross-left clickable" onClick={previousPokemon}>
  <div className="arrow arrow-left"></div>
</div>
<div className="cross cross-right clickable" onClick={nextPokemon}>
  <div className="arrow arrow-right"></div>
</div>
        </div>
    </div>

    {/*<!------ MIDDLE ------>*/}
  
    <div className="binding">
        <div className="hinge hinge1"></div>
        <div className="hinge hinge2"></div>
        <div className="hinge hinge3"></div>
    </div>

       {/*RIGHT SIDE */}
    <div id="right-side">
   
        <div id="round-bordure-right-side"></div>
        <div id="screen-right">
      <p id="pokemon-title-p"><span>{pokemon && pokemon.id}</span> -  <span id="pokemon-title">{pokemon && pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span></p>
      <p id="pokemon-hp-p" className="pokemon-stats-left">Hp: <span id="pokemon-hp">{pokemon && pokemon.stats && pokemon.stats[0].base_stat}</span></p>
      <p id="pokemon-attack-p" className="pokemon-stats-right">Ataque: <span id="pokemon-attack">{pokemon && pokemon.stats && pokemon.stats[1].base_stat}</span></p>
      <p id="pokemon-defense-p" className="pokemon-stats-left">Defensa: <span id="pokemon-defense">{pokemon && pokemon.stats && pokemon.stats[2].base_stat}</span></p>
      <p id="pokemon-speed-p" className="pokemon-stats-right">Velocidad: <span id="pokemon-speed">{pokemon && pokemon.stats && pokemon.stats[5].base_stat}</span></p>
      {/* Los datos del Pokémon se mostrarán si la información está disponible */}
    </div>
       
    <div id="screen-info" className="keyboard">
        {characteristics && (
          <div>
            {/* Render the fetched data here */}
            <p>Descripción: {description}</p>
            <p>Tipo: {type}</p>
          </div>
        )}
      </div>
        
        <div id="elongated-lights">
        <Link to="/pokemons" className="key light">
      
      </Link>
      <Link to="/pokemon/:id" className="key light">
      
      </Link>
        </div>
     
        <div id="right-side-yellow-light" className="light"></div>
     
        <div id="white-buttons">
        <div className="key clickable" onClick={() => fetchEvolutionChain(pokemonId)}>
        
        </div>
  
        <div className="key clickable">
      <Link to={`/pokemon/${pokemonId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      </Link>
        </div>
      </div>
   
      <div id="grey-buttons">
           <div className="key clickable">
           <Link to={`/evolutions/${pokemon}`}>Evoluciones</Link>
              </div>
          <div className="key clickable">
              <Link to="/PokemonList">Lista</Link>
          </div>
     </div>
    </div>
</div>
</div>
  )
  }



  
export default Pokedex;